import { TripStatusType } from "./trip";

export type BustDataType = {
  id: number;
  vendor_id: number;
  driver_id: number;
  name: string;
  bus_number: number;
};

export type DriverDataType = {
  id: number;
  user_id: number;
  vendor_id: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export type SeatItemDataType = {
  row: number;
  price: number;
  column: number;
  seat_type: string;
  is_sleeper: 0 | 1;
  seat_class: string;
  is_recliner: 0| 1;
  seat_number: number;
};

export type SeatInBusDataType = {
  id: number;
  bus_id: number;
  rows: number;
  columns: number;
  seats: SeatItemDataType[];
}

export type BusDetailsType = {
  id: number;
  vendor_id: number;
  driver_id: number;
  name: string;
  bus_number: string;
  image: string;
  facilities: string;
  rating: string;
  ticket_price: string;
  status: TripStatusType;
  created_at: string;
  updated_at: string;
  berth_type?: string;
  seats?: SeatInBusDataType
  driver?: DriverDataType;
};