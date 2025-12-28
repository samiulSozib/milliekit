import { cookies } from 'next/headers';

import BusBookingIndex from '@/components/pages/Modules/BusBooking';
import { _dateOptions, apiPathConfig, i18n } from '@/config';
import { CustomerRequest } from '@/server/customer';

import type { TicketRegistrationDataType } from '@/types';
import TaxiBookingIndex from '@/components/pages/Modules/TaxiBooking';
import { TaxiTicketRegistrationDataType } from '@/types/taxi-ticket';

const customerRequest = new CustomerRequest({
  url: apiPathConfig.bookings.base,
});

export default async function Page() {
  const cookieStore = await cookies();
  const tokenInCookie = cookieStore.get('token')?.value ?? '';

  let items: TicketRegistrationDataType[] = [];
  try {
    customerRequest.options.url = apiPathConfig.bookings.base;
    customerRequest.options.token = tokenInCookie;

    const response = await customerRequest.getListOfBookings({
      'to-date': i18n.langDateFormatter['en'](_dateOptions).format(new Date()),
      page: 1,
      per_page: 10,
    });

    items = response.items;
  } catch (error) {
    console.error('Error fetching trip data:', error);
    // Handle the error as needed, e.g., show an error message to the user
  }

const bookings: TaxiTicketRegistrationDataType[] = [
  {
    id: 145216,
    booking_number: "#145216",
    car_model: "Toyota Corolla",
    passengers: { adult: 2, child: 1 },
    price: 1000,
    currency: "AFN",
    from: { city: "Taloqan", time: "02:00" },
    to: { city: "Kunduz", time: "23:00" },
    travel_date: "2025-11-02",
    payment_status: "paid",
    booking_status: "booked",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 145217,
    booking_number: "#145217",
    car_model: "Honda Civic",
    passengers: { adult: 1, child: 0 },
    price: 750,
    currency: "AFN",
    from: { city: "Kabul", time: "07:00" },
    to: { city: "Mazar-i-Sharif", time: "14:00" },
    travel_date: "2025-11-03",
    payment_status: "paid",
    booking_status: "booked",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 145218,
    booking_number: "#145218",
    car_model: "Toyota Hiace",
    passengers: { adult: 4, child: 2 },
    price: 2000,
    currency: "AFN",
    from: { city: "Kandahar", time: "06:30" },
    to: { city: "Herat", time: "18:45" },
    travel_date: "2025-11-04",
    payment_status: "unpaid",
    booking_status: "completed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 145219,
    booking_number: "#145219",
    car_model: "Toyota Camry",
    passengers: { adult: 3, child: 0 },
    price: 1200,
    currency: "AFN",
    from: { city: "Jalalabad", time: "09:15" },
    to: { city: "Kabul", time: "12:30" },
    travel_date: "2025-11-05",
    payment_status: "paid",
    booking_status: "completed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 145220,
    booking_number: "#145220",
    car_model: "Nissan Sunny",
    passengers: { adult: 2, child: 0 },
    price: 800,
    currency: "AFN",
    from: { city: "Mazar-i-Sharif", time: "14:00" },
    to: { city: "Kunduz", time: "17:30" },
    travel_date: "2025-11-06",
    payment_status: "unpaid",
    booking_status: "cancelled",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 145221,
    booking_number: "#145221",
    car_model: "Toyota Corolla",
    passengers: { adult: 1, child: 1 },
    price: 900,
    currency: "AFN",
    from: { city: "Herat", time: "08:00" },
    to: { city: "Kandahar", time: "20:00" },
    travel_date: "2025-11-07",
    payment_status: "paid",
    booking_status: "booked",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 145222,
    booking_number: "#145222",
    car_model: "Honda City",
    passengers: { adult: 2, child: 2 },
    price: 1500,
    currency: "AFN",
    from: { city: "Kabul", time: "05:45" },
    to: { city: "Jalalabad", time: "09:15" },
    travel_date: "2025-11-08",
    payment_status: "unpaid",
    booking_status: "completed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 145223,
    booking_number: "#145223",
    car_model: "Toyota Hiace",
    passengers: { adult: 6, child: 0 },
    price: 2500,
    currency: "AFN",
    from: { city: "Kunduz", time: "10:30" },
    to: { city: "Mazar-i-Sharif", time: "13:45" },
    travel_date: "2025-11-09",
    payment_status: "paid",
    booking_status: "booked",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];


  return <TaxiBookingIndex latestBookings={bookings} />;
}
