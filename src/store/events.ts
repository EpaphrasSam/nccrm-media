import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Event,
  EventCreateInput,
  EventQueryParams,
  EventUpdateInput,
  EventValidateInput,
} from "@/services/events/types";
import type { SubIndicator } from "@/services/sub-indicators/types";
import { eventService } from "@/services/events/api";
import { urlSync } from "@/utils/url-sync";
import { navigationService } from "@/utils/navigation";
import { storeSync } from "@/lib/store-sync";

// Form step types
export type EventFormStep =
  | "event"
  | "perpetrator"
  | "victim"
  | "outcome"
  | "context";

// Mode type
export type EventFormMode = "new" | "edit";

// Form data types
export interface EventFormData {
  reporter_id: string;
  report_date: string;
  details: string;
  event_date: string;
  region: string;
  district: string;
  location_details: string;
  sub_indicator_id: string;
  follow_ups: string[];
  city: string;
  coordinates: string;
}

export interface PerpetratorFormData {
  perpetrator?: string;
  pep_gender?: string;
  pep_age?: string;
  pep_occupation?: string;
  pep_note?: string;
}

export interface VictimFormData {
  victim?: string;
  victim_age?: string;
  victim_gender?: string;
  victim_occupation?: string;
  victim_note?: string;
}

export interface OutcomeFormData {
  death_count_men?: number;
  death_count_women_chldren?: number;
  death_details?: string;
  injury_count_men?: number;
  injury_count_women_chldren?: number;
  injury_details?: string;
  losses_count?: number;
  losses_details?: string;
}

export interface ContextFormData {
  info_source?: string;
  impact?: string;
  weapons_use?: string;
  context_details?: string;
  docs?: File[];
  files?: string[];
  newDocs?: File[];
}

interface FormDataState {
  event: EventFormData | null;
  perpetrator: PerpetratorFormData | null;
  victim: VictimFormData | null;
  outcome: OutcomeFormData | null;
  context: ContextFormData | null;
}

interface EventsState {
  // Form state
  currentStep: EventFormStep;
  currentEvent: Event | null;
  formData: FormDataState;
  mode: EventFormMode;

  // Reference Data
  subIndicators: SubIndicator[];
  setSubIndicators: (indicators: SubIndicator[]) => void;

  // Data
  events: Event[];
  totalEvents: number;
  totalPages: number;

  // Filters & Pagination
  filters: EventQueryParams;
  setFilters: (filters: Partial<EventQueryParams>) => void;
  resetFilters: () => void;

  // Loading States
  isTableLoading: boolean;
  isFiltersLoading: boolean;
  isFormLoading: boolean;
  isExporting: boolean;
  setTableLoading: (loading: boolean) => void;
  setFiltersLoading: (loading: boolean) => void;
  setFormLoading: (loading: boolean) => void;

  // Form actions
  setCurrentStep: (step: EventFormStep) => void;
  setMode: (mode: EventFormMode) => void;
  setEventForm: (data: EventFormData) => void;
  setPerpetratorForm: (data: PerpetratorFormData) => void;
  setVictimForm: (data: VictimFormData) => void;
  setOutcomeForm: (data: OutcomeFormData) => void;
  setContextForm: (data: ContextFormData) => void;
  resetForm: () => void;
  clearForm: () => void;

  // Event actions
  addEvent: () => void;
  editEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => Promise<void>;
  createEvent: (data: EventCreateInput) => Promise<void>;
  updateEvent: (id: string, data: EventUpdateInput) => Promise<void>;
  validateEvent: (eventId: string, status: EventValidateInput) => Promise<void>;
  exportToExcel: () => Promise<void>;
}

const DEFAULT_FILTERS: EventQueryParams = {
  page: 1,
  limit: 10,
};

const DEFAULT_FORM_STATE: FormDataState = {
  event: null,
  perpetrator: null,
  victim: null,
  outcome: null,
  context: null,
};

export const useEventsStore = create<EventsState>()(
  persist(
    (set, get) => ({
      // Initial Form State
      currentStep: "event",
      currentEvent: null,
      formData: DEFAULT_FORM_STATE,
      mode: "new",

      // Initial Reference Data
      subIndicators: [],
      setSubIndicators: (indicators) => set({ subIndicators: indicators }),

      // Initial Data
      events: [],
      totalEvents: 0,
      totalPages: 0,

      // Filters & Pagination
      filters: DEFAULT_FILTERS,
      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
        urlSync.pushToUrl(newFilters);
      },
      resetFilters: () => {
        set({ filters: DEFAULT_FILTERS });
        urlSync.pushToUrl({});
      },

      // Loading States
      isTableLoading: true,
      isFiltersLoading: false,
      isFormLoading: false,
      isExporting: false,
      setTableLoading: (loading) => set({ isTableLoading: loading }),
      setFiltersLoading: (loading) => set({ isFiltersLoading: loading }),
      setFormLoading: (loading) => set({ isFormLoading: loading }),

      // Form actions
      setCurrentStep: (step) => set({ currentStep: step }),
      setMode: (mode) => set({ mode }),
      setEventForm: (data) =>
        set((state) => ({ formData: { ...state.formData, event: data } })),
      setPerpetratorForm: (data) =>
        set((state) => ({
          formData: { ...state.formData, perpetrator: data },
        })),
      setVictimForm: (data) =>
        set((state) => ({ formData: { ...state.formData, victim: data } })),
      setOutcomeForm: (data) =>
        set((state) => ({ formData: { ...state.formData, outcome: data } })),
      setContextForm: (data) =>
        set((state) => ({ formData: { ...state.formData, context: data } })),
      resetForm: () =>
        set({
          formData: DEFAULT_FORM_STATE,
          currentStep: "event",
          currentEvent: null,
        }),
      clearForm: () =>
        set({
          formData: DEFAULT_FORM_STATE,
          currentStep: "event",
          currentEvent: null,
          mode: "new",
        }),

      // Event actions
      addEvent: () => {
        // When switching to new mode, check if we have persisted new event data
        const currentState = get();

        // If we're coming from edit mode, we need to restore the persisted new event data
        // The persist middleware should have already hydrated the store, but if we're in edit mode,
        // we need to restore the new event data from localStorage manually
        if (currentState.mode === "edit") {
          const persistedData = localStorage.getItem("events-storage");
          let restoredData = null;

          if (persistedData) {
            try {
              const parsed = JSON.parse(persistedData);
              // Only restore if it was persisted new mode data
              if (parsed.state?.mode === "new") {
                restoredData = parsed.state;
              }
            } catch (e) {
              console.warn("Failed to parse persisted events data:", e);
            }
          }

          set({
            mode: "new",
            currentEvent: null,
            // Restore persisted form data and step if available, otherwise start fresh
            formData: restoredData?.formData || DEFAULT_FORM_STATE,
            currentStep: restoredData?.currentStep || "event",
          });
        } else {
          // Already in new mode, just ensure currentEvent is null
          set({
            mode: "new",
            currentEvent: null,
          });
        }

        navigationService.navigate("/events/new");
      },
      editEvent: (event) => {
        // When switching to edit mode, set currentEvent and also populate formData
        // This allows "Save Anywhere" to work properly in edit mode
        // But don't persist this formData to localStorage (handled by partialize)
        set({
          currentEvent: event,
          mode: "edit",
          currentStep: "event",
          // Populate formData from currentEvent so Save Anywhere works
          formData: {
            event: {
              reporter_id: event?.reporter?.id || "",
              report_date: event?.report_date || "",
              details: event?.details || "",
              event_date: event?.event_date || "",
              region: event?.region || "",
              district: event?.district || "",
              city: event?.city || "",
              coordinates: event?.coordinates || "",
              location_details: event?.location_details || "",
              sub_indicator_id: event?.sub_indicator_id || "",
              follow_ups: Array.isArray(event?.follow_ups)
                ? event?.follow_ups
                : [],
            },
            perpetrator: {
              perpetrator: event?.perpetrator || "",
              pep_gender: event?.pep_gender || "",
              pep_age: event?.pep_age || "",
              pep_occupation: event?.pep_occupation || "",
              pep_note: event?.pep_note || "",
            },
            victim: {
              victim: event?.victim || "",
              victim_age: event?.victim_age || "",
              victim_gender: event?.victim_gender || "",
              victim_occupation: event?.victim_occupation || "",
              victim_note: event?.victim_note || "",
            },
            outcome: {
              death_count_men: event?.death_count_men || 0,
              death_count_women_chldren: event?.death_count_women_chldren || 0,
              death_details: event?.death_details || "",
              injury_count_men: event?.injury_count_men || 0,
              injury_count_women_chldren:
                event?.injury_count_women_chldren || 0,
              injury_details: event?.injury_details || "",
              losses_count: event?.losses_count || 0,
              losses_details: event?.losses_details || "",
            },
            context: {
              info_source: event?.info_source || "",
              impact: event?.impact || "",
              weapons_use: event?.weapons_use || "",
              context_details: event?.context_details || "",
            },
          },
        });
        navigationService.navigate(`/events/${event.id}/edit`);
      },
      deleteEvent: async (eventId) => {
        set({ isTableLoading: true });
        try {
          await eventService.delete(eventId, false, {
            handleError: (error: string) => {
              console.error("Error deleting event:", error);
              throw new Error(error);
            },
          });
          set((state) => ({
            events: state.events.filter((r) => r.id !== eventId),
            totalEvents: state.totalEvents - 1,
          }));
          storeSync.trigger();
        } catch {
          // Error has been handled by handleError, we just need to stop execution
          return;
        } finally {
          set({ isTableLoading: false });
        }
      },
      createEvent: async (data) => {
        try {
          await eventService.create(data, false, {
            handleError: (error: string) => {
              console.error("Error creating event:", error);
              throw new Error(error);
            },
          });
          setTimeout(() => {
            get().clearForm();
          }, 4000);
          navigationService.replace("/events");
        } catch {
          // Error has been handled by handleError, we just need to stop execution
          return;
        }
      },
      updateEvent: async (id, data) => {
        try {
          await eventService.update(id, data, false, {
            handleError: (error: string) => {
              console.error("Error updating event:", error);
              throw new Error(error);
            },
          });
          storeSync.trigger();
        } catch {
          return;
        }
      },
      validateEvent: async (eventId, status) => {
        try {
          await eventService.validate(eventId, status, false, {
            handleError: (error: string) => {
              console.error("Error validating event:", error);
              throw new Error(error);
            },
          });
          set({ currentEvent: null });
          storeSync.trigger();
        } catch {
          // Error has been handled by handleError, we just need to stop execution
          return;
        }
      },
      exportToExcel: async () => {
        try {
          set({ isExporting: true });

          // Get current events from state
          const { events } = get();

          // Return early if no events
          if (!events.length) {
            console.log("No events to export");
            return;
          }

          // Import ALL_COLUMNS from ExportPreviewModal or define it here
          const ALL_COLUMNS = [
            { key: "id", label: "ID" },
            { key: "reporter.name", label: "Reporter" },
            { key: "report_date", label: "Report Date" },
            { key: "details", label: "Details" },
            { key: "status", label: "Status" },
            { key: "event_date", label: "Event Date" },
            { key: "region", label: "Region" },
            { key: "district", label: "District" },
            { key: "city", label: "City" },
            { key: "coordinates", label: "Coordinates" },
            { key: "location_details", label: "Location Details" },
            {
              key: "sub_indicator.main_indicator.thematic_area.name",
              label: "Thematic Area",
            },
            {
              key: "sub_indicator.main_indicator.name",
              label: "Main Indicator",
            },
            { key: "sub_indicator.name", label: "Sub Indicator" },
            { key: "perpetrator", label: "Perpetrator" },
            { key: "pep_gender", label: "Perpetrator Gender" },
            { key: "pep_age", label: "Perpetrator Age Bracket" },
            { key: "pep_occupation", label: "Perpetrator Occupation" },
            { key: "pep_note", label: "Perpetrator Notes" },
            { key: "victim", label: "Victim" },
            { key: "victim_gender", label: "Victim Gender" },
            { key: "victim_age", label: "Victim Age Bracket" },
            { key: "victim_occupation", label: "Victim Occupation" },
            { key: "victim_note", label: "Victim Notes" },
            { key: "death_count_men", label: "Death Count (Men)" },
            {
              key: "death_count_women_chldren",
              label: "Death Count (Women/Children)",
            },
            { key: "death_details", label: "Death Details" },
            { key: "injury_count_men", label: "Injury Count (Men)" },
            {
              key: "injury_count_women_chldren",
              label: "Injury Count (Women/Children)",
            },
            { key: "injury_details", label: "Injury Details" },
            { key: "losses_count", label: "Losses Count" },
            { key: "losses_details", label: "Losses Details" },
            { key: "info_source", label: "Information Source" },
            { key: "impact", label: "Impact" },
            { key: "weapons_use", label: "Weapons Used" },
            { key: "context_details", label: "Context Details" },
            { key: "follow_ups", label: "Follow-ups" },
            { key: "created_at", label: "Created At" },
            { key: "updated_at", label: "Updated At" },
          ];

          // Helper to get nested property value
          const getNestedValue = (obj: Event, path: string): unknown => {
            return path.split(".").reduce<unknown>((acc, part) => {
              if (acc && typeof acc === "object" && part in acc) {
                return (acc as Record<string, unknown>)[part];
              }
              return undefined;
            }, obj);
          };

          // Format data for CSV based on ALL_COLUMNS
          const csvData = events.map((event) => {
            const row: Record<
              string,
              string | number | boolean | undefined | null
            > = {};
            ALL_COLUMNS.forEach((col) => {
              let value = getNestedValue(event, col.key);
              // Special handling for dates and arrays
              if (col.key.endsWith("_date") || col.key.endsWith("_at")) {
                if (
                  typeof value === "string" ||
                  typeof value === "number" ||
                  value instanceof Date
                ) {
                  value = value ? new Date(value).toLocaleDateString() : "";
                } else {
                  value = "";
                }
              } else if (col.key === "follow_ups") {
                if (Array.isArray(value)) {
                  value = value.join("; ");
                } else {
                  value = "";
                }
              }
              if (
                typeof value !== "string" &&
                typeof value !== "number" &&
                typeof value !== "boolean" &&
                value !== null &&
                value !== undefined
              ) {
                value = "";
              }
              row[col.key] = value as
                | string
                | number
                | boolean
                | undefined
                | null;
            });
            return row;
          });

          // Convert to CSV
          const headers = ALL_COLUMNS.map((col) => col.label);
          const keys = ALL_COLUMNS.map((col) => col.key);
          const csvRows = [
            headers.map((header) => `"${header}"`).join(","),
            ...csvData.map((row) =>
              keys
                .map((key) => {
                  const value = row[key];
                  const escapedValue =
                    value?.toString().replace(/"/g, '""') || "";
                  return `"${escapedValue}"`;
                })
                .join(",")
            ),
          ];

          // Add BOM and create CSV string
          const BOM = "\uFEFF"; // Add BOM for Excel to auto-expand columns
          const csvString = BOM + csvRows.join("\n");

          // Create and download file
          const blob = new Blob([csvString], {
            type: "text/csv;charset=utf-8;",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `events_export_${new Date().toISOString().split("T")[0]}.csv`
          );
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Failed to export events:", error);
          throw error;
        } finally {
          set({ isExporting: false });
        }
      },
    }),
    {
      name: "events-storage",
      partialize: (state) => {
        // Only persist data for new events (when mode is new and no currentEvent)
        if (state.mode === "new" && !state.currentEvent) {
          return {
            mode: state.mode,
            formData: state.formData,
            currentStep: state.currentStep,
          };
        }

        // When in edit mode, preserve existing localStorage data
        // Get current persisted data and return it to avoid clearing
        const existingData = localStorage.getItem("events-storage");
        if (existingData) {
          try {
            const parsed = JSON.parse(existingData);
            return parsed.state || {};
          } catch (e) {
            console.warn("Failed to parse existing persisted data:", e);
          }
        }

        // Fallback to empty object if no existing data
        return {};
      },
      // Ensure proper hydration
      skipHydration: false,
      // Storage options
      storage: {
        getItem: (key) => {
          const value = localStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: (key, value) => {
          localStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: (key) => {
          localStorage.removeItem(key);
        },
      },
    }
  )
);
