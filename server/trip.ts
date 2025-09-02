import { apiPathConfig } from '@/config';
import { RequestBase } from './request';

import type { FetchOptions } from './request';
import type { TripDetailsResponseType, TripItemDataType, TripListQueryParamsType } from '@/types/trip';
import type { ServerGetListResponseType } from '@/types';

export class TripRequest extends RequestBase {
  constructor(options: FetchOptions) {
    super(options);
  }

  async getListOfTrips(
    queryParams?: Partial<TripListQueryParamsType>
  ): Promise<ServerGetListResponseType<TripItemDataType>> {
    if (Object.keys(queryParams || {}).length > 0) {
      this.options.queryParameters = queryParams;
    } else {
      delete this.options.queryParameters;
    }

    const response = await this.serviceRequest<ServerGetListResponseType<TripItemDataType>>();
    return response;
  }

  async getTripDetails(tripId: string): Promise<TripDetailsResponseType> {
    this.options.url = apiPathConfig.trips.details.replace('{{tripId}}', tripId);

    const response = await this.serviceRequest<TripDetailsResponseType>();
    return response;
  }
}
