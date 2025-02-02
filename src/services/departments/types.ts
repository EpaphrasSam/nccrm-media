export type DepartmentStatus = "active" | "inactive";

export interface Department {
  id: string;
  name: string;
  createdAt: string;
  status: DepartmentStatus;
}
