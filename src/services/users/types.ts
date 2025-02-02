import { UserRole, Department, UserStatus } from "@/lib/constants";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  status: UserStatus;
  avatarUrl?: string;
}

// You can add more types as needed:
// export type UserCreateInput = Omit<User, "id" | "createdAt">
// export type UserUpdateInput = Partial<User>
