import { apiPathConfig } from '@/config';
import { RequestBase } from './request';
import type { FetchOptions } from './request';
import type { PageDetailsResponseType, PageListResponseType } from '@/types/page';

export class PagesRequest extends RequestBase {
  constructor(options: FetchOptions) {
    super(options);
  }

  

  // Get single page details by name (e.g. Privacy & Policy, FAQ, Help)
  async getPageDetails(pageName: string, locale: string = 'en'): Promise<PageDetailsResponseType> {
    this.options.url = apiPathConfig.pages.details.replace('{{pageName}}', encodeURIComponent(pageName));
    this.options.headers = {
      ...(this.options.headers || {}),
      'Accept-Language': locale,
    };
    const response = await this.serviceRequest<PageDetailsResponseType>();
    console.log(response)
    return response;
  }
}
