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

const RootLayout = async (props: ChildrenType & { params: Promise<{ lang: Locale }> }) => {
  const params = await props.params;

  const { children } = props;

  const headersList = await headers();
  const systemLang = await getSystemLang();
  // const systemMode = await getSystemMode();
  const direction = i18n.langDirection[systemLang as Locale];

  return (
    <TranslationWrapper headersList={headersList} lang={params.lang} systemLang={systemLang as Locale}>
      <html id="__next" lang={systemLang as Locale} dir={direction} suppressHydrationWarning>
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


