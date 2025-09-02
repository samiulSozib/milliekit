import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { RouteItemType } from '@/config';

export const useActiveRouteStore = create<{
  activeRoute: RouteItemType | null;
  setActiveRoute(route: RouteItemType | null): void;
}>()(
  persist(
    (set) => ({
      activeRoute: null,

      setActiveRoute: (route) => {
        set({
          activeRoute: route,
        });
      },
    }),
    {
      name: 'active-route-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
