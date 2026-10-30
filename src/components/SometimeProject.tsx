import { useLanguage } from '../i18n';
import { sometimeStory } from '../data/sometime';
import IdentityBar from './IdentityBar';
import LanguageSwitch from './LanguageSwitch';
import DotCursor from './DotCursor';
import SometimeScene from './SometimeScene';
import MediaImage from './MediaImage';
import SiteNavigation from './SiteNavigation';

export default function SometimeProject() {
  const { language, copy } = useLanguage();
  const story = sometimeStory[language];
  return <>
    <a className="skip-link" href="#project-story">{copy.skipStory}</a>
    <IdentityBar homeHref="/#intro" />
    <SiteNavigation page="project" />
    <LanguageSwitch />
    <main className="case-study" id="project-story" tabIndex={-1}>
      <a className="text-link case-back" href="/?return=work">← {copy.backToWork}</a>
      <header className="case-intro">
        <div><p className="eyebrow">Sometime / {story.label}</p><h1>{story.title}</h1></div>
        <div><p className="case-lead">{story.lead}</p><ul className="case-facts"><li>{story.role}</li><li>Flutter / Dart</li><li>{story.status}</li></ul></div>
      </header>
      <div className="project-visual case-hero"><SometimeScene background="/projects/sometime/Sometime_BG.webp" /></div>
      <section className="case-section"><p className="eyebrow">01 / {copy.caseIdea}</p><div><h2>{story.problemTitle}</h2><p>{story.problem}</p></div></section>
      <dl className="case-categories">
        {(['Today', 'Soon', 'Sometime'] as const).map((name, index) => <div key={name}><dt>{name}<span aria-hidden="true">.</span></dt><dd>{[story.today, story.soon, story.later][index]}</dd></div>)}
      </dl>
      <section className="case-section"><p className="eyebrow">02 / {copy.caseDesign}</p><div><h2>{story.designTitle}</h2><p>{story.design}</p></div></section>
      <div className="case-screens">
        <figure><MediaImage src="/projects/sometime/Sometime_Main.webp" alt={story.listAlt} width={1040} height={2145} defer /><figcaption>Today. Soon. Sometime.</figcaption></figure>
        <figure><MediaImage src="/projects/sometime/Sometime_Task.webp" alt={story.taskAlt} width={1040} height={2145} defer /><figcaption>{copy.caseDetails}</figcaption></figure>
      </div>
      <section className="case-section"><p className="eyebrow">03 / {copy.caseBuild}</p><div><h2>{story.buildTitle}</h2><p>{story.build}</p></div></section>
      <footer className="case-footer"><div><a className="text-link" href="https://github.com/Pizzateik/Sometime" target="_blank" rel="noopener noreferrer">{story.explore} ↗</a><p>{story.source}</p></div><a className="text-link" href="https://github.com/Pizzateik/Sometime/releases" target="_blank" rel="noopener noreferrer">{story.release} ↗</a></footer>
      <a className="text-link" href="/?return=work">← {copy.backToWork}</a>
    </main>
    <DotCursor />
  </>;
}
