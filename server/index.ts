import { API_BASE_URL } from '@/config';
import queryString from 'query-string';
import { isEmpty } from '@/utils/helpers/index';
import { strings } from '@/constants';
import { getUserToken } from '@/utils';

export interface IFetchParams {
  method: string;
  body?: BodyInit;
  headers: HeadersInit;
}

export interface IErrorMessage {
  message?: string;
  requestURL?: string;
  params?: Record<string, string | number | boolean>;
  data?: {
    status?: string;
    status_code?: number;
    success?: boolean;
    errors?: Record<string, string>; // Adjusted to capture field-level validation errors
  };
}

export interface IResponse<T> {
  status?: 'success' | 'error';
  status_code?: 200 | 404 | 503 | 422;
  success?: boolean;
  body: T;
}

interface IApiFetchConfig<T, P> {
  endpoint: string;
  params?: Record<string, string | number | boolean>;
  method?: 'GET' | 'POST' | 'PUT';
  headers?: Record<string, string | number>;
  payload?: Record<string, string | number> | P;
  baseURL?: string;
  handleSuccess?: (data: IResponse<T>) => void;
  handleError?: (error: IErrorMessage) => void;
}

export const fetchData = async <T, P = unknown>({
  endpoint,
  params = {},
  method = 'GET',
  headers = {},
  payload,
  baseURL,
  handleSuccess,
  handleError,
}: IApiFetchConfig<T, P>): Promise<void> => {
  let APIBaseURL = API_BASE_URL;

  if (baseURL) {
    APIBaseURL = baseURL;
  }

  let requestURL = `${APIBaseURL}/${endpoint}`;

  // Add query parameters for GET requests
  if (method === 'GET' && params && !isEmpty(params)) {
    requestURL = `${APIBaseURL}/${endpoint}?${queryString.stringify(params)}`;
  }

  // Prepare fetch parameters
  let fetchParams: IFetchParams = {
    method,
    headers: Object.fromEntries(Object.entries(headers).map(([key, value]) => [key, String(value)])),
  };

  if (method === 'POST') {
    fetchParams = {
      ...fetchParams,
      body: payload ? JSON.stringify(payload) : undefined,
      headers: {
        ...fetchParams.headers,
        'Content-Type': 'application/json',
      },
    };
  }

  const userToken = getUserToken();

  if (userToken) {
    fetchParams = {
      ...fetchParams,
      headers: {
        ...fetchParams.headers,
        Authorization: userToken,
      },
    };
  }

  try {
    const response = await fetch(requestURL, fetchParams);

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json();

      const errorMessage: IErrorMessage = {
        message: strings.errors.internal_server_error,
        requestURL,
        params,
        data: errorData,
      };

      // Specific validation errors (status_code 422)
      if (errorData?.status_code === 422 && errorData.errors) {
        errorMessage.message = strings.errors.validation_error;
      }

      // Specific validation errors (status_code 403)
      if (errorData?.status_code === 403 && errorData.errors) {
        errorMessage.message = errorData.errors.message;
      }

      handleError?.(errorMessage);
      console.warn(errorMessage);
      return;
    }

    // Parse response data
    const data: IResponse<T> = await response.json();

    // Handle successful responses
    if (data.success && data.status_code === 200 && data.status === 'success') {
      handleSuccess?.(data);
    } else {
      // Handle unexpected server responses
      const errorMessage: IErrorMessage = {
        message: strings.errors.invalid_server_response,
        requestURL,
        params,
        data,
      };

      handleError?.(errorMessage);
      console.warn(errorMessage);
    }
  } catch (error) {
    // Handle request errors
    const errorMessage: IErrorMessage = {
      message: strings.errors.invalid_request,
      requestURL,
      params,
      data: {},
    };

    handleError?.(errorMessage);
    console.warn(errorMessage);
  }
};
