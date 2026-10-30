import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { pageMetadata, resolvePage } from './routes';

export type Language = 'en' | 'de' | 'fr';
const storageKey = 'eik-rose-language';

export const translations = {
  en: {
    contactLabel: 'Say hello', contactTitle: 'Have something in mind?', contactText: 'A project, a question, or an idea you’d like to talk about. I’d like to hear it.', contactSignature: 'Eik, with occasional interruptions from Arya.',
    productDesign: 'Product design', creativeDevelopment: 'Creative development', writing: 'Writing', openSource: 'Open source',
    skipStory: 'Skip to project story', caseIdea: 'The idea', caseDesign: 'The interface', caseBuild: 'The build', caseDetails: 'Task details', sometimeDescription: 'Sometime: a task app for Today, Soon, and Sometime. Design and development by Eik Rose.',
    blogTitle: 'Blog', blogIntro: 'Notes on things I build, ideas I keep coming back to, and what I learn along the way.',
    blogLabel: 'Notes & ideas', blogCardTitle: 'A place for longer thoughts.', blogCardText: 'On code, design, and the things in between.',
    blogEmptyTitle: 'The first page is still blank.', blogEmptyText: 'There are no posts here yet. For now, you can explore what I’m building.', backToWork: 'Explore my work',
    cursorView: 'View',
    intro: 'I’m a student who likes coding, design, business, politics, space, and thinking about what comes next. Most of the time, that means learning something new, building a project, or trying to make an idea work.',
    germany: 'Germany', back: 'Back to introduction', time: 'Current time in Germany',
    skip: 'Skip to selected projects', projects: 'Selected projects',
    social: 'Social and contact links', email: 'Email', cv: 'Download CV', cvSoon: 'CV coming soon',
    listening: 'Currently listening', album: 'Toto IV album cover',
    me: 'me :)', portrait: 'Portrait of Eik Rose', cat: 'Arya — Professional interruption specialist',
    catCaption: 'Professional interruption specialist', view: 'View', preview: 'preview',
    language: 'Choose language', languageSkills: 'Language proficiency', title: 'Eik Rose',
    description: 'Student interested in technology, design, business, space, and the future — building projects and exploring ideas along the way.',
    imageAlt: 'Eik Rose. wordmark, portrait, and a small pirate ship on a dark background. eikrose.de',
    notFoundHeading: 'Lost at sea.',
    notFoundText: 'This page seems to have sailed somewhere else.',
    sailHome: 'Sail home',
  },
  de: {
    contactLabel: 'Schreib mir', contactTitle: 'Hast du eine Idee?', contactText: 'Ein Projekt, eine Frage oder ein Gedanke, über den du sprechen möchtest. Ich freue mich darauf.', contactSignature: 'Eik, gelegentlich unterbrochen von Arya.',
    productDesign: 'Produktdesign', creativeDevelopment: 'Kreative Entwicklung', writing: 'Texte', openSource: 'Open Source',
    skipStory: 'Zur Projektbeschreibung', caseIdea: 'Die Idee', caseDesign: 'Die Oberfläche', caseBuild: 'Die Umsetzung', caseDetails: 'Aufgabendetails', sometimeDescription: 'Sometime: eine Aufgaben-App für Today, Soon und Sometime. Design und Entwicklung von Eik Rose.',
    blogTitle: 'Blog', blogIntro: 'Notizen zu meinen Projekten, Ideen, die mich beschäftigen, und dem, was ich dabei lerne.',
    blogLabel: 'Notizen & Ideen', blogCardTitle: 'Platz für längere Gedanken.', blogCardText: 'Über Code, Design und das, was dazwischen liegt.',
    blogEmptyTitle: 'Die erste Seite ist noch leer.', blogEmptyText: 'Hier gibt es noch keine Beiträge. Bis dahin kannst du dir meine Projekte ansehen.', backToWork: 'Zu meinen Projekten',
    cursorView: 'Ansehen',
    intro: 'Ich bin Student und interessiere mich für Programmieren, Design, Wirtschaft, Politik, Raumfahrt und die Frage, was als Nächstes kommt. Meistens lerne ich dabei etwas Neues, arbeite an einem Projekt oder versuche, eine Idee umzusetzen.',
    germany: 'Deutschland', back: 'Zurück zur Einleitung', time: 'Aktuelle Uhrzeit in Deutschland',
    skip: 'Zu den ausgewählten Projekten', projects: 'Ausgewählte Projekte',
    social: 'Social Media und Kontakt', email: 'E-Mail an', cv: 'CV herunterladen', cvSoon: 'CV bald verfügbar',
    listening: 'Höre gerade', album: 'Albumcover von Toto IV',
    me: 'ich :)', portrait: 'Porträt von Eik Rose', cat: 'Arya — Professionelle Unterbrechungsspezialistin',
    catCaption: 'Professionelle Unterbrechungsspezialistin', view: 'Ansehen:', preview: 'Vorschau',
    language: 'Sprache wählen', languageSkills: 'Sprachkenntnisse', title: 'Eik Rose',
    description: 'Student mit Interesse an Technologie, Design, Wirtschaft, Raumfahrt und der Zukunft — ich entwickle Projekte und gehe neuen Ideen nach.',
    imageAlt: 'Eik Rose. Schriftzug, Porträt und ein kleines Piratenschiff auf dunklem Hintergrund. eikrose.de',
    notFoundHeading: 'Auf See verloren.',
    notFoundText: 'Diese Seite ist wohl irgendwo anders hingesegelt.',
    sailHome: 'Zurück zur Startseite',
  },
  fr: {
    contactLabel: 'Un petit bonjour', contactTitle: 'Une idée en tête ?', contactText: 'Un projet, une question ou une idée dont tu aimerais parler. Je serais ravi d’en discuter.', contactSignature: 'Eik, parfois interrompu par Arya.',
    productDesign: 'Design produit', creativeDevelopment: 'Développement créatif', writing: 'Écriture', openSource: 'Open source',
    skipStory: 'Aller à la présentation du projet', caseIdea: 'L’idée', caseDesign: 'L’interface', caseBuild: 'La réalisation', caseDetails: 'Détails de la tâche', sometimeDescription: 'Sometime : une appli de tâches pour Today, Soon et Sometime. Design et développement par Eik Rose.',
    blogTitle: 'Blog', blogIntro: 'Des notes sur mes projets, les idées qui me restent en tête et ce que j’apprends en chemin.',
    blogLabel: 'Notes & idées', blogCardTitle: 'Un espace pour mes réflexions.', blogCardText: 'Sur le code, le design et ce qui les relie.',
    blogEmptyTitle: 'La première page est encore blanche.', blogEmptyText: 'Il n’y a pas encore d’articles ici. En attendant, tu peux découvrir mes projets.', backToWork: 'Découvrir mes projets',
    cursorView: 'Voir',
    intro: 'Je suis étudiant et je m’intéresse au code, au design, à l’économie, à la politique, à l’espace et à ce que nous réserve l’avenir. Le plus souvent, j’apprends quelque chose, je développe un projet ou j’essaie de concrétiser une idée.',
    germany: 'Allemagne', back: 'Retour à la présentation', time: 'Heure actuelle en Allemagne',
    skip: 'Aller aux projets sélectionnés', projects: 'Projets sélectionnés',
    social: 'Réseaux sociaux et contact', email: 'Écrire à', cv: 'Télécharger le CV', cvSoon: 'CV bientôt disponible',
    listening: 'En ce moment', album: 'Pochette de l’album Toto IV',
    me: 'moi :)', portrait: 'Portrait d’Eik Rose', cat: 'Arya — Spécialiste des interruptions',
    catCaption: 'Spécialiste des interruptions', view: 'Voir', preview: 'aperçu',
    language: 'Choisir la langue', languageSkills: 'Compétences linguistiques', title: 'Eik Rose',
    description: 'Étudiant curieux de technologie, de design, d’économie, d’espace et d’avenir — je développe des projets et explore de nouvelles idées.',
    imageAlt: 'Le nom Eik Rose., un portrait et un petit bateau pirate sur fond sombre. eikrose.de',
    notFoundHeading: 'Perdu en mer.',
    notFoundText: 'Cette page semble avoir pris le large.',
    sailHome: "Retour à l'accueil",
  },
};

function initialLanguage(): Language {
  if (typeof document !== 'undefined' && document.getElementById('root')?.dataset.prerendered) {
    const language = document.documentElement.lang;
    if (language === 'en' || language === 'de' || language === 'fr') return language;
  }
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

export function LanguageProvider({ children, initialLanguage: initial }: { children: ReactNode; initialLanguage?: Language }) {
  const [language, updateLanguage] = useState<Language>(() => initial ?? initialLanguage());
  const copy = translations[language];
  const setLanguage = (next: Language) => {
    updateLanguage(next);
    try { localStorage.setItem(storageKey, next); } catch { /* Keep switching usable without storage. */ }
  };
  useEffect(() => {
    document.documentElement.lang = language;
    const metadata = pageMetadata(resolvePage(window.location.pathname), copy);
    document.title = metadata.title;
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
      document.querySelector(selector)?.setAttribute('content', metadata.title);
    }
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) {
      document.querySelector(selector)?.setAttribute('content', metadata.description);
    }
    for (const selector of ['meta[property="og:image:alt"]', 'meta[name="twitter:image:alt"]']) {
      document.querySelector(selector)?.setAttribute('content', copy.imageAlt);
    }
  }, [language, copy]);
  return <LanguageContext.Provider value={{ language, setLanguage, copy }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage requires LanguageProvider');
  return context;
}
