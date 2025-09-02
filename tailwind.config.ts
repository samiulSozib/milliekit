import type { Config } from 'tailwindcss';

const breakpointXS = '280px';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontWeight: {}, // Remove font weights

    extend: {
      fontFamily: {
        primary: ['var(--font-primary)'],
        secondary: ['var(--font-secondary)'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: 'var(--color-primary)',
        'primary-darker': 'var(--color-primary-darker)',
        'primary-lighter': 'var(--color-primary-lighter)',
        secondary: 'var(--color-secondary)',
        'secondary-darker': 'var(--color-secondary-darker)',
        'secondary-transparent': 'var(--color-secondary-transparent)',
        link: 'var(--color-link)',
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        notice: 'var(--color-notice)',
        borderPrimary: 'var(--border-color-primary)',
        muted: 'var(--color-muted)',
        global: 'var(--color-global)',
        bgGray: 'var(--color-bgGray)',
        'gray-200': 'var(--color-gray-200)',
        'gray-300': 'var(--color-gray-300)',
        'gray-400': 'var(--color-gray-400)',
        'gray-500': 'var(--color-gray-500)',
        'gray-600': 'var(--color-gray-600)',
        'gray-700': 'var(--color-gray-700)',
        'gray-800': 'var(--color-gray-800)',
      },
      fontSize: {
        /* Default Sizes */
        xs: ['var(--font-size-xs)', 'var(--line-height-xs)'],
        sm: ['var(--font-size-sm)', 'var(--line-height-sm)'],
        base: ['var(--font-size-base)', 'var(--line-height-base)'],
        lg: ['var(--font-size-lg)', 'var(--line-height-lg)'],
        xl: ['var(--font-size-xl)', 'var(--line-height-xl)'],
        '2xl': ['var(--font-size-2xl)', 'var(--line-height-2xl)'],
        '3xl': ['var(--font-size-3xl)', 'var(--line-height-3xl)'],
        '4xl': ['var(--font-size-4xl)', 'var(--line-height-4xl)'],
        '5xl': ['var(--font-size-5xl)', 'var(--line-height-5xl)'],
        '6xl': ['var(--font-size-6xl)', 'var(--line-height-6xl)'],
        '7xl': ['var(--font-size-7xl)', 'var(--line-height-7xl)'],
        '8xl': ['var(--font-size-8xl)', 'var(--line-height-8xl)'],
        '9xl': ['var(--font-size-9xl)', 'var(--line-height-9xl)'],

        /* Custom Sizes */
        xxs: ['var(--font-size-xxs)', 'var(--line-height-xxs)'],
        xsm: ['var(--font-size-xsm)', 'var(--line-height-xsm)'],
        md: ['var(--font-size-md)', 'var(--line-height-md)'],
        xmd: ['var(--font-size-xmd)', 'var(--line-height-xmd)'],
        xbase: ['var(--font-size-xbase)', 'var(--line-height-xbase)'],
      },
      screens: {
        xs: breakpointXS,
      },
    },
  },
  plugins: [],
} satisfies Config;
