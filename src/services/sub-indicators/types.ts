export type SubIndicatorStatus = "active" | "inactive";

export interface SubIndicator {
  id: string;
  name: string;
  mainIndicatorId: string;
  status: SubIndicatorStatus;
  createdAt: string;
}

// For display purposes (like in tables)
export interface SubIndicatorWithMainIndicator extends SubIndicator {
  mainIndicator?: string;
}
