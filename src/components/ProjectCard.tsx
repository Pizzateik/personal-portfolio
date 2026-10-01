import { ArrowUpRight } from '@phosphor-icons/react';
import { useRef, useState } from 'react';
import type { Project } from '../data/projects';
import { useLanguage } from '../i18n';
import SometimeScene from './SometimeScene';
import GitHubConfirmation from './GitHubConfirmation';

export default function ProjectCard({ project }: { project: Project }) {
  const isSometime = project.media === 'sometime';
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { language, copy } = useLanguage();
  const title = project.title[language];
  const visual = isSometime
    ? <SometimeScene background={project.image} />
    : <img src={project.image} alt="" draggable={false} />;
  return (
    <article className={`project${isSometime ? ' project--sometime' : ''}`} aria-labelledby={`project-${project.id}`}>
      <div className="project-frame">
        {isSometime ? (
          <button ref={triggerRef} className="project-visual project-trigger" type="button" aria-label={`${copy.view} ${title}`} aria-haspopup="dialog" onClick={() => setConfirmationOpen(true)}>{visual}</button>
        ) : project.href ? (
          <a className="project-visual" href={project.href} aria-label={`${copy.view} ${title}`}>{visual}<ArrowUpRight className="project-open" size={21} /></a>
        ) : (
          <div className="project-visual" tabIndex={0} role="group" aria-label={`${title} — ${copy.preview}`} aria-describedby={`description-${project.id}`}>{visual}</div>
        )}
      </div>
      <div className="project-caption">
        <div><h2 id={`project-${project.id}`}>{title}</h2><p id={`description-${project.id}`}>{project.description[language]}</p></div>
      </div>
      {confirmationOpen && <GitHubConfirmation triggerRef={triggerRef} onClose={() => setConfirmationOpen(false)} />}
    </article>
  );
}
