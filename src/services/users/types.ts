import { Gender, UserStatus } from "@/lib/constants";

export const GENDERS = {
  MALE: "male" as Gender,
  FEMALE: "female" as Gender,
} as const;

// API Response Types
export interface UserListResponse {
  message: string;
  users: UserListItem[];
  totalUsers: number;
  totalPages: number;
}

export interface UserListItem {
  id: string;
  name: string;
  status: UserStatus;
  image: string;
  department: {
    name: string;
  };
  role: {
    name: string;
  };
}

export interface UserDetailResponse {
  message: string;
  user: UserDetail;
}

export interface UserDetail {
  id: string;
  name: string;
  status: UserStatus;
  email: string;
  username: string;
  phone_number: string;
  gender: Gender;
  department: {
    id: string;
    name: string;
  };
  role: {
    id: string;
    name: string;
  };
}

// Request Types
export interface UserCreateInput {
  name: string;
  email: string;
  username: string;
  password: string;
  phone_number: string;
  gender: Gender;
  department_id: string;
  role_id: string;
}

export interface UserUpdateInput
  extends Partial<Omit<UserCreateInput, "password">> {
  password?: string;
  image?: File;
}

export interface UserValidateInput {
  status: "approved" | "rejected";
}

// Query Parameters
export interface UserQueryParams {
  page?: number;
  limit?: number;
  department?: string;
  role?: string;
}
