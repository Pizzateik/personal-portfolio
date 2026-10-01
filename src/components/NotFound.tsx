import { useLanguage, type translations } from '../i18n';
import Wordmark from './Wordmark';
import PirateShip from './PirateShip';
import LanguageSwitch from './LanguageSwitch';
import DotCursor from './DotCursor';

// Also rendered into the static 404.html at build time, so it works without JS.
export function NotFoundContent({ copy }: { copy: typeof translations.en }) {
  return (
    <main className="not-found" aria-labelledby="not-found-heading">
      <span className="not-found-brand"><Wordmark /></span>
      <div className="not-found-content">
        <span className="ship-bob not-found-ship"><PirateShip /></span>
        <p className="not-found-code">404</p>
        <h1 id="not-found-heading">{copy.notFoundHeading}</h1>
        <p className="not-found-text">{copy.notFoundText}</p>
        <a className="button not-found-home" href="/">{copy.sailHome}</a>
      </div>
    </main>
  );
}

export default function NotFound() {
  const { copy } = useLanguage();
  return <><NotFoundContent copy={copy} /><LanguageSwitch /><DotCursor /></>;
}
