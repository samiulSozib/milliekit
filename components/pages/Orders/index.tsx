'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { useSettings } from '@/components/core/hooks/useSettings';
import PageWrapper from '@/components/core/PageWrapper';
import ActionBox from '@/components/shared/ActionBox';
import Header from '@/components/shared/Header';
import { Controller, useForm } from 'react-hook-form';
import { Modal } from '@/components/core/Modal';
import { Button } from '@/components/core/Button';
import Icon from '@/components/core/Icon';
import { useActiveRouteStore } from '@/store/useActiveRouteStore';
import { routeList } from '@/config';
import { OrderCard } from '@/components/shared/OrderCard';
import { Input, InputTwo } from '@/components/core/Form';
import { orderFilterFormSchema } from '@/validation';
import { createQueryParams, getLocalizedUrl } from '@/utils';
import { NotFound } from './NotFound';

import type { DatePicker } from '@mhf/date-picker/build/date-picker';
import type { TicketRegistrationDataType, TransactionQueryParamsType } from '@/types';

// const orders: OrderCardProps[] = [
//   {
//     id: '11256343',
//     date: '۲۱ مهر ۱۴۰۳',
//     description: 'خرید بسته ایرانسل ایران',
//     phone: '09125645874',
//     buy: '۲۰۰,۰۰۰ تومان',
//     sell: '۲۵۰,۰۰۰ تومان',
//     status: 'success',
//   },
//   {
//     id: '11256341',
//     date: '۲۱ مهر ۱۴۰۳',
//     description: 'بازی الماس ده الماسی (نامحدود)',
//     phone: '09125645874',
//     buy: '۲۰۰,۰۰۰ تومان',
//     sell: '۲۵۰,۰۰۰ تومان',
//     status: 'failed',
//   },
//   {
//     id: '11256342',
//     date: '۲۱ مهر ۱۴۰۳',
//     description: 'بسته مکالمه ۲۰ ساعته درون شهری ایرانسل ایران',
//     phone: '09125645874',
//     buy: '۲۰۰,۰۰۰ تومان',
//     sell: '۲۵۰,۰۰۰ تومان',
//     status: 'pending',
//   },
// ];

export default function Orders({ items }: { items: TicketRegistrationDataType[] }) {
  const [openFormDateModal, setIsOpenFromDateModal] = useState<boolean>(false);
  const [openToDateModal, setIsOpenToDateModal] = useState<boolean>(false);
  // const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);
  const [isOpenSuccessfulModal, setIsOpenSuccessfulModal] = useState<boolean>(false);
  const [isOpenFailureModal, setIsOpenFailureModal] = useState<boolean>(false);

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
    resolver: yupResolver(orderFilterFormSchema),
    defaultValues: {
      'from-date': null,
      'to-date': null,
      search: null,
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
  });

  const setActiveRoute = useActiveRouteStore((state) => state.setActiveRoute);

  useEffect(() => {
    setActiveRoute(routeList.orders);

    return () => {
      setActiveRoute(null);
    };
  }, []);

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

    const queryParamsRecord: Partial<TransactionQueryParamsType> = { page: 1, per_page: 10 };

    if (selectedDates.current.start != null) {
      queryParamsRecord['from-date'] = selectedDates.current.start.toISOString().split('T')[0];
    }

    if (selectedDates.current.end != null) {
      queryParamsRecord['to-date'] = selectedDates.current.end.toISOString().split('T')[0];
    }

    const queryParams = createQueryParams(queryParamsRecord);
    try {
      router.push(getLocalizedUrl(routeList.orders.path + '?' + queryParams, lang!));
    } catch (error) {
      console.log(error);
    }
  }, [lang]);

  const onReset = useCallback(() => {
    useFormProps.reset();
    router.push(getLocalizedUrl(routeList.orders.path, lang!));
  }, [lang]);

  return (
    <>
      <PageWrapper name="orders">
        <Header title={generalDictionary.orders} overlayOpacity={0.01} />

        <ActionBox>
          <>
            <div className="flex flex-col gap-y-3">
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
                      dictionary.general[
                        useFormProps.formState.errors['from-date']?.message as keyof typeof dictionary.general
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
                      dictionary.general[
                        useFormProps.formState.errors['to-date']?.message as keyof typeof dictionary.general
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
                      dictionary.general[
                        useFormProps.formState.errors['search']?.message as keyof typeof dictionary.general
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
          </>
        </ActionBox>

        <div className="mt-6">
          <div className="container-fluid">
            <div className="flex flex-col gap-y-4">
              {items.length > 0 ? (
                items.map((order) => (
                  <OrderCard
                    key={order.id}
                    id={order.id + ''}
                    date={order.created_at}
                    phone={order.user.mobile}
                    status={order.status}
                    title={`${generalDictionary.ticket} ${order.trip.route.name}`}
                    amount={order.total_price + ''}
                  />
                ))
              ) : (
                <NotFound />
              )}
            </div>
          </div>
        </div>
      </PageWrapper>

      <Modal
        isOpen={isOpenSuccessfulModal}
        onClose={() => setIsOpenSuccessfulModal(false)}
        autoClose={false}
        footer={
          <div className="px-5 pb-6 pt-1">
            <div className="w-full">
              <Button
                size="xs"
                variant="outlined"
                color="white"
                className="w-full border border-gray-300"
                onClick={() => setIsOpenSuccessfulModal(false)}
              >
                {generalDictionary.close}
              </Button>
            </div>
          </div>
        }
      >
        <div className="px-5 py-6">
          <div className="flex flex-col items-center gap-y-7">
            <div className="w-[5.3rem]">
              <img src="/assets/images/misc/icon-successful.png" alt="" />
            </div>
            <div className="text-[var(--color-success)] font-semibold text-xmd">
              <p>{generalDictionary.amountTransferredSuccessfully}</p>
            </div>
          </div>
        </div>
      </Modal>

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

      <Modal
        isOpen={isOpenFailureModal}
        onClose={() => setIsOpenFailureModal(false)}
        autoClose={false}
        footer={
          <div className="px-5 pb-6 pt-1">
            <div className="w-full">
              <Button
                size="xs"
                variant="outlined"
                color="white"
                className="w-full border border-gray-300"
                onClick={() => setIsOpenFailureModal(false)}
              >
                {generalDictionary.close}
              </Button>
            </div>
          </div>
        }
      >
        <div className="px-5 py-6">
          <div className="flex flex-col items-center gap-y-7">
            <div className="w-[5.3rem]">
              <img src="/assets/images/misc/icon-failure.png" alt="" />
            </div>
            <div className="text-[var(--color-error)] font-semibold text-xmd">
              <p>{dictionary.network.networkRequestError}</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
