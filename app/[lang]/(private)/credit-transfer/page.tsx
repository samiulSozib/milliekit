import { cookies } from 'next/headers';

import CreditTransferIndex from '@/components/pages/Modules/CreditTransfer';
import { CreditTransferRequest } from '@/server/credit-transfer';
import { apiPathConfig } from '@/config';

import type { CreditTransferItemDataType } from '@/types';

const creditTransferRequest = new CreditTransferRequest({
  url: apiPathConfig.creditTransfer.base
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queryParams = await searchParams;

  const cookieStore = await cookies();
  const tokenInCookie = cookieStore.get('token')?.value ?? '';

  let transferItems: CreditTransferItemDataType[] = [];
  let totalItems = 0;
  try {
    creditTransferRequest.options.url = apiPathConfig.creditTransfer.base;
    creditTransferRequest.options.token = tokenInCookie;

    const response = await creditTransferRequest.getListOfTransfers(queryParams);
    transferItems = response.items;
    totalItems = response.data.total;
  } catch (error) {
    console.error('Error fetching transfers list:', error);
    // Handle the error as needed, e.g., show an error message to the user
  }

  return <CreditTransferIndex items={transferItems} totalItems={totalItems} />;
}
