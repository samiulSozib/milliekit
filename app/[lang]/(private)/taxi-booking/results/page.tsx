import { cookies } from 'next/headers';

import { BusBookingResults } from '@/components/pages/Modules/BusBooking/Results';
import { apiPathConfig } from '@/config';
import { TripRequest } from '@/server/trip';
import { VendorRequest } from '@/server/vendor';

import type { TaxiTripItemDataType, TripItemDataType, VendorDataType } from '@/types';
import { TaxiBookingResults } from '@/components/pages/Modules/TaxiBooking/Results';

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

  const taxiTripData: TaxiTripItemDataType[] = [
  {
    id: 1,
    departure_time: "14:30",
    arrival_time: "20:00",
    duration: "5 h 30 m",
    available_seats: 4,
    total_seats: 4,
    ticket_price: "550 AFN",
    taxi_model: {
      id: 1,
      name: "Toyota Corolla",
      capacity: 4,
      image: "/images/toyota-corolla.png"
    },
    driver: {
      id: 1,
      name: "Abas Kazemi",
      rating: 4.8,
      phone_number: "+93 70 123 4567"
    },
    boarding_location: {
      id: 1,
      name: "Harat Central Station",
      address: "Main Road, Harat City Center",
      city: "Harat"
    },
    drop_off_location: {
      id: 2,
      name: "Kabol Central Station",
      address: "City Center, Kabol",
      city: "Kabol"
    },
    route: {
      origin: "Harat",
      destination: "Kabol",
      via_cities: ["mazarsharif"]
    },
    refund_policy: "Free cancellation up to 2 hours before departure. 50% refund within 2 hours of departure.",
    taxi_information: "Comfortable sedan with AC, free water bottles, and WiFi available",
    status: "active",
    is_fastest: true
  },
  {
    id: 2,
    departure_time: "14:30",
    arrival_time: "20:00",
    duration: "5 h 30 m",
    available_seats: 3,
    total_seats: 4,
    ticket_price: "550 AFN",
    taxi_model: {
      id: 1,
      name: "Toyota Corolla",
      capacity: 4,
      image: "/images/toyota-corolla.png"
    },
    driver: {
      id: 2,
      name: "Mohammad Hassan",
      rating: 4.6,
      phone_number: "+93 70 234 5678"
    },
    boarding_location: {
      id: 1,
      name: "Harat Central Station",
      address: "Main Road, Harat City Center",
      city: "Harat"
    },
    drop_off_location: {
      id: 2,
      name: "Kabol Central Station",
      address: "City Center, Kabol",
      city: "Kabol"
    },
    route: {
      origin: "Harat",
      destination: "Kabol",
      via_cities: ["mazarsharif"]
    },
    refund_policy: "Free cancellation up to 3 hours before departure. 25% refund within 3 hours of departure.",
    taxi_information: "Spacious sedan with extra legroom, AC, and charging ports",
    status: "active"
  },
  {
    id: 3,
    departure_time: "14:30",
    arrival_time: "20:00",
    duration: "5 h 30 m",
    available_seats: 4,
    total_seats: 4,
    ticket_price: "600 AFN",
    taxi_model: {
      id: 2,
      name: "Honda Civic",
      capacity: 4,
      image: "/images/honda-civic.png"
    },
    driver: {
      id: 3,
      name: "Ahmad Shah",
      rating: 4.9,
      phone_number: "+93 70 345 6789"
    },
    boarding_location: {
      id: 1,
      name: "Harat Central Station",
      address: "Main Road, Harat City Center",
      city: "Harat"
    },
    drop_off_location: {
      id: 2,
      name: "Kabol Central Station",
      address: "City Center, Kabol",
      city: "Kabol"
    },
    route: {
      origin: "Harat",
      destination: "Kabol",
      via_cities: ["mazarsharif"]
    },
    refund_policy: "Free cancellation up to 4 hours before departure. No refund within 4 hours of departure.",
    taxi_information: "Premium sedan with leather seats, AC, and entertainment system",
    status: "active"
  },
  {
    id: 4,
    departure_time: "16:00",
    arrival_time: "21:30",
    duration: "5 h 30 m",
    available_seats: 4,
    total_seats: 4,
    ticket_price: "500 AFN",
    taxi_model: {
      id: 3,
      name: "Toyota Camry",
      capacity: 4,
      image: "/images/toyota-camry.png"
    },
    driver: {
      id: 4,
      name: "Karimullah Noori",
      rating: 4.7,
      phone_number: "+93 70 456 7890"
    },
    boarding_location: {
      id: 1,
      name: "Harat Central Station",
      address: "Main Road, Harat City Center",
      city: "Harat"
    },
    drop_off_location: {
      id: 2,
      name: "Kabol Central Station",
      address: "City Center, Kabol",
      city: "Kabol"
    },
    route: {
      origin: "Harat",
      destination: "Kabol",
      via_cities: ["mazarsharif"]
    },
    refund_policy: "Free cancellation up to 2 hours before departure. 75% refund within 2 hours of departure.",
    taxi_information: "Comfortable ride with AC and complimentary snacks",
    status: "active"
  }
];



  return <TaxiBookingResults trips={taxiTripData} vendors={vendorItems} />;
}
