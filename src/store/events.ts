import { create } from "zustand";
import type {
  Event,
  EventCreateInput,
  EventQueryParams,
} from "@/services/events/types";
import type { UserListItem } from "@/services/users/types";
import type { Region } from "@/services/regions/types";
import type { SubIndicator } from "@/services/sub-indicators/types";
import type { ThematicArea } from "@/services/thematic-areas/types";
import { eventService } from "@/services/events/api";
import { urlSync } from "@/utils/url-sync";

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
  thematic_area_id: string;
}

export interface PerpetratorFormData {
  perpetrator: string;
  pep_gender: string;
  pep_age: number;
  pep_occupation: string;
  pep_organization: string;
  pep_note: string;
}

export interface VictimFormData {
  victim: string;
  victim_age: number;
  victim_gender: string;
  victim_occupation: string;
  victim_organization: string;
  victim_note: string;
}

export interface OutcomeFormData {
  death_count_men: number;
  death_count_women_chldren: number;
  death_details: string;
  injury_count_men: number;
  injury_count_women_chldren: number;
  injury_details: string;
  losses_count: number;
  losses_details: string;
}

export interface ContextFormData {
  info_credibility: string;
  info_source: string;
  geo_scope: string;
  impact: string;
  weapons_use: string;
  context_details: string;
  docs?: File[];
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
  thematicAreas: ThematicArea[];
  setReporters: (reporters: UserListItem[]) => void;
  setRegions: (regions: Region[]) => void;
  setSubIndicators: (indicators: SubIndicator[]) => void;
  setThematicAreas: (areas: ThematicArea[]) => void;

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
  updateEvent: (id: string, data: Partial<Event>) => Promise<void>;
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
  thematicAreas: [],
  setReporters: (reporters) => set({ reporters }),
  setRegions: (regions) => set({ regions }),
  setSubIndicators: (indicators) => set({ subIndicators: indicators }),
  setThematicAreas: (areas) => set({ thematicAreas: areas }),

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
  isTableLoading: false,
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
    window.location.href = "/events/new";
  },
  editEvent: (event) => {
    window.location.href = `/events/${event.id}/edit`;
  },
  deleteEvent: async (eventId) => {
    try {
      set({ isTableLoading: true });
      await eventService.delete(eventId);
      set((state) => ({
        events: state.events.filter((e) => e.id !== eventId),
        totalEvents: state.totalEvents - 1,
      }));
    } catch (error) {
      console.error("Failed to delete event:", error);
      throw error;
    } finally {
      set({ isTableLoading: false });
    }
  },
  createEvent: async (data) => {
    try {
      set({ isFormLoading: true });
      await eventService.create(data);
      get().resetForm();
      window.location.href = "/events";
    } catch (error) {
      console.error("Failed to create event:", error);
      throw error;
    } finally {
      set({ isFormLoading: false });
    }
  },
  updateEvent: async (id, data) => {
    try {
      set({ isFormLoading: true });
      await eventService.update(id, data);
      window.location.href = "/events";
    } catch (error) {
      console.error("Failed to update event:", error);
      throw error;
    } finally {
      set({ isFormLoading: false });
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
