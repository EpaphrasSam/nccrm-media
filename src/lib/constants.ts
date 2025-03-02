// Essential colors
export const COLORS = {
  primary: "#2563EB",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#0EA5E9",
  gray: "#6B7280",
} as const;

// Gender Types
export const GENDERS = {
  MALE: "male",
  FEMALE: "female",
} as const;

export type Gender = (typeof GENDERS)[keyof typeof GENDERS];

// User Status Types
export const USER_STATUSES = {
  ACTIVE: "active",
  PENDING_VERIFICATION: "pending_verification",
  DEACTIVATED: "deactivated",
} as const;

export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];

// General Status Types
export const STATUSES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type Status = (typeof STATUSES)[keyof typeof STATUSES];

// Event Status Types
export const EVENT_STATUSES = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type EventStatus = (typeof EVENT_STATUSES)[keyof typeof EVENT_STATUSES];

// Status Color Mapping
export const STATUS_COLORS: Record<string, string> = {
  // User Statuses
  [USER_STATUSES.ACTIVE]: COLORS.success,
  [USER_STATUSES.PENDING_VERIFICATION]: COLORS.warning,
  [USER_STATUSES.DEACTIVATED]: COLORS.danger,

  // Event Statuses
  [EVENT_STATUSES.PENDING]: COLORS.warning,
  [EVENT_STATUSES.APPROVED]: COLORS.success,
  [EVENT_STATUSES.REJECTED]: COLORS.danger,
} as const;

// Helper function to get status color
export const getStatusColor = (status: string): string => {
  return STATUS_COLORS[status.toLowerCase()] || COLORS.gray;
};
