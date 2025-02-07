// Essential colors
export const COLORS = {
  blue: "#2563EB",
  purple: "#9333EA",
  teal: "#0D9488",
  amber: "#F59E0B",
  green: "#22C55E",
  red: "#EF4444",
  yellow: "#EAB308",
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: "Admin",
  EDITOR: "Editor",
  REPORTER: "Reporter",
  VIEWER: "Viewer",
} as const;

// Departments
export const DEPARTMENTS = {
  CRIME_JUSTICE: "Crime & Justice",
  SPORTS_RECREATION: "Sports & Recreation",
  EDUCATION_RESEARCH: "Education & Research",
} as const;

// User Statuses
export const USER_STATUSES = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  PENDING: "Pending Verification",
} as const;

// Add to existing constants
export const GENDERS = {
  MALE: "male",
  FEMALE: "female",
} as const;

type ValueOf<T> = T[keyof T];

export type UserRole = ValueOf<typeof USER_ROLES>;
export type Department = ValueOf<typeof DEPARTMENTS>;
export type UserStatus = ValueOf<typeof USER_STATUSES>;
export type Gender = (typeof GENDERS)[keyof typeof GENDERS];

// Role color mapping
export const ROLE_COLORS: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: COLORS.blue,
  [USER_ROLES.EDITOR]: COLORS.purple,
  [USER_ROLES.REPORTER]: COLORS.teal,
  [USER_ROLES.VIEWER]: COLORS.amber,
};

// Status color mapping
export const STATUS_COLORS = {
  active: COLORS.green,
  inactive: COLORS.red,
  pending: COLORS.yellow,
} as const;
