export type ThematicAreaStatus = "active" | "inactive";

export interface ThematicArea {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status: ThematicAreaStatus;
}
