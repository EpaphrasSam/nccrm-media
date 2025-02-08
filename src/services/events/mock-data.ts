import { Event } from "./types";

export const mockEvents: Event[] = [
  {
    id: "evt_1",
    reporterId: "1", // Sarah Ibrahim
    subIndicatorId: "1", // Armed Robbery Cases
    regionId: "1", // Greater Accra
    thematicAreaId: "1", // Crime & Justice
    date: "2024-01-15",
    createdAt: "2024-01-15",
  },
  {
    id: "evt_2",
    reporterId: "2", // John Doe
    subIndicatorId: "2", // Voter Registration
    regionId: "2", // Ashanti Region
    thematicAreaId: "2", // Electoral Violence
    date: "2024-02-05",
    createdAt: "2024-02-05",
  },
  {
    id: "evt_3",
    reporterId: "3", // Emma Wilson
    subIndicatorId: "3", // COVID-19 Cases
    regionId: "3", // Northern Region
    thematicAreaId: "3", // Health & Safety
    date: "2024-03-01",
    createdAt: "2024-03-01",
  },
  {
    id: "evt_4",
    reporterId: "4", // Michael Chen
    subIndicatorId: "4", // Forest Area Lost
    regionId: "4", // Western Region
    thematicAreaId: "4", // Environmental Issues
    date: "2024-03-30",
    createdAt: "2024-03-30",
  },
];
