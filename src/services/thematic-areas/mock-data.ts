import { ThematicArea } from "./types";

export const mockThematicAreas: ThematicArea[] = [
  {
    id: "1",
    name: "Criminality",
    description:
      "Focuses on criminal activities, law enforcement, and public safety.",
    createdAt: "2023-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "Editor",
    description:
      "Responsible for reviewing, editing, and publishing news reports and managing content submissions.",
    createdAt: "2023-02-05",
    status: "active",
  },
  {
    id: "3",
    name: "Contributor",
    description:
      "Can create and submit news reports or articles for review but cannot publish directly.",
    createdAt: "2023-03-01",
    status: "inactive",
  },
  {
    id: "4",
    name: "Viewer",
    description:
      "Read-only access to view published news and reports without editing or submission permissions",
    createdAt: "2023-03-30",
    status: "active",
  },
];
