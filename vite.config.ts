import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { defineConfig, type Connect, type Plugin, type ResolvedConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NotFoundContent } from './src/components/NotFound';
import { translations } from './src/i18n';

function notFoundHtml(html: string) {
  return html
    .replace('</head>', '<meta name="robots" content="noindex" /></head>')
    .replace('<div id="root"></div>', `<div id="root">${renderToStaticMarkup(createElement(NotFoundContent, { copy: translations.en }))}</div>`)
    .replace('</body>', '<noscript><style>html,html *{cursor:auto!important}</style></noscript></body>');
}

function fileExists(root: string, pathname: string) {
  const path = resolve(root, `.${pathname}`);
  const withinRoot = relative(root, path);
  if (withinRoot.startsWith('..') || isAbsolute(withinRoot)) return false;
  try { return statSync(path).isFile(); } catch { return false; }
}

function unknownPage(roots: string[], html: (pathname: string) => string | Promise<string>): Connect.NextHandleFunction {
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
      response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': Buffer.byteLength(content) });
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch (error) { next(error); }
  };
}

function portfolio404(): Plugin {
  let config: ResolvedConfig;
  return {
    name: 'portfolio-404',
    configResolved(resolved) { config = resolved; },
    configureServer(server) {
      server.middlewares.use(unknownPage([config.root, config.publicDir], pathname =>
        server.transformIndexHtml(pathname, notFoundHtml(readFileSync(resolve(config.root, 'index.html'), 'utf8'))),
      ));
    },
    configurePreviewServer(server) {
      const output = resolve(config.root, config.build.outDir);
      server.middlewares.use(unknownPage([output], () => readFileSync(resolve(output, '404.html'), 'utf8')));
    },
    closeBundle() {
      if (config.command !== 'build') return;
      const output = resolve(config.root, config.build.outDir);
      writeFileSync(resolve(output, '404.html'), notFoundHtml(readFileSync(resolve(output, 'index.html'), 'utf8')));
    },
  };
}

export default defineConfig({ plugins: [react(), portfolio404()] });
