export type CitySelectionPropsType = {
  cities: { name: string; id: number }[];
  selectedCity?: { name: string; id: number };
  onCityChange(city: { name: string; id: number }): void;
  onCitySelect(city: { name: string; id: number }): void;
};
