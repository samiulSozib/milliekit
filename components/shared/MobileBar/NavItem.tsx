import { ReactElement } from 'react';
import { classnames } from '@/utils';

interface NavItemProps {
  title: string;
  icon: ReactElement;
  iconFilled?: ReactElement;
  isActive?: boolean;
  onChangeRoute?: () => void;
}

export default function NavItem({ title, icon, iconFilled, isActive = false, onChangeRoute }: NavItemProps) {
  return (
    <div className={classnames('text-center text-[var(--color-gray-700)] mt-1.5', { 'text-primary': isActive })}>
      <button className="flex flex-col items-center select-none hover:text-primary transition" onClick={onChangeRoute}>
        <div className="c-icon">{isActive ? iconFilled : icon}</div>
        <div className="text-xs mt-1.5">{title}</div>
      </button>
    </div>
  );
}
