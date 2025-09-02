import type { RoleType, UserStatusType } from "./user";

export type ProfileBaseType = {
  id: number;
  status: UserStatusType;
  created_at: string;
  updated_at: string;
};

export type RoleDataType = ProfileBaseType & {
  user_id: number;
};

export type ProfileType = ProfileBaseType &
  { [key in RoleType]: RoleDataType } &
  RoleDataType & {
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    national_id: string | null;
    gender: 'male' | 'female';
    birthday: string | null;
    role: RoleType;
  };

export type LoggedInDataType = {
  token: string;
  profile: ProfileType[];
};

export type LoggedOutDataType = {
  logout: boolean;
};

export type LoginDataType = {
  email_or_phone: string;
  password: string;
};
