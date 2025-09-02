import { classnames } from '@/utils';

interface IBottomBarProps {
  children: React.ReactNode;
  transparent?: boolean;
}

export default function BottomBar({ children, transparent = false }: IBottomBarProps) {
  return (
    <div
      className={classnames(
        'fixed bottom-0 left-0 right-0 z-20 text-white pb-[var(--mobile-bar-height)] rounded-t-3xl',
        [transparent ? 'bg-secondary-transparent' : 'bg-secondary']
      )}
    >
      <div className="container-fluid">{children}</div>
    </div>
  );
}
