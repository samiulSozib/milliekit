import { cookies } from 'next/headers';

import Transactions from '@/components/pages/Transactions';
import { CustomerRequest } from '@/server/customer';
import { apiPathConfig } from '@/config';

import type { TransactionItemDataType } from '@/types';

const customerRequest = new CustomerRequest({
  url: apiPathConfig.wallet.transactions,
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queryParams = await searchParams;

  const cookieStore = await cookies();
  const tokenInCookie = cookieStore.get('token')?.value ?? '';

  let items: TransactionItemDataType[] = [];
  try {
    customerRequest.options.url = apiPathConfig.wallet.transactions;
    customerRequest.options.token = tokenInCookie;

    const response = await customerRequest.getWalletTransactions(queryParams);
    items = response.items;
  } catch (error) {
    console.error('Error fetching trip data:', error);
    // Handle the error as needed, e.g., show an error message to the user
  }
  
  return <Transactions items={items} />;
}
