import { headers } from 'next/headers';
import SVGSymbols from '@/components/core/SVGSymbols';
import { i18n } from '@configs/i18n';

import '../../scss/globals.scss';

import type { Metadata } from 'next';
import type { ChildrenType } from '@/types';
import type { Locale } from '@/config';

export const metadata: Metadata = {
  title: '404',
};

const RootLayout = async (props: ChildrenType) => {
  const { children } = props;

  return (
    <html id="__next" suppressHydrationWarning>
      <body>
        <SVGSymbols />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
