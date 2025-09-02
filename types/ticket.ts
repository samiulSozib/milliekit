import type { TripDataType } from './booking';
import type { ProfileType } from './profile';
import type { UserBaseDataType } from './user';
import type { VendorInTripDataType } from './vendor';

const paymentStatus = ['paid', 'unpaid', 'partially_paid', 'cancelled'] as const;
export type PaymentStatusType = (typeof paymentStatus)[number];

const ticketStatus = ['booked', 'used', 'cancelled'] as const;
export type TicketStatusType = (typeof ticketStatus)[number];

export type TicketItemDataType = {
  id: number;
  trip_seat_price_id: number;
  passenger_id: number;
  price: string;
  seat_number: number;
  is_child: boolean;
  status: TicketStatusType;
  passenger: ProfileType;
};

export type TicketRegistrationDataType = {
  id: number;
  ticket_count: number;
  total_price: number;
  penalty_amount: number | null;
  remaining_amount: number;
  is_partial_payment: boolean;
  disbursement_at: string | null;
  created_at: string;
  update_at: string;
  child_count: number;
  download_tickets: string;
  status: PaymentStatusType;
  user: UserBaseDataType;
  vendor: VendorInTripDataType | null;
  agent: VendorInTripDataType | null;
  tickets: TicketItemDataType[];
  trip: TripDataType & {
    bus: {
      id: number;
      vendor_id: number;
      driver_id: number;
      name: string;
      bus_number: string;
    };
  };
};
