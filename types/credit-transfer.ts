import { UserBaseDataType } from "./user";

// const commissionMethod = ['amount_with_commission', 'amount_without_commission'] as const;
const commissionMethod = ['amount_without_commission', 'amount_with_commission'] as const;

export type CommissionMethodType = typeof commissionMethod[number];

export type CreditTransferItemDataType = {
  id: number;
  mobile:string|null
  amount:number,
  fee:number,
  tx:string,
  status:string,
  request_status:string,
  created_at:string,
  updated_at:string,
  user:UserBaseDataType
};

export type CreditTransferDataToSaveType = {
  amount: number;
  mobile: string;
  commission_method: CommissionMethodType;
}

export type CreditTransferQueryParamsType = {
  'from-date': string;
  'to-date': string;
  search: string;
  per_page: number;
  page: number;
};