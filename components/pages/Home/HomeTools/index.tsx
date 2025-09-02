'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { classnames, getLocalizedUrl } from '@/utils';

import type { Locale } from '@/config/i18n';

interface HomeToolsProps {
  tools: {
    icon: React.ElementType;
    title: string;
    color?: string;
    isDisabled?: boolean;
    iconWidth?: number;
    link?: string;
  }[];
}

export default function HomeTools({ tools }: HomeToolsProps) {
  const { lang: locale } = useParams();

  return (
    <ul className="flex flex-wrap justify-between items-center gap-y-6">
      {tools.map((tool, index) => (
        <li key={index} className="w-1/4 flex justify-center items-center select-none">
          <Link
            href={tool.link != null ? getLocalizedUrl(tool.link, locale as Locale) : '#'}
            className={classnames(
              'flex flex-col items-center',
              tool.isDisabled && 'opacity-50 [&__.icon]:!bg-transparent [&__.icon]:border'
            )}
          >
            <div
              className={classnames(
                'icon bg-gray-200 hover:bg-[var(--color-quaternary)] transition rounded-lg w-16 h-16 flex justify-center items-center'
              )}
              style={tool.color ? { color: tool.color } : {}}
            >
              <tool.icon width={tool.iconWidth ? tool.iconWidth : '29'} />
            </div>
            <div className="mt-2 text-[var(--color-gray-700)] text-xs">{tool.title}</div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
