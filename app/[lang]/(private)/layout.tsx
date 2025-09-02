// Component Imports
import Providers from '@components/Providers';
import MobileBar from '@/components/shared/MobileBar';

// Util Imports
import { getSystemDictionary, getSystemLang } from '@/utils/server-helpers';
import { AuthGuard } from '@/hoc/AuthGuard';
import NextLoader from 'nextjs-rtl-loader';

// Type Imports
import type { ChildrenType } from '@/types';
import type { Locale } from '@configs/i18n';
import Sidebar from '@/components/shared/Sidebar';

const Layout = async (props: ChildrenType & { params: Promise<{ lang: Locale }> }) => {
  const { children, params } = props;

  // Vars
  const lang = (await params).lang;
  const systemLang = await getSystemLang();

  const _lang = systemLang ?? lang;
  const direction = _lang === 'en' ? 'ltr' : 'rtl';
  const systemDictionary = await getSystemDictionary(_lang as Locale);

  return (
    <Providers direction={direction} dictionary={systemDictionary}>
      <NextLoader color="#8576ff" height="3px" />
      <AuthGuard locale={_lang as Locale}>
        {children}
        <MobileBar />
        <Sidebar />
      </AuthGuard>
    </Providers>
  );
};

export default Layout;
