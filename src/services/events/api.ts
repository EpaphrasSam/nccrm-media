import { mockDetailedEvents } from "./mock-detailed-data";
import { Event, EventWithDetails } from "./types";

// Simulates fetching basic events from an API (for listing/table view)
export async function fetchEvents(): Promise<Event[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Convert detailed events to basic events for the table view
  const basicEvents: Event[] = mockDetailedEvents.map((event) => ({
    id: event.id,
    reporterId: event.reporterId,
    subIndicatorId: event.subIndicatorId,
    regionId: event.regionId,
    thematicAreaId: event.thematicAreaId,
    date: event.date,
    createdAt: event.createdAt,
    // Include UI display properties
    reporter: event.reporter,
    subIndicator: event.subIndicator,
    region: event.region,
    thematicArea: event.thematicArea,
  }));

  return basicEvents;
}

// Simulates fetching a single event by ID from an API (with full details)
export async function fetchEventById(
  id: string
): Promise<EventWithDetails | undefined> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Find the detailed event
  const detailedEvent = mockDetailedEvents.find((event) => event.id === id);
  if (!detailedEvent) return undefined;

  return detailedEvent;
}

// Simulates creating a new event
export async function createEvent(
  event: Omit<EventWithDetails, "id" | "createdAt">
): Promise<EventWithDetails> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newEvent: EventWithDetails = {
    ...event,
    id: `evt_${mockDetailedEvents.length + 1}`,
    createdAt: new Date().toISOString(),
  };

  // In a real app, this would be an API call
  mockDetailedEvents.push(newEvent);
  return newEvent;
}

// Simulates updating an event
export async function updateEvent(
  id: string,
  event: Partial<EventWithDetails>
): Promise<EventWithDetails> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = mockDetailedEvents.findIndex((e) => e.id === id);
  if (index === -1) throw new Error("Event not found");

  const updatedEvent = {
    ...mockDetailedEvents[index],
    ...event,
  };

  // In a real app, this would be an API call
  mockDetailedEvents[index] = updatedEvent;
  return updatedEvent;
}

export async function exportEventsToExcel(): Promise<Blob> {
  // Mock Excel export - creating a CSV file with mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create CSV header
      const headers = [
        "ID",
        "Reporter ID",
        "Sub Indicator ID",
        "Region ID",
        "Date",
        "Status",
        "Created At",
      ].join(",");

      // Convert mock data to CSV rows
      const rows = mockDetailedEvents.map((event) =>
        [
          event.id,
          event.reporterId,
          event.subIndicatorId,
          event.regionId,
          event.date,
          event.createdAt,
        ].join(",")
      );

      // Combine headers and rows
      const csvContent = [headers, ...rows].join("\n");

      // Create a Blob with the CSV content
      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      resolve(blob);
    }, 1000);
  });
}
