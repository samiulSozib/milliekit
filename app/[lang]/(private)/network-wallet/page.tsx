// // app/[lang]/network-wallet/page.tsx
// import { cookies } from 'next/headers';
// import { NetworkWalletRequest } from '@/server/network-wallet-transaction';
// import { apiPathConfig } from '@/config';

// import type { WalletTransactionItemDataType } from '@/types';
// import NetworkWalletIndex from '@/components/pages/NetworkWallet';

// export default async function Page({
//   searchParams,
// }: {
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// }) {
//   const queryParams = await searchParams;
  
//   // Get member_id from query parameters
//   const memberId = queryParams.member_id as string;
  
//   if (!memberId) {
//     return (
//       <div className="container mx-auto p-4">
//         <p className="text-red-600">شناسه کاربر مشخص نشده است.</p>
//       </div>
//     );
//   }

//   const cookieStore = await cookies();
//   const tokenInCookie = cookieStore.get('token')?.value ?? '';

//   let transactions: WalletTransactionItemDataType[] = [];
//   let totalItems = 0;
  
//   try {
//     const networkWalletRequest = new NetworkWalletRequest({
//       url: apiPathConfig.wallets.subCustomers.base,
//       token: tokenInCookie
//     });

//     // Fetch transactions for the specific member
//     const response = await networkWalletRequest.getTransactions(
//       memberId,
//       tokenInCookie
//     );
    
    
//     // Adjust based on your actual API response structure
//     transactions = response.items || response.items || [];
//     totalItems = response.data?.total 
//   } catch (error) {
//     console.error('Error fetching wallet transactions:', error);
//   }

//   return (
//     <NetworkWalletIndex 
//       items={transactions} 
//       totalItems={totalItems} 
//       memberId={memberId}
//     />
//   );
// }