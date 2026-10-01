import { useEffect, useRef } from 'react';

/** A stable perspective host; only its inner .tilt-surface is transformed. */
export default function useImageTilt<T extends HTMLElement>(enabled = true) {
  const cardRef = useRef<T>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !enabled) return;
    const mouse = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    const reset = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      card.removeAttribute('data-tilt-active');
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    };
    const move = (event: PointerEvent) => {
      if (!mouse.matches || reducedMotion.matches || event.pointerType !== 'mouse') return reset();
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const bounds = card.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, (pointerX - bounds.left - bounds.width / 2) / (bounds.width / 2)));
        const y = Math.max(-1, Math.min(1, (pointerY - bounds.top - bounds.height / 2) / (bounds.height / 2)));
        card.style.setProperty('--tilt-x', `${-y * 6}deg`);
        card.style.setProperty('--tilt-y', `${x * 6}deg`);
        card.setAttribute('data-tilt-active', 'true');
      });
    };
    card.addEventListener('pointermove', move, { passive: true });
    card.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);
    mouse.addEventListener('change', reset);
    reducedMotion.addEventListener('change', reset);
    return () => {
      reset();
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerleave', reset);
      window.removeEventListener('blur', reset);
      mouse.removeEventListener('change', reset);
      reducedMotion.removeEventListener('change', reset);
    };
  }, [enabled]);

  return cardRef;
}
