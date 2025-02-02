import { ThematicArea } from "./types";
import { mockThematicAreas } from "./mock-data";

// Simulating API call with mock data
export async function fetchThematicAreas(): Promise<ThematicArea[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) =>
    setTimeout(() => resolve(mockThematicAreas), 1000)
  );
}

// Add more API functions as needed:
// export async function createThematicArea(area: Omit<ThematicArea, "id">): Promise<ThematicArea>
// export async function updateThematicArea(id: string, area: Partial<ThematicArea>): Promise<ThematicArea>
// export async function deleteThematicArea(id: string): Promise<void>
