import { Department } from "./types";
import { mockDepartments } from "./mock-data";

// Simulating API call with mock data
export async function fetchDepartments(): Promise<Department[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) =>
    setTimeout(() => resolve(mockDepartments), 1000)
  );
}

// Add more API functions as needed:
// export async function createDepartment(department: Omit<Department, "id">): Promise<Department>
// export async function updateDepartment(id: string, department: Partial<Department>): Promise<Department>
// export async function deleteDepartment(id: string): Promise<void>
