import { Region } from "./types";
import { mockRegions } from "./mock-data";

// Simulating API call with mock data
export async function fetchRegions(): Promise<Region[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => setTimeout(() => resolve(mockRegions), 1000));
}

export async function fetchRegionById(id: string): Promise<Region | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const region = mockRegions.find((r) => r.id === id);
      resolve(region || null);
    }, 1000);
  });
}

export async function createRegion(
  region: Omit<Region, "id" | "createdAt">
): Promise<Region> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRegion: Region = {
        ...region,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      resolve(newRegion);
    }, 1000);
  });
}

export async function updateRegion(
  id: string,
  region: Partial<Region>
): Promise<Region> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingRegion = mockRegions.find((r) => r.id === id);
      if (!existingRegion) {
        reject(new Error("Region not found"));
        return;
      }
      const updatedRegion = { ...existingRegion, ...region };
      resolve(updatedRegion);
    }, 1000);
  });
}

// Add more API functions as needed:
// export async function createRegion(region: Omit<Region, "id">): Promise<Region>
// export async function updateRegion(id: string, region: Partial<Region>): Promise<Region>
// export async function deleteRegion(id: string): Promise<void>
