// Next Imports
import type { headers } from 'next/headers';

// Type Imports
import type { Locale } from '@configs/i18n';
import type { ChildrenType } from '@/types/general';

// Component Imports
import LangRedirect from '@components/LangRedirect';

// Config Imports
import { i18n } from '@configs/i18n';

// ℹ️ We've to create this array because next.js makes request with `_next` prefix for static/asset files
const invalidLangs = ['_next'];

const TranslationWrapper = (props: { headersList: Awaited<ReturnType<typeof headers>>; lang: Locale; systemLang: Locale } & ChildrenType) => {
  const doesLangExist = i18n.locales.includes(props.lang);

  // ℹ️ This doesn't mean MISSING, it means INVALID
  const isInvalidLang = invalidLangs.includes(props.lang);

  const langIsTheSameAsSystemLang = props.lang === props.systemLang;
  if (langIsTheSameAsSystemLang === false) {
    return <LangRedirect systemLang={props.systemLang} />;
  }

  return doesLangExist || isInvalidLang ? props.children : <LangRedirect systemLang={props.systemLang} />;
};

export default TranslationWrapper;
