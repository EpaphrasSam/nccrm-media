import type { RolePermissions } from "../roles/types";

// type Permission = { // Removed unused type
//   add: boolean;
//   edit: boolean;
//   view: boolean;
//   delete: boolean;
//   approve?: boolean;
// };

// export interface RoleFunctions { // Removed this interface
//   role: Permission;
//   user: Permission & { approve: boolean };
//   event: Permission & { approve: boolean };
//   region: Permission;
//   department: Permission;
//   sub_indicator: Permission;
//   thematic_area: Permission;
//   main_indicator: Permission;
// }

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  name: string;
  departmentId: string;
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
    functions: RolePermissions;
  } | null;
  token: string;
  department: string | null;
  gender: string | null;
  image: string | null;
  phone_number: string | null;
  status: string;
  username: string | null;
  created_at: string;
  updated_at: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  resetCode: string;
  newPassword: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}
