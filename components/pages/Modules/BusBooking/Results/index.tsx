'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import PageWrapper from '@/components/core/PageWrapper';
import Header from '@/components/shared/Header';
import { Button } from '@/components/core/Button';
import Ticket from '@/components/shared/Ticket';
import Icon from '@/components/core/Icon';
import BottomBar from '@/components/shared/BottomBar';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/core/Modal';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSettings } from '@/components/core/hooks/useSettings';
import { classnames, getDictionary, getLocalizedUrl, getLocalStorageItem, isFalsyValue } from '@/utils';
import { _dateOptions, apiPathConfig, i18n, routeList } from '@/config';
import { useActiveRouteStore } from '@/store/useActiveRouteStore';
import useTripStore from '@/store/useTripStore';
import { tripRequest } from '../index';
import { CustomerRequest } from '@/server/customer';
import { TripsFilterPanel } from '@/components/shared/TripsFilterPanel';
import { NotFound } from './NotFound';
import { SortDropdown } from '@/components/shared/SortDropdown';
import TicketSkeleton from '@/components/shared/Ticket/TicketSkeleton';
import styles from '../BusBooking.module.scss';

import type { Locale } from '@/config/i18n';
import type { LoggedInDataType, SortType, TripItemDataType, VendorDataType } from '@/types';

const customerRequest = new CustomerRequest({
  url: apiPathConfig.bookings.base,
});

const getSortOptions = (dictionary: Awaited<ReturnType<typeof getDictionary>>) => [
  {
    label: dictionary.general.cheapest,
    value: 'cheapest',
  },
  {
    label: dictionary.general.mostExpensive,
    value: 'expensive',
  },
  {
    label: dictionary.general.earliest,
    value: 'earliest',
  },
  {
    label: dictionary.general.latest,
    value: 'latest',
  },
  {
    label: dictionary.general.minPartialPayment,
    value: 'min-partial-payment',
  },
  {
    label: dictionary.general.maxPartialPayment,
    value: 'max-partial-payment',
  },
];

export function BusBookingResults({ trips, vendors }: { trips: TripItemDataType[]; vendors: VendorDataType[] }) {
  const router = useRouter();
  const queryParams = useSearchParams();
  const { lang: locale } = useParams();
  const {
    settings: { dictionary, lang },
  } = useSettings();
  const generalDictionary = dictionary.general;

  const setActiveRoute = useActiveRouteStore((state) => state.setActiveRoute);
  const setSelectedTripData = useTripStore((state) => state.setSelectedTripData);

  const [customerBalance, setCustomerBalance] = useState<number>(0);
  const [isOpenTicketModal, setIsOpenTicketModal] = useState<boolean>(false);
  const [isOpenFilterPanel, setIsOpenFilterPanel] = useState<boolean>(false);
  const [filtersAppliedCount, setFiltersAppliedCount] = useState<number>(0);

  const selectedTicketRef = useRef<TripItemDataType>({} as TripItemDataType);
  const prevNextDate = useRef<Date>(new Date());

  const onTicketClick = useCallback(
    (ticketData: TripItemDataType) => async () => {
      try {
        const tripData = await tripRequest.getTripDetails(ticketData.id + '');

        selectedTicketRef.current = tripData.item;
        setSelectedTripData(tripData.item);

        setIsOpenTicketModal(true);
      } catch (error) {
        console.error('Error fetching trip details:', error);
      }
    },
    []
  );

  const handleNextStep = useCallback(() => {
    router.push(
      getLocalizedUrl(
        routeList.busBooking.subPathList.seatSelection.path + `/${selectedTicketRef.current.id}`,
        locale as Locale
      )
    );
  }, []);

  const setQueryParam = useCallback(
    (key: string, value: string) => {
      // Indicate loading state
      document.body.classList.add('--loading');

      const params = new URLSearchParams(queryParams.toString());
      params.set(key, value);

      router.push(`?${params.toString()}`);
    },
    [queryParams]
  );

  const onNextDateClick = useCallback(() => {
    const departureTimeQueryParam = queryParams.get('departure-time');
    if (isFalsyValue(departureTimeQueryParam) === false) {
      prevNextDate.current = new Date(departureTimeQueryParam!);
    } else if (trips[0]?.departure_time != null) {
      prevNextDate.current = new Date(trips[0].departure_time);
    }

    prevNextDate.current.setDate(prevNextDate.current.getDate() + 1);

    setQueryParam('departure-time', i18n.langDateFormatter['en'](_dateOptions).format(prevNextDate.current));
  }, [trips, queryParams, setQueryParam]);

  const onPrevDateClick = useCallback(() => {
    const departureTimeQueryParam = queryParams.get('departure-time');
    if (isFalsyValue(departureTimeQueryParam) === false) {
      prevNextDate.current = new Date(departureTimeQueryParam!);
    } else if (trips[0]?.departure_time != null) {
      prevNextDate.current = new Date(trips[0].departure_time);
    }

    prevNextDate.current.setDate(prevNextDate.current.getDate() - 1);

    setQueryParam('departure-time', i18n.langDateFormatter['en'](_dateOptions).format(prevNextDate.current));
  }, [trips, queryParams, setQueryParam]);

  useEffect(() => {
    setActiveRoute(routeList.busBooking.subPathList.results);

    const userData = getLocalStorageItem<LoggedInDataType | null>('userData', null);
    customerRequest.options.token = userData?.token;

    customerRequest
      .getWalletBalance<{ balance: number }>()
      .then((response) => {
        setCustomerBalance(response.balance);
      })
      .catch((error) => {
        console.error('Error fetching wallet balance:', error);
      });

    return () => {
      setActiveRoute(null);
      selectedTicketRef.current = {} as TripItemDataType;
    };
  }, []);

  const searchResultHeader = useMemo(() => {
    if (trips[0] == null) return '';

    const { route } = trips[0];
    const { origin_city, destination_city } = route;

    return origin_city.name + ` ${generalDictionary.to} ` + destination_city.name;
  }, [trips]);

  const { route, bus, departure_time, arrival_time, ticket_price, total_seats, available_seats, vendor } =
    selectedTicketRef.current;
  const { origin_city, origin_station, destination_city, destination_station } = route ?? {};
  const { facilities } = bus ?? {};
  const { logo: vendorLogo, long_name: vendorName } = vendor ?? {};

  let _facilities: string[] = [];
  if (typeof facilities === 'string') {
    _facilities = facilities.split(',');
  } else if (Array.isArray(facilities)) {
    _facilities = facilities;
  }

  let departureTime: string | undefined;
  // let arrivalTime: string | undefined;
  if (trips[0] != null) {
    departureTime = trips[0].departure_time;
    // arrivalTime = trips[0].arrival_time;
  }

  const onSortChange = useCallback(
    (value: SortType) => {
      setQueryParam('sort', value);
    },
    [setQueryParam]
  );

  const sortOptions = useMemo(() => getSortOptions(dictionary), [dictionary]);

  useEffect(() => {
    if (typeof window == 'undefined') return;

    if (isOpenFilterPanel) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isOpenFilterPanel]);

  // Calculate the number of filters applied
  useEffect(() => {
    const params = new URLSearchParams(queryParams.toString());
    const classes = params.get('classes');
    const vendorsId = params.get('vendorsid');

    const count = [classes, vendorsId].filter(Boolean).length;
    setFiltersAppliedCount(count);
  }, [queryParams]);

  return (
    <>
      <PageWrapper name="module-bus-booking" customBottomSpacing="10rem">
        <Header
          wallpaper="/assets/images/modules/bus-booking/wallpaper.jpg"
          customTitle={
            <div className="flex flex-col gap-0.5 items-center px-2">
              <div className="text-center font-semibold text-xmd leading-[1.5]">
                <div>
                  {generalDictionary.busTicket} {searchResultHeader}
                </div>
              </div>
              {departureTime != null && (
                <div className="text-xsm">{i18n.langDateFormatter[lang!]().format(new Date(departureTime))}</div>
              )}
            </div>
          }
        >
          <div className="mt-6">
            <div className="container-fluid">
              <div className="flex items-center gap-3">
                <Button
                  color="white"
                  size="xs"
                  className="hover:bg-slate-100 border border-[#919EAB]"
                  onClick={() => setIsOpenFilterPanel(true)}
                >
                  <div className="flex items-center gap-2">
                    <Icon name="sort" size={19} />
                    <div className="flex gap-x-1">
                      <span>{generalDictionary.filters}</span>
                      {filtersAppliedCount > 0 && <i className="not-italic text-error">({filtersAppliedCount})</i>}
                    </div>
                  </div>
                </Button>
                <SortDropdown buttonTitle={generalDictionary.sort} options={sortOptions} onSelect={onSortChange} />
              </div>
            </div>
          </div>
        </Header>

        <div className={classnames('TripResults', styles.TripResults)}>
          {trips.length > 0 ? (
            <div className="TripList -mt-3 relative z-10">
              <div className="container-fluid">
                <div className="flex flex-col gap-4">
                  {trips
                    .filter((item) => item.status === 'active')
                    .map((trip) => (
                      <Ticket key={trip.id} ticketData={trip} onClick={onTicketClick(trip)} />
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <NotFound />
          )}

          <div className={classnames('TripResults__loading', styles.TripResults__loading)}>
            <div className="container-fluid">
              <div className="flex flex-col gap-4">
                <TicketSkeleton />
                <TicketSkeleton />
                <TicketSkeleton />
                <TicketSkeleton />
              </div>
            </div>
          </div>
        </div>

        <BottomBar>
          <div className="flex justify-between items-center py-4 gap-3">
            <button className="flex items-center gap-1 w-1/2" onClick={onNextDateClick}>
              <Icon name="arrow-left" size={18} className="rtl:rotate-180" />
              <span className="text-xsm font-semibold">{dictionary.general.nextDay}</span>
            </button>
            <div className="text-lg font-semibold flex-shrink-0">
              {i18n.langDateFormatter[lang!](_dateOptions).format(
                isFalsyValue(queryParams.get('departure-time')) === false
                  ? new Date(queryParams.get('departure-time')!)
                  : new Date()
              )}
            </div>
            <button className="flex items-center gap-1 w-1/2 justify-end" onClick={onPrevDateClick}>
              <span className="text-xsm font-semibold">{dictionary.general.prevDay}</span>
              <Icon name="arrow-left" className="ltr:rotate-180" size={18} />
            </button>
          </div>
        </BottomBar>
      </PageWrapper>

      <Modal
        isOpen={isOpenTicketModal}
        onClose={() => setIsOpenTicketModal(false)}
        autoClose={false}
        footer={
          <div className="px-5 py-6 flex gap-3 border-t">
            <div className="w-2/3">
              <Button
                size="xs"
                color="success"
                className="w-full"
                onClick={handleNextStep}
                disabled={available_seats === 0}
              >
                {generalDictionary.seatReservation}
              </Button>
            </div>
            <div className="w-1/3">
              <Button
                size="xs"
                variant="outlined"
                color="white"
                className="w-full border border-gray-300"
                onClick={() => setIsOpenTicketModal(false)}
              >
                {generalDictionary.return}
              </Button>
            </div>
          </div>
        }
      >
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center justify-start relative z-10 mb-3 gap-3">
            {/* 1st column: image */}
            {vendor && (
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={vendorLogo || '/assets/images/modules/bus-booking/vendor-default.png'}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* 2nd column: info */}
            {bus && (
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">
                  {vendorName} - {bus.name}
                </span>
                <span className="text-sm text-gray-500">{bus.bus_number}</span>
              </div>
            )}
          </div>

          {_facilities.length > 0 && (
            <div>
              <ul className="flex flex-wrap items-center gap-1 [&__li]:py-0.5 [&__li]:px-2 [&__li]:text-xxs [&__li]:rounded  [&__li]:bg-[rgba(24,144,255,0.12)] [&__li]:text-[var(--color-link)]">
                {_facilities.map((item, index) => (
                  <li key={index} className="font-semibold">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-center mt-8">
            {bus && (
              <div className="max-h-[150px] w-[90%]">
                <img
                  src={bus.image || '/assets/images/modules/bus-booking/bus-booking-vector.png'}
                  alt="Bus"
                  className="rounded-xl border border-gray-200 shadow-md object-fit bg-white"
                />
              </div>
            )}
          </div>

          {/* {bus != null && (
            <div className="flex justify-center font-semibold mt-6 text-[var(--color-gray-800)]">
              {vendorName} - {bus.name} - {bus.bus_number}
            </div>
          )} */}
          {/* Route section */}
          <div className="flex flex-wrap justify-between gap-y-2 items-center mt-4">
            {/* <div className="text-xxs text-[var(--color-gray-800)]">بزرگسال ۲، کودک ۱</div> */}
            <div className="text-xxs text-[var(--color-gray-800)] flex items-center gap-1 flex-wrap">
              <span>{route?.origin_city?.province?.name}</span>
              <span className="text-gray-500">{generalDictionary.arrow}</span>

              <span>{route?.origin_city?.name}</span>
              <span className="text-gray-500">{generalDictionary.arrow}</span>

              <span>{route?.destination_city?.province?.name}</span>
              <span className="text-gray-500">{generalDictionary.arrow}</span>

              <span>{route?.destination_city?.name}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-y-2 items-center mt-4">
            {/* <div className="text-xxs text-[var(--color-gray-800)]">بزرگسال ۲، کودک ۱</div> */}
            <div className="text-xxs text-[var(--color-gray-500)]">
              {generalDictionary.passengerCapacity}: {total_seats} {generalDictionary.seatCountUnit}
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-col items-center gap-1">
              <div className="text-xxs text-[var(--color-gray-500)]">{generalDictionary.origin}</div>
              <div className="font-semibold text-xs">{origin_city?.name ?? generalDictionary.unknown}</div>
              <div className="text-primary text-xsm">{departure_time?.split(' ')[1].replace(/:00$/, '')}</div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="text-primary mt-3">
                <Icon name="bus-path" width={93} height={18} />
              </div>
              {/* <div className="mt-1 text-[var(--color-gray-500)] text-xxs">3 ساعت و 14 دقیقه</div> */}
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="text-xxs text-[var(--color-gray-500)]">{generalDictionary.destination}</div>
              <div className="font-semibold text-xs">{destination_city?.name ?? generalDictionary.unknown}</div>
              <div className="text-primary text-xs">{arrival_time?.split(' ')[1].replace(/:00$/, '')}</div>
            </div>
          </div>
          <div className="grid gap-3 text-xs mt-4">
            <div className="flex flex-wrap gap-x-1 gap-y-3">
              <div className="text-[var(--color-gray-500)]">{generalDictionary.boardingPlace}:</div>
              <div className="text-[var(--color-gray-700)]">{origin_station?.name || generalDictionary.unknown}</div>
            </div>
            <div className="flex flex-wrap gap-x-1 gap-y-3">
              <div className="text-[var(--color-gray-500)]">{generalDictionary.dropLocation}:</div>
              <div className="text-[var(--color-gray-700)]">
                {destination_station?.name || generalDictionary.unknown}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-y-3 mt-5">
            <div className="flex items-center gap-1">
              <div className="text-[var(--color-gray-500)] text-md">{generalDictionary.totalPrice}:</div>
              <div className="flex items-center gap-1">
                <div className="font-semibold text-lg">{ticket_price}</div>
                <div className="text-[var(--color-gray-700)]">
                  <Icon name="afghan-currency" size={20} />
                </div>
              </div>
            </div>
            <div className="flex items-center text-xxs gap-2">
              {available_seats === 0 ? (
                <div className="text-error">{generalDictionary.capacityCompletion}</div>
              ) : (
                <>
                  {available_seats > 3 ? (
                    <div className="text-[var(--color-gray-500)]">
                      {available_seats} {generalDictionary.emptySeat}
                    </div>
                  ) : (
                    <div className="text-error">
                      {available_seats} {generalDictionary.remainingSeats}
                    </div>
                  )}
                </>
              )}
              <div className="text-error">
                <Icon name="ticket" size={24} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-success mt-4">
            <div>
              <Icon name="wallet-tick" size={24} />
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold">
              <div>
                {generalDictionary.accountCredit}:{' '}
                <span>{i18n.langNumberFormatter[lang!].format(customerBalance)}</span>
              </div>
              <Icon name={i18n.langCurrencySvgIconName[lang!]} size={17} />
            </div>
          </div>
        </div>
      </Modal>

      <AnimatePresence mode="wait">
        {isOpenFilterPanel && (
          <motion.div
            key="filter-panel"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed w-full top-0 left-0 z-50"
          >
            <TripsFilterPanel
              onClose={() => setIsOpenFilterPanel(false)}
              vendorList={vendors.map((item) => ({
                label: item.long_name ?? 'Unknown vendor',
                value: String(item.id),
              }))}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
