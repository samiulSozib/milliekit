export type NetworkPricingType = {
  adjust_type: 'increase' | 'decrease';
  adjust_mode: 'percentage' | 'fixed';
  adjust_value: number;
};

export type NetworkItemDataType = {
  id: number;
  parent_id: number | null;

  first_name: string;
  last_name: string;
  email: string | null;
  mobile: string;
  national_id: string | null;
  birthday: string | null;

  gender: 'male' | 'female' | 'other' | null;
  role: string;
  status: 'active' | 'inactive' | 'pending' | 'banned';

  openapi_enabled: boolean;

  pricing: NetworkPricingType | null;

  created_at: string;
  updated_at: string;
};


export type NetworkCreateDataType = {
  first_name: string;
  last_name: string;
  mobile: string;
  password: string;

  email?: string | null;

  price_adjust_type?: 'increase' | 'decrease' | null;
  price_adjust_mode?: 'percentage' | 'fixed' | null;
  price_adjust_value?: number | null;
};


export type NetworkUpdateDataType = {
  id: number;

  first_name?: string;
  last_name?: string;
  email?: string;
  mobile?: string;
  password?: string|undefined;

  price_adjust_type?: 'increase' | 'decrease';
  price_adjust_mode?: 'percentage' | 'fixed';
  price_adjust_value?: number;

  status?: 'active' | 'inactive' | 'pending' | 'banned';
  openapi_enabled?: '0' | '1';
};


export type NetworkQueryParamsType = {
  search?: string;
  per_page?: number;
  page?: number;
  status?: 'active' | 'inactive' | 'pending' | 'banned';
};
