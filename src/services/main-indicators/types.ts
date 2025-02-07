export type MainIndicatorStatus = "active" | "inactive";

export interface MainIndicator {
  id: string;
  name: string;
  description: string;
  thematicAreaId: string;
  status: MainIndicatorStatus;
  createdAt: string;
}

// For display purposes (like in tables)
export interface MainIndicatorWithThematicArea extends MainIndicator {
  thematicArea?: string;
}
