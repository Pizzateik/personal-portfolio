import useImageTilt from './useImageTilt';
import { useLanguage } from '../i18n';
import MediaImage from './MediaImage';

export default function PhotoCard({ shape }: { shape: 'square' | 'circle' }) {
  const cardRef = useImageTilt<HTMLSpanElement>();
  const { copy } = useLanguage();
  const caption = shape === 'square' ? copy.me : copy.catCaption;

  return (
    <span ref={cardRef} className={`photo-card tilt-card photo-card--${shape}`} tabIndex={0} role="img" aria-label={shape === 'circle' ? copy.cat : copy.portrait}>
      <span className="photo-surface tilt-surface">
        <MediaImage src={shape === 'square' ? '/photos/eik.webp' : '/photos/arya.webp'} defer={shape === 'circle'} alt="" draggable={false} />
      </span>
      <span className="photo-caption" aria-hidden="true">{caption}</span>
    </span>
  );
}
