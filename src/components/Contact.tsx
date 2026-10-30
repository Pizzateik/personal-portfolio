import { profile } from '../data/profile';
import { useLanguage } from '../i18n';
import PhotoCard from './PhotoCard';

export default function Contact() {
  const { copy } = useLanguage();
  return <section className="contact-scene" id="contact" aria-labelledby="contact-heading" tabIndex={-1}>
    <p className="eyebrow">{copy.contactLabel}</p>
    <h2 id="contact-heading">{copy.contactTitle}</h2>
    <p className="contact-description">{copy.contactText}</p>
    <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<span aria-hidden="true"> ↗</span></a>
    <div className="contact-signature"><PhotoCard shape="circle" /><p>{copy.contactSignature}</p></div>
  </section>;
}
