'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { classnames } from '@/utils';
import { LanguageSelection } from '@/components/shared/LanguageSelection';
import styles from './LanguagesPage.module.scss';
import { Button } from '@/components/core/Button';
import Icon from '@/components/core/Icon';

import { getLocalizedUrl } from '@/utils';
import { useSettings } from '@/components/core/hooks/useSettings';
import { languageList, routeList } from '@/config';

import type { Locale } from '@/config/i18n';

export default function LanguagesPage() {
  const { lang: locale } = useParams();

  const {
    settings: { dictionary },
  } = useSettings();

  return (
    <div className={classnames(styles.Languages, 'min-h-full')}>
      <div className="container-fluid pt-16">
        <div className="flex justify-center">
          <Link href={getLocalizedUrl(routeList.welcome.path, locale as Locale)}>
            <div className="max-w-[12rem]">
              <img src="/assets/images/branding/logo.svg" alt="" />
            </div>
          </Link>
        </div>

        <div className="mt-12">
          <LanguageSelection
            languageList={languageList}
            selectedLang={locale as Locale}
          />
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            href={getLocalizedUrl(routeList.welcome.path, locale as Locale)}
            className="[&__.button-text]:flex [&__.button-text]:gap-2 px-12"
          >
            <span>{dictionary.general.continue}</span>
            <Icon name="arrow-right-tailed" className="rtl:rotate-180" size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
