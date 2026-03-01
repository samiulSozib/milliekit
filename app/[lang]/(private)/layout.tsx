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
  params: { lang: string }; // string first, convert to Locale below
}

// Sync wrapper for type safety
export default function LayoutWrapper(props: LayoutProps) {
  return <AsyncLayout {...props} />;
}

// Async server component
async function AsyncLayout({ children, params }: LayoutProps) {
  // ⚡ Convert string to strict Locale
  const langCandidate = params.lang.toLowerCase();
  const validLocales: Locale[] = ['en', 'fa', 'af'];
  const lang: Locale = validLocales.includes(langCandidate as Locale)
    ? (langCandidate as Locale)
    : 'en';

  // Get system language & dictionary
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