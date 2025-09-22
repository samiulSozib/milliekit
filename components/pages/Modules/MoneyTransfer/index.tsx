'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';

import { useSettings } from '@/components/core/hooks/useSettings';
import PageWrapper from '@/components/core/PageWrapper';
import ActionBox from '@/components/shared/ActionBox';
import Header from '@/components/shared/Header';
import { Input, InputTwo } from '@/components/core/Form';
import { Modal } from '@/components/core/Modal';
import { Button } from '@/components/core/Button';
import { classnames, createQueryParams, getLocalizedUrl, getLocalStorageItem } from '@/utils';
import Icon from '@/components/core/Icon';
import { useActiveRouteStore } from '@/store/useActiveRouteStore';
import { moneyTransferFormSchema, moneyTransferListFilterFormSchema } from '@/validation';
import { SelectBox } from '@/components/core/Form/SelectBox';
import CalenderIcon from '@/components/core/Icon/CalenderIcon';
import { _dateOptions, apiPathConfig, i18n, routeList, type Locale } from '@/config';
import { MoneyTransferRequest } from '@/server/money-transfer';

import type { DatePicker } from '@mhf/date-picker/build/date-picker';
import type { MoneyTransferItemDataType, MoneyTransferQueryParamsType, LoggedInDataType } from '@/types';
import type { InferType } from 'yup';
import { Badge, badgeStatusMap } from '@/components/core/Badge';
import { RadioGroup } from '@/components/core/Form/RadioGroup/RadioGroup';

const moneyTransferRequest = new MoneyTransferRequest({
  url: apiPathConfig.moneyTransfer.base,
});

// const transactions = () => [
//   {
//     id: 1,
//     country: 'ir',
//     phone: '09368315217',
//     status: 'success',
//     amount: '156,000',
//     date: '1404/01/18',
//     time: '12:30',
//   },
//   {
//     id: 2,
//     country: 'ir',
//     phone: '09123456789',
//     status: 'pending',
//     amount: '89,500',
//     date: '1404/01/19',
//     time: '09:45',
//   },
//   {
//     id: 3,
//     country: 'ir',
//     phone: '09221234567',
//     status: 'failed',
//     amount: '220,000',
//     date: '1404/01/20',
//     time: '15:10',
//   },
// ];

export default function MoneyTransferIndex({
  items,
  totalItems,
}: {
  items: MoneyTransferItemDataType[];
  totalItems: number;
}) {
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);
  const [isOpenSuccessfulModal, setIsOpenSuccessfulModal] = useState<boolean>(false);
  const [isOpenFailureModal, setIsOpenFailureModal] = useState<boolean>(false);
  const [openTransactions, setOpenTransactions] = useState<number[]>([]);
  const [isOpenDatepickerModal, setIsOpenDatepickerModal] = useState<boolean>(false);

  const datePickerRef = useRef<DatePicker | null>(null);
  const departureDateGregorianModeValueRef = useRef<Date | null>(null);

  const router = useRouter();

  const {
    settings: { dictionary, lang },
  } = useSettings();
  const generalDictionary = dictionary.general;

  const transferFormProps = useForm({
    resolver: yupResolver(moneyTransferFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    
  });

  const transferListFilterFormProps = useForm({
    defaultValues: {
      date: i18n.langDateFormatter[lang as Locale](_dateOptions).format(new Date()),
      search: '',
      type: '',
    },
    resolver: yupResolver(moneyTransferListFilterFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
  });

  const handleAPIRequest = useCallback(async (data: InferType<typeof moneyTransferFormSchema>) => {
    setIsOpenConfirmModal(false);

    const userData = getLocalStorageItem<LoggedInDataType | null>('userData', null);
    if (userData == null) return;

    try {
      const { mobile_or_email, amount,commission_method } = data;
      await moneyTransferRequest.requestToTransfer(
        {
          amount: +amount,
          mobile_or_email: mobile_or_email,
          commission_method: commission_method,
        },
        userData.token
      );
      
      //console.log(data)

      transferFormProps.reset({
      mobile_or_email: '',
      amount: '',
      commission_method: 'amount_with_commission',
    });


      setIsOpenSuccessfulModal(true);
    } catch (error) {
      setIsOpenFailureModal(true);
    }
  }, []);

  const toggleTransaction = (id: number) => {
    setOpenTransactions((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleFiltersReset = useCallback(() => {
    transferListFilterFormProps.reset();
    router.push(getLocalizedUrl(routeList.moneyTransfer.path, lang!));
  }, [lang]);

  const handleSubmittingFilters = useCallback(
    (data: InferType<typeof moneyTransferListFilterFormSchema>) => {
      // from-date=2025-02-21&to-date=2025-02-21

      const queryParamsRecord: Partial<MoneyTransferQueryParamsType> = { page: 1, per_page: 10 };

      if (departureDateGregorianModeValueRef.current != null) {
        queryParamsRecord['to-date'] = departureDateGregorianModeValueRef.current.toISOString().split('T')[0];
      }

      if (data.search != null && data.search !== '') {
        queryParamsRecord['search'] = data.search;
      }

      const queryParams = createQueryParams(queryParamsRecord);

      try {
        router.push(getLocalizedUrl(routeList.moneyTransfer.path + '?' + queryParams, lang!));
      } catch (error) {
        console.log(error);
      }
    },
    [lang]
  );

  const setActiveRoute = useActiveRouteStore((state) => state.setActiveRoute);

  useEffect(() => {
    setActiveRoute(routeList.moneyTransfer);

    return () => {
      setActiveRoute(null);
    };
  }, []);

  const dateInputValue =
    transferListFilterFormProps.watch('date') ??
    i18n.langDateFormatter[lang as Locale](_dateOptions).format(new Date());

  useEffect(() => {
    let picker: DatePicker | null = null;
    let handler: null | ((event: Event) => void);

    if (isOpenDatepickerModal === true) {
      import('@mhf/date-picker/build/date-picker').then(() => {
        picker = datePickerRef.current;

        if (picker != null) {
          datePickerRef.current!.activeDate = dateInputValue;

          handler = (event: Event) => {
            const customEvent = event as CustomEvent<{ rawDate: Date; calendarDate: string }>;
            departureDateGregorianModeValueRef.current = customEvent.detail.rawDate;

            transferListFilterFormProps.setValue('date', customEvent.detail.calendarDate, {
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
  }, [isOpenDatepickerModal, dateInputValue]);

  //const { amount: amountFieldErrorData, phone: phoneFieldErrorData } = transferFormProps.formState.errors;
  const { date: dateFieldErrorData, search: searchFieldErrorData } = transferListFilterFormProps.formState.errors;
  const { amount: amountFieldErrorData, mobile_or_email: phoneFieldErrorData, commission_method: commissionMethodFieldErrorData } = transferFormProps.formState.errors;

  return (
    <>
      <PageWrapper name="module-money-transfer">
        <Header
          title={generalDictionary.moneyTransfer}
          wallpaper="/assets/images/modules/money-transfer/wallpaper.jpg"
          wallpaperPosition="top center"
          overlayOpacity={0.7}
        />

        <ActionBox>
          <>
            <div className="flex flex-col gap-y-4 -mt-1">
              {/* <div className="overflow-x-auto">
                <ul
                  className="
                    flex pt-3 pb-2.5 [&__button]:bg-[#f9fafb] [&__button]:p-1.5
                    [&__button]:mx-px [&__button]:whitespace-nowrap gap-2 [&__button]:text-[var(--color-gray-700)]
                    [&__button]:text-xsm [&__button]:rounded [&__button.selected]:bg-primary [&__button.selected]:text-white select-none
                    [&__button]:flex [&__button]:items-center [&__button]:gap-1 [&__button__.flag-icon]:w-6 [&__button__span]:pt-0.5"
                >
                  <li>
                    <button className="shadow-blue selected">
                      <div className="flag-icon">
                        <img src="/assets/images/flags/af.png" alt="" />
                      </div>
                      <span>Afghanistan</span>
                    </button>
                  </li>
                  <li>
                    <button className="shadow-blue">
                      <div className="flag-icon">
                        <img src="/assets/images/flags/ir.png" alt="" />
                      </div>
                      <span>Iran</span>
                    </button>
                  </li>
                  <li>
                    <button className="shadow-blue">
                      <div className="flag-icon">
                        <img src="/assets/images/flags/tr.png" alt="" />
                      </div>
                      <span>Turkey</span>
                    </button>
                  </li>
                </ul>
              </div> */}

              <div>
                <Controller
                  name="mobile_or_email"
                  control={transferFormProps.control}
                  render={({ field }) => (
                    <Input
                      ltr
                      id="phone"
                      type="text"
                      placeholder={generalDictionary.destinationPhoneNumber}
                      className="font-semibold"
                      hasError={phoneFieldErrorData?.message != null}
                      errorMessage={generalDictionary[phoneFieldErrorData?.message as keyof typeof generalDictionary]}
                      {...field}
                    />
                  )}
                />
              </div>

              <div>
                {/* <div className="flex justify-end mb-1.5">
                  <button className="text-[var(--color-select)] text-xxs">
                    {generalDictionary.transferTotalBalance} (۱۹۴/۷۰۰/۲۵۵ افغانی)
                  </button>
                </div> */}
                <Controller
                  name="amount"
                  control={transferFormProps.control}
                  render={({ field }) => (
                    <Input
                      ltr
                      id="amount"
                      type="text"
                      placeholder={generalDictionary.transferAmount}
                      className="font-semibold"
                      suffixIcon={<Icon name="afghan-currency" className="text-gray-500" size={20} />}
                      hasError={amountFieldErrorData?.message != null}
                      errorMessage={generalDictionary[amountFieldErrorData?.message as keyof typeof generalDictionary]}
                      {...field}
                    />
                  )}
                />
                {/* Add commission method selection */}
              <div className="mt-3">
                <Controller
                  name="commission_method"
                  control={transferFormProps.control}
                  render={({ field }) => (
                    <RadioGroup
                      options={[
                        {
                          value: 'amount_with_commission',
                          label: generalDictionary.withCommission || 'With Commission',
                        },
                        {
                          value: 'amount_without_commission',
                          label: generalDictionary.withoutCommission || 'Without Commission',
                        },
                      ]}
                      value={field.value}
                      onChange={field.onChange}
                      hasError={commissionMethodFieldErrorData?.message != null}
                      errorMessage={generalDictionary[commissionMethodFieldErrorData?.message as keyof typeof generalDictionary]}
                    />
                  )}
                />
              </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                fullWidth
                variant="contained"
                color="success"
                size="medium"
                type="submit"
                disabled={transferFormProps.formState.isValid === false}
                onClick={() => setIsOpenConfirmModal(true)}
              >
                {generalDictionary.sendToDestination}
              </Button>
            </div>
          </>
        </ActionBox>

        <div className="mt-6">
          <div className="container-fluid">
            <div className="bg-[var(--color-quaternary)] rounded-2xl py-6 px-5 shadow-quaternary">
              <div className="flex items-center gap-2">
                <div className="heading-symbol"></div>
                {generalDictionary.transfersHistory}
              </div>

              <div className="mt-6">
                <>
                  <div className="flex flex-col gap-y-3">
                    <Controller
                      name="type"
                      control={transferListFilterFormProps.control}
                      render={({ field }) => (
                        <SelectBox
                          id="type"
                          options={[{ label: generalDictionary.pending, value: 'pending' }]}
                          placeholder={generalDictionary.transactionType}
                          className="font-semibold"
                          // hasError={transferListFilterFormProps.formState.errors.amount != null}
                          // errorMessage={generalDictionary[transferListFilterFormProps.formState.errors['amount']?.message as keyof typeof generalDictionary]}
                          {...field}
                          value={{ label: generalDictionary.pending, value: 'pending' }}
                        />
                      )}
                    />
                    <Controller
                      name="date"
                      control={transferListFilterFormProps.control}
                      render={({ field }) => (
                        <InputTwo
                          type="text"
                          id="date"
                          placeholder={generalDictionary.select}
                          className="font-semibold"
                          label={generalDictionary.transferDate}
                          hasError={dateFieldErrorData?.message != null}
                          errorMessage={
                            generalDictionary[dateFieldErrorData?.message as keyof typeof generalDictionary]
                          }
                          {...field}
                          suffixIcon={<CalenderIcon width="24" className="text-primary cursor-pointer" />}
                          onClick={() => {
                            setIsOpenDatepickerModal(true);
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="search"
                      control={transferListFilterFormProps.control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          id="search"
                          placeholder={generalDictionary.search}
                          hasError={searchFieldErrorData?.message != null}
                          errorMessage={
                            generalDictionary[searchFieldErrorData?.message as keyof typeof generalDictionary]
                          }
                          {...field}
                          value={field.value ?? ''}
                          prefixIcon={<Icon name="search" className="text-gray-500" size={18} />}
                          className="font-semibold"
                        />
                      )}
                    />
                  </div>
                  <div className="mt-6 flex gap-3">
                    <div className="w-1/3">
                      <Button
                        onClick={handleFiltersReset}
                        size="xs"
                        variant="outlined"
                        color="danger"
                        className="w-full shadow-violet"
                      >
                        {generalDictionary.clearFilters}
                      </Button>
                    </div>
                    <div className="w-2/3">
                      <Button
                        size="xs"
                        color="primary"
                        className="w-full border border-gray-300"
                        disabled={transferListFilterFormProps.formState.isDirty === false}
                        onClick={transferListFilterFormProps.handleSubmit(handleSubmittingFilters)}
                      >
                        {generalDictionary.performFilters}
                      </Button>
                    </div>
                  </div>
                </>
              </div>

              <div className="w-full h-px bg-white my-6"></div>

              {items.length > 0 ? (
                <div className="flex flex-col gap-y-3">
                  {items.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={classnames(
                          'transaction-item bg-white py-1 px-3 rounded-md [&.transaction-item--open__.button-close]:hidden [&.transaction-item--open__.transaction-content]:max-h-96 [&.transaction-item--open__.transaction-content]:opacity-100 [&.transaction-item--open__.transaction-content]:mt-4',
                          {
                            'transaction-item--open': openTransactions.includes(item.id),
                          }
                        )}
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center flex-wrap gap-3">
                            {/* <div className="w-10 h-10">
                              <img src={`/assets/images/flags/${item.country}.png`} alt="" />
                            </div> */}
                            <div>
                              {/* <div className="uppercase text-gray-800 rtl:font-secondary">{item.country}</div> */}
                              <div className="text-gray-600 text-xsm">{item.mobile_or_email}</div>
                            </div>
                          </div>
                          <div className="button-close">
                            <button
                              onClick={() => toggleTransaction(item.id)}
                              className="flex items-center gap-x-1 text-link ml-1 mt-1"
                            >
                              <span className="text-xs font-semibold">اطلاعات بیشتر</span>
                              <Icon name="arrow-bottom" size={17} />
                            </button>
                          </div>
                        </div>

                        <div className="transaction-content overflow-hidden transition-all duration-300 max-h-0 opacity-0">
                          <ul className="flex flex-col gap-y-1.5">
                            {item.status && (
                              <li className="flex justify-between items-center text-xxs">
                                <div className="text-gray-500">وضعیت انتقال:</div>
                                <div>
                                  {
                                    // TODO: fix status type
                                  }
                                  <Badge status={item.status as keyof typeof badgeStatusMap} />
                                </div>
                              </li>
                            )}
                            {item.amount && (
                              <li className="flex justify-between items-center text-xxs">
                                <div className="text-gray-500">مقدار:</div>
                                <div className="text-gray-800 font-semibold">{item.amount}</div>
                              </li>
                            )}
                            {item.created_at && (
                              <li className="flex justify-between items-center text-xxs">
                                <div className="text-gray-500">تاریخ:</div>
                                <div className="text-gray-800 font-semibold">{item.created_at}</div>
                              </li>
                            )}
                            {/* {item.time && (
                              <li className="flex justify-between items-center text-xxs">
                                <div className="text-gray-500">ساعت:</div>
                                <div className="text-gray-800 font-semibold">{item.time}</div>
                              </li>
                            )} */}
                          </ul>

                          <div className="flex justify-center pb-3">
                            <button
                              onClick={() => toggleTransaction(item.id)}
                              className="flex items-center gap-x-1 text-link ml-1 mt-1"
                            >
                              <span className="text-xs font-semibold">بستن اطلاعات</span>
                              <Icon name="arrow-bottom" className="rotate-180" size={17} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="w-full h-px bg-white my-6"></div>

                  <div className="flex flex-col gap-y-2.5 items-center">
                    <div className="text-gray-800 text-xs">
                      {generalDictionary.creditTransferPaginationLabel
                        .replace('{{currentCount}}', '5')
                        .replace('{{totalCount}}', totalItems + '')}
                    </div>
                    <div className="flex items-center gap-6 text-primary [&__button[disabled]]:opacity-30">
                      <button>
                        <Icon name="arrow-right-bold" size={24} />
                      </button>
                      <button disabled>
                        <Icon name="arrow-right-bold" className="rotate-180" size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xsm text-gray-600 -mt-1">{generalDictionary.noTransactionsFound}</div>
              )}
            </div>
          </div>
        </div>
      </PageWrapper>

      <Modal
        isOpen={isOpenConfirmModal}
        onClose={() => setIsOpenConfirmModal(false)}
        autoClose={false}
        footer={
          <div className="p-5 flex gap-3 border-t">
            <div className="w-1/3">
              <Button
                size="xs"
                variant="outlined"
                color="white"
                className="w-full border border-gray-300"
                onClick={() => setIsOpenConfirmModal(false)}
              >
                {generalDictionary.cancel}
              </Button>
            </div>
            <div className="w-2/3">
              <Button
                size="xs"
                color="success"
                className="w-full"
                onClick={transferFormProps.handleSubmit(handleAPIRequest)}
              >
                {generalDictionary.yes}
              </Button>
            </div>
          </div>
        }
      >
        <div className="px-5 py-6 text-sm text-center">
          <p>{generalDictionary.transferConfirmation}</p>
        </div>
      </Modal>

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
              <p>مبلغ مورد نظر با موفقیت منتقل شد.</p>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isOpenDatepickerModal}
        onClose={() => setIsOpenDatepickerModal(false)}
        autoClose={false}
        header={
          <div className="p-5 border-b">
            <div className="text-lg font-semibold">{generalDictionary.transferDate}</div>
          </div>
        }
      >
        {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <date-picker solar={lang === 'fa'} ref={datePickerRef}></date-picker>
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
