import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import '@ant-design/v5-patch-for-react-19';

import PageWrapper from '@/components/core/PageWrapper';
import Header from '@/components/shared/Header';
import MobileBar from '@/components/shared/MobileBar';
import AntConfigProvider from '@/components/shared/AntConfigProvider';
import { FilterGroup, type FilterOption } from './FilterGroup';
import { useSettings } from '@/components/core/hooks/useSettings';
import BottomBar from '@/components/shared/BottomBar';
import { Button } from '@/components/core/Button';
import { routeList } from '@/config';

import { createQueryParams, getLocalizedUrl, type getDictionary } from '@/utils';
import type { TripListQueryParamsType } from '@/types';

type TripsFilterPanelPropsType = {
  vendorList: FilterOption[];
  busTypeOptions?: FilterOption[];
  onClose(): void;
};

const defaultBusTypeOptions = (dictionary: Awaited<ReturnType<typeof getDictionary>>) => [
  {
    label: dictionary.general.economic,
    value: 'economic',
  },
  {
    label: dictionary.general.business,
    value: 'business',
  },
  {
    label: dictionary.general.premium,
    value: 'premium',
  },
  {
    label: dictionary.general.vip,
    value: 'vip',
  },
];

export function TripsFilterPanel({ busTypeOptions, vendorList, onClose }: TripsFilterPanelPropsType) {
  const [_busTypeOptions, setBusTypeOptions] = useState<FilterOption[]>([]);
  

  const filtersRecordRef = useRef({
    busTypes: [] as string[],
    vendors: [] as number[],
  });

  const queryParams = useSearchParams();
  const router = useRouter();

  const {
    settings: { dictionary, lang },
  } = useSettings();
  const generalDictionary = dictionary.general;

  const handleBusTypeSelect = useCallback((option: FilterOption, selected: boolean) => {
    const busTypeId = option.value;
    const targetItemIndex = filtersRecordRef.current.busTypes.indexOf(busTypeId);

    if (targetItemIndex === -1 && selected === true) {
      filtersRecordRef.current.busTypes.push(busTypeId);
      return;
    }

    if (targetItemIndex > -1 && selected === false) {
      filtersRecordRef.current.busTypes.splice(targetItemIndex, 1);
    }
  }, []);

  const handleVendorTypeSelect = useCallback((option: FilterOption, selected: boolean) => {
    const vendorId = +option.value;
    const targetItemIndex = filtersRecordRef.current.vendors.indexOf(vendorId);

    if (targetItemIndex === -1 && selected === true) {
      filtersRecordRef.current.vendors.push(vendorId);
      return;
    }

    if (targetItemIndex > -1 && selected === false) {
      filtersRecordRef.current.vendors.splice(targetItemIndex, 1);
    }
  }, []);

  const parsedQueryParams = useMemo(() => {
    const currentQueryParams = new URLSearchParams(queryParams);

    const vendors = currentQueryParams.get('vendorsid');
    const classes = currentQueryParams.get('classes');
    filtersRecordRef.current.vendors = vendors?.split(',').map((item) => +item) ?? [];
    filtersRecordRef.current.busTypes = classes?.split(',') ?? [];

    return Object.fromEntries(currentQueryParams);
  }, [queryParams]);

  const handleFilterChange = useCallback(() => {
    // Indicate loading state
    document.body.classList.add('--loading');

    const { busTypes, vendors } = filtersRecordRef.current;
    const queryParamsRecord: Partial<TripListQueryParamsType> = { ...parsedQueryParams, page: 1, per_page: 10 };

    if (busTypes.length > 0) {
      queryParamsRecord.classes = busTypes.join(',');
    } else {
      delete queryParamsRecord.classes;
    }

    if (vendors.length > 0) {
      queryParamsRecord.vendorsid = vendors.join(',');
    } else {
      delete queryParamsRecord.vendorsid;
    }

    const _queryParams = createQueryParams(queryParamsRecord);
    router.push(getLocalizedUrl(routeList.busBooking.subPathList.results.path + '?' + _queryParams, lang!));
    onClose?.();
  }, [lang, parsedQueryParams, onClose]);

  const handleClearFilters = useCallback(() => {
    filtersRecordRef.current.busTypes = [];
    filtersRecordRef.current.vendors = [];

    const currentQueryParams = { ...parsedQueryParams };
    delete currentQueryParams.classes;
    delete currentQueryParams.vendorsid;

    const queryParamsRecord: Partial<TripListQueryParamsType> = { ...currentQueryParams, page: 1, per_page: 10 };
    const _queryParams = createQueryParams(queryParamsRecord);

    router.push(getLocalizedUrl(routeList.busBooking.subPathList.results.path + '?' + _queryParams, lang!));
    onClose?.();
  }, [parsedQueryParams]);

  useEffect(() => {
    setBusTypeOptions(busTypeOptions ?? defaultBusTypeOptions(dictionary));
  }, [busTypeOptions]);

  

  return (
    <AntConfigProvider>
      <PageWrapper
        name="module-bus-booking-filter-panel"
        className="!fixed w-full h-screen bg-white top-0 left-0 overflow-y-auto"
        customBottomSpacing="8.5rem"
        customBottomSpacingMobile="16rem"
      >
        <Header
          title={generalDictionary.filters}
          minHeight="10.5rem"
          wallpaper="/assets/images/modules/bus-booking/wallpaper.jpg"
          isHiddenMenuIcon={true}
          customBackFunc={onClose}
        />

        <div className="container-fluid">
          <div className="flex flex-col gap-y-8 [&__.filter-panel-group]:border-b [&__.filter-panel-group:last-of-type]:border-b-0 [&__.filter-panel-group]:pb-8 [&__.filter-panel-group:last-of-type]:pb-0">
            <FilterGroup
              title={generalDictionary.busClassSelection}
              options={_busTypeOptions}
              type="checkbox"
              onOptionSelect={handleBusTypeSelect}
              selectedOptions={parsedQueryParams['classes']?.split(',').map((item) => ({ label: '', value: item }))}
            />
            <FilterGroup
              title={generalDictionary.busCompanySelection}
              options={vendorList}
              type="checkbox"
              onOptionSelect={handleVendorTypeSelect}
              selectedOptions={parsedQueryParams['vendorsid']?.split(',').map((item) => ({ label: '', value: item }))}
            />
          </div>
          <div className="mt-16 flex gap-3">
            <BottomBar>
              <div className="py-5 flex gap-3">
                <Button onClick={handleFilterChange} size="xs" color="primary" className="w-full py-3 shadow-violet">
                  {dictionary.general.performFilters}
                </Button>
                {filtersRecordRef.current.vendors.length > 0 || filtersRecordRef.current.busTypes.length > 0 ? (
                  <Button
                    onClick={handleClearFilters}
                    size="xs"
                    variant="contained"
                    color="danger"
                    className="w-full py-3"
                  >
                    {dictionary.general.clearFilters}
                  </Button>
                ) : null}
              </div>
            </BottomBar>
            <MobileBar />
          </div>
        </div>
      </PageWrapper>
    </AntConfigProvider>
  );
}
