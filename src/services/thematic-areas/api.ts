import { ThematicArea } from "./types";
import { mockThematicAreas } from "./mock-data";

// Simulating API call with mock data
export async function fetchThematicAreas(): Promise<ThematicArea[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) =>
    setTimeout(() => resolve(mockThematicAreas), 1000)
  );
}

export async function fetchThematicAreaById(
  id: string
): Promise<ThematicArea | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const thematicArea = mockThematicAreas.find((t) => t.id === id);
      resolve(thematicArea || null);
    }, 1000);
  });
}

export async function createThematicArea(
  thematicArea: Omit<ThematicArea, "id" | "createdAt">
): Promise<ThematicArea> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newThematicArea: ThematicArea = {
        ...thematicArea,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      resolve(newThematicArea);
    }, 1000);
  });
}

export async function updateThematicArea(
  id: string,
  thematicArea: Partial<ThematicArea>
): Promise<ThematicArea> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingThematicArea = mockThematicAreas.find((t) => t.id === id);
      if (!existingThematicArea) {
        reject(new Error("Thematic Area not found"));
        return;
      }
      const updatedThematicArea = { ...existingThematicArea, ...thematicArea };
      resolve(updatedThematicArea);
    }, 1000);
  });
}

// Add more API functions as needed:
// export async function createThematicArea(area: Omit<ThematicArea, "id">): Promise<ThematicArea>
// export async function updateThematicArea(id: string, area: Partial<ThematicArea>): Promise<ThematicArea>
// export async function deleteThematicArea(id: string): Promise<void>
