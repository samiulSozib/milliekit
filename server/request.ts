import { delay } from '@/utils/delay';

export type Methods = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'TRACE' | 'OPTIONS' | 'PATCH';

export type ParamKeyType = 'string' | 'number' | 'boolean';
export type ParamValueType = string | number | boolean;
export type QueryParameters = Record<string, unknown>;

export interface FetchOptions extends RequestInit {

  /**
   * Request URL.
   */
  url: string;

  /**
   * A string to set request's method.
   *
   * @default 'GET'
   */
  method?: Methods;

  /**
   * A Headers object to set request's headers.
   */
  headers?: Record<string, string>;

  /**
   * A timeout for the fetch request.
   * Set `0` for disable it.
   *
   * Use with cation, you will have memory leak issue in nodejs.
   *
   * @default 10_000 ms
   */
  timeout?: number;

  /**
   * If fetch response not acceptable or timed out, it will retry the request.
   *
   * @default 3
   */
  retry?: number;

  /**
   * Delay before each retries.
   *
   * @default 1_000 ms
   */
  retryDelay?: number;

  /**
   * Body as JS Object.
   */
  bodyJson?: Record<string, unknown>;

  /**
   * URL Query Parameters as JS Object.
   */
  queryParameters?: QueryParameters;

  /**
   * Add token to Authentication bearer header.
   */
  token?: string;
}

export const apiErrorCodeToErrorMap = {
  401: () => { throw new Error('invalidCredentials'); },
  403: () => { throw new Error('invalidCredentials'); },
  404: () => { throw new Error('invalidRoute'); },
  500: () => { throw new Error('networkRequestError'); }
}

export class RequestBase {
  options: FetchOptions;

  constructor(options: FetchOptions) {
    this.options = options;
  }

  /**
   * Fetch from a `url` and return the standard response.
   */
  async serviceRequest<T extends Record<string, unknown>>(): Promise<T> {
    console.log('fetch: serviceRequest ', { url: this.options.url });

    try {
      const rawResponse = await this.#fetch(this.options);

      console.log('fetch: serviceRequest ', { rawResponse });

      const apiResponse = (await rawResponse.json()) as T;

      console.log('fetch: serviceRequest ', { apiResponse });

      return this.#processServiceResponse(apiResponse);

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }

      console.error('fetch: serviceRequest ', { error, options: this.options });
      throw new Error('fetchCompletelyFailed');
    }
  }

  /**
   * It's a wrapper around the browser's `fetch` function that adds retry pattern, timeout, cacheStrategy,
   * remove duplicates, etc.
   *
   * Example:
   *
   * ```ts
   * const response = await fetch({
   *   url: '/api/products',
   *   queryParameters: {limit: 10},
   *   timeout: 10_000,
   *   retry: 3,
   *   cacheStrategy: 'stale_while_revalidate',
   *   cacheDuplicate: 'auto',
   * });
   * ```
   */
  #fetch(options: FetchOptions): Promise<Response> {
    options = this.#processOptions(options);
    console.log('fetch ', { options });

    return this.#handleRetryPattern(options as Required<FetchOptions>);
  }

  /**
   * Process fetch options and set defaults, etc.
   */
  #processOptions(options: FetchOptions): Required<FetchOptions> {
    options.method ??= 'GET';
    options.window ??= null;

    options.timeout ??= 10_000;
    options.retry ??= 3;
    options.retryDelay ??= 1_000;
    options.headers ??= {};

    if (options.url.lastIndexOf('?') === -1 && options.queryParameters != null) {
      const queryParameters = options.queryParameters;

      // prettier-ignore
      const queryArray = Object
          .keys(queryParameters)
          .map((key) => `${key}=${String(queryParameters[key])}`);

      if (queryArray.length > 0) {
        options.url += '?' + queryArray.join('&');
      }
    }

    if (options.bodyJson != null) {
      options.body = JSON.stringify(options.bodyJson);
      options.headers['Content-Type'] = 'application/json';
    }

    if (options.token != null) {
      options.headers.Authorization = `Bearer ${options.token}`;
    }

    return options as Required<FetchOptions>;
  }

  /**
   * Handle retry pattern over `_handleTimeout`.
   */
  async #handleRetryPattern(options: Required<FetchOptions>): Promise<Response> {
    if (!(options.retry > 1)) return this.#handleTimeout(options);

    options.retry--;

    const externalAbortSignal = options.signal;

    try {
      const response = await this.#handleTimeout(options);

      if (response.status < 500) {
        return response;
      }

      // else
      throw new Error('fetch_server_error');
    } catch (error) {
      console.error('fetch: _handleRetryPattern', { error });

      if (globalThis.navigator?.onLine === false) {
        throw new Error('offline');
      }

      await delay(options.retryDelay);

      options.signal = externalAbortSignal;

      return this.#handleRetryPattern(options);
    }
  }

  /**
   * It's a wrapper around the browser's `fetch` with timeout.
   */
  #handleTimeout(options: FetchOptions): Promise<Response> {
    if (options.timeout === 0) {
      return globalThis.fetch(options.url, options);
    }

    // else
    return new Promise((resolved, reject) => {
      const abortController = new AbortController();
      const externalAbortSignal = options.signal;

      options.signal = abortController.signal;

      const timeoutId = setTimeout(() => {
        reject(new Error('fetch_timeout'));
        abortController.abort('fetch_timeout');
      }, options.timeout);

      if (externalAbortSignal != null) {
        // Respect external abort signal
        externalAbortSignal.addEventListener('abort', () => abortController.abort(), { once: true });
      }

      globalThis
        .fetch(options.url, options)
        .then(response => resolved(response))
        .catch(reason => reject(reason))
        .finally(() => {
          delete options.signal; // try to avoid memory leak in nodejs!
          clearTimeout(timeoutId);
        });
    });
  }

  #processServiceResponse<T>(serviceResponse: Record<string, unknown>): T {
    if (serviceResponse.status === 'success' && serviceResponse.status_code === 200) {
      return serviceResponse.body as T;
    }

    if (serviceResponse.status === 'error' && serviceResponse.status_code === 422) {
      throw new Error(JSON.stringify(serviceResponse.errors), { cause: serviceResponse.status_code });
    }

    if (
      serviceResponse.status === 'error' &&
      Object.hasOwn(apiErrorCodeToErrorMap, serviceResponse.status_code as number) === true
    ) {
      apiErrorCodeToErrorMap[serviceResponse.status_code as keyof typeof apiErrorCodeToErrorMap]();
    }

    throw new Error('unprocessedResponseCode');
  }
}
