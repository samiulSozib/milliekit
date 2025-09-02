export type VendorInTripDataType = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  registration_number: string | null;
  license_number: string | null;
  rating: string;
  agent_comission_amount: string;
  agent_comission_type: string;
  admin_comission_amount: string;
  admin_comission_type: string;
  settlement_period: string;
  description: string | null;
  logo: string;
  status: string;
  created_at: string;
  updated_at: string;
  short_name:string|null,
  long_name:string|null
};

export type VendorDataType = {
  id: number;
  name: string;
  rating: string;
  logo: string;
  short_name:string|null,
  long_name:string|null
};
