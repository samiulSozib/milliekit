import type { Locale } from '@configs/i18n';

const dictionaries = {
  fa: () => import('../data/dictionaries/fa.json').then(module => module.default),
  af: () => import('../data/dictionaries/af.json').then(module => module.default),
  en: () => import('../data/dictionaries/en.json').then(module => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();