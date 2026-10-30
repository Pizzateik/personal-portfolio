import { useLanguage } from '../i18n';

export default function SiteNavigation({ page }: { page: 'work' | 'blog' | 'project' }) {
  const { copy } = useLanguage();
  return <nav className="site-navigation" aria-label={copy.navigation}>
    <a href={page === 'work' ? '#projects' : '/#projects'} aria-current={page !== 'blog' ? 'page' : undefined}>{copy.navWork}</a>
    <a href="/blog" aria-current={page === 'blog' ? 'page' : undefined}>{copy.blogTitle}</a>
    <a href={page === 'work' ? '#contact' : '/#contact'}>{copy.navContact}</a>
  </nav>;
}
