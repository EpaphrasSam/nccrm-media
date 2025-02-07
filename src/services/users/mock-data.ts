import { User } from "./types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Ibrahim",
    email: "sarah.ibrahim@example.com",
    phoneNumber: "+233 24 123 4567",
    gender: "female",
    username: "sarah.ibrahim",
    roleId: "1", // Admin
    departmentId: "1", // Crime & Justice
    status: "active",
    avatarUrl: "https://i.pravatar.cc/150?u=sarah",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+233 24 987 6543",
    gender: "male",
    username: "john.doe",
    roleId: "2", // Editor
    departmentId: "2", // Sports & Recreation
    status: "active",
    avatarUrl: "https://i.pravatar.cc/150?u=john",
    createdAt: "2024-02-05",
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    phoneNumber: "+233 24 456 7890",
    gender: "female",
    username: "emma.wilson",
    roleId: "3", // Contributor
    departmentId: "3", // Education & Research
    status: "pending",
    avatarUrl: "https://i.pravatar.cc/150?u=emma",
    createdAt: "2024-03-01",
  },
  {
    id: "4",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    roleId: "4", // Viewer
    departmentId: "1", // Crime & Justice
    status: "inactive",
    avatarUrl: "https://i.pravatar.cc/150?u=michael",
    phoneNumber: "+233 24 123 4567",
    gender: "male",
    username: "michael.chen",
    createdAt: "2024-03-15",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    roleId: "2", // Editor
    departmentId: "3", // Education & Research
    status: "active",
    avatarUrl: "https://i.pravatar.cc/150?u=lisa",
    phoneNumber: "+233 24 123 4567",
    gender: "female",
    username: "lisa.anderson",
    createdAt: "2024-03-30",
  },
];
