import { apiPathConfig } from '@/config';
import { RequestBase } from './request';

import type { FetchOptions } from './request';
import type {
  BookDataToSaveType,
  BookingListQueryParamsType,
  ServerEntityGetDetailsResponseType,
  ServerGetListResponseType,
  TicketCancellationDataType,
  TicketRegistrationDataType,
  TransactionItemDataType,
  TransactionQueryParamsType,
  TripItemDataType,
} from '@/types';

export class CustomerRequest extends RequestBase {
  constructor(options: FetchOptions) {
    super(options);
  }

  async getListOfTrips(queryParams?: Partial<BookingListQueryParamsType>) {
    this.options.method = 'GET';

    if (Object.keys(queryParams || {}).length > 0) {
      this.options.queryParameters = queryParams;
    } else {
      delete this.options.queryParameters;
    }

    const response = await this.serviceRequest<ServerGetListResponseType<TripItemDataType>>();
    return response;
  }

  async getListOfBookings(queryParams?: Partial<BookingListQueryParamsType>) {
    this.options.method = 'GET';

    if (Object.keys(queryParams || {}).length > 0) {
      this.options.queryParameters = queryParams;
    } else {
      delete this.options.queryParameters;
    }

    const response = await this.serviceRequest<ServerGetListResponseType<TicketRegistrationDataType>>();
    return response;
  }

  async bookTrip(data: BookDataToSaveType) {
    this.options.url = apiPathConfig.bookings.base;
    this.options.method = 'POST';
    this.options.bodyJson = {
      ...data,
      tickets: JSON.stringify(data.tickets),
    };

    const response = await this.serviceRequest<ServerEntityGetDetailsResponseType<TicketRegistrationDataType>>();
    return response;
  }

  async getBookingDetails(bookingId: string) {
    this.options.url = apiPathConfig.bookings.details.replace('{{bookingId}}', bookingId);
    this.options.method = 'GET';

    const response = await this.serviceRequest<{ item: TicketRegistrationDataType }>();
    return response;
  }

  async getBookingPaid(bookingId: string): Promise<unknown> {
    this.options.url = apiPathConfig.bookings.paid.replace('{{bookingId}}', bookingId);
    this.options.method = 'GET';

    const response = await this.serviceRequest();
    return response;
  }

  async getBookingCancel(bookingId: string) {
    this.options.url = apiPathConfig.bookings.cancel.replace('{{bookingId}}', bookingId);
    this.options.method = 'GET';

    const response = await this.serviceRequest<{ item: TicketRegistrationDataType }>();
    return response;
  }

  async getBookingDownload(bookingId: string): Promise<unknown> {
    this.options.url = apiPathConfig.bookings.download.replace('{{bookingId}}', bookingId);
    this.options.method = 'GET';

    const response = await this.serviceRequest();
    return response;
  }

  async getWalletBalance<T>(): Promise<T> {
    this.options.url = apiPathConfig.wallet.balance;
    this.options.method = 'GET';

    const response = await this.serviceRequest();
    return response as T;
  }

  async getWalletTransactions(queryParams?: Partial<TransactionQueryParamsType>) {
    this.options.url = apiPathConfig.wallet.transactions;
    this.options.method = 'GET';

    if (Object.keys(queryParams || {}).length > 0) {
      this.options.queryParameters = queryParams;
    } else {
      delete this.options.queryParameters;
    }

    const response = await this.serviceRequest<ServerGetListResponseType<TransactionItemDataType>>();
    return response;
  }

  async getWalletTransactionDetails(transactionId: string): Promise<unknown> {
    this.options.url = apiPathConfig.wallet.transactionsDetails.replace('{{transactionId}}', transactionId);
    this.options.method = 'GET';

    const response = await this.serviceRequest();
    return response;
  }

  async getCancellationInfo(bookingId: string) {
    this.options.url = apiPathConfig.bookings.cancellationInfo.replace('{{bookingId}}', bookingId);
    this.options.method = 'GET';

    const response = await this.serviceRequest<{ item: TicketCancellationDataType }>();
    return response;
  }
}
