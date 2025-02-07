import { SubIndicator } from "./types";
import { mockSubIndicators } from "./mock-data";

// Simulating API call with mock data
export async function fetchSubIndicators(): Promise<SubIndicator[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) =>
    setTimeout(() => resolve(mockSubIndicators), 1000)
  );
}

export async function fetchSubIndicatorById(
  id: string
): Promise<SubIndicator | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const subIndicator = mockSubIndicators.find((t) => t.id === id);
      resolve(subIndicator || null);
    }, 1000);
  });
}

export async function createSubIndicator(
  subIndicator: Omit<SubIndicator, "id" | "createdAt">
): Promise<SubIndicator> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newSubIndicator: SubIndicator = {
        ...subIndicator,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      resolve(newSubIndicator);
    }, 1000);
  });
}

export async function updateSubIndicator(
  id: string,
  subIndicator: Partial<SubIndicator>
): Promise<SubIndicator> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingSubIndicator = mockSubIndicators.find((t) => t.id === id);
      if (!existingSubIndicator) {
        reject(new Error("Sub Indicator not found"));
        return;
      }
      const updatedSubIndicator = {
        ...existingSubIndicator,
        ...subIndicator,
      };
      resolve(updatedSubIndicator);
    }, 1000);
  });
}

// Add more API functions as needed:
// export async function deleteSubIndicator(id: string): Promise<void>
