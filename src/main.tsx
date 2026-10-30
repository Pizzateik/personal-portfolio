import React from 'react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Page from './Page';
import { resolvePage } from './routes';
import { LanguageProvider } from './i18n';
import './styles.css';

const path = resolvePage(window.location.pathname);
if (!path && !document.querySelector('meta[name="robots"]')) {
  const robots = document.createElement('meta');
  robots.name = 'robots';
  robots.content = 'noindex';
  document.head.append(robots);
}

function Application() {
  useEffect(() => {
    document.documentElement.dataset.enhanced = 'true';
    return () => { delete document.documentElement.dataset.enhanced; };
  }, []);
  return <LanguageProvider><Page path={path} /></LanguageProvider>;
}

const root = document.getElementById('root')!;
const application = <React.StrictMode><Application /></React.StrictMode>;
// Capture the visible offset before React can replace any pre-rendered nodes.
window.dispatchEvent(new Event('portfolio:hydrate-start'));
if (root.dataset.prerendered) ReactDOM.hydrateRoot(root, application);
else ReactDOM.createRoot(root).render(application);
