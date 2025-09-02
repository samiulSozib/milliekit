import { memo, useEffect, useState } from 'react';

import Icon from '@/components/core/Icon';
import { Input } from '@/components/core/Form';
import { useSettings } from '@/components/core/hooks/useSettings';

import type { FC } from 'react';
import type { CitySelectionPropsType } from './type';

const CitySelectionComponent: FC<CitySelectionPropsType> = (props) => {
  const { cities, selectedCity, onCityChange, onCitySelect } = props;

  const [originalCities, setOriginalCities] = useState<typeof cities>(cities);
  const [_selectedCity, setSelectedCity] = useState<{ name: string; id: number } | undefined>(selectedCity);

  const [filteredDestinationCities, setFilteredDestinationCities] = useState<typeof cities>(cities ?? []);

  const {
    settings: { dictionary },
  } = useSettings();
  const generalDictionary = dictionary.general;

  const onItemSelect = (city: { name: string; id: number }) => {
    onCitySelect(city);
    onCityChange(city);
  };

  useEffect(() => {
    setOriginalCities(cities);
    setFilteredDestinationCities(cities);
  }, [cities]);

  useEffect(() => {
    if (selectedCity != null) {
      setSelectedCity(selectedCity);
    }
  }, [selectedCity]);

  return (
    <div className="pb-5 px-5">
      <div className="mt-4">
        <Input
          type="text"
          name="filter_destination_cities"
          id="filter_destination_cities"
          placeholder={generalDictionary.searchCity}
          prefixIcon={<Icon name="location" size={24} className="text-gray-600" />}
          className="[&__input]:shadow-none [&__input]:border [&__input]:border-gray-400"
          onChange={(event) => {
            if (event.target.value === '') {
              setFilteredDestinationCities(originalCities);
              return;
            }

            setFilteredDestinationCities(
              originalCities.filter((city) => city.name.toLowerCase().includes(event.target.value.toLowerCase()))
            );
          }}
        />
      </div>
      <div>
        {filteredDestinationCities.length ? (
          <div className="flex flex-col">
            {filteredDestinationCities.map((city) => (
              <button
                onClick={() => onItemSelect(city)}
                key={`city-${city.id}`}
                className="flex items-center gap-x-2 border-b pt-4 pb-3.5"
              >
                <Icon name="location" size={24} className="text-gray-600" />
                <span className="text-gray-900">{city.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-4">{generalDictionary.noCitiesFound}</div>
        )}
      </div>
    </div>
  );
};

export const CitySelection = memo(CitySelectionComponent, (prevProps, nextProps) => {
  return (
    prevProps.cities === nextProps.cities &&
    prevProps.selectedCity === nextProps.selectedCity &&
    prevProps.onCityChange === nextProps.onCityChange &&
    prevProps.onCitySelect === nextProps.onCitySelect
  );
});
