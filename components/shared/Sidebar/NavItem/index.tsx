import Icon from '@/components/core/Icon';
import Link from 'next/link';

interface INavItem {
  icon: React.ReactNode;
  title: string;
  link?: string;
  onClick?: () => void;
}

export default function NavItem({ icon, title, link, onClick }: INavItem) {
  const containerClass = 'flex items-center gap-3 text-white select-none hover:text-primary-lighter transition';
  const textClass = 'text-xmd font-semibold';

  if (link) {
    return (
      <Link href={link} className={containerClass}>
        {icon}
        <span className={textClass}>{title}</span>
      </Link>
    );
  }

  return (
    <button {...(onClick ? { onClick } : {})} className={containerClass}>
      {icon}
      <span className={textClass}>{title}</span>
    </button>
  );
}
