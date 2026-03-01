export type WalletTransactionDataType = {
  reason: string;
  by_user_id: number;
};

export type WalletTransactionUserType = {
  id: number;
  parent_id: number | null;
  vendor_id: number | null;
  vendor_branch_id: number | null;
  vendor_user_role_id: number | null;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  national_id: string | null;
  email_verified_at: string | null;
  gender: 'male' | 'female' | 'other';
  role: string;
  status: 'active' | 'inactive';
  birthday: string | null;
  openapi_enabled: boolean;
  created_at: string;
  updated_at: string;
  price_adjust_type: 'increase' | 'decrease';
  price_adjust_mode: 'percentage' | 'fixed';
  price_adjust_value: number;
};

export type WalletTransactionItemDataType = {
  id: number;
  user_id: number;
  referenceable_type: string;
  referenceable_id: number;
  currency: string;
  total: string;
  amount: string;
  fee: string;
  type: 'debit' | 'credit';
  action: string | null;
  status: 'pending' | 'verified' | 'rejected';
  data: WalletTransactionDataType;
  created_at: string;
  updated_at: string;
  user: WalletTransactionUserType;
};
