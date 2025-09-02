export type CityItemDataType = {
  id: number;
  name: string;
  code: string;
};

export type CitiesListResponse = {
  items: CityItemDataType[];
};
