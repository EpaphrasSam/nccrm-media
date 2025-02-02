import { Role } from "./types";

export const mockRoles: Role[] = [
  {
    id: "1",
    name: "Admin",
    description:
      "Full access to all features, including managing users, roles, departments, and system settings",
    createdAt: "2023-01-15",
    permissions: {
      role: ["view", "edit", "add", "delete"],
      department: ["view", "edit", "add", "delete"],
      region: ["view", "edit", "add", "delete"],
      thematicArea: ["view", "edit", "add", "delete"],
      mainIndicator: ["view", "edit", "add", "delete"],
      subIndicator: ["view", "edit", "add", "delete"],
    },
  },
  {
    id: "2",
    name: "Editor",
    description:
      "Responsible for reviewing, editing, and publishing news reports and managing content submissions.",
    createdAt: "2023-02-05",
    permissions: {
      department: ["view"],
      region: ["view"],
      thematicArea: ["view", "edit"],
      mainIndicator: ["view", "edit"],
      subIndicator: ["view", "edit"],
    },
  },
  {
    id: "3",
    name: "Contributor",
    description:
      "Can create and submit news reports or articles for review but cannot publish directly.",
    createdAt: "2023-03-01",
    permissions: {
      department: ["view"],
      region: ["view"],
      thematicArea: ["view"],
      mainIndicator: ["view"],
      subIndicator: ["view"],
    },
  },
  {
    id: "4",
    name: "Viewer",
    description:
      "Read-only access to view published news and reports without editing or submission permissions",
    createdAt: "2023-03-30",
    permissions: {
      department: ["view"],
      region: ["view"],
      thematicArea: ["view"],
      mainIndicator: ["view"],
      subIndicator: ["view"],
    },
  },
];
