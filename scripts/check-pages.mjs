import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pagePaths, resolvePage } from '../src/routes.ts';

for (const path of pagePaths) {
  assert.equal(resolvePage(path), path);
  assert.equal(resolvePage(`${path === '/' ? '' : path}/index.html`), path);
  assert.equal(resolvePage(`${path === '/' ? '' : path}/`), path);
  const file = path === '/' ? 'index.html' : `${path.slice(1)}.html`;
  const html = readFileSync(new URL(`../dist/${file}`, import.meta.url), 'utf8');
  assert.ok(html.includes(`rel="canonical" href="https://eikrose.de${path}"`), `${path}: canonical URL`);
  assert.ok(html.includes('data-prerendered="true"'), `${path}: content before JavaScript`);
  assert.ok(!html.includes('name="robots" content="noindex"'), `${path}: indexable`);
  assert.ok(html.includes('initial-de') && html.includes('initial-fr'), `${path}: saved languages before hydration`);
}
for (const path of ['/missing', '/blog/not-a-post', '/blogger', '/work/missing']) assert.equal(resolvePage(path), null);
const blog = readFileSync(new URL('../dist/blog.html', import.meta.url), 'utf8');
assert.ok(blog.includes('There are no posts here yet.'));
assert.ok(!blog.includes('<img'), 'Blog has no personal photos or project images');
assert.ok(!/class="[^"]*\bmusic-player\b/.test(blog), 'Blog has no music decoration');
const home = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
assert.ok(home.includes('href="/blog"'), 'Final gallery card links to the blog');
assert.ok(home.includes('Project 02') && home.includes('Project 03'), 'Remaining placeholders stay intact');
assert.ok(readFileSync(new URL('../dist/404.html', import.meta.url), 'utf8').includes('name="robots" content="noindex"'));
console.log(`Checked ${pagePaths.length} prerendered routes, blog content, language fallbacks, and 404 boundaries.`);
