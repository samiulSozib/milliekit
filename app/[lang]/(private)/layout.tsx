// app/[lang]/(private)/layout.tsx
import Providers from '@components/Providers';
import MobileBar from '@/components/shared/MobileBar';
import Sidebar from '@/components/shared/Sidebar';
import { getSystemDictionary, getSystemLang } from '@/utils/server-helpers';
import { AuthGuard } from '@/hoc/AuthGuard';
import NextLoader from 'nextjs-rtl-loader';
import type { ReactNode } from 'react';

export type Locale = 'en' | 'fa' | 'af';

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>; // params is now a Promise in Next.js 15
}

// Direct async export - await the params
export default async function Layout({ children, params }: LayoutProps) {
  // Await the params
  const { lang: langParam } = await params;
  
  // Validate Locale
  const langCandidate = langParam.toLowerCase();
  const validLocales: Locale[] = ['en', 'fa', 'af'];
  const lang: Locale = validLocales.includes(langCandidate as Locale)
    ? (langCandidate as Locale)
    : 'en';

  // Fetch system lang & dictionary
  const systemLang = await getSystemLang();
  const _lang: Locale = systemLang ?? lang;
  const direction = _lang === 'en' ? 'ltr' : 'rtl';
  const systemDictionary = await getSystemDictionary(_lang);

  return (
    <Providers direction={direction} dictionary={systemDictionary}>
      <NextLoader color="#8576ff" height="3px" />
      <AuthGuard locale={_lang}>
        {children}
        <MobileBar />
        <Sidebar />
      </AuthGuard>
    </Providers>
  );
}