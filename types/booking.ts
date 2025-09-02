import type { GenderType, ProfileDataType } from './user';
import type { VendorInTripDataType } from './vendor';

const bookingStatusList = ['pending', 'paid', 'partial_paid', 'cancelled'] as const;
export type BookingStatusType = (typeof bookingStatusList)[number];

export type BookingListQueryParamsType = {
  'trip-id': number;
  'from-date': string;
  'to-date': string;
  status: BookingStatusType;
  per_page: number;
  page: number;
};

export type TicketDataType = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  national_id: string;
  birthday: string;
  gender: GenderType;
  trip_seat_price_id: number;
};

export type BookDataToSaveType = {
  trip_id: number;
  is_partial_payment: 0 | 1;
  amount: number;
  tickets: TicketDataType[];
};

export type AgentDataType = {
  id: number;
  code: string | null;
  name: string | null;
  phone: string | null;
  comission_amount: string;
  comission_type: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type LocationDataType = {
  id: number;
  name: string;
  code: string;
};

export type OriginLocationDataType = {
  id: number;
  name: string;
  code: string;
  sort: number;
  country: LocationDataType;
  province: LocationDataType;
};

export type StationDataType = {
  id: number;
  name: string;
};

export type RouteDataType = {
  id: number;
  name: string;
  distance: number;
  origin_city: OriginLocationDataType;
  destination_city: OriginLocationDataType;
  origin_station: StationDataType;
  destination_station: StationDataType;
};

export type TripDataType = {
  id: number;
  route: RouteDataType;
  departure_time: string;
  arrival_time: string;
};

export type BookItemDataType = {
  id: number;
  ticket_count: number | null;
  total_price: string;
  penalty_amount: string;
  remaining_amount: string;
  is_partial_payment: boolean;
  disbursement_at: string | null;
  created_at: string;
  update_at: string;
  status: BookingStatusType;
  user: ProfileDataType;
  vendor: VendorInTripDataType;
  agent: AgentDataType;
  trip: TripDataType;
};

export type TicketCancellationDataType = {
  total_price: number;
  penalty_percantage: number;
  penalty_amount: number;
  refund_amount: number;
};
