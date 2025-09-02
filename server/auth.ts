import { RequestBase, type FetchOptions } from './request';

import type {
  LoggedInDataType,
  LoggedOutDataType,
} from '@/types/profile';

// export class AuthRequest extends RequestBase {
//   async login(loginData: { email_or_mobile: string; password: string; }): Promise<LoggedInDataType> {
//     this.options.method = 'POST';
//     this.options.url = apiConfig.login;
//     this.options.body = createFormData(loginData);

//     const response = await this.serviceRequest<LoggedInDataType>();
//     return response;
//   }

//   async logout(token: string): Promise<LoggedOutDataType> {
//     this.options.method = 'GET';
//     this.options.url = apiConfig.logout;
//     this.options.token = token;
    
//     const response = await this.serviceRequest<LoggedOutDataType>();
//     return response;
//   }
// }

export class LoginRequest extends RequestBase {
  constructor(options: FetchOptions) {
    super(options);
  }

  async login(): Promise<LoggedInDataType> {
    const response = await this.serviceRequest<LoggedInDataType>();
    return response;
  }
}

export class LogoutRequest extends RequestBase {
  constructor(options: FetchOptions) {
    super(options);
  }

  async logout(): Promise<LoggedOutDataType> {
    const response = await this.serviceRequest<LoggedOutDataType>();
    return response;
  }
}

export class RegisterRequest extends RequestBase {
  constructor(options: FetchOptions) {
    super(options);
  }

  async register(): Promise<{ message: string }> {
    const response = await this.serviceRequest<{ message: string }>();
    return response;
  }
}

