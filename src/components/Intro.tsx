import Wordmark from './Wordmark';
import SocialButtons from './SocialButtons';
import PhotoCard from './PhotoCard';
import MusicPlayer from './MusicPlayer';
import { useLanguage } from '../i18n';

export default function Intro() {
  const { copy } = useLanguage();
  return (
    <section className="intro" id="intro" aria-labelledby="intro-heading">
      <div className="intro-content">
        <PhotoCard shape="square" />
        <h1 id="intro-heading"><Wordmark /></h1>
        <p className="intro-description">{copy.intro}</p>
        <SocialButtons />
        <MusicPlayer />
      </div>
    </section>
  );
}
