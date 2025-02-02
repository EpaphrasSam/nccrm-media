import { SubIndicator } from "./types";
import { mockSubIndicators } from "./mock-data";

// Simulating API call with mock data
export async function fetchSubIndicators(): Promise<SubIndicator[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) =>
    setTimeout(() => resolve(mockSubIndicators), 1000)
  );
}

// Add more API functions as needed:
// export async function createSubIndicator(subIndicator: Omit<SubIndicator, "id">): Promise<SubIndicator>
// export async function updateSubIndicator(id: string, subIndicator: Partial<SubIndicator>): Promise<SubIndicator>
// export async function deleteSubIndicator(id: string): Promise<void>
