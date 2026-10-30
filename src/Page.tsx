import App from './App';
import NotFound from './components/NotFound';
import type { PagePath } from './routes';

export default function Page({ path }: { path: PagePath | null }) {
  return path ? <App blog={path === '/blog'} /> : <NotFound />;
}
