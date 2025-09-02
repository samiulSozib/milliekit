import { toast } from 'react-toastify';
import { isNumber } from '@/utils';
import { strings } from '@/constants';

interface IApiError {
  data?: {
    errors?: Record<string, string>;
  };
}

export const handleApiError = (error: IApiError): void => {
  if (error?.data?.errors && typeof error.data.errors === 'object') {
    Object.keys(error.data.errors).forEach((key) => {
      if (error.data && error.data.errors) {
        // Exclude number errors
        if (isNumber(error.data.errors[key])) return;

        toast.error(error.data.errors[key]);
      }
    });
  } else {
    toast.error(strings.error_unknown); // Fallback error message
  }
};
