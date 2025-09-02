import type { RouteDataType } from './booking';
import type { BusDetailsType } from './bus';
import type { VendorInTripDataType } from './vendor';

const tripStatus = ['active', 'inactive'] as const;
export type TripStatusType = typeof tripStatus[number];

export type SeatPriceItemDataType = {
  id: number;
  trip_id: number;
  seat_number: number;
  ticket_price: string;
  payble_price: number;
  total_discount_amount: string;
  discount_amount: string;
  discount_type: 'fixed' | 'percentage';
  sale_start_date: string | null;
  sale_end_date: string | null;
  is_avaiable: boolean;
}

export type TripItemDataType = {
  id: number;
  total_seats: number;
  available_seats: number;
  ticket_price: string;
  allow_partial_payment: number;
  min_partial_payment: string;
  partial_payment_type: string;
  departure_time: string;
  arrival_time: string;
  booking_deadline: string;
  status: TripStatusType;
  vendor: VendorInTripDataType;
  bus: BusDetailsType;
  route: RouteDataType;
  seat_prices: SeatPriceItemDataType[];
};

export type TripListQueryParamsType = {
  'route-id'?: string | null | undefined;
  'origin-city-id': string;
  'destination-city-id': string;
  'passenger-count': string;
  'departure-time': string;
  classes: string,
  vendorsid: string;
  search: string;
  per_page: number;
  page: number;
};

export type SortType = 'cheapest' | 'expensive' | 'earliest' | 'latest' | 'min-partial-payment' | 'max-partial-payment';

export type TripDetailsResponseType = {
  item: TripItemDataType;
};