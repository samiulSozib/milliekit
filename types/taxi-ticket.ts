import type { TripDataType } from './booking';
import type { ProfileType } from './profile';
import type { UserBaseDataType } from './user';
import type { VendorInTripDataType } from './vendor';


export const bookingStatus = ['booked', 'cancelled', 'completed'] as const;
export type BookingStatusType = (typeof bookingStatus)[number];

export const paymentStatus = ['paid', 'unpaid', 'partially_paid'] as const;
export type PaymentStatusType = (typeof paymentStatus)[number];

export type PassengerCountType = {
  adult: number;
  child: number;
};

export type LocationType = {
  city: string;
  time: string; // e.g. "02:00"
};

export type TaxiTicketRegistrationDataType = {
  id: number;
  booking_number: string; // e.g. "#145216"
  logo?:string;
  car_model: string; // e.g. "Toyota Corolla"
  passengers: PassengerCountType; // { adult: 2, child: 1 }
  from: LocationType; // { city: "Taloqan", time: "02:00" }
  to: LocationType; // { city: "Kunduz", time: "23:00" }
  travel_date: string; // e.g. "2025-11-02"
  price: number; // e.g. 1000
  currency: string; // e.g. "AFN"
  payment_status: PaymentStatusType;
  booking_status: BookingStatusType;
  created_at: string;
  updated_at: string;
};
