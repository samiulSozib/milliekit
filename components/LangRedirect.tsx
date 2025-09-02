'use client';

// Next Imports
import { redirect, useParams, usePathname } from 'next/navigation';

// Config Imports
import { i18n, type Locale } from '@configs/i18n';

const LangRedirect = (props: { systemLang?: Locale }) => {
  const { lang } = useParams();
  let pathname = usePathname();
  
  pathname = pathname.replace('/' + lang as string, '');  

  const redirectUrl = `/${props.systemLang ?? lang}${pathname}`;

  redirect(redirectUrl);
};

export default LangRedirect;
