export type Locale = (typeof i18n)['locales'][number];

export const _dayAndDateOptions: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
};

export const _dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };

export const i18n = {
  defaultLocale: 'fa',
  locales: ['fa', 'af', 'en'],
  langDirection: {
    fa: 'rtl',
    af: 'rtl',
    en: 'ltr',
  },
  langNumberFormatter: {
    fa: new Intl.NumberFormat('fa-IR'),
    af: new Intl.NumberFormat('af-AF'),
    en: new Intl.NumberFormat('en-US'),
  },
  langDateFormatter: {
    fa: (dateOptions: Intl.DateTimeFormatOptions = _dayAndDateOptions) => new Intl.DateTimeFormat('fa-IR', dateOptions),
    af: (dateOptions: Intl.DateTimeFormatOptions = _dayAndDateOptions) => new Intl.DateTimeFormat('af-AF', dateOptions),
    en: (dateOptions: Intl.DateTimeFormatOptions = _dayAndDateOptions) => new Intl.DateTimeFormat('en-CA', dateOptions), // e.g. 2025-10-25
  },
  langCurrencySvgIconName: {
    fa: 'iranian-currency',
    af: 'afghan-currency',
    en: 'american-currency',
  },
} as const;

export const languageList: { langCode: Locale; langName: string }[] = [
  {
    langCode: 'fa',
    langName: 'فارسی',
  },
  {
    langCode: 'af',
    langName: 'پشتو',
  },
  {
    langCode: 'en',
    langName: 'English',
  },
];