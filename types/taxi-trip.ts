export type TaxiTripStatusType = 'active' | 'inactive';

export type TaxiModelType = {
  id: number;
  name: string;
  capacity: number;
  image?: string;
};

export type DriverType = {
  id: number;
  name: string;
  rating?: number;
  phone_number?: string;
};

export type StationType = {
  id: number;
  name: string;
  address?: string;
  city: string;
};

export type TaxiTripItemDataType = {
  id: number;
  departure_time: string;
  arrival_time: string;
  duration: string; // e.g., "5 h 30 m"
  available_seats: number;
  total_seats: number;
  ticket_price: string; // e.g., "550 AFN"
  taxi_model: TaxiModelType;
  driver: DriverType;
  boarding_location: StationType;
  drop_off_location: StationType;
  route: {
    origin: string;
    destination: string;
    via_cities?: string[]; // e.g., ["mazarsharif"]
  };
  refund_policy: string;
  taxi_information: string;
  status: TaxiTripStatusType;
  is_fastest?: boolean;
};

export type TaxiTripListQueryParamsType = {
  'origin-city': string;
  'destination-city': string;
  'passenger-count': string;
  'departure-date': string;
  'taxi-model'?: string;
  'max-price'?: string;
  'min-seats'?: string;
  sort?: TaxiTripSortType;
  per_page: number;
  page: number;
};

export type TaxiTripSortType = 'cheapest' | 'expensive' | 'earliest' | 'latest' | 'fastest';

export type TaxiTripDetailsResponseType = {
  item: TaxiTripItemDataType;
  available_trips: TaxiTripItemDataType[];
};

export type TaxiTripBookingType = {
  trip_id: number;
  adult_count: number;
  child_count: number;
  total_price: string;
  account_balance: string;
  selected_seats?: number[];
};