import { Role } from "./types";
import { mockRoles } from "./mock-data";

// Simulating API call with mock data
export async function fetchRoles(): Promise<Role[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => setTimeout(() => resolve(mockRoles), 1000));
}

export async function fetchRoleById(id: string): Promise<Role | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const role = mockRoles.find((r) => r.id === id);
      resolve(role || null);
    }, 1000);
  });
}

export async function createRole(
  role: Omit<Role, "id" | "createdAt">
): Promise<Role> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRole: Role = {
        ...role,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      resolve(newRole);
    }, 1000);
  });
}

export async function updateRole(
  id: string,
  role: Partial<Role>
): Promise<Role> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingRole = mockRoles.find((r) => r.id === id);
      if (!existingRole) {
        reject(new Error("Role not found"));
        return;
      }
      const updatedRole = { ...existingRole, ...role };
      resolve(updatedRole);
    }, 1000);
  });
}

// Add more API functions as needed:
// export async function createRole(role: Omit<Role, "id">): Promise<Role>
// export async function updateRole(id: string, role: Partial<Role>): Promise<Role>
// export async function deleteRole(id: string): Promise<void>
