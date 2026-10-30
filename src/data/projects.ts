import type { Language } from '../i18n';

export interface Project {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  category: string;
  image: string;
  media?: 'sometime' | 'blog';
  href: string | null;
}

export const projects: Project[] = [
  { id: '01', title: { en: 'Sometime', de: 'Sometime', fr: 'Sometime' }, description: { en: 'Most task apps mix what matters today with ideas that can wait. Sometime separates tasks by when they matter — Today, Soon, or Sometime — without projects, tags, or complex planning.', de: 'Die meisten Aufgaben-Apps vermischen das, was heute zählt, mit Ideen, die warten können. Sometime ordnet Aufgaben danach, wann sie wichtig sind — Today, Soon oder Sometime — ohne Projekte, Tags oder komplizierte Planung.', fr: 'La plupart des applis de tâches mélangent les priorités du jour et les idées qui peuvent attendre. Sometime les classe selon le bon moment — Today, Soon ou Sometime — sans projets, tags ni planification compliquée.' }, category: 'Product design', image: '/projects/sometime/Sometime_BG.webp', media: 'sometime', href: '/work/sometime' },
  { id: '02', title: { en: 'Project 02', de: 'Projekt 02', fr: 'Projet 02' }, description: { en: 'A considered system, built around the everyday.', de: 'Ein durchdachtes System, gestaltet für den Alltag.', fr: 'Un système bien pensé, conçu pour le quotidien.' }, category: 'Product design', image: '/projects/space.svg', href: null },
  { id: '03', title: { en: 'Project 03', de: 'Projekt 03', fr: 'Projet 03' }, description: { en: 'Small experiments at the intersection of code and craft.', de: 'Kleine Experimente zwischen Code und Handwerk.', fr: 'De petites expériences entre code et savoir-faire.' }, category: 'Creative development', image: '/projects/orbit.svg', href: null },
  { id: '04', title: { en: 'Blog', de: 'Blog', fr: 'Blog' }, description: { en: 'Notes on code, design, and things I’m figuring out.', de: 'Notizen zu Code, Design und Dingen, die mich beschäftigen.', fr: 'Des notes sur le code, le design et ce que je découvre.' }, category: 'Writing', image: '/projects/fold.svg', media: 'blog', href: '/blog' },
];
