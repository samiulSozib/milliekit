import { headers } from 'next/headers';
import SVGSymbols from '@/components/core/SVGSymbols';
import TranslationWrapper from '@/hoc/TranslationWrapper';
import { ToastContainer } from 'react-toastify';

import { i18n } from '@configs/i18n';
import { getSystemLang } from '@/utils/server-helpers';
import { MODAL_ROOT_ID } from '@/constants/layoutConstants';

import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';
import 'swiper/css/pagination';
import '../../scss/globals.scss';

import type { Metadata, Viewport } from 'next';
import type { ChildrenType } from '@/types';
import type { Locale } from '@/config';

export const metadata: Metadata = {
  title: 'ملی کیت | زندگی هوشمند',
  description:
    'ملی کیت، اپلیکیشنی برای مدیریت مالی که امکان واریز، برداشت و انتقال پول را به‌صورت سریع و امن فراهم می‌کند.',
  keywords: ['ملی کیت', 'مدیریت مالی', 'کیف پول دیجیتال', 'پرداخت آنلاین', 'انتقال پول', 'دبیت و کریدیت'],
  authors: [{ name: 'ملی کیت', url: 'https://milleikit.com' }],
  openGraph: {
    title: 'ملی کیت | زندگی هوشمند و مدیریت مالی آسان',
    description:
      'با ملی کیت کیف پول دیجیتال خود را مدیریت کنید، واریز و برداشت انجام دهید و تراکنش‌های خود را به‌صورت دقیق مشاهده نمایید.',
    url: 'https://milleikit.com',
    siteName: 'ملی کیت',
    type: 'website',
  },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 1, userScalable: false };

interface RootLayoutProps extends ChildrenType {
  params: Promise<{ lang: string }>; // Changed from Locale to string
}

const RootLayout = async ({ children, params }: RootLayoutProps) => {
  // Await the params
  const { lang: langParam } = await params;

  // Validate the locale (same as in private layout)
  const validLocales: Locale[] = ['en', 'fa', 'af'];
  const langCandidate = langParam.toLowerCase();
  const lang: Locale = validLocales.includes(langCandidate as Locale)
    ? (langCandidate as Locale)
    : 'en';

  const headersList = await headers();
  const systemLang = await getSystemLang();
  
  // Determine which language to use
  const activeLang = (systemLang as Locale) || lang;
  const direction = i18n.langDirection[activeLang];

  return (
    <TranslationWrapper headersList={headersList} lang={lang} systemLang={systemLang as Locale}>
      <html id="__next" lang={activeLang} dir={direction} suppressHydrationWarning>
        <body>
          <SVGSymbols />
          {children}
          <ToastContainer position="top-center" autoClose={2000} rtl={direction === 'rtl'} limit={3} />
          <div id={MODAL_ROOT_ID} className="relative z-50" />
        </body>
      </html>
    </TranslationWrapper>
  );
};

export default RootLayout;