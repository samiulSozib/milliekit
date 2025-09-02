import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { BookItemDataType } from '@/types/booking';

type BookingStoreType = {
  books: BookItemDataType[];
  setBooks: (books: BookItemDataType[]) => void;
}

const useBookingStore = create<BookingStoreType>()(
  persist(
    (set) => ({
      books: [],
      setBooks: (books: BookItemDataType[]) => {
        set({ books });
      },
    }),
    {
      name: 'booking-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useBookingStore;
