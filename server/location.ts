import { apiPathConfig } from '@/config';
import { RequestBase } from './request';

import type { FetchOptions } from './request';
import type { CitiesListResponse } from '@/types';

class LocationRequest extends RequestBase {
  constructor(options: FetchOptions) {
    super(options);
  }

  async getCitiesList(countryCode: string): Promise<CitiesListResponse> {
    this.options.url.replace('{{countryCode}}', countryCode);

    const response = this.serviceRequest<CitiesListResponse>();

    return response;
  }
}

export const locationRequest = new LocationRequest({
  url: apiPathConfig.location.cities,
});
