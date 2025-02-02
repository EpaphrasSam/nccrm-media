import { User } from "./types";
import { DEPARTMENTS, USER_ROLES, USER_STATUSES } from "../../lib/constants";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Ibrahim",
    email: "sarah.ibrahim@example.com",
    role: USER_ROLES.ADMIN,
    department: DEPARTMENTS.CRIME_JUSTICE,
    status: USER_STATUSES.ACTIVE,
    avatarUrl: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john.doe@example.com",
    role: USER_ROLES.EDITOR,
    department: DEPARTMENTS.SPORTS_RECREATION,
    status: USER_STATUSES.ACTIVE,
    avatarUrl: "https://i.pravatar.cc/150?u=john",
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    role: USER_ROLES.REPORTER,
    department: DEPARTMENTS.EDUCATION_RESEARCH,
    status: USER_STATUSES.PENDING,
    avatarUrl: "https://i.pravatar.cc/150?u=emma",
  },
  {
    id: "4",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    role: USER_ROLES.VIEWER,
    department: DEPARTMENTS.CRIME_JUSTICE,
    status: USER_STATUSES.INACTIVE,
    avatarUrl: "https://i.pravatar.cc/150?u=michael",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    role: USER_ROLES.EDITOR,
    department: DEPARTMENTS.EDUCATION_RESEARCH,
    status: USER_STATUSES.ACTIVE,
    avatarUrl: "https://i.pravatar.cc/150?u=lisa",
  },
];
