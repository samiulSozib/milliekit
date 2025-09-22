import { apiPathConfig } from '@/config';
import { RequestBase } from './request';

import type { FetchOptions } from './request';
import type {
  MoneyTransferDataToSaveType,
  MoneyTransferItemDataType,
  MoneyTransferQueryParamsType,
  ServerEntityGetDetailsResponseType,
  ServerGetListResponseType,
} from '@/types';

export class MoneyTransferRequest extends RequestBase {
  constructor(options: FetchOptions) {
    super(options);
  }

  async getListOfTransfers(queryParams?: Partial<MoneyTransferQueryParamsType>) {
    if (Object.keys(queryParams || {}).length > 0) {
      this.options.queryParameters = queryParams;
    } else {
      delete this.options.queryParameters;
    }

    const response = await this.serviceRequest<ServerGetListResponseType<MoneyTransferItemDataType>>();
    return response;
  }

  async getTransferDetails(transferId: string) {
    this.options.url = apiPathConfig.moneyTransfer.details.replace('{{transferId}}', transferId);

    const response = await this.serviceRequest<ServerEntityGetDetailsResponseType<MoneyTransferItemDataType>>();
    return response.item;
  }

  async requestToTransfer(data: MoneyTransferDataToSaveType, authToken: string) {
    this.options.url = apiPathConfig.moneyTransfer.base;
    this.options.method = 'POST';
    this.options.token = authToken;
    this.options.bodyJson = data;

    const response = await this.serviceRequest<ServerEntityGetDetailsResponseType<Record<string, unknown>>>();
    return response.item;
  }
}
