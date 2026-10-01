import { useEffect, useRef, useState, type ComponentProps } from 'react';

type Props = ComponentProps<'img'> & { src: string; defer?: boolean };

/** Defer distant media and show a quiet placeholder only during prolonged loads. */
export default function MediaImage({ src, defer = false, onLoad, onError, ...props }: Props) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [active, setActive] = useState(!defer);
  const [settled, setSettled] = useState(false);
  const [placeholder, setPlaceholder] = useState(false);

  useEffect(() => {
    if (active) return;
    const image = imageRef.current;
    if (!image) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setActive(true);
        observer.disconnect();
      }
    }, { rootMargin: '240px' });
    observer.observe(image);
    return () => observer.disconnect();
  }, [active]);

  useEffect(() => {
    if (!active || settled) return;
    if (imageRef.current?.complete && imageRef.current.naturalWidth > 0) {
      setSettled(true);
      return;
    }
    const timer = window.setTimeout(() => setPlaceholder(true), 900);
    return () => window.clearTimeout(timer);
  }, [active, settled]);

  return <>
    <img {...props} ref={imageRef} src={active ? src : undefined} loading={defer ? 'lazy' : props.loading} decoding="async"
      onLoad={event => { setSettled(true); onLoad?.(event); }}
      onError={event => { setSettled(true); onError?.(event); }} />
    <span className="media-skeleton" data-visible={placeholder && !settled} aria-hidden="true" />
  </>;
}
