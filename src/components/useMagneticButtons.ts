import { useEffect, useRef } from 'react';

export default function useMagneticButtons() {
  const rowRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const mouse = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cleanups = Array.from(row.querySelectorAll<HTMLElement>('.button:not(:disabled)')).map(button => {
      let x = 0;
      let y = 0;
      let releaseTimer: number | undefined;
      const reset = () => {
        x = y = 0;
        button.style.setProperty('--magnetic-x', '0px');
        button.style.setProperty('--magnetic-y', '0px');
      };
      const move = (event: PointerEvent) => {
        window.clearTimeout(releaseTimer);
        if (!mouse.matches || reducedMotion.matches || event.pointerType !== 'mouse') return reset();
        button.classList.remove('is-releasing');
        const bounds = button.getBoundingClientRect();
        // Subtract the existing displacement to keep the attraction stable.
        // Normalize by the button dimensions so wider buttons never pull harder.
        x = Math.max(-1, Math.min(1, (event.clientX - (bounds.left + bounds.width / 2 - x)) / (bounds.width / 2)));
        y = Math.max(-.75, Math.min(.75, (event.clientY - (bounds.top + bounds.height / 2 - y)) / (bounds.height / 2) * .75));
        button.style.setProperty('--magnetic-x', `${x}px`);
        button.style.setProperty('--magnetic-y', `${y}px`);
      };
      const leave = () => {
        window.clearTimeout(releaseTimer);
        button.classList.add('is-releasing');
        // A short hold and soft release give the button a little tactile pull.
        releaseTimer = window.setTimeout(reset, reducedMotion.matches ? 0 : 30);
      };
      const cancel = () => { window.clearTimeout(releaseTimer); reset(); };
      button.addEventListener('pointermove', move);
      button.addEventListener('pointerleave', leave);
      button.addEventListener('blur', cancel);
      reducedMotion.addEventListener('change', cancel);
      return () => {
        cancel();
        button.removeEventListener('pointermove', move);
        button.removeEventListener('pointerleave', leave);
        button.removeEventListener('blur', cancel);
        reducedMotion.removeEventListener('change', cancel);
      };
    });
    return () => cleanups.forEach(cleanup => cleanup());
  }, []);

  return rowRef;
}
