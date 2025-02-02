export type MainIndicatorStatus = "active" | "inactive";

export interface MainIndicator {
  id: string;
  name: string;
  description: string;
  thematicArea: string;
  createdAt: string;
  status: MainIndicatorStatus;
}
