import { MainIndicator } from "./types";

export const mockMainIndicators: MainIndicator[] = [
  {
    id: "1",
    name: "Armed Robbery",
    description: "Incidence of violent theft involving weapons or force",
    thematicArea: "Criminality",
    createdAt: "2023-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "Election Transparency",
    description:
      "Assessment of fairness, integrity, and credibility of elections",
    thematicArea: "Politics",
    createdAt: "2023-02-05",
    status: "active",
  },
  {
    id: "3",
    name: "Disease Outbreaks",
    description: "Tracking the spread and impact of infectious diseases",
    thematicArea: "Health",
    createdAt: "2023-03-01",
    status: "inactive",
  },
  {
    id: "4",
    name: "Deforestation Rates",
    description: "Measures the loss of forest cover due to human activities",
    thematicArea: "Environment",
    createdAt: "2023-03-30",
    status: "active",
  },
];
