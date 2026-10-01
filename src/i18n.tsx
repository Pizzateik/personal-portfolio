import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Language = 'en' | 'de' | 'fr';
const storageKey = 'eik-rose-language';

const translations = {
  en: {
    githubQuestion: 'Open this project on GitHub?', cancel: 'Cancel', openGithub: 'Open GitHub',
    intro: 'I’m a student who likes coding, design, business, politics, space, and thinking about what comes next. Most of the time, that means learning something new, building a project, or trying to make an idea work.',
    germany: 'Germany', back: 'Back to introduction', time: 'Current time in Germany',
    skip: 'Skip to selected projects', projects: 'Selected projects',
    social: 'Social and contact links', email: 'Email', cv: 'Download CV', cvSoon: 'CV coming soon',
    listening: 'Currently listening', album: 'Toto IV album cover',
    me: 'me :)', portrait: 'Portrait of Eik Rose', cat: 'Arya — Professional interruption specialist',
    catCaption: 'Professional interruption specialist', view: 'View', preview: 'preview',
    language: 'Choose language', languageSkills: 'Language proficiency', title: 'Eik Rose. — Software & Design',
    description: 'Eik Rose. — Software, design, and experimental digital projects. Based in Germany.',
  },
  de: {
    githubQuestion: 'Dieses Projekt auf GitHub öffnen?', cancel: 'Abbrechen', openGithub: 'GitHub öffnen',
    intro: 'Ich bin Student und interessiere mich für Programmieren, Design, Wirtschaft, Politik, Raumfahrt und die Frage, was als Nächstes kommt. Meistens lerne ich dabei etwas Neues, arbeite an einem Projekt oder versuche, eine Idee umzusetzen.',
    germany: 'Deutschland', back: 'Zurück zur Einleitung', time: 'Aktuelle Uhrzeit in Deutschland',
    skip: 'Zu den ausgewählten Projekten', projects: 'Ausgewählte Projekte',
    social: 'Social Media und Kontakt', email: 'E-Mail an', cv: 'CV herunterladen', cvSoon: 'CV bald verfügbar',
    listening: 'Höre gerade', album: 'Albumcover von Toto IV',
    me: 'ich :)', portrait: 'Porträt von Eik Rose', cat: 'Arya — Professionelle Unterbrechungsspezialistin',
    catCaption: 'Professionelle Unterbrechungsspezialistin', view: 'Ansehen:', preview: 'Vorschau',
    language: 'Sprache wählen', languageSkills: 'Sprachkenntnisse', title: 'Eik Rose. — Software & Design',
    description: 'Eik Rose. — Software, Design und experimentelle digitale Projekte. Aus Deutschland.',
  },
  fr: {
    githubQuestion: 'Voir ce projet sur GitHub ?', cancel: 'Annuler', openGithub: 'Ouvrir GitHub',
    intro: 'Je suis étudiant et je m’intéresse au code, au design, à l’économie, à la politique, à l’espace et à ce que nous réserve l’avenir. Le plus souvent, j’apprends quelque chose, je développe un projet ou j’essaie de concrétiser une idée.',
    germany: 'Allemagne', back: 'Retour à la présentation', time: 'Heure actuelle en Allemagne',
    skip: 'Aller aux projets sélectionnés', projects: 'Projets sélectionnés',
    social: 'Réseaux sociaux et contact', email: 'Écrire à', cv: 'Télécharger le CV', cvSoon: 'CV bientôt disponible',
    listening: 'En ce moment', album: 'Pochette de l’album Toto IV',
    me: 'moi :)', portrait: 'Portrait d’Eik Rose', cat: 'Arya — Spécialiste des interruptions',
    catCaption: 'Spécialiste des interruptions', view: 'Voir', preview: 'aperçu',
    language: 'Choisir la langue', languageSkills: 'Compétences linguistiques', title: 'Eik Rose. — Logiciels & Design',
    description: 'Eik Rose. — Logiciels, design et projets numériques expérimentaux. Basé en Allemagne.',
  },
};

function initialLanguage(): Language {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'en' || saved === 'de' || saved === 'fr') return saved;
  } catch { /* Browser storage may be unavailable. */ }
  return 'en';
}

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  copy: typeof translations.en;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, updateLanguage] = useState<Language>(initialLanguage);
  const copy = translations[language];
  const setLanguage = (next: Language) => {
    updateLanguage(next);
    try { localStorage.setItem(storageKey, next); } catch { /* Keep switching usable without storage. */ }
  };
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = copy.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy.description);
  }, [language, copy]);
  return <LanguageContext.Provider value={{ language, setLanguage, copy }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage requires LanguageProvider');
  return context;
}
