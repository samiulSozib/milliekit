import { i18n } from './config/i18n';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: '/',
        destination: `/${i18n.defaultLocale}/home`,
        permanent: true,
        locale: false
      },
      {
        source: '/:lang(fa|af|en)',
        destination: '/:lang/home',
        permanent: true,
        locale: false
      },
    ]
  }
};

export default nextConfig;
