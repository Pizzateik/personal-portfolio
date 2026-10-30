import type { translations } from './i18n';

export const pagePaths = ['/', '/blog'] as const;
export type PagePath = typeof pagePaths[number];

export function resolvePage(pathname: string): PagePath | null {
  const path = pathname.replace(/\/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '') || '/';
  return pagePaths.find(page => page === path) ?? null;
}

export function pageMetadata(path: PagePath | null, copy: typeof translations.en) {
  return {
    title: path === '/blog' ? `${copy.blogTitle} · Eik Rose` : copy.title,
    description: path === '/blog' ? copy.blogIntro : copy.description,
    imageAlt: copy.imageAlt,
  };
}
