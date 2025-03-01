type Permission = {
  add: boolean;
  edit: boolean;
  view: boolean;
  delete: boolean;
  approve?: boolean;
};

export interface RoleFunctions {
  role: Permission;
  user: Permission & { approve: boolean };
  event: Permission & { approve: boolean };
  region: Permission;
  department: Permission;
  sub_indicator: Permission;
  thematic_area: Permission;
  main_indicator: Permission;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  fullName: string;
  department: string;
  phoneNumber: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  name: string;
  role: {
    id: string;
    name: string;
    functions: RoleFunctions;
  };
  token: string;
  department: string | null;
  gender: string | null;
  image: string | null;
  phone_number: string | null;
  status: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}
