import Wordmark from './Wordmark';
import SocialButtons from './SocialButtons';
import PhotoCard from './PhotoCard';
import MusicPlayer from './MusicPlayer';
import { useLanguage } from '../i18n';

export default function Intro({ blog = false }: { blog?: boolean }) {
  const { copy } = useLanguage();
  return (
    <section className={`intro${blog ? ' intro--blog' : ''}`} id="intro" aria-labelledby="intro-heading">
      <div className="intro-content">
        {blog ? <>
          <p className="eyebrow">{copy.blogLabel}</p>
          <h1 className="editorial-heading" id="intro-heading">{copy.blogTitle}<span aria-hidden="true">.</span></h1>
          <p className="intro-description">{copy.blogIntro}</p>
          <a className="text-link" href="/#projects">{copy.backToWork} ↗</a>
        </> : <>
          <PhotoCard shape="square" />
          <h1 id="intro-heading"><Wordmark /></h1>
          <p className="intro-description">{copy.intro}</p>
          <details className="intro-about"><summary>{copy.aboutLabel}</summary><p>{copy.aboutText}</p></details>
          <SocialButtons />
          <MusicPlayer />
        </>}
      </div>
    </section>
  );
}
