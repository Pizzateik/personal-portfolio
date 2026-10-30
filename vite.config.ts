import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { defineConfig, type Connect, type Plugin, type ResolvedConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Page from './src/Page';
import { pageMetadata, pagePaths, resolvePage, type PagePath } from './src/routes';
import { LanguageProvider, translations, type Language } from './src/i18n';

function pageHtml(html: string, path: PagePath | null) {
  const render = (language: Language) => renderToStaticMarkup(createElement(LanguageProvider, {
    initialLanguage: language, children: createElement(Page, { path }),
  }));
  const metadata = JSON.stringify(Object.fromEntries(Object.entries(translations).map(([language, copy]) =>
    [language, pageMetadata(path, copy)],
  ))).replace(/</g, '\\u003c');
  // Install input before any body content can paint, including streamed HTML.
  // Resolve the container at event time because it does not exist in the head.
  const scrollBootstrap = `<script id="portfolio-scroll-preboot">
    (()=>{
      const desktop=matchMedia('(min-width:769px)');
      let canvas,visibleX=0;
      const capture=()=>{const current=document.querySelector('.canvas');if(current){canvas=current;visibleX=current.scrollLeft}};
      const wheel=event=>{
        if(!desktop.matches||event.ctrlKey||event.shiftKey||Math.abs(event.deltaX)>=Math.abs(event.deltaY))return;
        capture();if(!canvas?.isConnected)return;
        event.preventDefault();
        const unit=event.deltaMode===1?16:event.deltaMode===2?canvas.clientWidth:1;
        canvas.scrollLeft+=event.deltaY*unit;
        visibleX=canvas.scrollLeft;
      };
      addEventListener('wheel',wheel,{passive:false});
      addEventListener('scroll',capture,{capture:true,passive:true});
      addEventListener('portfolio:hydrate-start',capture,{once:true});
      addEventListener('portfolio:scroll-ready',event=>{
        removeEventListener('wheel',wheel);
        removeEventListener('scroll',capture,true);
        removeEventListener('portfolio:hydrate-start',capture);
        const next=event.detail?.canvas;
        if(next&&canvas&&next!==canvas)next.scrollLeft=canvas.isConnected?canvas.scrollLeft:visibleX;
      },{once:true});
    })();
  </script>`;
  // Small parser-time enhancement: choose saved copy and reveal loaded media,
  // even while the main interaction bundle is still downloading.
  const bootstrap = `<script>
    (()=>{
      let language='en';try{const saved=localStorage.getItem('eik-rose-language');if(saved==='de'||saved==='fr')language=saved}catch{}
      const template=document.getElementById('initial-'+language);
      if(template){
        const offset=document.querySelector('.canvas')?.scrollLeft||0;
        document.getElementById('root').replaceChildren(template.content.cloneNode(true));
        const canvas=document.querySelector('.canvas');if(canvas)canvas.scrollLeft=offset;
      }
      document.documentElement.lang=language;
      const copy=${metadata}[language];
      document.title=copy.title;
      for(const selector of ['meta[property="og:title"]','meta[name="twitter:title"]'])document.querySelector(selector)?.setAttribute('content',copy.title);
      for(const selector of ['meta[name="description"]','meta[property="og:description"]','meta[name="twitter:description"]'])document.querySelector(selector)?.setAttribute('content',copy.description);
      for(const selector of ['meta[property="og:image:alt"]','meta[name="twitter:image:alt"]'])document.querySelector(selector)?.setAttribute('content',copy.imageAlt);
      document.querySelectorAll('template[data-initial-language]').forEach(template=>template.remove());
      document.querySelectorAll('.media-skeleton').forEach(placeholder=>{
        const image=placeholder.previousElementSibling;if(image?.tagName!=='IMG')return;
        const reveal=()=>{placeholder.dataset.visible='false'};
        if(image.complete&&image.naturalWidth>0)reveal();
        else{image.addEventListener('load',reveal,{once:true});image.addEventListener('error',reveal,{once:true})}
      });
      // Remember a real mouse position; never hide the native cursor here.
      const pointer=event=>{window.__portfolioPointer=event.pointerType==='mouse'?[event.clientX,event.clientY]:undefined};
      const clear=event=>{if(!event.relatedTarget)window.__portfolioPointer=undefined};
      addEventListener('pointermove',pointer,{passive:true});addEventListener('pointerout',clear);addEventListener('blur',clear);
      addEventListener('portfolio:cursor-ready',()=>{removeEventListener('pointermove',pointer);removeEventListener('pointerout',clear);removeEventListener('blur',clear)},{once:true});
    })();
  </script>`;
  const content = `<!--portfolio:start--><template id="initial-de" data-initial-language>${render('de')}</template><template id="initial-fr" data-initial-language>${render('fr')}</template><div id="root" data-prerendered="true">${render('en')}</div>${bootstrap}<noscript><style>.media-skeleton{display:none!important}html,html *{cursor:auto!important}</style></noscript><!--portfolio:end-->`;
  const result = html
    .replace(/<script id="portfolio-scroll-preboot">[\s\S]*?<\/script>/, '')
    .replace('</head>', `${path ? scrollBootstrap : ''}</head>`)
    .replace(/<!--portfolio:start-->[\s\S]*?<!--portfolio:end-->|<div id="root"><\/div>/, () => content);
  if (!path) return result.replace('</head>', '<meta name="robots" content="noindex" /></head>');
  const copy = pageMetadata(path, translations.en);
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const url = `https://eikrose.de${path}`;
  return result
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(copy.title)}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*("\s*\/?>)/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*("\s*\/?>)/, `$1${url}$2`)
    .replace(/(<meta (?:name|property)="(?:og:|twitter:)?title" content=")[^"]*("\s*\/?>)/g, `$1${escape(copy.title)}$2`)
    .replace(/(<meta (?:name|property)="(?:og:|twitter:)?description" content=")[^"]*("\s*\/?>)/g, `$1${escape(copy.description)}$2`);
}

function fileExists(root: string, pathname: string) {
  const path = resolve(root, `.${pathname}`);
  const withinRoot = relative(root, path);
  if (withinRoot.startsWith('..') || isAbsolute(withinRoot)) return false;
  try { return statSync(path).isFile(); } catch { return false; }
}

function pageMiddleware(roots: string[], html: (pathname: string) => string | Promise<string>): Connect.NextHandleFunction {
  return async (request, response, next) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') return next();
    let pathname: string;
    try { pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname); }
    catch { return next(); }
    if (pathname === '/' || pathname === '/index.html' || pathname.startsWith('/@') || roots.some(root => fileExists(root, pathname))) return next();
    // Leave non-navigation asset requests to Vite's regular static-file handling.
    if (!request.headers.accept?.includes('text/html') && request.headers.accept !== '*/*') return next();
    try {
      const content = await html(pathname);
      response.writeHead(resolvePage(pathname) ? 200 : 404, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': Buffer.byteLength(content) });
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch (error) { next(error); }
  };
}

function portfolio404(): Plugin {
  let config: ResolvedConfig;
  return {
    name: 'portfolio-static-pages',
    configResolved(resolved) { config = resolved; },
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        const page = html.includes('<div id="root"></div>') ? pageHtml(html, resolvePage(context.path)) : html;
        // Development gets the same immediate styled text as the production HTML.
        return context.server ? page.replace('</head>', `<style>${readFileSync(resolve(config.root, 'src/styles.css'), 'utf8')}</style></head>`) : page;
      },
    },
    configureServer(server) {
      server.middlewares.use(pageMiddleware([config.root, config.publicDir], pathname =>
        server.transformIndexHtml(pathname, pageHtml(readFileSync(resolve(config.root, 'index.html'), 'utf8'), resolvePage(pathname))),
      ));
    },
    configurePreviewServer(server) {
      const output = resolve(config.root, config.build.outDir);
      server.middlewares.use(pageMiddleware([output], pathname => {
        const path = resolvePage(pathname);
        return readFileSync(resolve(output, path ? path === '/' ? 'index.html' : `${path.slice(1)}.html` : '404.html'), 'utf8');
      }));
    },
    closeBundle() {
      if (config.command !== 'build') return;
      const output = resolve(config.root, config.build.outDir);
      // Inline the built CSS to avoid a separate render-blocking stylesheet request.
      const html = readFileSync(resolve(output, 'index.html'), 'utf8').replace(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g,
        (_, href: string) => `<style>${readFileSync(resolve(output, `.${href}`), 'utf8')}</style>`,
      );
      for (const path of pagePaths) {
        const file = resolve(output, path === '/' ? 'index.html' : `${path.slice(1)}.html`);
        mkdirSync(resolve(file, '..'), { recursive: true });
        writeFileSync(file, pageHtml(html, path));
      }
      writeFileSync(resolve(output, '404.html'), pageHtml(html, null));
    },
  };
}

export default defineConfig({ plugins: [react(), portfolio404()] });
