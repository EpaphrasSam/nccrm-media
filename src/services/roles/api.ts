import { Role } from "./types";
import { mockRoles } from "./mock-data";

// Simulating API call with mock data
export async function fetchRoles(): Promise<Role[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => setTimeout(() => resolve(mockRoles), 1000));
}

// Add more API functions as needed:
// export async function createRole(role: Omit<Role, "id">): Promise<Role>
// export async function updateRole(id: string, role: Partial<Role>): Promise<Role>
// export async function deleteRole(id: string): Promise<void>
