'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import PageWrapper from '@/components/core/PageWrapper';
import Header from '@/components/shared/Header';
import { Button } from '@/components/core/Button';
import TaxiTicket from '@/components/shared/TaxiTicket'; // You'll need to create this
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
// import TaxiTicketSkeleton from '@/components/shared/TaxiTicket/TaxiTicketSkeleton'; // Create this
import styles from '../TaxiBooking.module.scss';

import type { Locale } from '@/config/i18n';
import type { LoggedInDataType, SortType, TaxiTripItemDataType, VendorDataType } from '@/types';

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
    label: dictionary.general.fastest,
    value: 'fastest',
  },
];

export function TaxiBookingResults({ trips, vendors }: { trips: TaxiTripItemDataType[]; vendors: VendorDataType[] }) {
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
  const [activeTab, setActiveTab] = useState<'taxi-info' | 'refund-policy'>('taxi-info');


  const selectedTicketRef = useRef<TaxiTripItemDataType>({} as TaxiTripItemDataType);
  const prevNextDate = useRef<Date>(new Date());

  const onTicketClick = useCallback(
    (ticketData: TaxiTripItemDataType) => async () => {
      try {
        // For now, we'll use the mock data directly since we don't have a taxi trip details API
        selectedTicketRef.current = ticketData;
        //setSelectedTripData(ticketData);
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
        //routeList.taxiBooking.subPathList.seatSelection.path + `/${selectedTicketRef.current.id}`,
        routeList.taxiBooking.subPathList.supervisorInfo.path,
        locale as Locale
      )
    );
  }, [router, locale]);

  const setQueryParam = useCallback(
    (key: string, value: string) => {
      document.body.classList.add('--loading');
      const params = new URLSearchParams(queryParams.toString());
      params.set(key, value);
      router.push(`?${params.toString()}`);
    },
    [queryParams, router]
  );

  const onNextDateClick = useCallback(() => {
    const departureTimeQueryParam = queryParams.get('departure-time');
    if (isFalsyValue(departureTimeQueryParam) === false) {
      prevNextDate.current = new Date(departureTimeQueryParam!);
    } else if (trips[0]?.departure_time != null) {
      // For taxi trips, you might need to parse the time differently
      prevNextDate.current = new Date();
    }

    prevNextDate.current.setDate(prevNextDate.current.getDate() + 1);
    setQueryParam('departure-time', i18n.langDateFormatter['en'](_dateOptions).format(prevNextDate.current));
  }, [trips, queryParams, setQueryParam]);

  const onPrevDateClick = useCallback(() => {
    const departureTimeQueryParam = queryParams.get('departure-time');
    if (isFalsyValue(departureTimeQueryParam) === false) {
      prevNextDate.current = new Date(departureTimeQueryParam!);
    } else if (trips[0]?.departure_time != null) {
      prevNextDate.current = new Date();
    }

    prevNextDate.current.setDate(prevNextDate.current.getDate() - 1);
    setQueryParam('departure-time', i18n.langDateFormatter['en'](_dateOptions).format(prevNextDate.current));
  }, [trips, queryParams, setQueryParam]);

  useEffect(() => {
    setActiveRoute(routeList.taxiBooking.subPathList.results);

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
      selectedTicketRef.current = {} as TaxiTripItemDataType;
    };
  }, [setActiveRoute]);

  const searchResultHeader = useMemo(() => {
    if (trips[0] == null) return '';

    const { route } = trips[0];
    return `${route.origin} ${generalDictionary.to} ${route.destination}`;
  }, [trips, generalDictionary]);

  const {
    taxi_model,
    driver,
    boarding_location,
    drop_off_location,
    route,
    departure_time,
    arrival_time,
    duration,
    ticket_price,
    available_seats,
    total_seats,
    refund_policy,
    taxi_information,
    is_fastest
  } = selectedTicketRef.current;

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

  useEffect(() => {
    const params = new URLSearchParams(queryParams.toString());
    const classes = params.get('classes');
    const vendorsId = params.get('vendorsid');

    const count = [classes, vendorsId].filter(Boolean).length;
    setFiltersAppliedCount(count);
  }, [queryParams]);

  return (
    <>
      <PageWrapper name="module-taxi-booking" customBottomSpacing="10rem">
        <Header
          wallpaper="/assets/images/modules/bus-booking/wallpaper.jpg"
          customTitle={
            <div className="flex flex-col gap-0.5 items-center px-2">
              <div className="text-center font-semibold text-xmd leading-[1.5]">
                <div>
                  {generalDictionary.taxiTicket} {searchResultHeader}
                </div>
              </div>
              {trips[0]?.departure_time != null && (
                <div className="text-xsm">{trips[0].departure_time}</div>
              )}
            </div>
          }
        >
          <div className="mt-6">
            <div className="container-fluid">
              <div className="bg-white rounded-2xl py-3 px-4 mx-auto max-w-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  {/* Left side - Date and Passenger Info */}
                  <div className="flex items-center gap-6">
                    {/* Date */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Icon name="calender" size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {i18n.langDateFormatter[lang!]({
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }).format(
                            isFalsyValue(queryParams.get('departure-time')) === false
                              ? new Date(queryParams.get('departure-time')!)
                              : new Date()
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Vertical Separator */}
                    <div className="w-px h-8 bg-gray-200"></div>

                    {/* Passenger Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <Icon name="user" size={18} className="text-green-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">{generalDictionary.passengers}</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {generalDictionary.adult} {queryParams.get('adult-count') || 2}
                          {', '}{generalDictionary.child} {queryParams.get('child-count') || 1}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Sort Button */}
                  <div className="flex items-center">
                    <SortDropdown
                      buttonTitle={generalDictionary.sort}
                      options={sortOptions}
                      onSelect={onSortChange}
                    />
                  </div>
                </div>
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
                      <TaxiTicket key={trip.id} ticketData={trip} onClick={onTicketClick(trip)} />
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <NotFound />
          )}

          {/* Loading state - you can conditionally show this */}
          {/* <div className={classnames('TripResults__loading', styles.TripResults__loading)}>
            <div className="container-fluid">
              <div className="flex flex-col gap-4">
                <TaxiTicketSkeleton />
                <TaxiTicketSkeleton />
                <TaxiTicketSkeleton />
              </div>
            </div>
          </div> */}
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

      {/* Taxi Ticket Modal */}
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
                {generalDictionary.bookNow}
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
          {/* Toggle for Refund Policy and Taxi Information */}
          <div className="flex justify-between w-full rounded-lg overflow-hidden mb-4 border border-gray-200">
            <button
              type="button"
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${activeTab === "taxi-info"
                  ? "text-primary border-b-2 border-primary bg-white"
                  : "text-gray-600 border-b-2 border-transparent"
                }`}
              onClick={() => setActiveTab("taxi-info")}
            >
              {generalDictionary.taxiInformation}
            </button>
            <button
              type="button"
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${activeTab === "refund-policy"
                  ? "text-primary border-b-2 border-primary bg-white"
                  : "text-gray-600 border-b-2 border-transparent"
                }`}
              onClick={() => setActiveTab("refund-policy")}
            >
              {generalDictionary.refundPolicy}
            </button>
          </div>

          {/* Content based on active tab */}
          {activeTab === "taxi-info" ? (
            <>
              {/* Driver and Taxi Info */}
              <div className="flex flex-row items-center justify-between">
                <div className='flex flex-row items-center gap-2'>
                  <img
                    src={'/assets/images/modules/bus-booking/vendor-default.png'}
                    alt={taxi_model?.name}
                    className="h-4 w-4 object-fill"
                    style={{ width: '28px', height: '28px' }}
                  />
                  <span className="font-semibold text-gray-800">
                    {taxi_model?.name}
                  </span>
                </div>
                <span className="font-semibold text-gray-800">
                  Abas Kazemi
                </span>
              </div>

              {taxi_model?.image && (
                <div className='p-3'>
                  <img
                    src={'/assets/images/modules/bus-booking/bus-booking-vector.png'}
                    alt={taxi_model?.name}
                    className="h-4 w-4 object-cover"
                  />
                </div>
              )}

              {/* Route Information */}
              <div className="flex items-center justify-between mt-4 w-full">
                {/* Origin */}
                <div className="flex flex-col items-center gap-1">
                  <div className="text-xxs text-gray-500">Harat</div>
                  <div className="text-primary text-sm font-semibold">14:30</div>
                </div>

                {/* Center section with dashed line + curved arc + bus icon */}
                <div className="flex-1 mx-2 relative flex items-center justify-center">
                  {/* Straight dashed line */}
                  <div className="absolute w-full border-t-2 border-dashed border-indigo-300 top-1/2 -translate-y-1/2"></div>

                  {/* Curved dashed line (arc) */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <svg
                      width="90"
                      height="25"
                      viewBox="0 0 90 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 24C15 8 75 8 89 24"
                        stroke="#8b5cf6"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                    </svg>
                  </div>

                  {/* Bus icon (center) */}
                  <div className="bg-white px-2 z-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#8b5cf6"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 13.5l1.5-6A1.5 1.5 0 015.93 6h12.14a1.5 1.5 0 011.43 1.5l1.5 6M4.5 13.5h15M7.5 16.5h9m-9 0a1.5 1.5 0 01-1.5-1.5v-1.5m10.5 3a1.5 1.5 0 001.5-1.5v-1.5"
                      />
                    </svg>
                  </div>
                </div>

                {/* Destination */}
                <div className="flex flex-col items-center gap-1">
                  <div className="text-xxs text-gray-500">Kabol</div>
                  <div className="text-primary text-sm font-semibold">20:00</div>
                </div>
              </div>

              {/* Duration below */}
              <div className="text-center text-gray-500 text-xs mt-1">5h 30m</div>

              {/* Locations Details */}
              <div className="grid gap-3 text-xs mt-4">
                <div className="flex flex-wrap gap-x-1 gap-y-3">
                  <div className="text-gray-500">{generalDictionary.pickupLocation}:</div>
                  <div className="text-gray-700">{boarding_location?.name || generalDictionary.unknown}</div>
                </div>
                <div className="flex flex-wrap gap-x-1 gap-y-3">
                  <div className="text-gray-500">{generalDictionary.dropoffLocation}:</div>
                  <div className="text-gray-700">{drop_off_location?.name || generalDictionary.unknown}</div>
                </div>
              </div>

              {/* Price and Seats */}
              <div className="flex flex-wrap items-center justify-between gap-y-3 mt-5">
                <div className="flex items-center gap-1">
                  <div className="text-gray-500 text-md">{generalDictionary.totalPrice}:</div>
                  <div className="flex items-center gap-1">
                    <div className="font-semibold text-lg">{ticket_price}</div>
                    <div className="text-gray-700">
                      <Icon name="afghan-currency" size={20} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-xxs gap-2">
                  {available_seats === 0 ? (
                    <div className="text-error">{generalDictionary.fullCapacity}</div>
                  ) : (
                    <>
                      {available_seats > 0 && (
                        <div className="text-gray-500">
                          {available_seats}/{total_seats} {generalDictionary.seatsAvailable}
                        </div>
                      )}
                    </>
                  )}
                  <div className="text-error">
                    <Icon name="user" size={24} />
                  </div>
                </div>
              </div>

              {/* Wallet Balance */}
              <div className='flex items-center justify-between'>
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
                <div className='items-center text-center mt-4'>
                  <span className='text-green-600'><p className='font-bold'>+ Add Funds</p></span>
                </div>
              </div>
            </>
          ) : (
            /* Refund Policy Content */
            <div className="py-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {generalDictionary.refundPolicy}
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="text-primary mt-1">•</div>
                  <p>{generalDictionary.refundPolicyDescription1}</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-primary mt-1">•</div>
                  <p>{generalDictionary.refundPolicyDescription2}</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-primary mt-1">•</div>
                  <p>{generalDictionary.refundPolicyDescription3}</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-primary mt-1">•</div>
                  <p>{generalDictionary.refundPolicyDescription4}</p>
                </div>
              </div>

              {/* Refund Policy Summary */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {generalDictionary.refundPolicySummary}
                </h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>{generalDictionary.cancellationBefore24h}</p>
                  <p>{generalDictionary.cancellationWithin24h}</p>
                  <p>{generalDictionary.noShowPolicy}</p>
                </div>
              </div>
            </div>
          )}
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