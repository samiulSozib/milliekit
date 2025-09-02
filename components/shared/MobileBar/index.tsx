'use client';

import { useEffect, useState } from 'react';
import styles from './MobileBar.module.scss';
import NavItem from './NavItem';
import HomeIcon from '@/components/core/Icon/HomeIcon';
import HomeFilledIcon from '@/components/core/Icon/HomeFilledIcon';
import OrdersIcon from '@/components/core/Icon/OrdersIcon';
import OrdersFilledIcon from '@/components/core/Icon/OrdersFilledIcon';
import NetworkIcon from '@/components/core/Icon/NetworkIcon';
import NetworkFilledIcon from '@/components/core/Icon/NetworkFilledIcon';
import TransactionIcon from '@/components/core/Icon/TransactionIcon';
import TransactionFilledIcon from '@/components/core/Icon/TransactionFilledIcon';
import SupportIcon from '@/components/core/Icon/SupportIcon';
import { usePathname, useRouter, useParams } from 'next/navigation';

import { useSettings } from '@/components/core/hooks/useSettings';
import { routeList, type Locale } from '@/config';
import { classnames, getLocalizedUrl } from '@/utils';
import { useActiveRouteStore } from '@/store/useActiveRouteStore';

export default function MobileBar() {
  const pathname = usePathname();
  const { lang: locale } = useParams();
  const router = useRouter();
  const {
    settings: { dictionary },
  } = useSettings();

  const activeRoute = useActiveRouteStore((state) => state.activeRoute) ?? routeList.home;

  const [isBottomBar, setIsBottomBar] = useState(false);

  const handleChangeRoute = (url: string): void => {
    router.push(url);
  };

  // Check if the current page is in the bottom bar pages
  useEffect(() => {
    setIsBottomBar(pathname.includes(routeList.busBooking.path));
  }, [pathname]);

  return (
    <div
      className={classnames('fixed bottom-0 left-0 right-0 z-30', styles.MobileBar, {
        [styles['MobileBar--isBottomBar']]: isBottomBar,
      })}
    >
      <div className={classnames('container-fluid flex justify-between items-center', styles.MobileBar__inner)}>
        <div className="flex items-center gap-7 sm:gap-14 flex-basis-1/2 flex-1">
          <NavItem
            icon={<HomeIcon width="24" />}
            iconFilled={<HomeFilledIcon width="24" />}
            title={dictionary.navigation.home}
            isActive={routeList.home.path.includes(activeRoute.path)}
            onChangeRoute={() => handleChangeRoute(getLocalizedUrl(routeList.home.path, locale as Locale))}
          />
          <NavItem
            icon={<TransactionIcon width="24" />}
            iconFilled={<TransactionFilledIcon width="24" />}
            title={dictionary.navigation.transactions}
            isActive={routeList.transactions.path.includes(activeRoute.path)}
            onChangeRoute={() => handleChangeRoute(getLocalizedUrl(routeList.transactions.path, locale as Locale))}
          />
        </div>
        <div className={classnames(styles.MobileBar__buttonSpot)}>
          <button className="rounded-full p-4 text-primary bg-[var(--mobile-bar-bg)] hover:shadow-lg transition absolute -top-2 right-1/2 translate-x-1/2">
            <div className="c-icon c-icon--lg">
              <SupportIcon width="45" />
            </div>
          </button>
        </div>
        <div className="flex items-center gap-7 sm:gap-14 flex-basis-1/2 flex-1 justify-end">
          <NavItem
            icon={<OrdersIcon width="24" />}
            iconFilled={<OrdersFilledIcon width="24" />}
            title={dictionary.navigation.orders}
            isActive={routeList.orders.path.includes(activeRoute.path)}
            onChangeRoute={() => handleChangeRoute(getLocalizedUrl(routeList.orders.path, locale as Locale))}
          />
          <NavItem
            icon={<NetworkIcon width="24" />}
            iconFilled={<NetworkFilledIcon width="24" />}
            title={dictionary.navigation.network}
            isActive={routeList.network.path.includes(activeRoute.path)}
          />
        </div>
      </div>
    </div>
  );
}
