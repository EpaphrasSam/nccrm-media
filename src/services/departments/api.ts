import { Department } from "./types";
import { mockDepartments } from "./mock-data";

// Simulating API call with mock data
export async function fetchDepartments(): Promise<Department[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) =>
    setTimeout(() => resolve(mockDepartments), 1000)
  );
}

export async function fetchDepartmentById(
  id: string
): Promise<Department | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const department = mockDepartments.find((d) => d.id === id);
      resolve(department || null);
    }, 1000);
  });
}

export async function createDepartment(
  department: Omit<Department, "id" | "createdAt">
): Promise<Department> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDepartment: Department = {
        ...department,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      resolve(newDepartment);
    }, 1000);
  });
}

export async function updateDepartment(
  id: string,
  department: Partial<Department>
): Promise<Department> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingDepartment = mockDepartments.find((d) => d.id === id);
      if (!existingDepartment) {
        reject(new Error("Department not found"));
        return;
      }
      const updatedDepartment = { ...existingDepartment, ...department };
      resolve(updatedDepartment);
    }, 1000);
  });
}

// Add more API functions as needed:
// export async function createDepartment(department: Omit<Department, "id">): Promise<Department>
// export async function updateDepartment(id: string, department: Partial<Department>): Promise<Department>
// export async function deleteDepartment(id: string): Promise<void>
