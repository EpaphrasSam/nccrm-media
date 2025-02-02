import { MainIndicator } from "./types";
import { mockMainIndicators } from "./mock-data";

// Simulating API call with mock data
export async function fetchMainIndicators(): Promise<MainIndicator[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) =>
    setTimeout(() => resolve(mockMainIndicators), 1000)
  );
}

// Add more API functions as needed:
// export async function createMainIndicator(mainIndicator: Omit<MainIndicator, "id">): Promise<MainIndicator>
// export async function updateMainIndicator(id: string, mainIndicator: Partial<MainIndicator>): Promise<MainIndicator>
// export async function deleteMainIndicator(id: string): Promise<void>
