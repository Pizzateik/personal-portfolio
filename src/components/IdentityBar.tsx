import { useEffect, useState } from 'react';
import Wordmark from './Wordmark';
import { useLanguage } from '../i18n';

const clock = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});

export default function IdentityBar() {
  const { copy } = useLanguage();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <header className="identity-bar">
      <a className="identity-home" href="#intro" aria-label={`Eik Rose. — ${copy.back}`}><Wordmark /></a>
      <span className="identity-details">
        <span className="identity-location">{copy.germany}</span>
        <time dateTime={now.toISOString()} aria-label={`${copy.time}: ${clock.format(now)}`}>{clock.format(now)}</time>
      </span>
    </header>
  );
}
