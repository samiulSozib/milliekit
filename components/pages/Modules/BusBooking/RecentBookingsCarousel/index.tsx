import { useSettings } from '@/components/core/hooks/useSettings';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import BusTicketCard from '@/components/shared/BusTicketCard';
import { _dateOptions, apiPathConfig, i18n } from '@/config';
import { Modal } from '@/components/core/Modal';
import { Button } from '@/components/core/Button/Button';
import { SearchForm } from '@/components/shared/FilterForm';
import { TransactionForm } from '@/components/shared/TransactionForm';
import { Checkbox } from '@/components/core/Form';
import Icon from '@/components/core/Icon';
import TicketReceipt from '@/components/shared/TicketReceipt';
import { tripRequest } from '../index';
import { Spinner } from '@/components/core/Spinner';
import { getLocalStorageItem } from '@/utils';
import { CustomerRequest } from '@/server/customer';
import { showRequestError } from '@/utils/handle-request-error';

import type {
  LoggedInDataType,
  TicketCancellationDataType,
  TicketRegistrationDataType,
  TripItemDataType,
} from '@/types';
import { downloadBusTicket, shareBusTicket } from '@/utils/ticketTemplate';
import { GeneralDictionary } from '@/types/generalDictionary';

type RecentCarouselPropsType = {
  recentBooks: TicketRegistrationDataType[];
};

const tabButtonStyle = 'w-1/2 p-3 rounded-sm text-gray-600 font-semibold';
const activeTabButtonStyle = `${tabButtonStyle} text-success bg-[rgba(0,171,85,0.09)]`;

const customerRequest = new CustomerRequest({
  url: apiPathConfig.bookings.base,
});

export default function RecentBookingsCarousel(props: RecentCarouselPropsType) {
  const { recentBooks } = props;

  const [isOpenFilterModal, setIsOpenFilterModal] = useState(false);
  const [isOpenTicketDetailsModal, setIsOpenTicketDetailsModal] = useState(false);
  const [currentActiveTab, setCurrentActiveTab] = useState<'trips' | 'transactions'>('trips');
  const [isOpenCancellationModal, setIsOpenCancellationModal] = useState(false);
  const [isAcceptedCancellationTerms, setIsAcceptedCancellationTerms] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectedBookingRef = useRef<TicketRegistrationDataType>({} as TicketRegistrationDataType);
  const tripDataInTicketRefRef = useRef<TripItemDataType>({} as TripItemDataType);
  const cancellationInfoRef = useRef<TicketCancellationDataType>({} as TicketCancellationDataType);

  const { lang: locale } = useParams();

  const {
    settings: { dictionary, lang },
  } = useSettings();

  const generalDictionary = dictionary.general;

  const handleChangeActiveTab = useCallback((tab: 'trips' | 'transactions') => {
    selectedBookingRef.current = {} as TicketRegistrationDataType;
    tripDataInTicketRefRef.current = {} as TripItemDataType;
    cancellationInfoRef.current = {} as TicketCancellationDataType;

    setCurrentActiveTab(tab);
  }, []);

  function handleSearch(data: {
    phone: string;
    'identification-number': string;
    'tracking-code': string;
    'origin-city-id': string;
    'destination-city-id': string;
    'departure-time': string;
  }): void {
    throw new Error('Function not implemented.');
  }

  const handleBusTicketCardClick = useCallback(async (ticketData: TicketRegistrationDataType) => {
    setIsLoading(true);

    try {
      selectedBookingRef.current = ticketData;

      const tripDetails = await tripRequest.getTripDetails(ticketData.trip.id + '');
      tripDataInTicketRefRef.current = tripDetails.item;

      setIsOpenTicketDetailsModal(true);
    } catch (error) {
      console.log('Error fetching ticket details:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCancelTicket = useCallback(async (bookingData: TicketRegistrationDataType) => {
    selectedBookingRef.current = bookingData;

    try {
      const cancellationInfo = await customerRequest.getCancellationInfo(selectedBookingRef.current.id + '');
      cancellationInfoRef.current = cancellationInfo.item;

      setIsOpenCancellationModal(true);
    } catch (error: unknown) {
      console.log('Error canceling ticket:', error);
      showRequestError(error);
    }
  }, []);

  const handleCancellationTermsChange = (checked: boolean) => {
    setIsAcceptedCancellationTerms(checked);
  };

  const handleCancelTicketRequest = useCallback(async () => {
    try {
      const cancellationInfo = await customerRequest.getCancellationInfo(selectedBookingRef.current.id + '');
      cancellationInfoRef.current = cancellationInfo.item;

      const targetIndex = recentBooks.findIndex((item) => item.id === selectedBookingRef.current.id);
      if (targetIndex > -1) {
        recentBooks[targetIndex].status = 'cancelled';
      }

      setIsOpenCancellationModal(false);
    } catch (error: unknown) {
      console.log('Error canceling ticket:', error);
      showRequestError(error);
    }
  }, [recentBooks]);

  useEffect(() => {
    const userData = getLocalStorageItem<LoggedInDataType | null>('userData', null);
    if (userData != null) {
      tripRequest.options.token = userData.token;
      customerRequest.options.token = userData.token;
    }

    return () => {
      selectedBookingRef.current = {} as TicketRegistrationDataType;
      tripDataInTicketRefRef.current = {} as TripItemDataType;
      cancellationInfoRef.current = {} as TicketCancellationDataType;
    };
  }, []);

  if (!recentBooks.length) return;

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center text-[2rem] text-primary">
          <Spinner turbo />
        </div>
      )}

      <div className="mt-8">
        <div className="container-fluid">
          <div className="flex flex-wrap gap-y-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="heading-symbol"></div>
              <div className="font-semibold text-base">
                <h2>{generalDictionary.recentBookings}</h2>
              </div>
            </div>
            <div>
              <button
                onClick={() => setIsOpenFilterModal(true)}
                className="border border-[var(--color-gray-300)] pt-2.5 pb-2 px-2 rounded-lg text-xs font-semibold"
              >
                {generalDictionary.showDetails}
              </button>
            </div>
          </div>

          <Swiper
            spaceBetween={15}
            slidesPerView={1.3}
            loop={false}
            dir={locale === 'en' ? 'ltr' : 'rtl'}
            className="-ml-[var(--container-spacing)] sm:ml-0"
          >
            {recentBooks.map((item) => (
              <SwiperSlide key={item.id} className="[&__.ticket-item]:p-[4px]">
                <BusTicketCard
                  onClick={() => handleBusTicketCardClick(item)}
                  ticketId={item.id + ''}
                  busName={item.trip.bus.name ?? ''}
                  busImage={item?.vendor?.logo||"/assets/images/tmp/sample-bus.png"}
                  // passengers={item}
                  departure={item.trip.route.origin_city.name}
                  destination={item.trip.route.destination_city.name}
                  departureTime={item.trip.departure_time.split(' ')[1].replace(/:00$/, '')}
                  arrivalTime={item.trip.arrival_time.split(' ')[1].replace(/:00$/, '')}
                  price={item.total_price + ''}
                  className="mt-4"
                  onCancelTicket={() => handleCancelTicket(item)}
                  travelDate={i18n.langDateFormatter[lang!](_dateOptions).format(
                    new Date(item.trip.departure_time.split(' ')[0])
                  )}
                  isCancellable={
                    item.status !== 'cancelled' && new Date(item.trip.departure_time).getTime() > Date.now()
                  }
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <Modal
        isOpen={isOpenFilterModal}
        onClose={() => setIsOpenFilterModal(false)}
        autoClose={false}
        footer={
          <div className="p-5 border-t">
            <Button
              onClick={() => setIsOpenFilterModal(false)}
              size="xs"
              variant="outlined"
              color="white"
              className="w-full border border-gray-300"
            >
              {generalDictionary.close}
            </Button>
          </div>
        }
      >
        <div className="p-5">
          <div className="border border-[var(--color-gray-300)] p-1 flex gap-1 rounded-lg">
            <button
              onClick={() => handleChangeActiveTab('trips')}
              className={currentActiveTab === 'trips' ? activeTabButtonStyle : tabButtonStyle}
            >
              {generalDictionary.recentBookings}
            </button>
            <button
              onClick={() => handleChangeActiveTab('transactions')}
              className={currentActiveTab === 'transactions' ? activeTabButtonStyle : tabButtonStyle}
            >
              {generalDictionary.transactions}
            </button>
          </div>
          <div className="mt-4">
            {currentActiveTab === 'trips' ? (
              <SearchForm onSubmit={handleSearch} recentBooks={recentBooks} />
            ) : (
              <TransactionForm />
            )}
          </div>
        </div>
      </Modal>

      {Object.keys(selectedBookingRef.current).length > 0 && (
        <Modal
          isOpen={isOpenCancellationModal}
          onClose={() => setIsOpenCancellationModal(false)}
          autoClose={false}
          footer={
            <div className="px-5 py-6 flex gap-3 border-t">
              <div className="w-2/3">
                <Button
                  size="xs"
                  color="danger"
                  className="w-full"
                  onClick={handleCancelTicketRequest}
                  disabled={!isAcceptedCancellationTerms}
                >
                  {generalDictionary.confirmAndCancelTicket}
                </Button>
              </div>
              <div className="w-1/3">
                <Button
                  size="xs"
                  variant="outlined"
                  color="white"
                  className="w-full border border-gray-300"
                  onClick={() => setIsOpenCancellationModal(false)}
                >
                  {generalDictionary.return}
                </Button>
              </div>
            </div>
          }
        >
          <div className="p-5">
            <div className="flex justify-center">
              <div className="w-[7.5rem]">
                <img src="/assets/images/misc/tickets-vector.png" alt="" />
              </div>
            </div>
            <div className="text-gray-700 text-sm leading-[1.9] mt-5">
              <p>
                {generalDictionary.accordingTo}{' '}
                <span className="text-[var(--color-link)]">{generalDictionary.cancellationRules}</span>,{' '}
                {generalDictionary.priceAmount + ' '}
                <span className="text-error font-semibold">{cancellationInfoRef.current.penalty_amount + ' '}</span>
                {generalDictionary.cancellationInfoPart1 + ' '}
                {generalDictionary.and + ' ' + generalDictionary.priceAmount + ' '}
                <span className="text-error font-semibold">{cancellationInfoRef.current.refund_amount + ' '}</span>
                {generalDictionary.cancellationInfoPart2}
              </p>
              <p>{generalDictionary.refundExtraText}</p>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <div className="heading-symbol"></div>
                <div className="font-semibold">
                  <h2>جزئیات بلیط</h2>
                </div>
              </div>
              <BusTicketCard
                ticketId={selectedBookingRef.current.id + ''}
                busName={selectedBookingRef.current.trip.bus.name ?? ''}
                busImage={selectedBookingRef.current.vendor?.logo||"/assets/images/tmp/sample-bus.png"}
                departure={selectedBookingRef.current.trip.route.origin_city.name}
                destination={selectedBookingRef.current.trip.route.destination_city.name}
                departureTime={selectedBookingRef.current.trip.departure_time.split(' ')[1].replace(/:00$/, '')}
                arrivalTime={selectedBookingRef.current.trip.arrival_time.split(' ')[1].replace(/:00$/, '')}
                price={selectedBookingRef.current.total_price + ''}
                travelDate={i18n.langDateFormatter[lang!](_dateOptions).format(
                  new Date(selectedBookingRef.current.trip.departure_time.split(' ')[0])
                )}
              />
            </div>
            <div className="mt-4 text-xxs text-gray-800">
              <p>{generalDictionary.acceptRulesHint}</p>
            </div>
            <div className="bg-gray-200 p-3 mt-3 rounded">
              <Checkbox
                name="confirm_terms"
                color="green"
                label={generalDictionary.acceptRules}
                onChange={handleCancellationTermsChange}
              />
            </div>
          </div>
        </Modal>
      )}

      {Object.keys(selectedBookingRef.current).length > 0 && (
        <Modal
          isOpen={isOpenTicketDetailsModal}
          onClose={() => setIsOpenTicketDetailsModal(false)}
          autoClose={false}
          footer={
            <div className="p-5 pt-0">
              <div className="flex flex-wrap -mx-1">
                <div className="px-1 pb-2 w-1/2">
                  <Button size="xs" className="w-full" onClick={()=>shareBusTicket(selectedBookingRef.current,generalDictionary as GeneralDictionary)}>
                    {generalDictionary.share}
                  </Button>
                </div>
                <div className="px-1 pb-2 w-1/2">
                  <Button
                    size="xs"
                    variant="outlined"
                    className="w-full"
                    //href={selectedBookingRef.current.download_tickets}
                    onClick={()=>downloadBusTicket(selectedBookingRef.current,generalDictionary as GeneralDictionary)}
                  >
                    {generalDictionary.saveToGallery}
                  </Button>
                </div>
                <div className="px-1 pb-2 w-full">
                  <Button
                    onClick={() => setIsOpenTicketDetailsModal(false)}
                    size="xs"
                    variant="outlined"
                    color="white"
                    className="w-full border border-gray-300"
                  >
                    {generalDictionary.close}
                  </Button>
                </div>
              </div>
            </div>
          }
        >
          <div className="p-5 overflow-x-hidden">
            <div className="flex items-center gap-1 text-success text-xs font-semibold px-2">
              <Icon name="check-circle" />
              <div>{generalDictionary.ticketIssued}</div>
            </div>
            <TicketReceipt
              className="mt-4"
              selectedSeats={selectedBookingRef.current.tickets.map((item) => item.seat_number)}
              tripData={tripDataInTicketRefRef.current}
              paymentData={{}}
              ownerData={selectedBookingRef.current.tickets?.[0].passenger}
              passengers={selectedBookingRef.current.tickets}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
