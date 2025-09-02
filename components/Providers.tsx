import { ToastContainer } from 'react-toastify';

// Context Imports
import { SettingsProvider } from '@contexts/settingsContext';
// import ThemeProvider from '@components/theme';

// Util Imports
// import { NextAuthProvider } from '@contexts/nextAuthProvider';
import { getSettingsFromCookie } from '@/utils/server-helpers';

// Type Imports
import type { ChildrenType, Direction } from '@/types';
import type { getDictionary } from '@/utils/get-dictionary';

type Props = ChildrenType & {
  direction: Direction;
  dictionary?: Awaited<ReturnType<typeof getDictionary>>;
};

const Providers = async (props: Props) => {
  // Props
  const { children, direction, dictionary } = props;

  // Vars
  const settingsCookie = await getSettingsFromCookie();

  return (
    // <NextAuthProvider basePath={process.env.NEXTAUTH_BASEPATH}>
    <SettingsProvider settingsCookie={settingsCookie} dictionary={dictionary!}>
      {/* <ThemeProvider direction={direction} systemMode={systemMode}> */}
      {children}
      {/* </ThemeProvider> */}
    </SettingsProvider>
    // </NextAuthProvider>
  );
};

export default Providers;
