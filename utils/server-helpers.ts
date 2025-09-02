'use server';

// Next Imports
import { cookies } from 'next/headers';

import { getDictionary } from './get-dictionary';
import { parseJson } from './parse-json';
import { i18n, type Locale } from '@configs/i18n';

// Type Imports
import type { Settings } from '@contexts/settingsContext';

export const getSettingsFromCookie = async (): Promise<Settings> => {
  const cookieStore = await cookies();

  return parseJson(cookieStore.get('milliekitCookie')?.value || '{}') ?? {} as Settings;
};

export const getSystemDictionary = async (locale: Locale) => {
  const settingsCookie = await getSettingsFromCookie();

  let dictionary = settingsCookie.dictionary;

  if (typeof dictionary === 'undefined') {
    dictionary = await getDictionary(locale);
  }

  return dictionary;
};

export const getSystemLang = async () => {
  const settingsCookie = await getSettingsFromCookie();

  return settingsCookie.lang ?? i18n.defaultLocale;
};
