import { useEffect, useRef } from 'react';
import PirateShip from './PirateShip';

export default function ScrollIndicator() {
  const hintRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const canvas = document.querySelector('.canvas');
    const hint = hintRef.current;
    if (!canvas || !hint) return;
    let frame = 0;
    let previousLeft = canvas.scrollLeft;
    let direction = 1;
    let reverseDistance = 0;
    let lastMovement = 0;
    const render = () => {
      frame = 0;
      const now = performance.now();
      const left = Math.max(0, canvas.scrollLeft);
      const delta = left - previousLeft;
      previousLeft = left;
      if (left <= 1) {
        direction = 1;
        reverseDistance = 0;
      } else if (delta !== 0) {
        if (now - lastMovement > 180) reverseDistance = 0;
        // Require a deliberate reversal; small alternating trackpad deltas cancel out.
        reverseDistance = Math.max(0, reverseDistance - delta * direction);
        if (reverseDistance >= 12) {
          direction *= -1;
          reverseDistance = 0;
        }
        lastMovement = now;
      }
      const range = canvas.scrollWidth - canvas.clientWidth;
      const progress = range > 0 ? Math.max(0, Math.min(1, left / range)) : 0;
      hint.style.setProperty('--ship-direction', String(direction));
      hint.style.setProperty('--scroll-progress', String(progress));
      hint.style.setProperty('--wake-opacity', String(.32 - .14 * progress));
    };
    const update = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };
    canvas.addEventListener('scroll', update, { passive: true });
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(canvas);
    render();
    return () => {
      window.cancelAnimationFrame(frame);
      canvas.removeEventListener('scroll', update);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={hintRef} className="scroll-indicator" aria-hidden="true">
      <span className="ship-bob">
        <PirateShip className="ship-heading" />
      </span>
    </div>
  );
}
