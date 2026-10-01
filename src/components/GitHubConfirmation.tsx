import { useEffect, useRef, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, GithubLogo } from '@phosphor-icons/react';
import { useLanguage } from '../i18n';
import DotCursor from './DotCursor';

export default function GitHubConfirmation({ triggerRef, onClose }: {
  triggerRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { copy } = useLanguage();

  useEffect(() => {
    const dialog = dialogRef.current!;
    const trigger = triggerRef.current;
    dialog.showModal();
    return () => {
      dialog.close();
      trigger?.focus({ preventScroll: true });
    };
  }, [triggerRef]);

  return createPortal(
    <dialog ref={dialogRef} className="github-confirmation" aria-labelledby="github-confirmation-title" aria-describedby="github-confirmation-question"
      onKeyDown={event => {
        if (event.key !== 'Tab') return;
        const controls = event.currentTarget.querySelectorAll<HTMLElement>('button, a[href]');
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}>
      <div className="github-confirmation-content">
      <h2 id="github-confirmation-title">Sometime</h2>
      <p id="github-confirmation-question">{copy.githubQuestion}</p>
      <div className="github-confirmation-actions">
        <button className="button" type="button" autoFocus onClick={onClose}>{copy.cancel}</button>
        <a className="button github-confirmation-primary" href="https://github.com/Pizzateik/Sometime" target="_blank" rel="noopener noreferrer" onClick={onClose}>
          <GithubLogo size={18} />{copy.openGithub}<ArrowUpRight size={14} />
        </a>
      </div>
      </div>
      <DotCursor />
    </dialog>, document.body,
  );
}
