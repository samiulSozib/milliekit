'use client';

import { useCallback } from 'react';

import { usePathname } from 'next/navigation';
import { useSettings } from '@/components/core/hooks/useSettings';

import type { MouseEvent, FC } from 'react';
import type { Locale } from '@/config/i18n';
import { classnames } from '@/utils';

type LanguageDataType = {
  langCode: Locale;
  langName: string;
};

const getLocalePath = (pathName: string, locale: string) => {
  if (!pathName) return '/';
  const segments = pathName.split('/');

  segments[1] = locale;

  return segments.join('/');
};

export const LanguageSelection: FC<{ languageList: LanguageDataType[]; selectedLang: Locale }> = (props) => {
  const { languageList, selectedLang } = props;

  const pathName = usePathname();
  const { updateSettings } = useSettings();

  const onLanguageSelect = useCallback(
    (event: MouseEvent) => {
      const targetLanguage = languageList.find((item) => item.langName === (event.target as HTMLElement).innerText);
      if (targetLanguage == null) return;

      // i18n.defaultLocale = targetLanguage.langCode;
      updateSettings({ lang: targetLanguage.langCode });
    },
    [languageList, updateSettings]
  );

  return (
    <ul onClick={onLanguageSelect} className="flex flex-col gap-y-3">
      {languageList.map((languageItem) => (
        <li
          key={languageItem.langCode}
          className={classnames(
            'border border-transparent shadow-violet bg-white rounded-lg transition hover:bg-[var(--color-quaternary)]',
            {
              '!border-primary !bg-[var(--color-quaternary)]': selectedLang === languageItem.langCode,
            }
          )}
        >
          <a
            href={getLocalePath(pathName, languageItem.langCode)}
            className="flex items-center gap-2 w-full p-3 text-[var(--color-gray-700)]"
          >
            <div className="w-6">
              <img src={`/assets/images/flags/langs/${languageItem.langCode}.png`} alt="" />
            </div>
            {languageItem.langName}
          </a>
        </li>
      ))}
    </ul>
  );
};
