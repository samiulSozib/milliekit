import { toast } from 'react-toastify';

// import type { getDictionary } from '@/utils/getDictionary';

export const showRequestError = (error: unknown, /* dictionary: Awaited<ReturnType<typeof getDictionary>> */) => {
  console.error(error);

  if (error instanceof Error) {
    if (error.message === 'invalidCredentials') {
      toast.error('Invalid Credentials.');
      return;
    }

    return toast.error(error.message);
  }

  toast.error('Unprocessed Response Code.');
}
