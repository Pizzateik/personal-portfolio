import App from './App';
import NotFound from './components/NotFound';
import SometimeProject from './components/SometimeProject';
import type { PagePath } from './routes';

export default function Page({ path }: { path: PagePath | null }) {
  return path === '/work/sometime' ? <SometimeProject /> : path ? <App blog={path === '/blog'} /> : <NotFound />;
}
