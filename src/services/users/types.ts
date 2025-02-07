export type UserStatus = "active" | "inactive" | "pending";

export const USER_STATUSES = {
  ACTIVE: "active" as UserStatus,
  INACTIVE: "inactive" as UserStatus,
  PENDING: "pending" as UserStatus,
} as const;

export type Gender = "male" | "female";

export const GENDERS = {
  MALE: "male" as Gender,
  FEMALE: "female" as Gender,
} as const;

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  gender: Gender;
  username: string;
  roleId: string;
  role?: string; // For display purposes
  departmentId: string;
  department?: string; // For display purposes
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
}

// For API requests
export type UserCreateInput = Omit<
  User,
  "id" | "createdAt" | "avatarUrl" | "department" | "role"
>;
export type UserUpdateInput = Partial<Omit<User, "department" | "role">>;
