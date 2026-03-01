import { apiPathConfig } from '@/config';
import { RequestBase } from './request';

import type { FetchOptions } from './request';
import type {
  WalletTransactionItemDataType,
  ServerBaseResponseType,
  ServerGetListResponseType,
  NetworkQueryParamsType,
} from '@/types';

export class NetworkWalletRequest extends RequestBase {
  constructor(options: FetchOptions) {
    super(options);
  }

  /**
   * Credit sub customer wallet
   * POST multipart/form-data
   */
  async credit(
    subCustomerId: string | number,
    amount: number,
    data: string,
    authToken: string
  ) {
    this.options.url =
      `${apiPathConfig.wallets.subCustomers.base}/${subCustomerId}/credit`;
    this.options.method = 'POST';
    this.options.token = authToken;

    const formData = new FormData();
    formData.append('amount', String(amount));
    formData.append('data', data);

    this.options.body = formData;
    delete this.options.bodyJson;

    const response =
      await this.serviceRequest<ServerBaseResponseType>();

    return response;
  }

  /**
   * Debit sub customer wallet
   * POST multipart/form-data
   */
  async debit(
    subCustomerId: string | number,
    amount: number,
    data: string,
    authToken: string
  ) {
    this.options.url =
      `${apiPathConfig.wallets.subCustomers.base}/${subCustomerId}/debit`;
    this.options.method = 'POST';
    this.options.token = authToken;

    const formData = new FormData();
    formData.append('amount', String(amount));
    formData.append('data', data);

    this.options.body = formData;
    delete this.options.bodyJson;

    const response =
      await this.serviceRequest<ServerBaseResponseType>();

    return response;
  }

  /**
   * Get sub customer wallet transactions
   */
  async getTransactions(
    subCustomerId: string | number,
    authToken: string
  ) {
    this.options.url =
      `${apiPathConfig.wallets.subCustomers.base}/${subCustomerId}/transactions`;
    this.options.method = 'GET';
    this.options.token = authToken;

    const response =
      await this.serviceRequest<
        ServerGetListResponseType<WalletTransactionItemDataType>
      >();

    return response;
  }

    async getList(queryParams?: Partial<NetworkQueryParamsType>) {
    this.options.url = apiPathConfig.networks.base;

    if (Object.keys(queryParams || {}).length > 0) {
      this.options.queryParameters = queryParams;
    } else {
      delete this.options.queryParameters;
    }

    const response =
      await this.serviceRequest<ServerGetListResponseType<WalletTransactionItemDataType>>();

    return response;
  }
}


