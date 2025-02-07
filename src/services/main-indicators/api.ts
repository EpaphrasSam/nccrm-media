import { MainIndicator } from "./types";
import { mockMainIndicators } from "./mock-data";

// Simulating API call with mock data
export async function fetchMainIndicators(): Promise<MainIndicator[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) =>
    setTimeout(() => resolve(mockMainIndicators), 1000)
  );
}

export async function fetchMainIndicatorById(
  id: string
): Promise<MainIndicator | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mainIndicator = mockMainIndicators.find((t) => t.id === id);
      resolve(mainIndicator || null);
    }, 1000);
  });
}

export async function createMainIndicator(
  mainIndicator: Omit<MainIndicator, "id" | "createdAt">
): Promise<MainIndicator> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMainIndicator: MainIndicator = {
        ...mainIndicator,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      resolve(newMainIndicator);
    }, 1000);
  });
}

export async function updateMainIndicator(
  id: string,
  mainIndicator: Partial<MainIndicator>
): Promise<MainIndicator> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingMainIndicator = mockMainIndicators.find((t) => t.id === id);
      if (!existingMainIndicator) {
        reject(new Error("Main Indicator not found"));
        return;
      }
      const updatedMainIndicator = {
        ...existingMainIndicator,
        ...mainIndicator,
      };
      resolve(updatedMainIndicator);
    }, 1000);
  });
}

// Add more API functions as needed:
// export async function deleteMainIndicator(id: string): Promise<void>
