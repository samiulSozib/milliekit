import { UserBaseDataType } from "./user";

// const commissionMethod = ['amount_with_commission', 'amount_without_commission'] as const;
const commissionMethod = ['amount_without_commission', 'amount_with_commission'] as const;

export type MoneyCommissionMethodType = typeof commissionMethod[number];

export type MoneyTransferItemDataType = {
  id: number;
  mobile_or_email:string|null
  amount:number,
  fee:number,
  tx:string,
  status:string,
  request_status:string,
  created_at:string,
  updated_at:string,
  user:UserBaseDataType
};

export type MoneyTransferDataToSaveType = {
  amount: number;
  mobile_or_email: string;
  commission_method: MoneyCommissionMethodType;
}

export type MoneyTransferQueryParamsType = {
  'from-date': string;
  'to-date': string;
  search: string;
  per_page: number;
  page: number;
};