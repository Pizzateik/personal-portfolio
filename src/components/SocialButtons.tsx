import { DownloadSimple, GithubLogo, InstagramLogo, EnvelopeSimple } from '@phosphor-icons/react';
import { profile } from '../data/profile';
import useMagneticButtons from './useMagneticButtons';
import { useLanguage } from '../i18n';

export default function SocialButtons() {
  const rowRef = useMagneticButtons();
  const { copy } = useLanguage();
  const expandedContents = (Icon: typeof GithubLogo, label: string) => <>
    <Icon className="button-icon" size={21} weight="regular" aria-hidden="true" />
    <span className="button-expanded" aria-hidden="true">
      <Icon size={21} weight="regular" />
      <span className="button-detail">{label}</span>
    </span>
  </>;
  const cvContents = <>
    <span className="cv-liquid" aria-hidden="true" />
    <span className="cv-label"><span className="cv-text">{copy.cv}</span><DownloadSimple size={18} weight="regular" aria-hidden="true" /></span>
  </>;
  return (
    <nav className="social-buttons" ref={rowRef} aria-label={copy.social}>
      <a className="button icon-button expand-button" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub — Pizzateik">
        {expandedContents(GithubLogo, 'Pizzateik')}
      </a>
      <a className="button icon-button expand-button" href={profile.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram — @teikkk">
        {expandedContents(InstagramLogo, '@teikkk')}
      </a>
      <a className="button email-button expand-button" href={`mailto:${profile.email}`} aria-label={`${copy.email} ${profile.email}`}>
        {expandedContents(EnvelopeSimple, profile.email)}
      </a>
      {profile.cv ? (
        <a className="button cv-button" href={profile.cv} download="Eik-Rose-CV.pdf" aria-label={copy.cv}>{cvContents}</a>
      ) : (
        <button className="button cv-button" type="button" disabled aria-label={copy.cvSoon} title={copy.cvSoon}>{cvContents}</button>
      )}
    </nav>
  );
}
