import { cookies } from 'next/headers';

import Orders from '@/components/pages/Orders';
import { CustomerRequest } from '@/server/customer';
import { apiPathConfig } from '@/config';

import type { TicketRegistrationDataType } from '@/types';

const customerRequest = new CustomerRequest({
  url: apiPathConfig.bookings.base
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queryParams = await searchParams;

  const cookieStore = await cookies();
  const tokenInCookie = cookieStore.get('token')?.value ?? '';

  let items: TicketRegistrationDataType[] = [];
  try {
    customerRequest.options.url = apiPathConfig.bookings.base;
    customerRequest.options.token = tokenInCookie;    

    const response = await customerRequest.getListOfBookings(queryParams);
    items = response.items;
  } catch (error) {
    console.error('Error fetching trip data:', error);
    // Handle the error as needed, e.g., show an error message to the user
  }

  return <Orders items={items} />;
}
