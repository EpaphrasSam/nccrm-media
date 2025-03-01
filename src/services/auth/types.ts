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
  role: string;
  token: string;
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
