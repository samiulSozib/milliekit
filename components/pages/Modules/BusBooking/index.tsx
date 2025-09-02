'use client';

import { useCallback, useEffect, useState } from 'react';

import PageWrapper from '@/components/core/PageWrapper';
import Header from '@/components/shared/Header';
import ActionBox from '@/components/shared/ActionBox';
import { useParams, useRouter } from 'next/navigation';
import { useSettings } from '@/components/core/hooks/useSettings';
import { useActiveRouteStore } from '@/store/useActiveRouteStore';
import { createQueryParams, getLocalizedUrl, getLocalStorageItem, type getDictionary } from '@/utils';
import { _dateOptions, apiPathConfig, i18n, routeList, type Locale } from '@/config';
import { TripRequest } from '@/server/trip';
import { filterFormSchema } from '@/validation';
import OfferBannersCarousel from './OfferBannersCarousel';
import useScreenSize from '@/components/core/hooks/useScreenSize';
import RecentBookingsCarousel from './RecentBookingsCarousel';
import { FilterForm } from '@/components/shared/FilterForm';

import type { InferType } from 'yup';
import type { LoggedInDataType } from '@/types/profile';
import type { TicketRegistrationDataType, TripListQueryParamsType } from '@/types';

const features = (dictionary: Awaited<ReturnType<typeof getDictionary>>) => [
  {
    title: 'راحتی سفر',
    description: 'از انتخاب بلیط تا رسیدن به مقصد، تجربه‌ای بدون دغدغه و راحت را برای شما فراهم می‌کنیم.',
    icon: '/assets/images/modules/bus-booking/features/comfortable-travel.png',
    color: '#1890FF',
  },
  {
    title: 'پرداخت سریع و آسان',
    description:
      'پرداخت بلیط بدون نیاز به کارت بانکی! با استفاده از کیف پول دیجیتال، هزینه بلیط خود را به سادگی پرداخت کنید.',
    icon: '/assets/images/modules/bus-booking/features/easy-pay.png',
    color: '#00AB55',
  },
  {
    title: 'پشتیبانی ۲۴ ساعته',
    description: 'پرداخت سریع و مطمئن از طریق کیف پول دیجیتال، بدون نیاز به کارت بانکی.',
    icon: '/assets/images/modules/bus-booking/features/support-24.png',
    color: '#FF4842',
  },
  {
    title: 'بازگشت وجه',
    description: 'در صورت کنسلی، مبلغ بلیط طبق قوانین به حساب کیف پول شما بازگردانده می‌شود.',
    icon: '/assets/images/modules/bus-booking/features/refund.png',
    color: '#00CED1',
  },
];

const offerBanners = [
  '/assets/images/tmp/banners/banner-1x.jpg',
  '/assets/images/tmp/banners/banner-3.jpg',
  '/assets/images/tmp/banners/banner-2.jpg',
  '/assets/images/tmp/banners/banner-1x.jpg',
];

export const tripRequest = new TripRequest({
  url: apiPathConfig.trips.base,
});

export default function BusBookingIndex({ latestBookings }: { latestBookings: TicketRegistrationDataType[] }) {
  const router = useRouter();
  const { lang: locale } = useParams();

  const {
    settings: { dictionary },
  } = useSettings();

  const setActiveRoute = useActiveRouteStore((state) => state.setActiveRoute);

  const [isComponentMounted, setIsComponentMounted] = useState(false);

  const { isDesktop } = useScreenSize();

  const generalDictionary = dictionary.general;
  const _features = features(dictionary);

  const handleSearch = useCallback((data: InferType<typeof filterFormSchema>) => {
    const userData = getLocalStorageItem<LoggedInDataType | null>('userData', null);
    tripRequest.options.token = userData?.token;

    // from-date=2025-02-21&to-date=2025-02-21&status=paid
    const queryParams = createQueryParams<Partial<TripListQueryParamsType>>({ ...data, per_page: 10, page: 1 });
    try {
      router.push(getLocalizedUrl(routeList.busBooking.subPathList.results.path + '?' + queryParams, locale as Locale));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    setIsComponentMounted(true);

    setActiveRoute(routeList.busBooking.subPathList.results);

    return () => {
      setActiveRoute(null);
    };
  }, []);

  return (
    <>
      <PageWrapper name="module-bus-booking">
        <Header
          title={dictionary.general.busReservation}
          wallpaper="/assets/images/modules/bus-booking/wallpaper.jpg"
        />
        <ActionBox>
          <FilterForm onSubmit={handleSearch} />
        </ActionBox>

        <div className="mt-4">
          <div className="container-fluid">
            <div className="flex flex-col gap-1">
              {_features.map((item, index) => (
                <div className="flex gap-1.5 items-center" key={index}>
                  <div className="w-[5rem] shrink-0">
                    <img className="w-full !h-auto relative -right-15" src={item.icon} alt="" />
                  </div>
                  <div>
                    <div className="font-semibold text-md" style={{ color: item.color }}>
                      {item.title}
                    </div>
                    <div className="text-xxs text-[var(--color-gray-600)] mt-1">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <RecentBookingsCarousel recentBooks={latestBookings} />

        {isComponentMounted && (
          <div className="mt-8">
            <div className="container-fluid">
              <div className="flex items-center gap-2">
                <div className="heading-symbol"></div>
                <div className="font-semibold text-base">
                  <h2>{generalDictionary.specialOffer}</h2>
                </div>
              </div>

              <div className="mt-4 -mx-[var(--container-spacing)] sm:mx-0">
                <OfferBannersCarousel banners={offerBanners} isDesktop={isDesktop} />
              </div>
            </div>
          </div>
        )}
      </PageWrapper>
    </>
  );
}
