import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { TripItemDataType } from '@/types/trip';

type TripStoreType = {
  trips: TripItemDataType[];
  selectedTripData: TripItemDataType;
  selectedSeats: { seatPriceId: number; seatNumber: number; }[];
  setSelectedSeats(seats: { seatPriceId: number; seatNumber: number; }[]): void;
  setSelectedTripData(trip: TripItemDataType): void;
  setTrips(trips: TripItemDataType[]): void;
}

const useTripStore = create<TripStoreType>()(
  persist(
    (set) => ({
      trips: [],
      selectedTripData: {} as TripItemDataType,
      selectedSeats: [],
      setSelectedSeats: (seats: { seatPriceId: number; seatNumber: number; }[]) => {
        set({ selectedSeats: seats });
      },
      setSelectedTripData: (trip: TripItemDataType) => {
        set({ selectedTripData: trip });
      },
      setTrips: (trips: TripItemDataType[]) => {
        set({ trips });
      },
    }),
    {
      name: 'trip-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useTripStore;
