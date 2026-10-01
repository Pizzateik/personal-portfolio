import { useEffect, useRef, useState, type ComponentProps } from 'react';

type Props = ComponentProps<'img'> & { src: string; defer?: boolean; skeletonClassName?: string };

/** Reserve the scene immediately; reveal each image independently as it arrives. */
export default function MediaImage({ src, srcSet, sizes, defer = false, skeletonClassName = '', onLoad, onError, ...props }: Props) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [active, setActive] = useState(!defer);
  const [settled, setSettled] = useState(false);

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
  }, [active, settled]);

  return <>
    <img {...props} ref={imageRef} src={active ? src : undefined} srcSet={active ? srcSet : undefined} sizes={sizes} loading={defer ? 'lazy' : props.loading} decoding="async"
      onLoad={event => { setSettled(true); onLoad?.(event); }}
      onError={event => { setSettled(true); onError?.(event); }} />
    <span className={`media-skeleton ${skeletonClassName}`} data-visible={!settled} suppressHydrationWarning aria-hidden="true" />
  </>;
}
