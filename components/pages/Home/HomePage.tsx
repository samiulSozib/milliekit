'use client';

import { useEffect, useState } from 'react';

import PageWrapper from '@/components/core/PageWrapper';
import HomeHeader from './HomeHeader';
import StackedBanners from './StackedBanners';
import SimCardIcon from '@/components/core/Icon/SimCardIcon';
import CallIcon from '@/components/core/Icon/CallIcon';
import SMSIcon from '@/components/core/Icon/SMSIcon';
import GlobalIcon from '@/components/core/Icon/GlobalIcon';
import SimTopupIcon from '@/components/core/Icon/SimTopupIcon';
import BusIcon from '@/components/core/Icon/BusIcon';
import FlightIcon from '@/components/core/Icon/FlightIcon';
import CityTaxiIcon from '@/components/core/Icon/CityTaxiIcon';
import TaxiPinIcon from '@/components/core/Icon/TaxiPinIcon';
import CommunicationIcon from '@/components/core/Icon/CommunicationIcon';
import MoreIcon from '@/components/core/Icon/MoreIcon';
import HomeTools from './HomeTools';
import useScreenSize from '@/components/core/hooks/useScreenSize';
import CarouselBanners from './CarouselBanners';

import { routeList } from '@/config';
import { useSettings } from '@/components/core/hooks/useSettings';
import { useActiveRouteStore } from '@/store/useActiveRouteStore';

import type { getDictionary } from '@/utils/get-dictionary';

const banners = [
  '/assets/images/tmp/banners/banner-1x.jpg',
  '/assets/images/tmp/banners/banner-3.jpg',
  '/assets/images/tmp/banners/banner-2.jpg',
];

const tools = (dictionary: Awaited<ReturnType<typeof getDictionary>>) => [
  {
    icon: BusIcon,
    title: dictionary.general.busReservation,
    color: '#A2845E',
    iconWidth: 35,
    link: '/bus-booking',
  },
  {
    icon: FlightIcon,
    title: dictionary.general.flightTicket,
    color: '#A2845E',
    iconWidth: 35,
    link: '/flight-booking',
    isDisabled:true
  },
  {
    icon: TaxiPinIcon,
    title: dictionary.general.taxiTicket,
    color: '#A2845E',
    iconWidth: 35,
    link: '/taxi-booking',
    isDisabled:true

  },
  {
    icon: CityTaxiIcon,
    title: dictionary.general.cityTaxiTicket,
    color: '#A2845E',
    iconWidth: 35,
    link: '/city-taxi-booking',
    isDisabled:true

  },
  {
    icon: SimTopupIcon,
    title: dictionary.general.creditTransfer,
    color: '#AF52DE',
    isDisabled: false,
    link: '/credit-transfer',
  },
  {
    icon: GlobalIcon,
    title: dictionary.general.internetPackage,
    color: '#1C1678',
    isDisabled: false,
    link: '/top-up',
  },
  {
    icon: CallIcon,
    title: dictionary.general.conversationPackage,
    color: '#FF9500',
    isDisabled: true,
  },
  {
    icon: MoreIcon,
    title: dictionary.general.otherServices,
    color: '#292D32',
    isDisabled: true,
  },
];

export default function HomePage() {
  const {
    settings: { dictionary },
  } = useSettings();

  const setActiveRoute = useActiveRouteStore((state) => state.setActiveRoute);
  const [isComponentMounted, setIsComponentMounted] = useState(false);

  const { isDesktop } = useScreenSize();

  useEffect(() => {
    setIsComponentMounted(true);

    setActiveRoute(routeList.home);

    return () => {
      setActiveRoute(null);
    };
  }, []);

  return (
    <>
      <PageWrapper name="home" isContainer={false}>
        <HomeHeader />

        <div className="-mt-8 bg-white rounded-3xl overflow-hidden relative">
          {isComponentMounted && (
            <div className="container-fluid">
              {isDesktop ? (
                <div className="pt-[5rem]">
                  <CarouselBanners banners={banners} />
                </div>
              ) : (
                <div className="pt-[6rem]">
                  <StackedBanners banners={banners} cardOffset={10} scaleFactor={0.08} />
                </div>
              )}
            </div>
          )}

          <div className="mt-8">
            <div className="container-fluid">
              <HomeTools tools={tools(dictionary)} />
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
