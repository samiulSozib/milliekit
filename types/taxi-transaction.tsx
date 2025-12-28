export type TaxiTransactionQueryParamsType = {
  'from-date': string;
  'to-date': string;
  per_page: number;
  page: number;
};

export type TaxiTransactionItemDataType = {
  id: number;
  order_id: string;
  ticket_number: string;
  origin: string;
  destination: string;
  booking_datetime: string;
  departure_datetime: string;
  passengers: {
    adult: number;
    child: number;
  };
  paid_amount: string;
  currency: string;
  status: 'issued_ticket' | 'pending' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
};