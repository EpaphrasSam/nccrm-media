import { create } from "zustand";
import type {
  Event,
  EventCreateInput,
  EventQueryParams,
  EventUpdateInput,
} from "@/services/events/types";
import type { UserListItem } from "@/services/users/types";
import type { Region } from "@/services/regions/types";
import type { SubIndicator } from "@/services/sub-indicators/types";
import { eventService } from "@/services/events/api";
import { urlSync } from "@/utils/url-sync";
import { navigationService } from "@/utils/navigation";

// Form step types
export type EventFormStep =
  | "event"
  | "perpetrator"
  | "victim"
  | "outcome"
  | "context";

// Form data types
export interface EventFormData {
  reporter_id: string;
  report_date: string;
  details: string;
  event_date: string;
  region_id: string;
  location_details: string;
  sub_indicator_id: string;
  follow_ups: string[];
}

export interface PerpetratorFormData {
  perpetrator?: string;
  pep_gender?: string;
  pep_age?: number;
  pep_occupation?: string;
  pep_organization?: string;
  pep_note?: string;
}

export interface VictimFormData {
  victim?: string;
  victim_age?: number;
  victim_gender?: string;
  victim_occupation?: string;
  victim_organization?: string;
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
  info_credibility?: string;
  info_source?: string;
  geo_scope?: string;
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

  // Reference Data
  reporters: UserListItem[];
  regions: Region[];
  subIndicators: SubIndicator[];
  setReporters: (reporters: UserListItem[]) => void;
  setRegions: (regions: Region[]) => void;
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
  setEventForm: (data: EventFormData) => void;
  setPerpetratorForm: (data: PerpetratorFormData) => void;
  setVictimForm: (data: VictimFormData) => void;
  setOutcomeForm: (data: OutcomeFormData) => void;
  setContextForm: (data: ContextFormData) => void;
  resetForm: () => void;

  // Event actions
  addEvent: () => void;
  editEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => Promise<void>;
  createEvent: (data: EventCreateInput) => Promise<void>;
  updateEvent: (id: string, data: EventUpdateInput) => Promise<void>;
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

export const useEventsStore = create<EventsState>((set, get) => ({
  // Initial Form State
  currentStep: "event",
  currentEvent: null,
  formData: DEFAULT_FORM_STATE,

  // Initial Reference Data
  reporters: [],
  regions: [],
  subIndicators: [],
  setReporters: (reporters) => set({ reporters }),
  setRegions: (regions) => set({ regions }),
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
  setEventForm: (data) =>
    set((state) => ({ formData: { ...state.formData, event: data } })),
  setPerpetratorForm: (data) =>
    set((state) => ({ formData: { ...state.formData, perpetrator: data } })),
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

  // Event actions
  addEvent: () => {
    navigationService.navigate("/events/new");
  },
  editEvent: (event) => {
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
      get().resetForm();
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
    } catch {
      // Error has been handled by handleError, we just need to stop execution
      return;
    }
  },
  exportToExcel: async () => {
    try {
      set({ isExporting: true });
      // TODO: Add API call to export events
      const blob = new Blob([""], { type: "text/csv" });
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
}));
