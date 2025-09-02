'use client';

import { useEffect, useState } from 'react';
import { useSettings } from '@/components/core/hooks/useSettings';
import PageWrapper from '@/components/core/PageWrapper';
import ActionBox from '@/components/shared/ActionBox';
import Header from '@/components/shared/Header';
import { FormProvider, useForm } from 'react-hook-form';
import { Input } from '@/components/core/Form';
import { Modal } from '@/components/core/Modal';
import { Button } from '@/components/core/Button';
import { getDictionary } from '@/utils';
import { useActiveRouteStore } from '@/store/useActiveRouteStore';
import { routeList } from '@/config';

const packageTimes = (dictionary: Awaited<ReturnType<typeof getDictionary>>) => [
  {
    title: dictionary.general.unlimited,
  },
  {
    title: dictionary.general.oneDay,
  },
  {
    title: dictionary.general.oneWeek,
  },
  {
    title: dictionary.general.oneMonth,
  },
  {
    title: dictionary.general.twoMonths,
  },
  {
    title: dictionary.general.threeMonths,
  },
  {
    title: dictionary.general.sixMonths,
  },
  {
    title: dictionary.general.oneYear,
  },
];

export default function TopUpIndex() {
  const methods = useForm();
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);
  const [isOpenSuccessfulModal, setIsOpenSuccessfulModal] = useState<boolean>(false);
  const [isOpenFailureModal, setIsOpenFailureModal] = useState<boolean>(false);

  const {
    settings: { dictionary },
  } = useSettings();
  const generalDictionary = dictionary.general;

  const handleAPIRequest = () => {
    setIsOpenConfirmModal(false);
    setIsOpenSuccessfulModal(true);
    // setIsOpenFailureModal(true);
  };

  const setActiveRoute = useActiveRouteStore((state) => state.setActiveRoute);

  useEffect(() => {
    setActiveRoute(routeList.topUp);

    return () => {
      setActiveRoute(null);
    };
  }, []);

  const PackageItem = () => {
    return (
      <button onClick={() => setIsOpenConfirmModal(true)} className="bg-white rounded-lg py-2 px-3 text-xs select-none">
        <div className="flex items-center gap-x-1.5">
          <div className="w-10 h-10">
            <img src="/assets/images/third-party/irancell.png" alt="" />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="flex justify-between">
              <div className="text-[var(--color-gray-800)] direction-ltr font-secondary text-xsm">1GB</div>
              <div className="text-[var(--color-link)]">{generalDictionary.oneDay}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-[var(--color-gray-500)]">{generalDictionary.sale}:</div>
              <div className="text-[var(--color-gray-600)]">200/000 {generalDictionary.rial}</div>
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <>
      <PageWrapper name="module-top-up">
        <Header title={generalDictionary.internetPackage} overlayOpacity={0.01} />
        <ActionBox>
          <div>
            <div>
              <FormProvider {...methods}>
                <Input
                  type="number"
                  name="phone"
                  id="phone"
                  placeholder={generalDictionary.phoneNumber}
                  className="font-semibold"
                  ltr={true}
                />
              </FormProvider>
            </div>
            <div className="flex items-center justify-center flex-wrap gap-3 mt-6 select-none">
              <button>
                <img className="!w-[4.5rem]" src="/assets/images/third-party/irancell.png" alt="" />
              </button>
              <button className="opacity-30">
                <img className="!w-[4.5rem]" src="/assets/images/third-party/mci.png" alt="" />
              </button>
              <button className="opacity-30">
                <img className="!w-[4.5rem]" src="/assets/images/third-party/rightel.png" alt="" />
              </button>
            </div>
            <div className="overflow-x-auto mt-4 -mb-1">
              <ul className="flex py-3 [&__button]:bg-[#f9fafb] [&__button]:py-2 [&__button]:px-2 [&__button]:mx-px [&__button]:whitespace-nowrap gap-1.5 [&__button]:text-[var(--color-gray-600)] [&__button]:text-xs [&__button]:rounded [&__button.selected]:bg-primary [&__button.selected]:text-white">
                <li>
                  <button className="selected shadow-blue">{generalDictionary.all}</button>
                </li>
                {packageTimes(dictionary).map((item, index) => (
                  <li key={index}>
                    <button className="shadow-blue">{item.title}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ActionBox>

        <div className="mt-6">
          <div className="container-fluid">
            <div className="flex flex-col gap-y-3 bg-[var(--color-quaternary)] rounded-2xl overflow-hidden p-4">
              {PackageItem()}
              {PackageItem()}
              {PackageItem()}
              {PackageItem()}
              {PackageItem()}
            </div>
          </div>
        </div>
      </PageWrapper>

      <Modal
        isOpen={isOpenConfirmModal}
        onClose={() => setIsOpenConfirmModal(false)}
        autoClose={false}
        footer={
          <div className="px-5 pb-6 pt-1 flex gap-3">
            <div className="w-2/3">
              <Button size="xs" color="success" className="w-full" onClick={handleAPIRequest}>
                {generalDictionary.confirm}
              </Button>
            </div>
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
          </div>
        }
      >
        <div className="px-5 py-6 text-xs">
          <div className="flex items-center gap-x-2">
            <div className="w-10 h-10">
              <img src="/assets/images/third-party/irancell.png" alt="" />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex justify-between">
                <div className="text-[var(--color-gray-800)] direction-ltr font-secondary text-sm">1GB</div>
                <div className="text-[var(--color-link)]">{generalDictionary.oneDay}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[var(--color-gray-500)]">{generalDictionary.buy}:</div>
                <div className="text-[var(--color-gray-800)]">100/000 {generalDictionary.rial}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[var(--color-gray-500)]">{generalDictionary.sale}:</div>
                <div className="text-[var(--color-gray-800)]">200/000 {generalDictionary.rial}</div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <textarea
              className="w-full text-[var(--color-gray-600)] shadow-gray-5 mt-6 bg-[#f9fafb] py-2 px-3 text-xs rounded-md min-h-[5rem] outline-primary transition"
              placeholder={dictionary.placeholders.packageDescription}
            ></textarea>
          </div>
          <div className="flex justify-between mt-2.5">
            <div className="text-[var(--color-gray-600)]">{generalDictionary.phoneNumber}</div>
            <div className="text-[var(--color-gray-800)] text-md">09365422563</div>
          </div>
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
              <p>{dictionary.messages.packageReservationSuccessful}</p>
            </div>
          </div>
        </div>
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
              <p>خطای شبکه</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
