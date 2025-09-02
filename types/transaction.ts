export type TransactionQueryParamsType = {
  'from-date': string;
  'to-date': string;
  per_page: number;
  page: number;
};

export type TransactionItemDataType = {
  id: number;
  user_id: number;
  referenceable_type: string;
  referenceable_id: number;
  currency: string;
  total: string;
  amount: string;
  fee: string;
  type: 'debit' | 'credit';
  status: 'verified' | 'pending' | 'failed';
  data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};