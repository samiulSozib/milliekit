import { apiPathConfig } from '@/config';
import { RequestBase } from './request';

import type { FetchOptions } from './request';
import type {
  NetworkItemDataType,
  NetworkCreateDataType,
  NetworkUpdateDataType,
  NetworkQueryParamsType,
  ServerEntityGetDetailsResponseType,
  ServerGetListResponseType,
  ServerBaseResponseType,
} from '@/types';

export class NetworkRequest extends RequestBase {
  constructor(options: FetchOptions) {
    super(options);
  }

  /**
   * List my sub customers (networks)
   */
  async getList(queryParams?: Partial<NetworkQueryParamsType>) {
    this.options.url = apiPathConfig.networks.base;

    if (Object.keys(queryParams || {}).length > 0) {
      this.options.queryParameters = queryParams;
    } else {
      delete this.options.queryParameters;
    }

    const response =
      await this.serviceRequest<ServerGetListResponseType<NetworkItemDataType>>();

    return response;
  }

  /**
   * Show sub customer details
   */
  async getDetails(id: string | number) {
    this.options.url = `${apiPathConfig.networks.details}/${id}`;

    const response =
      await this.serviceRequest<ServerEntityGetDetailsResponseType<NetworkItemDataType>>();

    return response.item;
  }

  /**
   * Create sub customer (network)
   * multipart/form-data
   */
  async create(data: NetworkCreateDataType, authToken: string) {
    this.options.url = apiPathConfig.networks.base;
    this.options.method = 'POST';
    this.options.token = authToken;
    this.options.bodyJson = data;

    const response =
      await this.serviceRequest<ServerEntityGetDetailsResponseType<NetworkItemDataType>>();

    return response.item;
  }

/**
 * Update sub customer (network)
 * multipart/form-data
 */
async update(data: NetworkUpdateDataType, authToken: string) {
  this.options.url = `${apiPathConfig.networks.base}/update`;
  this.options.method = 'POST';
  this.options.token = authToken;
  
  // Prepare update data - explicitly omit password if it's empty or undefined
  const updateData: Partial<NetworkUpdateDataType> = {
    id: data.id,
    first_name: data.first_name,
    last_name: data.last_name,
    mobile: data.mobile,
    email: data.email || '',
    price_adjust_type: data.price_adjust_type,
    price_adjust_mode: data.price_adjust_mode,
    price_adjust_value: data.price_adjust_value || 0,
  };
  
  // Only include password if it's provided and not empty
  // This ensures the field is completely omitted from the request if not needed
  if (data.password && data.password.trim() !== '') {
    updateData.password = data.password;
  }
  
  // Use FormData instead of JSON to match the multipart/form-data requirement
  const formData = new FormData();
  
  // Append all fields to FormData
  Object.entries(updateData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  
  this.options.body = formData;
  delete this.options.bodyJson; // Remove bodyJson since we're using FormData

  const response =
    await this.serviceRequest<ServerEntityGetDetailsResponseType<NetworkItemDataType>>();

  return response.item;
}

  /**
   * Deactivate sub customer (network)
   */
  async deactivate(id: string | number, authToken: string) {
    this.options.url = `${apiPathConfig.networks.base}/${id}`;
    this.options.method = 'DELETE';
    this.options.token = authToken;

    const response =
      await this.serviceRequest<ServerBaseResponseType>();

    return response;
  }
}
