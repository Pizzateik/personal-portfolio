import { useEffect, useRef, useState } from 'react';
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
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
        else visible.delete(entry.target.id);
      }
      setActive([...visible].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null);
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

  const title = projects.find(project => `work-${project.id}` === active)?.title[language];
  return <nav className="gallery-index" ref={indexRef} aria-label={copy.projectIndex}>
    <span className="gallery-index-current" aria-hidden="true">{title ?? (active === 'contact' ? copy.navContact : copy.navWork)}</span>
    {projects.map((project, index) => <a key={project.id} href={`#work-${project.id}`} aria-label={project.title[language]} title={project.title[language]} aria-current={active === `work-${project.id}` ? 'location' : undefined} onClick={event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const card = document.getElementById(`work-${project.id}`);
      if (!card) return;
      event.preventDefault();
      card.focus({ preventScroll: true });
      card.scrollIntoView({ block: 'nearest', inline: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      history.replaceState(history.state, '', event.currentTarget.hash);
    }}>{String(index + 1).padStart(2, '0')}</a>)}
  </nav>;
}
