'use client';

// Next Imports
import { redirect, usePathname } from 'next/navigation';

// Util Imports
import { getLocalizedUrl, parseJson } from '@/utils';
import { routeList } from '@/config';

// Type Imports
import type { Locale } from '@configs/i18n';

const AuthRedirect = ({ lang }: { lang: Locale; }) => {
  const pathname = usePathname();

  const visitedWelcomePage = parseJson<boolean | undefined>('visitedWelcomePage') ?? false;
  if (visitedWelcomePage === false) {
    return redirect(`/${lang}/welcome`);
  }

  // ℹ️ Bring me `lang`
  const redirectUrl = `/${lang}/login?redirectTo=${pathname}`;
  const login = `/${lang}/login`;
  const homePage = getLocalizedUrl(routeList.home.path, lang);

  return redirect(pathname === login ? login : pathname === homePage ? login : redirectUrl);
};

export default AuthRedirect;
