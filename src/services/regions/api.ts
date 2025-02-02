import { Region } from "./types";
import { mockRegions } from "./mock-data";

// Simulating API call with mock data
export async function fetchRegions(): Promise<Region[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => setTimeout(() => resolve(mockRegions), 1000));
}

// Add more API functions as needed:
// export async function createRegion(region: Omit<Region, "id">): Promise<Region>
// export async function updateRegion(id: string, region: Partial<Region>): Promise<Region>
// export async function deleteRegion(id: string): Promise<void>
