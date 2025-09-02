import { cookies } from 'next/headers';

import { BusBookingResults } from '@/components/pages/Modules/BusBooking/Results';
import { apiPathConfig } from '@/config';
import { TripRequest } from '@/server/trip';
import { VendorRequest } from '@/server/vendor';

import type { TripItemDataType, VendorDataType } from '@/types';

const tripRequest = new TripRequest({
  url: apiPathConfig.trips.base,
});

const vendorRequest = new VendorRequest({
  url: apiPathConfig.vendor.base,
});


export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queryParams = await searchParams;

  const cookieStore = await cookies();
  const tokenInCookie = cookieStore.get('token')?.value ?? '';

  let tripItems: TripItemDataType[] = [];
  try {
    tripRequest.options.url = apiPathConfig.trips.base;
    tripRequest.options.token = tokenInCookie;

    const response = await tripRequest.getListOfTrips(queryParams);
    tripItems = response.items;
  } catch (error) {
    console.error('Error fetching trips list:', error);
    // Handle the error as needed, e.g., show an error message to the user
  }

  let vendorItems: VendorDataType[] = [];
  try {
    vendorRequest.options.url = apiPathConfig.vendor.base;
    vendorRequest.options.token = tokenInCookie;

    const response = await vendorRequest.getListOfVendors();
    vendorItems = response.items;
  } catch (error) {
    console.error('Error fetching vendors list:', error);
    // Handle the error as needed, e.g., show an error message to the user
  }

  return <BusBookingResults trips={tripItems} vendors={vendorItems} />;
}
