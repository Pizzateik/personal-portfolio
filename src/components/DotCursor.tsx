import { useEffect, useRef } from 'react';
import { useLanguage } from '../i18n';

export default function DotCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { copy } = useLanguage();

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shape = cursor.querySelector<HTMLElement>('.cursor-shape')!;
    let pressAnimation: Animation | undefined;
    let blendTimer = 0;
    const hide = () => {
      cursor.style.opacity = '0';
      cursor.dataset.pressed = 'false';
      cursor.dataset.project = 'false';
      cursor.dataset.dot = 'true';
      window.clearTimeout(blendTimer);
      pressAnimation?.cancel();
    };
    const move = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType !== 'mouse') return hide();
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.style.opacity = '1';
      const project = String(event.target instanceof Element && !!event.target.closest('.project'));
      if (cursor.dataset.project !== project) {
        window.clearTimeout(blendTimer);
        cursor.dataset.project = project;
        cursor.dataset.dot = 'false';
        if (project === 'false') {
          if (reducedMotion.matches) cursor.dataset.dot = 'true';
          else blendTimer = window.setTimeout(() => { cursor.dataset.dot = 'true'; }, 210);
        }
      }
    };
    const press = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType !== 'mouse' || event.button !== 0) return;
      pressAnimation?.cancel();
      cursor.dataset.pressed = 'true';
    };
    const release = (event: PointerEvent) => {
      if (cursor.dataset.pressed !== 'true' || event.button !== 0) return;
      cursor.dataset.pressed = 'false';
      if (!reducedMotion.matches) {
        pressAnimation = shape.animate([
          { transform: 'translate(-50%, -50%) scale(.84)' },
          { transform: 'translate(-50%, -50%) scale(1.035)', offset: .7 },
          { transform: 'translate(-50%, -50%) scale(1)' },
        ], { duration: 210, easing: 'ease-out' });
      }
    };
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) hide(); };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', press);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', hide);
    window.addEventListener('pointerout', leave);
    window.addEventListener('blur', hide);
    finePointer.addEventListener('change', hide);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', hide);
      window.removeEventListener('pointerout', leave);
      window.removeEventListener('blur', hide);
      finePointer.removeEventListener('change', hide);
      pressAnimation?.cancel();
      window.clearTimeout(blendTimer);
    };
  }, []);

  return <div className="dot-cursor" ref={cursorRef} data-dot="true" data-project="false" aria-hidden="true"><span className="cursor-shape"><span className="cursor-dot" /><span className="cursor-pill" /><span className="cursor-label">{copy.cursorView}</span></span></div>;
}
