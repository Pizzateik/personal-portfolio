import { useEffect, useRef, useState } from 'react';
import { useLanguage, type Language } from '../i18n';

const languages: { code: Language; name: string; proficiency: string }[] = [
  { code: 'en', name: 'English', proficiency: 'Fluent' },
  { code: 'de', name: 'Deutsch', proficiency: 'Native' },
  { code: 'fr', name: 'Français', proficiency: 'Basic' },
];

export default function LanguageSwitch() {
  const { language, setLanguage, copy } = useLanguage();
  const [open, setOpen] = useState(false);
  const selectorRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !selectorRef.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  return (
    <nav
      className="language-switch"
      aria-label={copy.language}
      ref={selectorRef}
      data-open={open}
      onPointerEnter={event => { if (event.pointerType !== 'touch') setOpen(true); }}
      onPointerLeave={event => { if (event.pointerType !== 'touch' && !event.currentTarget.querySelector(':focus-visible')) setOpen(false); }}
      onPointerUp={event => { if (event.pointerType === 'touch') setOpen(true); }}
      onFocusCapture={event => { if (event.target.matches(':focus-visible')) setOpen(true); }}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget) && !event.currentTarget.matches(':hover')) setOpen(false);
      }}
    >
      {languages.map((option, index) => <span className="language-option" key={option.code}>
        {index > 0 && <span className="language-divider" aria-hidden="true">|</span>}
        <button type="button" lang={option.code} aria-label={option.name} aria-pressed={language === option.code} aria-expanded={open} aria-controls="language-skills" aria-describedby={open ? 'language-skills' : undefined} onClick={() => setLanguage(option.code)}>{option.code.toUpperCase()}</button>
      </span>)}
      <div className="language-skills" id="language-skills" role="note" aria-label={copy.languageSkills} aria-hidden={!open} lang="en">
        {languages.map(option => <div className="language-skill" key={option.code}>
          <span className="language-code">{option.code.toUpperCase()}</span>
          <span className="language-name" lang={option.code}>{option.name}</span>
          <span className="language-proficiency">{option.proficiency}</span>
        </div>)}
      </div>
    </nav>
  );
}
