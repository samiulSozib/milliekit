'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

import PageWrapper from '@/components/core/PageWrapper';
import Header from '@/components/shared/Header';
import { Button } from '@/components/core/Button';
import Icon from '@/components/core/Icon';
import { Modal } from '@/components/core/Modal';
import ActionBox from '@/components/shared/ActionBox';
import { Controller, useForm } from 'react-hook-form';
import { Input, InputTwo } from '@/components/core/Form';
import TripDetails from '@/components/shared/TripDetails';
import TicketReceipt from '@/components/shared/TicketReceipt';
import CalenderIcon from '@/components/core/Icon/CalenderIcon';

import { apiPathConfig, routeList } from '@/config';
import { useSettings } from '@/components/core/hooks/useSettings';
import { useActiveRouteStore } from '@/store/useActiveRouteStore';
import useTripStore from '@/store/useTripStore';
import { CustomerRequest } from '@/server/customer';
import { getLocalStorageItem } from '@/utils';
import { mySelfFormSchema, othersDataFormSchema } from '@/validation';

import type { InferType } from 'yup';
import type { getDictionary } from '@/utils/get-dictionary';
import type { GenderType, LoggedInDataType, TicketDataType, TicketRegistrationDataType } from '@/types';
import type{ DatePicker } from '@mhf/date-picker/build/date-picker';
import { formatSeatNumber } from '@/utils/seatNumber';
import { downloadBusTicket, shareBusTicket } from '@/utils/ticketTemplate';
import { GeneralDictionary } from '../../../../../types/generalDictionary';

const customerRequest = new CustomerRequest({
  url: apiPathConfig.bookings.base,
});

const reserveTypesOptions = (dictionary: Awaited<ReturnType<typeof getDictionary>>) => [
  {
    label: dictionary.general.myself,
    value: 'myself',
  },
  {
    label: dictionary.general.others,
    value: 'others',
  },
];

const genderOptions = (dictionary: Awaited<ReturnType<typeof getDictionary>>) => [
  {
    label: dictionary.general.male,
    value: 'male',
  },
  {
    label: dictionary.general.female,
    value: 'female',
  },
];

export default function BusBookingSupervisor() {
  const {
    settings: { dictionary, lang },
  } = useSettings();

  const mySelfDataFormProps = useForm({
    resolver: yupResolver(mySelfFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
  });

  const othersDataFormProps = useForm({
    resolver: yupResolver(othersDataFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
  });

  const generalDictionary = dictionary.general;
  const _reserveTypesOptions = reserveTypesOptions(dictionary);
  const _genderOptions = genderOptions(dictionary);

  const setActiveRoute = useActiveRouteStore((state) => state.setActiveRoute);

  const [isGetTicketLoading, setIsGetTicketLoading] = useState(false);

  const selectedTripDataStore = useTripStore((state) => state.selectedTripData);
  const selectedSeatsStore = useTripStore((state) => state.selectedSeats);

  const [customerBalance, setCustomerBalance] = useState<number>(0);
  const [isOpenTicketReceiptModal, setIsOpenTicketReceiptModal] = useState<boolean>(false);
  const [currentReserveType, setCurrentReserveType] = useState<string>(_reserveTypesOptions[0].value);
  const [gender, setGender] = useState<string>(_genderOptions[0].value);
  const [isOpenDatepickerModal, setIsOpenDatepickerModal] = useState<boolean>(false);

  const registeredTicketDataRef = useRef<TicketRegistrationDataType>({} as TicketRegistrationDataType);
  const datePickerRef = useRef<DatePicker | null>(null);
  const birthdayGregorianModeValueRef = useRef<Date | null>(null);

  const handleSelectReserveType = useCallback((value: string) => {
    setCurrentReserveType(value);
  }, []);

  const handleSelectGender = useCallback(
    (value: string) => {
      setGender(value);
      othersDataFormProps.setValue('gender', value, { shouldDirty: true, shouldValidate: true });
    },
    [othersDataFormProps]
  );

  const { bus, route, arrival_time, departure_time } = selectedTripDataStore;
  const { origin_city, origin_station, destination_city, destination_station, distance } = route ?? {};
  const { facilities } = bus ?? {};

  let _facilities: string[] = [];
  if (typeof facilities === 'string') {
    _facilities = facilities.split(', ');
  } else if (Array.isArray(facilities)) {
    _facilities = facilities;
  }

  const finalTotalPrice = useMemo(() => {
    return selectedSeatsStore.reduce((sum, seatData) => {
      const seatPriceData = selectedTripDataStore.seat_prices.find((item) => item.seat_number === seatData.seatNumber);
      if (seatPriceData == null) return sum;

      return sum + seatPriceData.payble_price;
    }, 0);
  }, [selectedTripDataStore, selectedSeatsStore]);

  const onOthersFormDataSubmit = useCallback(
    async (data: InferType<typeof othersDataFormSchema>) => {
      if (customerBalance <= 0) {
        toast.error(generalDictionary.balanceIsNotEnough);
        return;
      }

      setIsGetTicketLoading(true);

      const userData = getLocalStorageItem<LoggedInDataType | null>('userData', null);
      if (userData == null) return;

      const { first_name, last_name, email, phone, national_id, gender } = data;

      const tickets: TicketDataType[] = [];
      selectedSeatsStore.forEach((seatData) => {
        tickets.push({
          first_name,
          last_name,
          national_id,
          phone,
          birthday: birthdayGregorianModeValueRef.current?.toISOString().split('T')[0] ?? '',
          email: email ?? '',
          gender: (gender ?? 'male') as GenderType,
          trip_seat_price_id: seatData.seatPriceId,
        });
      });

      try {
        customerRequest.options.token = userData.token;

        const response = await customerRequest.bookTrip({
          is_partial_payment: 0,
          amount: finalTotalPrice,
          tickets,
          trip_id: selectedTripDataStore.id,
        });

        registeredTicketDataRef.current = response.item ?? {};
        othersDataFormProps.reset({
          first_name: '',
          last_name: '',
          national_id: '',
          phone: '',
          email: '',
          birthday: '',
          gender: 'male',
        });

        setIsOpenTicketReceiptModal(true);
      } catch (error) {
        console.log('onMyselfFormDataSubmit => Saving data error ', error);
        toast.error(generalDictionary.ticketIssuingFailed);
      }

      setIsGetTicketLoading(false);
    },
    [selectedSeatsStore, selectedTripDataStore, finalTotalPrice, customerBalance, gender]
  );

  const onMyselfFormDataSubmit = useCallback(
    async (data: InferType<typeof mySelfFormSchema>) => {
      if (customerBalance <= 0) {
        toast.error(generalDictionary.balanceIsNotEnough);
        return;
      }

      setIsGetTicketLoading(true);

      const userData = getLocalStorageItem<LoggedInDataType | null>('userData', null);
      if (userData == null) return;

      const { first_name, last_name, email, mobile, national_id, birthday, gender } = userData.profile[0];

      const tickets: TicketDataType[] = [];
      selectedSeatsStore.forEach((seatData) => {
        tickets.push({
          first_name,
          last_name,
          national_id: national_id ?? '5222222222',
          phone: data.phone ?? mobile,
          birthday: birthday ?? '',
          email,
          gender: gender ?? 'male',
          trip_seat_price_id: seatData.seatPriceId,
        });
      });

      try {
        customerRequest.options.token = userData.token;

        const response = await customerRequest.bookTrip({
          is_partial_payment: 0,
          amount: finalTotalPrice,
          tickets,
          trip_id: selectedTripDataStore.id,
        });

        registeredTicketDataRef.current = response.item ?? {};

        mySelfDataFormProps.reset({
          phone: '',
        });

        setIsOpenTicketReceiptModal(true);
      } catch (error) {
        console.log('onMyselfFormDataSubmit => Saving data error ', error);
        toast.error(generalDictionary.ticketIssuingFailed);
      }

      setIsGetTicketLoading(false);
    },
    [selectedSeatsStore, selectedTripDataStore, finalTotalPrice, customerBalance]
  );

  useEffect(() => {
    setActiveRoute(routeList.busBooking.subPathList.supervisorInfo);

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
    };
  }, []);

  const birthdayInputValue = othersDataFormProps.watch('birthday');

  useEffect(() => {
    let picker: DatePicker | null = null;
    let handler: null | ((event: Event) => void);

    if (isOpenDatepickerModal === true) {
      import('@mhf/date-picker/build/date-picker').then(() => {
        picker = datePickerRef.current;

        if (picker != null) {
          datePickerRef.current!.activeDate = birthdayInputValue;

          handler = (event: Event) => {
            const customEvent = event as CustomEvent<{ rawDate: Date; calendarDate: string }>;
            birthdayGregorianModeValueRef.current = customEvent.detail.rawDate;

            othersDataFormProps.setValue('birthday', customEvent.detail.calendarDate, {
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
  }, [isOpenDatepickerModal, birthdayInputValue]);

  useEffect(() => {
    othersDataFormProps.clearErrors();
    mySelfDataFormProps.clearErrors();
  }, [currentReserveType]);

  return (
    <>
      <PageWrapper name="module-bus-booking">
        <Header wallpaper="/assets/images/modules/bus-booking/wallpaper.jpg" title={generalDictionary.supervisorInfo} />
        <ActionBox>
          <>
            <div>
              <div className="flex items-center gap-2">
                <div className="heading-symbol"></div>
                {generalDictionary.reserveFor}
              </div>
              <div className="flex gap-4 mt-6">
                {_reserveTypesOptions.map((option, key) => (
                  <div key={key} className="inline-flex items-center w-1/2">
                    <label className="relative flex items-center cursor-pointer" htmlFor={option.value}>
                      <input
                        type="radio"
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-[var(--color-gray-600)] checked:border-[--color-success] transition-all"
                        id={option.value}
                        onChange={() => handleSelectReserveType(option.value)}
                        checked={option.value === currentReserveType}
                      />
                      <span className="absolute bg-[--color-success] w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                    </label>
                    <label
                      className="mr-2 ltr:mr-0 ltr:ml-2 cursor-pointer text-xs text-[var(--color-gray-800)] checked:text-red-400"
                      htmlFor={option.value}
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {currentReserveType === 'myself' ? (
              <div className="flex flex-col gap-4 mt-6">
                <div className="flex flex-col gap-2">
                  <Controller
                    key="mySelfPhone"
                    name="phone"
                    control={mySelfDataFormProps.control}
                    render={({ field }) => (
                      <Input
                        id="phone"
                        type="text"
                        placeholder={generalDictionary.phoneNumber}
                        className="font-semibold"
                        hasError={mySelfDataFormProps.formState.errors.phone?.message != null}
                        errorMessage={
                          generalDictionary[
                            mySelfDataFormProps.formState.errors.phone?.message as keyof typeof generalDictionary
                          ]
                        }
                        ltr
                        {...field}
                      />
                    )}
                  />
                </div>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="medium"
                  type="submit"
                  onClick={mySelfDataFormProps.handleSubmit(onMyselfFormDataSubmit)}
                  loading={isGetTicketLoading}
                  disabled={mySelfDataFormProps.formState.isValid === false}
                >
                  {generalDictionary.getTicket}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-6">
                <div className="flex flex-col gap-3.5">
                  <Controller
                    name="first_name"
                    key="othersFormFirstName"
                    control={othersDataFormProps.control}
                    render={({ field }) => (
                      <Input
                        key="othersFormFirstName"
                        id="first_name"
                        type="text"
                        placeholder={generalDictionary.firstName}
                        className="font-semibold"
                        hasError={othersDataFormProps.formState.errors.first_name != null}
                        errorMessage={
                          generalDictionary[
                            othersDataFormProps.formState.errors['first_name']
                              ?.message as keyof typeof generalDictionary
                          ]
                        }
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="last_name"
                    control={othersDataFormProps.control}
                    render={({ field }) => (
                      <Input
                        id="last_name"
                        type="text"
                        placeholder={generalDictionary.lastName}
                        className="font-semibold"
                        hasError={othersDataFormProps.formState.errors.last_name != null}
                        errorMessage={
                          generalDictionary[
                            othersDataFormProps.formState.errors['last_name']?.message as keyof typeof generalDictionary
                          ]
                        }
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="national_id"
                    control={othersDataFormProps.control}
                    render={({ field }) => (
                      <Input
                        ltr
                        id="national_id"
                        type="number"
                        placeholder={generalDictionary.nationalId}
                        className="font-semibold"
                        hasError={othersDataFormProps.formState.errors.national_id != null}
                        errorMessage={
                          generalDictionary[
                            othersDataFormProps.formState.errors['national_id']
                              ?.message as keyof typeof generalDictionary
                          ]
                        }
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="phone"
                    control={othersDataFormProps.control}
                    render={({ field }) => (
                      <Input
                        id="phone"
                        type="number"
                        placeholder={generalDictionary.mobileNumber}
                        className="font-semibold"
                        hasError={othersDataFormProps.formState.errors.phone?.message != null}
                        errorMessage={
                          generalDictionary[
                            othersDataFormProps.formState.errors.phone?.message as keyof typeof generalDictionary
                          ]
                        }
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="email"
                    control={othersDataFormProps.control}
                    render={({ field }) => (
                      <Input
                        ltr
                        id="email"
                        type="text"
                        placeholder={generalDictionary.email}
                        className="font-semibold"
                        hasError={othersDataFormProps.formState.errors.email?.message != null}
                        errorMessage={
                          generalDictionary[
                            othersDataFormProps.formState.errors.email?.message as keyof typeof generalDictionary
                          ]
                        }
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="birthday"
                    control={othersDataFormProps.control}
                    render={({ field }) => (
                      <InputTwo
                        type="text"
                        id="birthday"
                        className="font-semibold"
                        label={generalDictionary.birthday}
                        placeholder={generalDictionary.select}
                        hasError={othersDataFormProps.formState.errors.birthday?.message != null}
                        errorMessage={
                          generalDictionary[
                            othersDataFormProps.formState.errors.birthday?.message as keyof typeof generalDictionary
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
                  <div className="flex gap-4 mt-6">
                    {_genderOptions.map((option, key) => (
                      <div key={key} className="inline-flex items-center w-1/2">
                        <label className="relative flex items-center cursor-pointer" htmlFor={option.value}>
                          <input
                            type="radio"
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-[var(--color-gray-600)] checked:border-[--color-success] transition-all"
                            id={option.value}
                            onChange={() => handleSelectGender(option.value)}
                            checked={option.value === gender}
                          />
                          <span className="absolute bg-[--color-success] w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                        </label>
                        <label
                          className="mr-2 ltr:mr-0 ltr:ml-2 cursor-pointer text-xs text-[var(--color-gray-800)] checked:text-red-400"
                          htmlFor={option.value}
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  fullWidth
                  loading={isGetTicketLoading}
                  variant="contained"
                  color="primary"
                  size="medium"
                  type="submit"
                  onClick={othersDataFormProps.handleSubmit(onOthersFormDataSubmit)}
                  disabled={othersDataFormProps.formState.isValid === false}
                >
                  {generalDictionary.getTicket}
                </Button>
              </div>
            )}
          </>
        </ActionBox>

        <div className="mt-6">
          <div className="container-fluid">
            <div className="p-5 shadow-gray-10 rounded-2xl">
              {_facilities.length > 0 && (
                <div>
                  <ul className="flex flex-wrap items-center gap-1 [&__li]:py-0.5 [&__li]:px-2 [&__li]:text-xxs [&__li]:rounded  [&__li]:bg-[rgba(24,144,255,0.12)] [&__li]:text-[var(--color-link)]">
                    {_facilities.map((item, key) => (
                      <li key={key} className="font-semibold">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={bus.image || '/assets/images/tmp/transportation-company.png'}
                      alt={bus.name || 'Bus company'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="font-semibold text-[var(--color-gray-800)] text-xsm">
                    {bus.name} - {bus.bus_number}
                  </div>
                </div>
                {/* <div className="text-xxs text-[var(--color-gray-500)]">بزرگسال ۲، کودک ۱</div> */}
              </div>
              <TripDetails
                departure={origin_city.name || generalDictionary.unknown}
                destination={destination_city.name || generalDictionary.unknown}
                departureTime={departure_time.split(' ')[1].replace(/:00$/, '') ?? generalDictionary.unknown}
                arrivalTime={arrival_time.split(' ')[1].replace(/:00$/, '') ?? generalDictionary.unknown}
                duration={distance}
                className="mt-3"
              />
              <div className="grid gap-3 text-xs mt-4">
                <div className="flex flex-wrap gap-x-1 gap-y-3">
                  <div className="text-[var(--color-gray-500)]">{generalDictionary.boardingPlace}:</div>
                  <div className="text-[var(--color-gray-700)]">{origin_station.name || generalDictionary.unknown}</div>
                </div>
                <div className="flex flex-wrap gap-x-1 gap-y-3">
                  <div className="text-[var(--color-gray-500)]">{generalDictionary.dropLocation}:</div>
                  <div className="text-[var(--color-gray-700)]">
                    {destination_station.name || generalDictionary.unknown}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-y-3 mt-5">
                <div className="flex items-center gap-1">
                  <div className="text-[var(--color-gray-500)] text-md">{generalDictionary.totalPrice}:</div>
                  <div className="flex items-center gap-1">
                    <div className="font-semibold text-lg">{finalTotalPrice}</div>
                    <div className="text-[var(--color-gray-700)]">
                      <Icon name="afghan-currency" size={20} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-xs gap-2">
                  <div className="text-[var(--color-gray-500)]">
                    {generalDictionary.seat}:{' '}
                    {selectedSeatsStore.map((item) => formatSeatNumber(item.seatNumber)).join(', ')}
                  </div>
                  <div>
                    <Icon name="seat-available" className="text-primary" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-success mt-4">
                <div>
                  <Icon name="wallet-tick" size={24} />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold">
                  <div>
                    {generalDictionary.accountCredit}: <span>{customerBalance}</span>
                  </div>
                  <Icon name="afghan-currency" size={17} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>

      <Modal
        isOpen={isOpenTicketReceiptModal}
        onClose={() => setIsOpenTicketReceiptModal(false)}
        autoClose={false}
        footer={
          <div className="p-5 pt-0">
            <div className="flex flex-wrap -mx-1">
              <div className="px-1 pb-2 w-1/2">
                <Button
                  size="xs"
                  className="w-full"
                  onClick={() =>
                    shareBusTicket(registeredTicketDataRef.current, generalDictionary as GeneralDictionary)
                  }
                >
                  {generalDictionary.share}
                </Button>
              </div>
              <div className="px-1 pb-2 w-1/2">
                <Button
                  size="xs"
                  variant="outlined"
                  className="w-full"
                  // href={registeredTicketDataRef.current.download_tickets}
                  onClick={() =>
                    downloadBusTicket(registeredTicketDataRef.current, generalDictionary as GeneralDictionary)
                  }
                >
                  {generalDictionary.saveToGallery}
                </Button>
              </div>
              <div className="px-1 pb-2 w-full">
                <Button
                  onClick={() => setIsOpenTicketReceiptModal(false)}
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
            selectedSeats={selectedSeatsStore.map((item) => item.seatNumber)}
            tripData={selectedTripDataStore}
            paymentData={{}}
            ownerData={registeredTicketDataRef.current.tickets?.[0].passenger}
            passengers={registeredTicketDataRef.current.tickets}
          />
        </div>
      </Modal>

      <Modal
        isOpen={isOpenDatepickerModal}
        onClose={() => setIsOpenDatepickerModal(false)}
        autoClose={false}
        header={
          <div className="p-5 border-b">
            <div className="text-lg font-semibold">{generalDictionary.birthday}</div>
          </div>
        }
      >
        {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <date-picker solar={lang === 'fa'} ref={datePickerRef}></date-picker>
      </Modal>
    </>
  );
}
