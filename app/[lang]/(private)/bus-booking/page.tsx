import { cookies } from 'next/headers';

import BusBookingIndex from '@/components/pages/Modules/BusBooking';
import { _dateOptions, apiPathConfig, i18n } from '@/config';
import { CustomerRequest } from '@/server/customer';

import type { TicketRegistrationDataType } from '@/types';

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

  return <BusBookingIndex latestBookings={items} />;
}
