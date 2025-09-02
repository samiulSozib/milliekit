'use client';

import { useEffect } from 'react';

import PageWrapper from '@/components/core/PageWrapper';
import WelcomeCarousel from './WelcomeCarousel';
import { Button } from '@/components/core/Button';
import { useParams } from 'next/navigation';
import Icon from '@/components/core/Icon';
import Link from 'next/link';

import { getLocalizedUrl } from '@/utils';
import { useSettings } from '@/components/core/hooks/useSettings';
import { routeList } from '@/config';
import { useActiveRouteStore } from '@/store/useActiveRouteStore';

import type { Locale } from '@/config/i18n';

const CarouselSampleData = [
  {
    title: 'مدیریت مالی (دبیت و کریدیت پول)',
    description:
      'این اپلیکیشن امکان واریز و برداشت پول را برای کاربران فراهم می‌کند. کاربران می‌توانند کیف پول دیجیتال خود را شارژ کنند، مبالغ موردنیاز را انتقال دهند و تراکنش‌های مالی خود را مشاهده و مدیریت کنند.',
  },
  {
    title: 'پرداخت آسان – مدیریت مالی بی‌دردسر',
    description:
      'با پرداخت آسان تراکنش‌های مالی خود را به ساده‌ترین شکل انجام دهید. امکان واریز، برداشت و انتقال پول را داشته باشید.',
  },
  {
    title: 'کیف پول سریع – پرداخت‌های مطمئن و فوری',
    description:
      'کیف پول سریع راهی هوشمند و ایمن برای مدیریت پول شما است. موجودی کیف پول خود را افزایش دهید، مبلغ موردنظر را انتقال دهید.',
  },
  {
    title: 'جریان نقدی – مرکز مالی شخصی شما',
    description:
      'با جریان نقدی، کنترل کامل امور مالی خود را در دست بگیرید. کیف پول دیجیتال خود را شارژ کنید، پرداخت‌های خود را به‌آسانی انجام دهید و تمامی معاملات مالی خود را در یک مکان مدیریت نمایید.',
  },
];

export default function WelcomePage() {
  const { lang: locale } = useParams();
  const {
    settings: { dictionary },
  } = useSettings();

  const setActiveRoute = useActiveRouteStore((state) => state.setActiveRoute);

  useEffect(() => {
    setActiveRoute(routeList.welcome);

    localStorage.setItem('visitedWelcomePage', 'true');

    return () => {
      setActiveRoute(null);
    };
  }, []);

  return (
    <PageWrapper name="welcome" isContainer={true}>
      <div className="min-h-[--full-height] flex flex-col justify-center items-center py-4">
        <div className="flex flex-col justify-center items-center md:border border-gray-200 md:p-8 rounded-lg relative">
          <Link
            href={getLocalizedUrl(routeList.languages.path, locale as Locale)}
            className="flex items-center bg-primary text-white px-2 py-1.5 rounded-md gap-x-0.5 absolute left-0 top-0 md:top-4 md:left-4 z-50"
          >
            <div className="w-6">
              <img src={`/assets/images/flags/langs/${locale}.png`} alt="" />
            </div>
            <Icon name="arrow-bottom" size={19} />
          </Link>

          <div className="md:max-w-[18rem] select-none pointer-events-none">
            <img src="/assets/images/welcome/greeting.png" alt="" />
          </div>

          <div className="mt-8 text-[1.3rem] font-semibold text-center">
            <h1>{dictionary.app.slogan}</h1>
          </div>

          <div className="mt-6 max-w-[16rem] sm:max-w-[18rem]">
            <WelcomeCarousel slides={CarouselSampleData} />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Button
              href={getLocalizedUrl(routeList.login.path, locale as Locale)}
              className="min-w-full xs:min-w-[9rem]"
            >
              {dictionary.general.login}
            </Button>
            <Button
              href={getLocalizedUrl(routeList.register.path, locale as Locale)}
              className="min-w-full xs:min-w-[9rem]"
              variant="outlined"
            >
              {dictionary.general.register}
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
