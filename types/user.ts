import type { DriverDataType } from './bus';

export type UserBaseDataType = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export type ProfileDataType = UserBaseDataType & {
  driver: DriverDataType;
}

export type GenderType = 'male' | 'female' | 'other';

export type RoleType = 'admin' | 'agent' | 'driver' | 'vendor';

export type UserStatusType = 'active' | 'blocked' | 'deactivated';
