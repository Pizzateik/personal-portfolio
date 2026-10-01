import { MusicNote } from '@phosphor-icons/react';
import { music } from '../data/music';
import useImageTilt from './useImageTilt';
import { useLanguage } from '../i18n';

export default function MusicPlayer() {
  const artworkRef = useImageTilt<HTMLDivElement>();
  const { copy } = useLanguage();

  return (
    <aside className="music-player" aria-label={copy.listening}>
      <div className="album-art tilt-card" ref={artworkRef}>
        <span className="album-surface tilt-surface"><img src={music.artwork} alt={copy.album} /></span>
        <span className="music-notes" aria-hidden="true">
          <MusicNote className="floating-note note-one" size={12} weight="fill" />
          <MusicNote className="floating-note note-two" size={9} weight="fill" />
          <MusicNote className="floating-note note-three" size={10} weight="fill" />
        </span>
      </div>
      <div className="music-info">
        <span className="music-status">{copy.listening}</span>
        <strong className="music-title">{music.title}</strong>
        <span className="music-artist">{music.artist}</span>
      </div>
    </aside>
  );
}
