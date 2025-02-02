export type SubIndicatorStatus = "active" | "inactive";

export interface SubIndicator {
  id: string;
  name: string;
  mainIndicator: string;
  createdAt: string;
  status: SubIndicatorStatus;
}
