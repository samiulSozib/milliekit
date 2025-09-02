import { RequestBase } from './request';

import type { FetchOptions } from './request';
import type { VendorDataType } from '@/types';

export class VendorRequest extends RequestBase {
  constructor(options: FetchOptions) {
    super(options);
  }

  async getListOfVendors(queryParams?: { search: string; }): Promise<{ items: VendorDataType[] }> {
    if (Object.keys(queryParams || {}).length > 0) {
      this.options.queryParameters = queryParams;
    } else {
      delete this.options.queryParameters;
    }

    const response = await this.serviceRequest<{ items: VendorDataType[] }>();
    return response;
  }
}

