import { ArrowUpRight } from '@phosphor-icons/react/dist/csr/ArrowUpRight';
import { useLayoutEffect, useRef } from 'react';
import type { Project } from '../data/projects';
import { useLanguage } from '../i18n';
import SometimeScene from './SometimeScene';
import MediaImage from './MediaImage';

export default function ProjectCard({ project, deferMedia = false }: { project: Project; deferMedia?: boolean }) {
  const isSometime = project.media === 'sometime';
  const cardRef = useRef<HTMLElement>(null);
  const { language, copy } = useLanguage();

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = card.getBoundingClientRect();
    // Initially visible cards animate in CSS, before hydration. Only defer cards
    // outside the viewport so already painted content never disappears on load.
    if (bounds.right > 0 && bounds.left < window.innerWidth && bounds.bottom > 0 && bounds.top < window.innerHeight) return;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      delete card.dataset.reveal;
      observer.disconnect();
    }, { threshold: .08 });
    card.dataset.reveal = 'pending';
    observer.observe(card);
    return () => {
      observer.disconnect();
      delete card.dataset.reveal;
    };
  }, []);

  const title = project.title[language];
  const category = project.media === 'blog' ? copy.writing : project.category === 'Creative development' ? copy.creativeDevelopment : copy.productDesign;
  const status = isSometime ? copy.openSource : project.media === 'blog' ? copy.blogTitle : copy.preview;
  const visual = project.media === 'blog'
    ? <div className="blog-card-content"><p className="eyebrow">{copy.blogLabel}</p><span className="blog-card-title">{copy.blogCardTitle}</span><p>{copy.blogCardText}</p></div>
    : isSometime
    ? <SometimeScene background={project.image} />
    : <MediaImage src={project.image} defer={deferMedia} alt="" draggable={false} />;
  return (
    <article ref={cardRef} className={`project${isSometime ? ' project--sometime' : ''}${project.media === 'blog' ? ' project--blog' : ''}`} aria-labelledby={`project-${project.id}`}>
      <div className="project-frame">
        {project.href ? (
          <a className="project-visual" href={project.href} aria-label={`${copy.view} ${title}`}>{visual}<ArrowUpRight className="project-open" size={21} aria-hidden="true" /></a>
        ) : (
          <div className="project-visual" tabIndex={0} role="group" aria-label={`${title} — ${copy.preview}`} aria-describedby={`description-${project.id}`}>{visual}</div>
        )}
      </div>
      <div className="project-caption">
        <div><h2 id={`project-${project.id}`}>{project.href ? <a href={project.href}>{title}</a> : title}</h2><div className="project-meta"><span>{category}</span><span>{status}</span></div><p id={`description-${project.id}`}>{project.description[language]}</p></div>
      </div>
    </article>
  );
}
