import { isServerSide } from '@/utils';

export const getUserToken = () => {
  if (isServerSide) return;

  const storageJson = window.localStorage.getItem('auth-storage');
  if (storageJson) {
    const storage = JSON.parse(storageJson);
    return storage.state.token;
  }

  return;
};
