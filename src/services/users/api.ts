import { mockUsers } from "./mock-data";
import { User } from "./types";

// Simulating API call with mock data
export async function fetchUsers(): Promise<User[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => setTimeout(() => resolve(mockUsers), 1000));
}

// Add more API functions as needed:
// export async function createUser(user: Omit<User, "id">): Promise<User>
// export async function updateUser(id: string, user: Partial<User>): Promise<User>
// export async function deleteUser(id: string): Promise<void>
