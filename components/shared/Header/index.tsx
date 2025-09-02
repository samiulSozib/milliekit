'use client';

import { useRouter } from 'next/navigation';
import { classnames } from '@/utils';
import styles from './Header.module.scss';
import MenuIcon from '../../core/Icon/MenuIcon';
import ArrowLeftIcon from '../../core/Icon/ArrowLeftIcon';
import useSidebarStore from '@/store/useSidebarStore';

interface IHeaderProps {
  title?: string;
  customTitle?: React.ReactNode;
  wallpaper?: string;
  wallpaperPosition?: string;
  children?: React.ReactNode;
  minHeight?: string;
  overlayOpacity?: number;
  isHiddenMenuIcon?: boolean;
  customBackFunc?(): void;
}

export default function Header({
  title,
  wallpaper,
  wallpaperPosition = 'center center',
  customTitle,
  children,
  minHeight = '14rem',
  overlayOpacity,
  isHiddenMenuIcon = false,
  customBackFunc,
}: IHeaderProps) {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const router = useRouter();

  const handleNavigateBack = () => {
    router.back();
  };

  return (
    <div
      className={classnames('Header relative', styles.Header)}
      style={{
        ['--wallpaper-image' as string]: `url('${wallpaper ?? '/assets/images/misc/wallpaper-default.png'}')`,
        ['--wallpaper-position' as string]: wallpaperPosition,
        ['--header-min-height' as string]: minHeight,
        ['--overlay-opacity' as string]: overlayOpacity ? overlayOpacity : 0.47,
      }}
    >
      <div className={styles.Header__backdrop}></div>
      <div className={classnames('Header__inner text-white relative h-full pt-12', styles.Header__inner)}>
        <div className="container-fluid">
          <div className="flex justify-between items-center">
            <div>
              <button
                onClick={toggleSidebar}
                className={classnames('border rounded-full w-10 h-10 flex items-center justify-center ltr-rotate', {
                  'opacity-0': isHiddenMenuIcon,
                })}
              >
                <MenuIcon width="25" />
              </button>
            </div>
            {customTitle ? (
              customTitle
            ) : (
              <div className="text-center font-semibold text-xbase leading-[1.5] px-2">
                <div dangerouslySetInnerHTML={{ __html: title ?? '' }}></div>
              </div>
            )}
            <div>
              <button
                onClick={customBackFunc ? customBackFunc : handleNavigateBack}
                className="border rounded-full w-10 h-10 flex items-center justify-center ltr-rotate"
              >
                <i>
                  <ArrowLeftIcon width="24" />
                </i>
              </button>
            </div>
          </div>
        </div>
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}
