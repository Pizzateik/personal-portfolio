import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import NotFound from './components/NotFound';
import { LanguageProvider } from './i18n';
import './styles.css';

const isHome = window.location.pathname === '/' || window.location.pathname === '/index.html';
if (!isHome && !document.querySelector('meta[name="robots"]')) {
  const robots = document.createElement('meta');
  robots.name = 'robots';
  robots.content = 'noindex';
  document.head.append(robots);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><LanguageProvider>{isHome ? <App /> : <NotFound />}</LanguageProvider></React.StrictMode>,
);
