import { cookies } from 'next/headers';

import CreditTransferIndex from '@/components/pages/Modules/CreditTransfer';
import { apiPathConfig } from '@/config';

import type {MoneyTransferItemDataType } from '@/types';
import { MoneyTransferRequest } from '@/server/money-transfer';
import MoneyTransferIndex from '@/components/pages/Modules/MoneyTransfer';

const moneyTransferRequest = new MoneyTransferRequest({
  url: apiPathConfig.moneyTransfer.base
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queryParams = await searchParams;

  const cookieStore = await cookies();
  const tokenInCookie = cookieStore.get('token')?.value ?? '';

  let transferItems: MoneyTransferItemDataType[] = [];
  let totalItems = 0;
  try {
    moneyTransferRequest.options.url = apiPathConfig.moneyTransfer.base;
    moneyTransferRequest.options.token = tokenInCookie;

    const response = await moneyTransferRequest.getListOfTransfers(queryParams);
    transferItems = response.items;
    totalItems = response.data.total;
  } catch (error) {
    console.error('Error fetching transfers list:', error);
    // Handle the error as needed, e.g., show an error message to the user
  }

  return <MoneyTransferIndex items={transferItems} totalItems={totalItems} />;
}
