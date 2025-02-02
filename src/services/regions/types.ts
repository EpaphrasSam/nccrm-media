export type RegionStatus = "active" | "inactive";

export interface Region {
  id: string;
  name: string;
  createdAt: string;
  status: RegionStatus;
}
