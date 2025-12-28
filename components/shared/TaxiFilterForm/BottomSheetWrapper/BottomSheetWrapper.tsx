import { memo, useCallback, useEffect, useState } from 'react';

import { useSettings } from '@/components/core/hooks/useSettings';
import { BottomSheet } from '@/components/core/BottomSheet';
import { Button } from '@/components/core/Button';
import Icon from '@/components/core/Icon';

import type { FC } from 'react';
import type { BottomSheetWrapperPropsType } from './type';

const BottomSheetWrapperComponent: FC<BottomSheetWrapperPropsType> = (props) => {
  const {
    isOpen,
    adultPassengerCount,
    childPassengerCount,
    onAdultPassengersChange,
    onChildPassengersChange,
    onClose,
    onApplyPassengers,
  } = props;

  const [isOpenPassengersSheet, setIsOpenPassengersSheet] = useState(isOpen ?? false);
  const [_adultPassengerCount, setAdultPassengerCount] = useState(adultPassengerCount ?? 1);
  const [_childPassengerCount, setChildPassengerCount] = useState(childPassengerCount ?? 0);

  const {
    settings: { dictionary },
  } = useSettings();
  const generalDictionary = dictionary.general;

  const _onAdultPassengersChange = useCallback(
    (isIncrement: boolean) => {
      if (isIncrement) {
        setAdultPassengerCount((prev) => prev + 1);
      } else {
        setAdultPassengerCount((prev) => (prev > 1 ? prev - 1 : prev));
      }
    },
    [setAdultPassengerCount]
  );

  const _onChildPassengersChange = useCallback(
    (isIncrement: boolean) => {
      if (isIncrement) {
        setChildPassengerCount((prev) => prev + 1);
      } else {
        setChildPassengerCount((prev) => (prev > 0 ? prev - 1 : prev));
      }
    },
    [setChildPassengerCount]
  );

  const onBottomSheetClose = useCallback((isNative: boolean) => {
    setIsOpenPassengersSheet(isNative);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    setAdultPassengerCount(adultPassengerCount);
  }, [adultPassengerCount]);

  useEffect(() => {
    setChildPassengerCount(childPassengerCount);
  }, [childPassengerCount]);

  useEffect(() => {
    setIsOpenPassengersSheet(isOpen ?? false);
  }, [isOpen]);

  useEffect(() => {
    onAdultPassengersChange(_adultPassengerCount);
  }, [_adultPassengerCount, onAdultPassengersChange]);

  useEffect(() => {
    onChildPassengersChange(_childPassengerCount);
  }, [_childPassengerCount, onChildPassengersChange]);

  return (
    <BottomSheet
      modalId="#passenger_count"
      isOpen={isOpenPassengersSheet}
      onClose={onBottomSheetClose}
      headerTitle={generalDictionary.passengersCount}
      zIndex="z-50"
      umMountOnClose
      customWidth="!max-w-[calc(var(--container-max-width)-6rem)]"
      hasHeaderBorder
      footer={
        <div className="bottom-0 right-0 w-full bg-white py-4">
          <div className="px-5">
            <Button onClick={onApplyPassengers} variant="contained" fullWidth>
              {generalDictionary.confirmPassengers}
            </Button>
          </div>
        </div>
      }
    >
      <div>
        <div className="grow flex flex-col py-4 px-5 gap-y-4 mt-2">
          <div className="flex justify-between items-center select-none">
            <div>{generalDictionary.adult}</div>
            <div className="flex gap-x-2 items-center">
              <button
                className="w-7 h-7 bg-primary text-white flex items-center justify-center rounded-lg"
                onClick={() => _onAdultPassengersChange(true)}
              >
                <Icon name="plus" size={16} />
              </button>
              <div className="min-w-6 text-lg text-center">{adultPassengerCount}</div>
              <button
                className="w-7 h-7 bg-primary text-white flex items-center justify-center rounded-lg"
                onClick={() => _onAdultPassengersChange(false)}
              >
                <Icon name="minus" size={16} />
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center select-none">
            <div>{generalDictionary.child}</div>
            <div className="flex gap-x-2 items-center">
              <button
                className="w-7 h-7 bg-primary text-white flex items-center justify-center rounded-lg"
                onClick={() => _onChildPassengersChange(true)}
              >
                <Icon name="plus" size={16} />
              </button>
              <div className="min-w-6 text-lg text-center">{childPassengerCount}</div>
              <button
                className="w-7 h-7 bg-primary text-white flex items-center justify-center rounded-lg"
                onClick={() => _onChildPassengersChange(false)}
              >
                <Icon name="minus" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

export const BottomSheetWrapper = memo(BottomSheetWrapperComponent, (prevProps, nextProps) => {
  return (
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.adultPassengerCount === nextProps.adultPassengerCount &&
    prevProps.childPassengerCount === nextProps.childPassengerCount &&
    prevProps.onClose === nextProps.onClose &&
    prevProps.onAdultPassengersChange === nextProps.onAdultPassengersChange &&
    prevProps.onChildPassengersChange === nextProps.onChildPassengersChange &&
    prevProps.onApplyPassengers === nextProps.onApplyPassengers
  );
});
