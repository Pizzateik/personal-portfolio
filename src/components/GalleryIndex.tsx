import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { projects } from '../data/projects';
import { useLanguage } from '../i18n';

export default function GalleryIndex() {
  const { language, copy } = useLanguage();
  const indexRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const canvas = document.querySelector<HTMLElement>('.canvas');
    const index = indexRef.current;
    if (!canvas || !index) return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      const horizontal = canvas.scrollWidth > canvas.clientWidth;
      const center = (horizontal ? window.innerWidth : window.innerHeight) / 2;
      const nearest = [...visible].map(card => {
        const bounds = card.getBoundingClientRect();
        return { id: card.id, distance: Math.abs((horizontal ? bounds.left + bounds.width / 2 : bounds.top + bounds.height / 2) - center) };
      }).sort((a, b) => a.distance - b.distance)[0];
      setActive(nearest?.id ?? null);
    }, { threshold: [0, .25, .5, .75, 1] });
    canvas.querySelectorAll('.project, #contact').forEach(card => observer.observe(card));
    let frame = 0;
    const render = () => {
      frame = 0;
      const horizontal = canvas.scrollWidth > canvas.clientWidth;
      const range = horizontal ? canvas.scrollWidth - canvas.clientWidth : document.documentElement.scrollHeight - window.innerHeight;
      const position = horizontal ? canvas.scrollLeft : window.scrollY;
      index.style.setProperty('--gallery-progress', String(range > 0 ? Math.max(0, Math.min(1, position / range)) : 0));
    };
    const update = () => { if (!frame) frame = window.requestAnimationFrame(render); };
    canvas.addEventListener('scroll', update, { passive: true });
    window.addEventListener('scroll', update, { passive: true });
    const resize = new ResizeObserver(update);
    resize.observe(canvas);
    render();
    return () => {
      observer.disconnect();
      resize.disconnect();
      canvas.removeEventListener('scroll', update);
      window.removeEventListener('scroll', update);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  // One highlight slides between numbers instead of each number lighting up on its own.
  useLayoutEffect(() => {
    const index = indexRef.current;
    const marker = index?.querySelector<HTMLElement>('.gallery-index-marker');
    if (!index || !marker) return;
    // Appearing from nothing or re-measuring after a resize: place it without sliding.
    const place = (slide: boolean) => {
      const current = index.querySelector<HTMLElement>('a[aria-current]');
      const instant = !slide || marker.dataset.visible !== 'true';
      marker.dataset.visible = String(!!current);
      if (!current) return;
      if (instant) marker.style.transition = 'opacity 150ms ease-out';
      marker.style.setProperty('--marker-x', `${current.offsetLeft}px`);
      marker.style.setProperty('--marker-y', `${current.offsetTop}px`);
      marker.style.setProperty('--marker-width', `${current.offsetWidth}px`);
      marker.style.setProperty('--marker-height', `${current.offsetHeight}px`);
      if (instant) {
        void marker.offsetWidth;
        marker.style.transition = '';
      }
    };
    place(true);
    // Observers report once on attach; skip it so it cannot cancel the slide just started.
    let attached = false;
    const resize = new ResizeObserver(() => { if (attached) place(false); attached = true; });
    resize.observe(index);
    return () => resize.disconnect();
  }, [active, language]);

  const title = projects.find(project => `work-${project.id}` === active)?.title[language];
  const label = title ?? (active === 'contact' ? copy.navContact : copy.navWork);
  return <nav className="gallery-index" ref={indexRef} aria-label={copy.projectIndex}>
    <span className="gallery-index-marker" aria-hidden="true" />
    <span className="gallery-index-current" aria-hidden="true"><span key={label}>{label}</span></span>
    {projects.map((project, index) => <a key={project.id} href={`#work-${project.id}`} aria-label={project.title[language]} title={project.title[language]} aria-current={active === `work-${project.id}` ? 'location' : undefined} onClick={event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const card = document.getElementById(`work-${project.id}`);
      if (!card) return;
      event.preventDefault();
      card.focus({ preventScroll: true });
      card.scrollIntoView({ block: 'center', inline: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      history.replaceState(history.state, '', event.currentTarget.hash);
    }}>{String(index + 1).padStart(2, '0')}</a>)}
  </nav>;
}
