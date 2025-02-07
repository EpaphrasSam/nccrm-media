import { MainIndicator } from "./types";

export const mockMainIndicators: MainIndicator[] = [
  {
    id: "1",
    name: "Armed Robbery",
    description: "Incidence of violent theft involving weapons or force",
    thematicAreaId: "1",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Election Transparency",
    description:
      "Assessment of fairness, integrity, and credibility of elections",
    thematicAreaId: "2",
    status: "active",
    createdAt: "2024-02-05",
  },
  {
    id: "3",
    name: "Disease Outbreaks",
    description: "Tracking the spread and impact of infectious diseases",
    thematicAreaId: "3",
    status: "inactive",
    createdAt: "2024-03-01",
  },
  {
    id: "4",
    name: "Deforestation Rates",
    description: "Measures the loss of forest cover due to human activities",
    thematicAreaId: "4",
    status: "active",
    createdAt: "2024-03-30",
  },
];
