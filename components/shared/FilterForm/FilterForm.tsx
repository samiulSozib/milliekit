import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

import { InputTwo, LocationInput } from '@/components/core/Form';
import { Button } from '@/components/core/Button';
import { Modal } from '@/components/core/Modal';
import { CitySelection } from './CitySelection';
import { BottomSheetWrapper } from './BottomSheetWrapper';
import CalenderIcon from '@/components/core/Icon/CalenderIcon';
import SwitchIcon from '@/components/core/Icon/SwitchIcon';
import Icon from '@/components/core/Icon';

import { useSettings } from '@/components/core/hooks/useSettings';
import { filterFormSchema } from '@/validation';
import { _dateOptions, i18n, type Locale } from '@/config';
import { locationRequest } from '@/server/location';

import type { FC } from 'react';
import type { InferType } from 'yup';
import type { CityItemDataType } from '@/types';
import type { DatePicker } from '@mhf/date-picker/build/date-picker';
import type { FilterFormPropsType } from './type';

const FilterFormComponent: FC<FilterFormPropsType> = (props) => {
  const { onSubmit } = props;

  const [searchingBus, setSearchingBus] = useState<boolean>(false);
  const [isOpenOriginModal, setIsOpenOriginModal] = useState<boolean>(false);
  const [isOpenPassengersSheet, setIsOpenPassengersSheet] = useState<boolean>(false);
  const [isOpenDatepickerModal, setIsOpenDatepickerModal] = useState<boolean>(false);
  const [isOpenDestinationModal, setIsOpenDestinationModal] = useState<boolean>(false);
  const [selectedOrigin, setSelectedOrigin] = useState<Partial<CityItemDataType>>({});
  const [selectedDestination, setSelectedDestination] = useState<Partial<CityItemDataType>>({});
  const [allCitiesList, setAllCitiesList] = useState<CityItemDataType[]>([]);
  const [adultPassengerCount, setAdultPassengerCount] = useState(1);
  const [childPassengerCount, setChildPassengerCount] = useState(0);

  const selectedCitiesRef = useRef<
    Partial<{
      origin: { id: number; name: string };
      destination: { id: number; name: string };
    }>
  >({});

  const datePickerRef = useRef<DatePicker | null>(null);
  const departureDateGregorianModeValueRef = useRef<Date | null>(null);

  const filterFormProps = useForm({
    resolver: yupResolver(filterFormSchema),
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
    setIsOpenOriginModal(true);
  }, []);

  const handleBackDatepickerModal = useCallback(() => {
    setIsOpenDatepickerModal(false);
    setIsOpenPassengersSheet(true);
  }, []);

  const handleSelectOrigin = useCallback((selected: CityItemDataType) => {
    setSelectedOrigin(selected);

    filterFormProps.setValue('origin-city-id', selected.id + '', {
      shouldValidate: true,
      shouldDirty: true,
    });

    setIsOpenOriginModal(false);
    setIsOpenDestinationModal(true);
  }, []);

  const handleSelectDestination = useCallback((selected: CityItemDataType) => {
    setSelectedDestination(selected);

    filterFormProps.setValue('destination-city-id', selected.id + '', {
      shouldValidate: true,
      shouldDirty: true,
    });

    setIsOpenDestinationModal(false);
    setIsOpenPassengersSheet(true);
  }, []);

  const handleApplyPassengers = useCallback(() => {
    setIsOpenPassengersSheet(false);
    setIsOpenDatepickerModal(true);
  }, []);

  const handleChangeAdultPassengers = useCallback(
    (count: number) => {
      setAdultPassengerCount(count);

      filterFormProps.setValue('passenger-count', `${count + childPassengerCount} ${generalDictionary.passenger}`, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [childPassengerCount]
  );

  const handleChangeChildPassengers = useCallback(
    (count: number) => {
      setChildPassengerCount(count);

      filterFormProps.setValue('passenger-count', `${adultPassengerCount + count} ${generalDictionary.passenger}`, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [adultPassengerCount]
  );

  const handleSearch = useCallback(
    (data: InferType<typeof filterFormSchema>) => {
      setSearchingBus(true);

      if (departureDateGregorianModeValueRef.current != null) {
        data['departure-time'] = i18n.langDateFormatter['en'](_dateOptions).format(
          departureDateGregorianModeValueRef.current
        );
      } else {
        data['departure-time'] = i18n.langDateFormatter['en'](_dateOptions).format(new Date());
      }

      data['passenger-count'] = adultPassengerCount + childPassengerCount + '';

      onSubmit(data);
    },
    [onSubmit, lang, adultPassengerCount, childPassengerCount]
  );

  const departureDateInputValue =
    filterFormProps.watch('departure-time') ?? i18n.langDateFormatter[lang as Locale](_dateOptions).format(new Date());

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
            console.log(event)

            filterFormProps.setValue('departure-time', customEvent.detail.calendarDate, {
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

  const onSwapCitiesButtonClick = useCallback(() => {
    setSelectedOrigin(selectedDestination);
    setSelectedDestination(selectedOrigin);
  }, [selectedOrigin, selectedDestination]);

  useEffect(() => {
    locationRequest
      .getCitiesList('af') // TODO: Dynamic country code
      .then((response) => {
        const citiesList = response.items;

        setAllCitiesList(citiesList);
      })
      .catch((error) => {
        console.error('Error fetching cities:', error);
      });

    filterFormProps.setValue('departure-time', departureDateInputValue, {
      shouldValidate: true,
      shouldDirty: true,
    });

    filterFormProps.setValue(
      'passenger-count',
      adultPassengerCount + childPassengerCount + ` ${generalDictionary.passenger}`,
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 relative">
          <Controller
            name="origin-city-id"
            control={filterFormProps.control}
            render={({ field }) => (
              <LocationInput
                id="origin"
                title={generalDictionary.origin}
                label={generalDictionary.exit}
                placeholder={generalDictionary.select}
                onClick={() => setIsOpenOriginModal(true)}
                hasError={filterFormProps.formState.errors['origin-city-id'] != null}
                errorMessage={
                  dictionary.general[
                    filterFormProps.formState.errors['origin-city-id']?.message as keyof typeof dictionary.general
                  ]
                }
                {...field}
                value={selectedOrigin.name}
              />
            )}
          />
          <Controller
            name="destination-city-id"
            control={filterFormProps.control}
            render={({ field }) => (
              <LocationInput
                id="destination"
                title={generalDictionary.destination}
                label={generalDictionary.enter}
                placeholder={generalDictionary.select}
                onClick={() => setIsOpenDestinationModal(true)}
                hasError={filterFormProps.formState.errors['destination-city-id'] != null}
                errorMessage={
                  dictionary.general[
                    filterFormProps.formState.errors['destination-city-id']?.message as keyof typeof dictionary.general
                  ]
                }
                {...field}
                value={selectedDestination.name}
              />
            )}
          />
          <button
            onClick={onSwapCitiesButtonClick}
            className="absolute top-1/2 -translate-y-1/2 left-3 ltr:left-auto ltr:right-3 border border-[--color-gray-400] w-[35px] h-[35px] bg-white rounded-md text-primary flex justify-center items-center"
          >
            <SwitchIcon width="18" />
          </button>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <Controller
              name="passenger-count"
              control={filterFormProps.control}
              render={({ field }) => (
                <InputTwo
                  type="text"
                  id="passenger-count"
                  placeholder={generalDictionary.select}
                  className="font-semibold"
                  label={generalDictionary.numberPassengers}
                  onClick={() => setIsOpenPassengersSheet(true)}
                  hasError={filterFormProps.formState.errors['passenger-count'] != null}
                  errorMessage={
                    dictionary.general[
                      filterFormProps.formState.errors['passenger-count']?.message as keyof typeof dictionary.general
                    ]
                  }
                  {...field}
                />
              )}
            />
          </div>
          <div className="w-1/2">
            <Controller
              name="departure-time"
              control={filterFormProps.control}
              render={({ field }) => (
                <InputTwo
                  type="text"
                  id="departure-time"
                  placeholder={generalDictionary.select}
                  className="font-semibold"
                  label={generalDictionary.moveDate}
                  hasError={filterFormProps.formState.errors['departure-time'] != null}
                  errorMessage={
                    dictionary.general[
                      filterFormProps.formState.errors['departure-time']?.message as keyof typeof dictionary.general
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
          </div>
        </div>
        <div>
          <Button
            fullWidth
            loading={searchingBus}
            onClick={filterFormProps.handleSubmit(handleSearch)}
            variant="contained"
            color="primary"
            size="medium"
            type="submit"
          >
            {generalDictionary.searchBus}
          </Button>
        </div>
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

      <BottomSheetWrapper
        isOpen={isOpenPassengersSheet}
        adultPassengerCount={adultPassengerCount}
        childPassengerCount={childPassengerCount}
        onClose={() => setIsOpenPassengersSheet(false)}
        onAdultPassengersChange={handleChangeAdultPassengers}
        onChildPassengersChange={handleChangeChildPassengers}
        onApplyPassengers={handleApplyPassengers}
      />
    </>
  );
};

export const FilterForm = memo(FilterFormComponent, (prevProps, nextProps) => {
  return prevProps.onSubmit === nextProps.onSubmit;
});
