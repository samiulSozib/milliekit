import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { setAuthToken } from '@/app/[lang]/actions/auth';

import type { ProfileType } from '@/types/profile';

interface IAuthStore {
  isLoggedIn: boolean;
  token: string | null;
  profile: ProfileType | null;
  login: (token: string, profile: ProfileType) => Promise<void>;
  logout: () => Promise<void>;
}

const useAuthStore = create<IAuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      profile: null,

      login: async (token, profile): Promise<void> => {
        set({
          isLoggedIn: true,
          profile,
        });

        await setAuthToken(token);
      },

      logout: async (): Promise<void> => {
        set({
          isLoggedIn: false,
          profile: null,
        });

        await setAuthToken('');
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
