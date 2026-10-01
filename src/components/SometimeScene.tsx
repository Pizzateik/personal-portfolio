import { useEffect, useRef, useState } from 'react';
import MediaImage from './MediaImage';
import { sometimeBackground } from '../data/responsiveImages';

const layers = [
  ['green', 'Sometime_Green'],
  ['red', 'Sometime_Red'],
  ['lilac', 'Sometime_Lilac'],
  ['widget-large', 'Sometime_Widget_Large'],
  ['widget-medium', 'Sometime_Widget_Medium'],
  ['widget-small', 'Sometime_Widget_Small'],
  ['task', 'Sometime_Task'],
  ['main', 'Sometime_Main'],
] as const;

export default function SometimeScene({ background }: { background: string }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [hoverReady, setHoverReady] = useState(false);
  useEffect(() => {
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let cancelled = false;
    let started = false;
    let idle = 0;
    let timer = 0;
    let paintFrame = 0;
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const preload = async () => {
      if (cancelled) return;
      try {
        await Promise.all(layers.slice(0, 6).map(async ([, asset]) => {
          const image = new Image();
          image.fetchPriority = 'low';
          image.src = `/projects/sometime/${asset}.webp`;
          await image.decode();
        }));
        if (!cancelled) setHoverReady(true);
      } catch { /* Keep the calm scene usable if a supporting image is unavailable. */ }
    };
    const schedule = async () => {
      if (!pointer.matches || started) return;
      started = true;
      const hero = sceneRef.current?.querySelectorAll<HTMLImageElement>('img.sometime-background, img.sometime-main, img.sometime-task');
      await Promise.allSettled([...hero || []].map(image => image.decode()));
      if (cancelled) return;
      paintFrame = window.requestAnimationFrame(() => {
        paintFrame = window.requestAnimationFrame(() => {
          if (cancelled) return;
          if (idleWindow.requestIdleCallback) idle = idleWindow.requestIdleCallback(() => void preload(), { timeout: 1500 });
          else timer = window.setTimeout(() => void preload(), 120);
        });
      });
    };
    void schedule();
    pointer.addEventListener('change', schedule);
    return () => {
      cancelled = true;
      pointer.removeEventListener('change', schedule);
      if (idle) idleWindow.cancelIdleCallback?.(idle);
      window.clearTimeout(timer);
      window.cancelAnimationFrame(paintFrame);
    };
  }, []);

  return (
    <div ref={sceneRef} className="sometime-scene" data-hover-ready={hoverReady} aria-hidden="true">
      <MediaImage className="sometime-background" {...sometimeBackground} src={background} alt="" draggable={false} fetchPriority="high" />
      {layers.map(([layer, asset]) => (
        layer === 'main' || layer === 'task' ? <MediaImage
          key={layer}
          className={`sometime-layer sometime-${layer} sometime-phone`}
          skeletonClassName={`sometime-layer sometime-${layer} sometime-phone sometime-phone-placeholder`}
          src={`/projects/sometime/${asset}.webp`}
          width={1040} height={2145}
          fetchPriority="high" alt="" draggable={false}
        /> : <img
          key={layer}
          className={`sometime-layer sometime-${layer}${layer.startsWith('widget') ? '' : ' sometime-phone'}`}
          src={hoverReady ? `/projects/sometime/${asset}.webp` : undefined}
          fetchPriority="low"
          alt=""
          draggable={false}
          decoding="async"
        />
      ))}
    </div>
  );
}
