'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';

import { useSettings } from '@/components/core/hooks/useSettings';
import { Input, InputTwo } from '@/components/core/Form';
import { Button } from '@/components/core/Button';
import Icon from '@/components/core/Icon';
import { apiPathConfig, routeList } from '@/config';
import { transactionFilterFormSchema } from '@/validation';
import { Modal } from '@/components/core/Modal';
import { NotFound } from './NotFound';
import { createQueryParams, getLocalizedUrl, getLocalStorageItem } from '@/utils';
import { CustomerRequest } from '@/server/customer';
import { Spinner } from '@/components/core/Spinner';

import type { LoggedInDataType, TaxiTransactionItemDataType, TaxiTransactionQueryParamsType} from '@/types';
import type { DatePicker } from '@mhf/date-picker/build/date-picker';
import { TaxiTransactionCard } from '../TaxiTransactionCard';

const customerRequest = new CustomerRequest({
  url: apiPathConfig.wallet.transactions,
});

const taxiTransactions: TaxiTransactionItemDataType[] = [
  {
    id: 1,
    order_id: "#1125643",
    ticket_number: "6555484",
    origin: "Harat",
    destination: "Mazarsharif",
    booking_datetime: "09-05-2025 - 12:56",
    departure_datetime: "09/15/2025 - 04:42",
    passengers: { adult: 3, child: 1 },
    paid_amount: "50,456",
    currency: "AFN",
    status: "issued_ticket",
    created_at: "2025-09-05T12:56:00Z",
    updated_at: "2025-09-05T12:56:00Z"
  },
  {
    id: 2,
    order_id: "#1125644",
    ticket_number: "6555485",
    origin: "Kabul",
    destination: "Kandahar",
    booking_datetime: "09-06-2025 - 14:30",
    departure_datetime: "09/16/2025 - 08:15",
    passengers: { adult: 2, child: 0 },
    paid_amount: "35,200",
    currency: "AFN",
    status: "issued_ticket",
    created_at: "2025-09-06T14:30:00Z",
    updated_at: "2025-09-06T14:30:00Z"
  },
  {
    id: 3,
    order_id: "#1125645",
    ticket_number: "6555486",
    origin: "Mazarsharif",
    destination: "Jalalabad",
    booking_datetime: "09-07-2025 - 09:45",
    departure_datetime: "09/17/2025 - 06:30",
    passengers: { adult: 4, child: 2 },
    paid_amount: "62,800",
    currency: "AFN",
    status: "pending",
    created_at: "2025-09-07T09:45:00Z",
    updated_at: "2025-09-07T09:45:00Z"
  },
  {
    id: 4,
    order_id: "#1125646",
    ticket_number: "6555487",
    origin: "Kunduz",
    destination: "Herat",
    booking_datetime: "09-08-2025 - 16:20",
    departure_datetime: "09/18/2025 - 12:00",
    passengers: { adult: 1, child: 1 },
    paid_amount: "45,150",
    currency: "AFN",
    status: "issued_ticket",
    created_at: "2025-09-08T16:20:00Z",
    updated_at: "2025-09-08T16:20:00Z"
  },
  {
    id: 5,
    order_id: "#1125647",
    ticket_number: "6555488",
    origin: "Kandahar",
    destination: "Kabul",
    booking_datetime: "09-09-2025 - 11:10",
    departure_datetime: "09/19/2025 - 07:45",
    passengers: { adult: 3, child: 0 },
    paid_amount: "38,900",
    currency: "AFN",
    status: "cancelled",
    created_at: "2025-09-09T11:10:00Z",
    updated_at: "2025-09-09T11:10:00Z"
  },
  {
    id: 6,
    order_id: "#1125648",
    ticket_number: "6555489",
    origin: "Herat",
    destination: "Kunduz",
    booking_datetime: "09-10-2025 - 13:25",
    departure_datetime: "09/20/2025 - 10:30",
    passengers: { adult: 2, child: 2 },
    paid_amount: "55,750",
    currency: "AFN",
    status: "completed",
    created_at: "2025-09-10T13:25:00Z",
    updated_at: "2025-09-10T13:25:00Z"
  },
  {
    id: 7,
    order_id: "#1125649",
    ticket_number: "6555490",
    origin: "Jalalabad",
    destination: "Mazarsharif",
    booking_datetime: "09-11-2025 - 08:40",
    departure_datetime: "09/21/2025 - 05:15",
    passengers: { adult: 1, child: 0 },
    paid_amount: "28,400",
    currency: "AFN",
    status: "issued_ticket",
    created_at: "2025-09-11T08:40:00Z",
    updated_at: "2025-09-11T08:40:00Z"
  },
  {
    id: 8,
    order_id: "#1125650",
    ticket_number: "6555491",
    origin: "Kabul",
    destination: "Herat",
    booking_datetime: "09-12-2025 - 17:55",
    departure_datetime: "09/22/2025 - 14:20",
    passengers: { adult: 5, child: 1 },
    paid_amount: "75,300",
    currency: "AFN",
    status: "pending",
    created_at: "2025-09-12T17:55:00Z",
    updated_at: "2025-09-12T17:55:00Z"
  }
];

export const TransactionForm = () => {
  const [openFormDateModal, setIsOpenFromDateModal] = useState<boolean>(false);
  const [openToDateModal, setIsOpenToDateModal] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<TaxiTransactionItemDataType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const datePickerRef = useRef<DatePicker | null>(null);
  const datePicker2Ref = useRef<DatePicker | null>(null);

  const selectedDates = useRef<{ start: Date | null; end: Date }>({
    start: null,
    end: new Date(),
  });

  const router = useRouter();

  const {
    settings: { dictionary, lang },
  } = useSettings();
  const generalDictionary = dictionary.general;

  const useFormProps = useForm({
    resolver: yupResolver(transactionFilterFormSchema),
    defaultValues: {
      'from-date': null,
      'to-date': null,
      search: null,
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
  });

  useEffect(() => {
    let picker: DatePicker | null = null;
    let handler: null | ((event: Event) => void);

    if (openFormDateModal === true) {
      import('@mhf/date-picker/build/date-picker').then(() => {
        picker = datePickerRef.current;

        if (picker != null) {
          handler = (event: Event) => {
            const customEvent = event as CustomEvent<{ rawDate: Date; calendarDate: string }>;
            selectedDates.current.start = customEvent.detail.rawDate;

            if (selectedDates.current.start.getTime() > selectedDates.current.end.getTime()) {
              toast.error(generalDictionary.endDateShouldBeAfterStartDate);
              return;
            }

            useFormProps.setValue('from-date', customEvent.detail.calendarDate, {
              shouldValidate: true,
              shouldDirty: true,
            });

            setIsOpenFromDateModal(false);
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
  }, [openFormDateModal]);

  useEffect(() => {
    let picker: DatePicker | null = null;
    let handler: null | ((event: Event) => void);

    if (openToDateModal === true) {
      import('@mhf/date-picker/build/date-picker').then(() => {
        picker = datePicker2Ref.current;

        if (picker != null) {
          handler = (event: Event) => {
            const customEvent = event as CustomEvent<{ rawDate: Date; calendarDate: string }>;
            selectedDates.current.end = customEvent.detail.rawDate;

            if (
              selectedDates.current.start != null &&
              selectedDates.current.start.getTime() > selectedDates.current.end.getTime()
            ) {
              toast.error(generalDictionary.endDateShouldBeAfterStartDate);
              return;
            }

            useFormProps.setValue('to-date', customEvent.detail.calendarDate, {
              shouldValidate: true,
              shouldDirty: true,
            });

            setIsOpenToDateModal(false);
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
  }, [openToDateModal]);

  const onSubmit = useCallback(() => {
    // from-date=2025-02-21&to-date=2025-02-21

    const queryParamsRecord: Partial<TaxiTransactionQueryParamsType> = { page: 1, per_page: 10 };

    if (selectedDates.current.start != null) {
      queryParamsRecord['from-date'] = selectedDates.current.start.toISOString().split('T')[0];
    }

    if (selectedDates.current.end != null) {
      queryParamsRecord['to-date'] = selectedDates.current.end.toISOString().split('T')[0];
    }

    const queryParams = createQueryParams(queryParamsRecord);

    try {
      router.push(getLocalizedUrl(routeList.transactions.path + '?' + queryParams, lang!));
    } catch (error) {
      console.log(error);
    }
  }, [lang]);

  const onReset = useCallback(() => {
    useFormProps.reset();
    router.push(getLocalizedUrl(routeList.transactions.path, lang!));
  }, [lang]);

  const fetchTransactionsRequest = async () => {
    setIsLoading(true);

    try {
      // const userData = getLocalStorageItem<LoggedInDataType | null>('userData', null);
      // customerRequest.options.url = apiPathConfig.wallet.transactions;
      // customerRequest.options.token = userData?.token;

      // const response = await customerRequest.getWalletTransactions();
      // setTransactions(response.items);
      setTransactions(taxiTransactions)
    } catch (error) {
      console.error('Error fetching trip data:', error);
      // Handle the error as needed, e.g., show an error message to the user
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchTransactionsRequest();
  }, []);

  return (
    <>
      <div className="shadow-gray-10 rounded-2xl p-5">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-[5px] border-[var(--color-title)]"></div>
          {generalDictionary.advancedSearch}
        </div>
        <div className="mt-4">
          <div className="flex flex-col gap-4">
            <Controller
              name="from-date"
              control={useFormProps.control}
              render={({ field }) => (
                <InputTwo
                  type="text"
                  id="departure-time"
                  placeholder={generalDictionary.select}
                  label={generalDictionary.fromDate}
                  hasError={useFormProps.formState.errors['from-date'] != null}
                  errorMessage={
                    generalDictionary[
                      useFormProps.formState.errors['from-date']?.message as keyof typeof generalDictionary
                    ]
                  }
                  {...field}
                  suffixIcon={<Icon name="calender" className="text-gray-500" size={18} />}
                  onClick={() => {
                    setIsOpenFromDateModal(true);
                  }}
                />
              )}
            />
            <Controller
              name="to-date"
              control={useFormProps.control}
              render={({ field }) => (
                <InputTwo
                  type="text"
                  id="departure-time"
                  placeholder={generalDictionary.select}
                  label={generalDictionary.toDate}
                  hasError={useFormProps.formState.errors['to-date'] != null}
                  errorMessage={
                    generalDictionary[
                      useFormProps.formState.errors['to-date']?.message as keyof typeof generalDictionary
                    ]
                  }
                  {...field}
                  suffixIcon={<Icon name="calender" className="text-gray-500" size={18} />}
                  onClick={() => {
                    setIsOpenToDateModal(true);
                  }}
                />
              )}
            />
            <Controller
              name="search"
              control={useFormProps.control}
              render={({ field }) => (
                <Input
                  type="text"
                  id="search"
                  placeholder={generalDictionary.search}
                  hasError={useFormProps.formState.errors['search'] != null}
                  errorMessage={
                    generalDictionary[
                      useFormProps.formState.errors['search']?.message as keyof typeof generalDictionary
                    ]
                  }
                  {...field}
                  value={field.value ?? ''}
                  prefixIcon={<Icon name="search" className="text-gray-500" size={18} />}
                  className="font-semibold"
                />
              )}
            />
          </div>

          <div className="mt-4 flex gap-3">
            <div className="w-2/3">
              <Button
                size="xs"
                color="primary"
                className="w-full shadow-violet"
                disabled={useFormProps.formState.isDirty === false}
                onClick={useFormProps.handleSubmit(onSubmit)}
              >
                {generalDictionary.performFilters}
              </Button>
            </div>
            <div className="w-1/3">
              <Button
                size="xs"
                variant="outlined"
                color="danger"
                className="w-full"
                disabled={useFormProps.formState.isDirty === false}
                onClick={onReset}
              >
                {generalDictionary.clearFilters}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center text-[1.4rem] py-4 text-primary">
            <Spinner turbo />
          </div>
        ) : (
          <div className="flex flex-col gap-y-4">
            {transactions.length > 0 ? (
              transactions.map((item) => (
                <TaxiTransactionCard
                  key={item.id}
                  id={item.id}
                  order_id={item.order_id}
                  amount={item.paid_amount}
                  date={item.created_at}
                  status={item.status}
                  origin={item.origin}
                  destination={item.destination}
                  passengers={item.passengers}
                />
              ))
            ) : (
              <NotFound />
            )}
          </div>
        )}
      </div>

      <Modal
        key="from-date"
        isOpen={openFormDateModal}
        onClose={() => setIsOpenFromDateModal(false)}
        autoClose={false}
        header={
          <div className="p-5 border-b">
            <div className="text-lg font-semibold">{generalDictionary.fromDate}</div>
          </div>
        }
      >
        {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <date-picker solar={lang === 'fa'} ref={datePickerRef}></date-picker>
      </Modal>

      <Modal
        key="to-date"
        isOpen={openToDateModal}
        onClose={() => setIsOpenToDateModal(false)}
        autoClose={false}
        header={
          <div className="p-5 border-b">
            <div className="text-lg font-semibold">{generalDictionary.toDate}</div>
          </div>
        }
      >
        {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <date-picker solar={lang === 'fa'} ref={datePicker2Ref}></date-picker>
      </Modal>
    </>
  );
};
