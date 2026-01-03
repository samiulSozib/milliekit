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
import type { ReactNode } from 'react';
import type { Locale } from '@/config';

export const metadata: Metadata = {
  title: 'ملی کیت | زندگی هوشمند',
  description:
    'ملی کیت، اپلیکیشنی برای مدیریت مالی که امکان واریز، برداشت و انتقال پول را به‌صورت سریع و امن فراهم می‌کند.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

type Props = {
  children: ReactNode;
  params: {
    lang: string; // ✅ MUST be string
  };
};

const RootLayout = async ({ children, params }: Props) => {
  const headersList =await headers(); // ✅ sync in Next 15
  const systemLang = (await getSystemLang()) as Locale;

  // ✅ safe narrowing INSIDE function
  const lang = params.lang as Locale;

  const direction = i18n.langDirection[systemLang];

  return (
    <TranslationWrapper headersList={headersList} lang={lang} systemLang={systemLang}>
      <html id="__next" lang={systemLang} dir={direction} suppressHydrationWarning>
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
