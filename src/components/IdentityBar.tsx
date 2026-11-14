import { useEffect, useState } from 'react';
import Wordmark from './Wordmark';
import { useLanguage } from '../i18n';

const clock = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});

export default function IdentityBar({ homeHref = '#intro' }: { homeHref?: string }) {
  const { copy } = useLanguage();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  // On phones the fixed header stack is tall: tuck it away while reading down,
  // bring it back on any upward scroll or when keyboard focus enters it.
  useEffect(() => {
    const phone = window.matchMedia('(max-width: 768px)');
    const root = document.documentElement;
    const header = '.identity-bar, .site-navigation, .language-switch';
    let last = window.scrollY;
    let frame = 0;
    const show = () => { delete root.dataset.headerHidden; };
    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const delta = y - last;
      if (!phone.matches || y < 140 || document.activeElement?.closest(header)) {
        show();
        last = y;
        return;
      }
      if (Math.abs(delta) < 8) return;
      if (delta > 0) root.dataset.headerHidden = 'true';
      else show();
      last = y;
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const onFocus = (event: FocusEvent) => { if (event.target instanceof Element && event.target.closest(header)) show(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('focusin', onFocus);
    phone.addEventListener('change', show);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('focusin', onFocus);
      phone.removeEventListener('change', show);
      show();
    };
  }, []);

  return (
    <header className="identity-bar">
      <a className="identity-home" href={homeHref} aria-label={`Eik Rose. — ${copy.back}`}><Wordmark /></a>
      <span className="identity-details">
        <span className="identity-location">{copy.germany}</span>
        <time dateTime={now?.toISOString()} aria-label={now ? `${copy.time}: ${clock.format(now)}` : copy.time}>{now ? clock.format(now) : '--:--'}</time>
      </span>
    </header>
  );
}
