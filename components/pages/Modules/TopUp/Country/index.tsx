'use client';

import { useSettings } from '@/components/core/hooks/useSettings';
import PageWrapper from '@/components/core/PageWrapper';
import ActionBox from '@/components/shared/ActionBox';
import Header from '@/components/shared/Header';
import { getLocalizedUrl } from '@/utils';
import { useParams, useRouter } from 'next/navigation';
import { Locale } from '@/config';

export default function SelectCountry() {
  const router = useRouter();
  const { lang: locale } = useParams();

  const {
    settings: { dictionary },
  } = useSettings();
  const generalDictionary = dictionary.general;

  const handleSelectCounty = (country: string) => {
    router.push(getLocalizedUrl(`/top-up/packages/${country}`, locale as Locale));
  };

  return (
    <PageWrapper name="module-top-up__select-country">
      <Header title={generalDictionary.selectCountry} overlayOpacity={0.01} />
      <ActionBox>
        <div>
          <div className="flex items-center gap-2">
            <div className="heading-symbol"></div>
            {generalDictionary.reserveFor}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => handleSelectCounty('afghanistan')}
              className="w-1/2 bg-[var(--color-quaternary)] flex flex-col items-center justify-center rounded-lg p-2 gap-4 shadow-violet"
            >
              <div className="w-[3.2rem]">
                <img src="/assets/images/flags/af.png" alt="" />
              </div>
              <div className="text-[var(--color-gray-800)] text-xs">{generalDictionary.afghanistan}</div>
            </button>
            <button
              onClick={() => handleSelectCounty('iran')}
              className="w-1/2 bg-[var(--color-quaternary)] flex flex-col items-center justify-center rounded-lg p-2 gap-4 shadow-violet"
            >
              <div className="w-[3.2rem]">
                <img src="/assets/images/flags/ir.png" alt="" />
              </div>
              <div className="text-[var(--color-gray-800)] text-xs">{generalDictionary.iran}</div>
            </button>
          </div>
        </div>
      </ActionBox>
    </PageWrapper>
  );
}
