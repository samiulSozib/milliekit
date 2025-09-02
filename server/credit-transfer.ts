import { apiPathConfig } from '@/config';
import { RequestBase } from './request';

import type { FetchOptions } from './request';
import type {
  CreditTransferDataToSaveType,
  CreditTransferItemDataType,
  CreditTransferQueryParamsType,
  ServerEntityGetDetailsResponseType,
  ServerGetListResponseType,
} from '@/types';

export class CreditTransferRequest extends RequestBase {
  constructor(options: FetchOptions) {
    super(options);
  }

  async getListOfTransfers(queryParams?: Partial<CreditTransferQueryParamsType>) {
    if (Object.keys(queryParams || {}).length > 0) {
      this.options.queryParameters = queryParams;
    } else {
      delete this.options.queryParameters;
    }

    const response = await this.serviceRequest<ServerGetListResponseType<CreditTransferItemDataType>>();
    return response;
  }

  async getTransferDetails(transferId: string) {
    this.options.url = apiPathConfig.creditTransfer.details.replace('{{transferId}}', transferId);

    const response = await this.serviceRequest<ServerEntityGetDetailsResponseType<CreditTransferItemDataType>>();
    return response.item;
  }

  async requestToTransfer(data: CreditTransferDataToSaveType, authToken: string) {
    this.options.url = apiPathConfig.creditTransfer.base;
    this.options.method = 'POST';
    this.options.token = authToken;
    this.options.bodyJson = data;

    const response = await this.serviceRequest<ServerEntityGetDetailsResponseType<Record<string, unknown>>>();
    return response.item;
  }
}
