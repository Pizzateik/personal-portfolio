import { useLayoutEffect, useRef } from 'react';
import IdentityBar from './components/IdentityBar';
import Intro from './components/Intro';
import ProjectCard from './components/ProjectCard';
import ScrollIndicator from './components/ScrollIndicator';
import DotCursor from './components/DotCursor';
import PhotoCard from './components/PhotoCard';
import LanguageSwitch from './components/LanguageSwitch';
import { useLanguage } from './i18n';
import { projects } from './data/projects';

export default function App() {
  const { copy } = useLanguage();
  const canvasRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Retire preboot input and restore a replaced container before reading its
    // real position or painting. Both spring coordinates start at this value.
    window.dispatchEvent(new CustomEvent('portfolio:scroll-ready', { detail: { canvas } }));
    const desktop = window.matchMedia('(min-width: 769px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let position = canvas.scrollLeft;
    let target = position;
    let velocity = 0;
    let previousTime = 0;
    // Hydration can finish long before images/dev modules finish loading.
    // Keep loading-time input direct; smooth only fresh input after load.
    let smoothReadyAt = document.readyState === 'complete' ? performance.now() : Infinity;
    const stop = () => {
      window.cancelAnimationFrame(frame);
      frame = previousTime = 0;
      velocity = 0;
      position = target = canvas.scrollLeft;
    };
    const animate = (time: number) => {
      const elapsed = (previousTime ? Math.min(time - previousTime, 64) : 16) / 1000;
      previousTime = time;
      // A critically damped spring eases into each notch instead of starting
      // with a sharp jump. Preserve velocity across successive wheel events.
      const frequency = 18;
      const displacement = position - target;
      const momentum = velocity + frequency * displacement;
      const decay = Math.exp(-frequency * elapsed);
      position = target + (displacement + momentum * elapsed) * decay;
      velocity = (velocity - frequency * momentum * elapsed) * decay;
      canvas.scrollLeft = position;
      if (Math.abs(target - position) > .5 || Math.abs(velocity) > 5) {
        frame = window.requestAnimationFrame(animate);
      } else {
        canvas.scrollLeft = target;
        stop();
      }
    };
    const onWheel = (event: WheelEvent) => {
      // Preserve native horizontal trackpad gestures and pinch zoom.
      if (!desktop.matches || event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) {
        stop();
        return;
      }
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? canvas.clientWidth : 1;
      const delta = event.deltaY * unit;
      if (reducedMotion.matches || document.readyState !== 'complete' || event.timeStamp < smoothReadyAt) {
        stop();
        canvas.scrollLeft += delta;
        return;
      }
      if (!frame || delta * (target - position) < 0) {
        position = target = canvas.scrollLeft;
        velocity = 0;
      }
      target = Math.max(0, Math.min(canvas.scrollWidth - canvas.clientWidth, target + delta));
      if (!frame) frame = window.requestAnimationFrame(animate);
    };
    const loaded = () => {
      stop();
      smoothReadyAt = performance.now();
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('load', loaded, { once: true });
    window.addEventListener('pointerdown', stop);
    window.addEventListener('keydown', stop);
    window.addEventListener('resize', stop);
    reducedMotion.addEventListener('change', stop);
    return () => {
      stop();
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('load', loaded);
      window.removeEventListener('pointerdown', stop);
      window.removeEventListener('keydown', stop);
      window.removeEventListener('resize', stop);
      reducedMotion.removeEventListener('change', stop);
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#projects">{copy.skip}</a>
      <IdentityBar />
      <LanguageSwitch />
      <main className="canvas" ref={canvasRef} aria-label="Portfolio">
        <Intro />
        <section className="projects" id="projects" aria-label={copy.projects} tabIndex={-1}>
          {projects.map((project, index) => <ProjectCard key={project.id} project={project} deferMedia={index >= 2} />)}
        </section>
        <aside className="portfolio-signature" aria-label={copy.catCaption}><PhotoCard shape="circle" /></aside>
      </main>
      <ScrollIndicator />
      <DotCursor />
    </>
  );
}
