// // Component Imports
// import Providers from '@components/Providers';
// import { getSystemDictionary, getSystemLang } from '@/utils/server-helpers';
// import NextLoader from 'nextjs-rtl-loader';

// // Type Imports
// import type { Locale } from '@configs/i18n';
// import type { ChildrenType } from '@/types';

// const Layout = async (props: ChildrenType & { params: Promise<{ lang: Locale }> }) => {
//   const { children, params } = props;

//   // Vars
//   const lang = (await params).lang;
//   const systemLang = await getSystemLang();

//   const _lang = systemLang ?? lang;
//   const direction = _lang === 'en' ? 'ltr' : 'rtl';
//   const systemDictionary = await getSystemDictionary(_lang as Locale);

//   return (
//     <Providers direction={direction} dictionary={systemDictionary}>
//       <NextLoader color="#8576ff" height="3px" />
//       {children}
//     </Providers>
//   );
// };

// export default Layout;


// Component Imports
import Providers from '@components/Providers';
import { getSystemDictionary, getSystemLang } from '@/utils/server-helpers';
import NextLoader from 'nextjs-rtl-loader';

// Type Imports
import type { Locale } from '@configs/i18n';
import type { ChildrenType } from '@/types';

const Layout = async (props: ChildrenType & { params: Promise<{ lang: Locale }> }) => {
  const { children, params } = props;

  // Vars
  const { lang } = await params;
  const systemLang = await getSystemLang();

  const _lang = (systemLang ?? lang) as Locale;
  const direction = _lang === 'en' ? 'ltr' : 'rtl';
  const systemDictionary = await getSystemDictionary(_lang);

  return (
    <Providers direction={direction} dictionary={systemDictionary}>
      <NextLoader color="#8576ff" height="3px" />
      {children}
    </Providers>
  );
};

export default Layout;