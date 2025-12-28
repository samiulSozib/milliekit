import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

import { Checkbox, Input, InputTwo, LocationInput } from '@/components/core/Form';
import { Button } from '@/components/core/Button';
import { Modal } from '@/components/core/Modal';
import { CitySelection } from './CitySelection';
import CalenderIcon from '@/components/core/Icon/CalenderIcon';
import Icon from '@/components/core/Icon';
import { Spinner } from '@/components/core/Spinner';

import { useSettings } from '@/components/core/hooks/useSettings';
import { searchFormSchema } from '@/validation';
import { _dateOptions, apiPathConfig, i18n, type Locale } from '@/config';
import { locationRequest } from '@/server/location';
import BusTicketCard from '../BusTicketCard';
import TicketReceipt from '../TicketReceipt';
import { tripRequest } from '@/components/pages/Modules/BusBooking';
import { getLocalStorageItem } from '@/utils';
import { showRequestError } from '@/utils/handle-request-error';
import { CustomerRequest } from '@/server/customer';

import type { FC } from 'react';
import type { InferType } from 'yup';
import type {
  CityItemDataType,
  LoggedInDataType,
  TicketCancellationDataType,
  TripItemDataType,
} from '@/types';
import type { DatePicker } from '@mhf/date-picker/build/date-picker';
import type { SearchFormPropsType } from './type';
import { downloadBusTicket, shareBusTicket } from '@/utils/ticketTemplate';
import { GeneralDictionary } from '@/types/generalDictionary';
import { TaxiTicketRegistrationDataType } from '@/types/taxi-ticket';
import TaxiTicketCard from '../TaxiTicketCard';

const customerRequest = new CustomerRequest({
  url: apiPathConfig.bookings.base,
});

const SearchFormComponent: FC<SearchFormPropsType> = (props) => {
  const { onSubmit, recentBooks } = props;

  const [searchingBus, setSearchingBus] = useState<boolean>(false);
  const [isOpenOriginModal, setIsOpenOriginModal] = useState<boolean>(false);
  const [isOpenDatepickerModal, setIsOpenDatepickerModal] = useState<boolean>(false);
  const [isOpenDestinationModal, setIsOpenDestinationModal] = useState<boolean>(false);
  const [selectedOrigin, setSelectedOrigin] = useState<Partial<CityItemDataType>>({});
  const [selectedDestination, setSelectedDestination] = useState<Partial<CityItemDataType>>({});
  const [allCitiesList, setAllCitiesList] = useState<CityItemDataType[]>([]);
  const [isOpenTicketDetailsModal, setIsOpenTicketDetailsModal] = useState(false);
  const [isOpenCancellationModal, setIsOpenCancellationModal] = useState(false);
  const [isAcceptedCancellationTerms, setIsAcceptedCancellationTerms] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectedBookingRef = useRef<TaxiTicketRegistrationDataType>({} as TaxiTicketRegistrationDataType);
  const tripDataInTicketRefRef = useRef<TripItemDataType>({} as TripItemDataType);
  const cancellationInfoRef = useRef<TicketCancellationDataType>({} as TicketCancellationDataType);

  const selectedCitiesRef = useRef<
    Partial<{
      origin: { id: number; name: string };
      destination: { id: number; name: string };
    }>
  >({});

  const datePickerRef = useRef<DatePicker | null>(null);
  const departureDateGregorianModeValueRef = useRef<Date | null>(null);

  const searchFormProps = useForm({
    resolver: yupResolver(searchFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
  });

  const {
    settings: { dictionary, lang },
  } = useSettings();
  const generalDictionary = dictionary.general;

  const handleBackOriginModal = useCallback(() => {
    setIsOpenOriginModal(false);
  }, []);

  const handleBackDestinationModal = useCallback(() => {
    setIsOpenDestinationModal(false);
  }, []);

  const handleBackDatepickerModal = useCallback(() => {
    setIsOpenDatepickerModal(false);
  }, []);

  const handleSelectOrigin = useCallback((selected: CityItemDataType) => {
    setSelectedOrigin(selected);

    searchFormProps.setValue('origin-city-id', selected.id + '', {
      shouldValidate: true,
      shouldDirty: true,
    });

    setIsOpenOriginModal(false);
  }, []);

  const handleSelectDestination = useCallback((selected: CityItemDataType) => {
    setSelectedDestination(selected);

    searchFormProps.setValue('destination-city-id', selected.id + '', {
      shouldValidate: true,
      shouldDirty: true,
    });

    setIsOpenDestinationModal(false);
  }, []);

  const handleSearch = useCallback(
    (data: InferType<typeof searchFormSchema>) => {
      setSearchingBus(true);

      if (departureDateGregorianModeValueRef.current != null) {
        data['departure-time'] = i18n.langDateFormatter['en'](_dateOptions).format(
          departureDateGregorianModeValueRef.current
        );
      } else {
        data['departure-time'] = i18n.langDateFormatter['en'](_dateOptions).format(new Date());
      }

      onSubmit(data);
    },
    [onSubmit, lang]
  );

  const departureDateInputValue =
    searchFormProps.watch('departure-time') ?? i18n.langDateFormatter[lang as Locale](_dateOptions).format(new Date());

  const onSwapCitiesButtonClick = useCallback(() => {
    setSelectedOrigin(selectedDestination);
    setSelectedDestination(selectedOrigin);
  }, [selectedOrigin, selectedDestination]);

  const handleBusTicketCardClick = useCallback(async (ticketData: TaxiTicketRegistrationDataType) => {
    setIsLoading(true);

    try {
      selectedBookingRef.current = ticketData;

      const tripDetails = await tripRequest.getTripDetails(ticketData.id + '');
      tripDataInTicketRefRef.current = tripDetails.item;
      setIsOpenTicketDetailsModal(true);
    } catch (error) {
      console.log('Error fetching ticket details:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCancelTicket = useCallback(async (bookingData: TaxiTicketRegistrationDataType) => {
    selectedBookingRef.current = bookingData;

    try {
      const cancellationInfo = await customerRequest.getCancellationInfo(selectedBookingRef.current.id + '');
      cancellationInfoRef.current = cancellationInfo.item;

      const targetIndex = recentBooks.findIndex((item) => item.id === bookingData.id);
      if (targetIndex > -1) {
        recentBooks[targetIndex].booking_status = 'cancelled';
      }

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
      const response = await customerRequest.getBookingCancel(selectedBookingRef.current.id + '');
      //selectedBookingRef.current = response.item;

      const targetIndex = recentBooks.findIndex((item) => item.id === selectedBookingRef.current.id);
      if (targetIndex > -1) {
        recentBooks[targetIndex].booking_status = 'cancelled';
      }

      setIsOpenCancellationModal(false);
    } catch (error: unknown) {
      console.log('Error canceling ticket:', error);
      showRequestError(error);
    }
  }, [recentBooks]);

  useEffect(() => {
    let picker: DatePicker | null = null;
    let handler: null | ((event: Event) => void);

    if (isOpenDatepickerModal === true) {
      import('@mhf/date-picker/build/date-picker').then(() => {
        picker = datePickerRef.current;

        if (picker != null) {
          datePickerRef.current!.activeDate = departureDateInputValue;

          handler = (event: Event) => {
            const customEvent = event as CustomEvent<{ rawDate: Date; calendarDate: string }>;
            departureDateGregorianModeValueRef.current = customEvent.detail.rawDate;

            searchFormProps.setValue('departure-time', customEvent.detail.calendarDate, {
              shouldValidate: true,
              shouldDirty: true,
            });

            setIsOpenDatepickerModal(false);
          };

          picker.addEventListener('date-changed', handler as EventListener);
        }
      });
    }

    return () => {
      if (picker != null && handler != null) {
        picker.removeEventListener('date-changed', handler as EventListener);
      }
    };
  }, [isOpenDatepickerModal, departureDateInputValue]);

  useEffect(() => {
    const userData = getLocalStorageItem<LoggedInDataType | null>('userData', null);
    if (userData != null) {
      tripRequest.options.token = userData.token;
      customerRequest.options.token = userData.token;
    }

    locationRequest
      .getCitiesList('af') // TODO: Dynamic country code
      .then((response) => {
        const citiesList = response.items;

        setAllCitiesList(citiesList);
      })
      .catch((error) => {
        console.error('Error fetching cities:', error);
      });

    searchFormProps.setValue('departure-time', departureDateInputValue, {
      shouldValidate: true,
      shouldDirty: true,
    });

    return () => {
      selectedBookingRef.current = {} as TaxiTicketRegistrationDataType;
      tripDataInTicketRefRef.current = {} as TripItemDataType;
      cancellationInfoRef.current = {} as TicketCancellationDataType;
    };
  }, []);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center text-[2rem] text-primary">
          <Spinner turbo={true} />
        </div>
      )}

      <div className="shadow-gray-10 rounded-2xl p-5">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-[5px] border-[var(--color-title)]"></div>
          {generalDictionary.advancedSearch}
        </div>
        <div className="mt-4">
          <div className="flex flex-col gap-4">
            <Controller
              name="phone"
              control={searchFormProps.control}
              render={({ field }) => (
                <Input
                  type="text"
                  id="phone"
                  placeholder={generalDictionary.searchByPhoneNumber}
                  hasError={searchFormProps.formState.errors['phone'] != null}
                  errorMessage={
                    dictionary.general[
                      searchFormProps.formState.errors['phone']?.message as keyof typeof dictionary.general
                    ]
                  }
                  {...field}
                  value={field.value ?? ''}
                  prefixIcon={<Icon name="search" className="text-gray-500" size={18} />}
                  className="font-semibold"
                />
              )}
            />
            <Controller
              name="identification-number"
              control={searchFormProps.control}
              render={({ field }) => (
                <Input
                  type="text"
                  id="identification-number"
                  placeholder={generalDictionary.searchByIdentificationNumber}
                  hasError={searchFormProps.formState.errors['identification-number'] != null}
                  errorMessage={
                    dictionary.general[
                      searchFormProps.formState.errors['identification-number']
                        ?.message as keyof typeof dictionary.general
                    ]
                  }
                  {...field}
                  value={field.value ?? ''}
                  prefixIcon={<Icon name="search" className="text-gray-500" size={18} />}
                  className="font-semibold"
                />
              )}
            />
            <Controller
              name="tracking-code"
              control={searchFormProps.control}
              render={({ field }) => (
                <Input
                  type="text"
                  id="tracking-code"
                  placeholder={generalDictionary.searchByTrackingCode}
                  hasError={searchFormProps.formState.errors['tracking-code'] != null}
                  errorMessage={
                    dictionary.general[
                      searchFormProps.formState.errors['tracking-code']?.message as keyof typeof dictionary.general
                    ]
                  }
                  {...field}
                  value={field.value ?? ''}
                  prefixIcon={<Icon name="search" className="text-gray-500" size={18} />}
                  className="font-semibold"
                />
              )}
            />
            <Controller
              name="origin-city-id"
              control={searchFormProps.control}
              render={({ field }) => (
                <LocationInput
                  id="origin"
                  title={generalDictionary.origin}
                  label={generalDictionary.exit}
                  placeholder={generalDictionary.select}
                  onClick={() => setIsOpenOriginModal(true)}
                  hasError={searchFormProps.formState.errors['origin-city-id'] != null}
                  errorMessage={
                    dictionary.general[
                      searchFormProps.formState.errors['origin-city-id']?.message as keyof typeof dictionary.general
                    ]
                  }
                  {...field}
                  value={selectedOrigin.name}
                />
              )}
            />
            <Controller
              name="destination-city-id"
              control={searchFormProps.control}
              render={({ field }) => (
                <LocationInput
                  id="destination"
                  title={generalDictionary.destination}
                  label={generalDictionary.enter}
                  placeholder={generalDictionary.select}
                  onClick={() => setIsOpenDestinationModal(true)}
                  hasError={searchFormProps.formState.errors['destination-city-id'] != null}
                  errorMessage={
                    dictionary.general[
                      searchFormProps.formState.errors['destination-city-id']
                        ?.message as keyof typeof dictionary.general
                    ]
                  }
                  {...field}
                  value={selectedDestination.name}
                />
              )}
            />
            <Controller
              name="departure-time"
              control={searchFormProps.control}
              render={({ field }) => (
                <InputTwo
                  type="text"
                  id="departure-time"
                  placeholder={generalDictionary.select}
                  label={generalDictionary.moveDate}
                  hasError={searchFormProps.formState.errors['departure-time'] != null}
                  errorMessage={
                    dictionary.general[
                      searchFormProps.formState.errors['departure-time']?.message as keyof typeof dictionary.general
                    ]
                  }
                  {...field}
                  suffixIcon={<CalenderIcon width="24" className="text-primary cursor-pointer" />}
                  onClick={() => {
                    setIsOpenDatepickerModal(true);
                  }}
                />
              )}
            />
            <Button
              fullWidth
              loading={searchingBus}
              onClick={searchFormProps.handleSubmit(handleSearch)}
              variant="contained"
              color="primary"
              size="medium"
              type="submit"
            >
              {generalDictionary.search}
            </Button>
          </div>
        </div>
      </div>
      <div className="ticket-list mt-4 space-y-4">
        {recentBooks.map((item) => (
          <TaxiTicketCard
            passengers={item.passengers}
            key={item.id}
            ticketId={item.id + ''}
            busName={item.car_model ?? ''}
            busImage={item?.logo||"/assets/images/tmp/sample-bus.png"}
            // passengers={item}
            departure={item.from.city}
            destination={item.to.city}
            departureTime={item.travel_date}
            price={item.price + ''}
            onCancelTicket={() => handleCancelTicket(item)}
            onClick={() => handleBusTicketCardClick(item)}
            isCancellable={item.booking_status !== 'cancelled' && new Date(item.travel_date).getTime() > Date.now()}
            travelDate={i18n.langDateFormatter[lang!](_dateOptions).format(
              new Date(item.travel_date.split(' ')[0])
            )}
          />
        ))}
      </div>

      <Modal
        isOpen={isOpenOriginModal}
        onClose={() => setIsOpenOriginModal(false)}
        autoClose={false}
        header={
          <div className="p-5 border-b">
            <button onClick={handleBackOriginModal}>
              <Icon name="arrow-right-tailed" size={24} />
            </button>
            <div className="text-lg font-semibold">{generalDictionary.origin}</div>
          </div>
        }
      >
        <CitySelection
          cities={allCitiesList}
          onCitySelect={handleSelectOrigin}
          onCityChange={(city) => {
            setSelectedOrigin(city);
            selectedCitiesRef.current.origin = city;
          }}
        />
      </Modal>

      <Modal
        isOpen={isOpenDestinationModal}
        onClose={() => setIsOpenDestinationModal(false)}
        autoClose={false}
        header={
          <div className="p-5 border-b">
            <button onClick={handleBackDestinationModal}>
              <Icon name="arrow-right-tailed" size={24} />
            </button>
            <div className="text-lg font-semibold">{generalDictionary.destination}</div>
          </div>
        }
      >
        <CitySelection
          cities={allCitiesList}
          onCitySelect={handleSelectDestination}
          onCityChange={(city) => {
            setSelectedDestination(city);
            selectedCitiesRef.current.destination = city;
          }}
        />
      </Modal>

      <Modal
        isOpen={isOpenDatepickerModal}
        onClose={() => setIsOpenDatepickerModal(false)}
        autoClose={false}
        header={
          <div className="p-5 border-b">
            <button onClick={handleBackDatepickerModal}>
              <Icon name="arrow-right-tailed" size={24} />
            </button>
            <div className="text-lg font-semibold">{generalDictionary.moveDate}</div>
          </div>
        }
      >
        {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <date-picker solar={lang === 'fa'} ref={datePickerRef}></date-picker>
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
              <TaxiTicketCard
                passengers={selectedBookingRef.current.passengers}
                ticketId={selectedBookingRef.current.id + ''}
                busName={selectedBookingRef.current.car_model ?? ''}
                busImage={selectedBookingRef?.current?.logo||"/assets/images/tmp/sample-bus.png"}
                departure={selectedBookingRef.current.from.city}
                destination={selectedBookingRef.current.to.city}
                departureTime={selectedBookingRef.current.travel_date}
                price={selectedBookingRef.current.price + ''}
                travelDate={i18n.langDateFormatter[lang!](_dateOptions).format(
                  new Date(selectedBookingRef.current.travel_date.split(' ')[0])
                )}
              />
            </div>
            <div className="mt-4 text-xxs text-gray-800">
              <p>📌 توجه: برای ادامه فرایند، تیک قوانین را میپذیرم را بزنید.</p>
            </div>
            <div className="bg-gray-200 p-3 mt-3 rounded">
              <Checkbox
                name="confirm_terms"
                color="green"
                label="قوانین را می‌پذیرم."
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
                  {/* <Button size="xs" className="w-full" onClick={()=>shareBusTicket(selectedBookingRef.current,generalDictionary as GeneralDictionary)}>
                    {generalDictionary.share}
                  </Button> */}
                </div>
                <div className="px-1 pb-2 w-1/2">
                  <Button
                    size="xs"
                    variant="outlined"
                    className="w-full"
                    // href={selectedBookingRef.current.download_tickets}
                    //onClick={()=>downloadBusTicket(selectedBookingRef.current,generalDictionary as GeneralDictionary)}
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
            {/* <TicketReceipt
              className="mt-4"
              selectedSeats={selectedBookingRef.current.tickets.map((item) => item.seat_number)}
              tripData={tripDataInTicketRefRef.current}
              paymentData={{}}
              ownerData={selectedBookingRef.current.tickets?.[0].passenger}
              passengers={selectedBookingRef.current.tickets}
            /> */}
          </div>
        </Modal>
      )}
    </>
  );
};

export const SearchForm = memo(SearchFormComponent, (prevProps, nextProps) => {
  return prevProps.onSubmit === nextProps.onSubmit;
});
