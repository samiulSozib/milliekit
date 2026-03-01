// app/[lang]/network/page.tsx
import { cookies } from 'next/headers';
import { NetworkRequest } from '@/server/network';
import { apiPathConfig } from '@/config';

import type { NetworkItemDataType } from '@/types';
import NetworkIndex from '@/components/pages/Network';

const networkRequest = new NetworkRequest({
  url: apiPathConfig.networks.base
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queryParams = await searchParams;

  const cookieStore = await cookies();
  const tokenInCookie = cookieStore.get('token')?.value ?? '';

  let networkItems: NetworkItemDataType[] = [];
  let totalItems = 0;
  
  try {
    networkRequest.options.url = apiPathConfig.networks.base;
    networkRequest.options.token = tokenInCookie;

    const response = await networkRequest.getList({
      ...queryParams,
      per_page: 10,
      page: 1
    });
    
    networkItems = response.items || [];
    totalItems = response.data.total || 0;
  } catch (error) {
    console.error('Error fetching network list:', error);
    // Handle error appropriately
  }

  return (
    <NetworkIndex 
      items={networkItems} 
      totalItems={totalItems} 
    />
  );
}