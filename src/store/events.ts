import { create } from "zustand";
import { EventWithDetails } from "@/services/events/types";
import {
  createEvent as createEventApi,
  updateEvent as updateEventApi,
  exportEventsToExcel as exportEventsToExcelApi,
} from "@/services/events/api";

// Form step types
export type EventFormStep =
  | "event"
  | "perpetrator"
  | "victim"
  | "outcome"
  | "context";

// Form data types
export interface EventFormData {
  // Event details
  reporterId: string;
  date: string;
  eventDetails: string;
  when: string;
  where: string;
  locationDetails: string;
  subIndicatorId: string;
  thematicAreaId: string;
}

export interface PerpetratorFormData {
  name: string;
  age: string;
  gender: string;
  occupation: string;
  organization: string;
  note: string;
}

export interface VictimFormData {
  name: string;
  age: string;
  gender: string;
  occupation: string;
  organization: string;
  note: string;
}

export interface OutcomeFormData {
  deathsMen: number;
  deathsWomenChildren: number;
  deathDetails: string;
  injuriesMen: number;
  injuriesWomenChildren: number;
  injuriesDetails: string;
  lossesProperty: number;
  lossesDetails: string;
}

export interface ContextFormData {
  informationCredibility: string;
  informationSource: string;
  geographicScope: string;
  impact: string;
  weaponsUse: string;
  details: string;
  attachments?: File[];
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
  isLoading: boolean;
  isExporting: boolean;
  currentEvent: EventWithDetails | null;
  formData: FormDataState;

  // Data
  events: EventWithDetails[];
  filteredEvents: EventWithDetails[];
  totalEvents: number;

  // Search and filters
  searchQuery: string;
  subIndicatorFilter: string;
  regionFilter: string;

  // Pagination
  currentPage: number;
  pageSize: number;

  // Form actions
  setCurrentStep: (step: EventFormStep) => void;
  setLoading: (loading: boolean) => void;
  setCurrentEvent: (event: EventWithDetails | null) => void;
  setEventForm: (data: EventFormData) => void;
  setPerpetratorForm: (data: PerpetratorFormData) => void;
  setVictimForm: (data: VictimFormData) => void;
  setOutcomeForm: (data: OutcomeFormData) => void;
  setContextForm: (data: ContextFormData) => void;
  resetForm: () => void;

  // Search and filter actions
  setSearchQuery: (query: string) => void;
  setFilters: (subIndicator: string, region: string) => void;
  clearFilters: () => void;

  // Pagination actions
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Event actions
  addEvent: () => void;
  editEvent: (event: EventWithDetails) => void;
  deleteEvent: (eventId: string) => Promise<void>;
  createEvent: (data: Partial<EventWithDetails>) => Promise<void>;
  updateEvent: (id: string, data: Partial<EventWithDetails>) => Promise<void>;
  exportToExcel: () => Promise<void>;
}

const filterEvents = (
  events: EventWithDetails[],
  searchQuery: string,
  subIndicatorFilter: string,
  regionFilter: string
) => {
  return events.filter((event) => {
    const matchesSearch = searchQuery
      ? event.reporter?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.subIndicator?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.region?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesSubIndicator =
      subIndicatorFilter === "all" ||
      event.subIndicatorId === subIndicatorFilter;
    const matchesRegion =
      regionFilter === "all" || event.regionId === regionFilter;

    return matchesSearch && matchesSubIndicator && matchesRegion;
  });
};

export const useEventsStore = create<EventsState>((set, get) => ({
  currentStep: "event",
  isLoading: true,
  isExporting: false,
  currentEvent: null,
  formData: {
    event: null,
    perpetrator: null,
    victim: null,
    outcome: null,
    context: null,
  },
  events: [],
  filteredEvents: [],
  totalEvents: 0,
  currentPage: 1,
  pageSize: 10,
  searchQuery: "",
  subIndicatorFilter: "all",
  regionFilter: "all",

  setCurrentStep: (step) => set({ currentStep: step }),
  setLoading: (loading) => set({ isLoading: loading }),
  setCurrentEvent: (event) => set({ currentEvent: event }),

  // Form data setters
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

  // Reset form
  resetForm: () =>
    set({
      formData: {
        event: null,
        perpetrator: null,
        victim: null,
        outcome: null,
        context: null,
      },
      currentStep: "event",
    }),

  // API methods
  createEvent: async (data) => {
    const state = get();
    const completeFormData = {
      reporterId: state.formData.event?.reporterId || "",
      date: state.formData.event?.date || "",
      eventDetails: state.formData.event?.eventDetails || "",
      when: state.formData.event?.when || "",
      where: state.formData.event?.where || "",
      locationDetails: state.formData.event?.locationDetails || "",
      subIndicatorId: state.formData.event?.subIndicatorId || "",
      thematicAreaId: state.formData.event?.thematicAreaId || "",
      regionId: state.formData.event?.where || "",
      what: state.formData.event?.subIndicatorId || "",
      thematicArea: "",
      perpetrator: state.formData.perpetrator || {
        name: "",
        age: "",
        gender: "",
        occupation: "",
        organization: "",
        note: "",
      },
      victim: state.formData.victim || {
        name: "",
        age: "",
        gender: "",
        occupation: "",
        organization: "",
        note: "",
      },
      outcome: state.formData.outcome || {
        deathsMen: 0,
        deathsWomenChildren: 0,
        deathDetails: "",
        injuriesMen: 0,
        injuriesWomenChildren: 0,
        injuriesDetails: "",
        lossesProperty: 0,
        lossesDetails: "",
      },
      context: state.formData.context || {
        informationCredibility: "",
        informationSource: "",
        geographicScope: "",
        impact: "",
        weaponsUse: "",
        details: "",
      },
      ...data,
    };

    try {
      set({ isLoading: true });
      const newEvent = await createEventApi(completeFormData);
      set((state) => {
        const newEvents = [...state.events, newEvent];
        const filtered = filterEvents(
          newEvents,
          state.searchQuery,
          state.subIndicatorFilter,
          state.regionFilter
        );
        return {
          events: newEvents,
          filteredEvents: filtered,
          totalEvents: filtered.length,
          isLoading: false,
        };
      });
      get().resetForm();
    } catch (error) {
      console.error("Failed to create event:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateEvent: async (id, data) => {
    const state = get();
    const completeFormData = {
      ...state.formData.event,
      perpetrator: state.formData.perpetrator || {
        name: "",
        age: "",
        gender: "",
        occupation: "",
        organization: "",
        note: "",
      },
      victim: state.formData.victim || {
        name: "",
        age: "",
        gender: "",
        occupation: "",
        organization: "",
        note: "",
      },
      outcome: state.formData.outcome || {
        deathsMen: 0,
        deathsWomenChildren: 0,
        deathDetails: "",
        injuriesMen: 0,
        injuriesWomenChildren: 0,
        injuriesDetails: "",
        lossesProperty: 0,
        lossesDetails: "",
      },
      context: state.formData.context || {
        informationCredibility: "",
        informationSource: "",
        geographicScope: "",
        impact: "",
        weaponsUse: "",
        details: "",
      },
      ...data,
    };

    try {
      set({ isLoading: true });
      const updatedEvent = await updateEventApi(id, completeFormData);
      set((state) => {
        const newEvents = state.events.map((e) =>
          e.id === id ? updatedEvent : e
        );
        const filtered = filterEvents(
          newEvents,
          state.searchQuery,
          state.subIndicatorFilter,
          state.regionFilter
        );
        return {
          events: newEvents,
          filteredEvents: filtered,
          totalEvents: filtered.length,
          currentEvent: updatedEvent,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error("Failed to update event:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Search
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    const state = get();
    const filtered = filterEvents(
      state.events,
      query,
      state.subIndicatorFilter,
      state.regionFilter
    );
    set({
      filteredEvents: filtered,
      totalEvents: filtered.length,
      currentPage: 1,
    });
  },

  // Filters
  setFilters: (subIndicator, region) => {
    set({ subIndicatorFilter: subIndicator, regionFilter: region });
    const state = get();
    const filtered = filterEvents(
      state.events,
      state.searchQuery,
      subIndicator,
      region
    );
    set({
      filteredEvents: filtered,
      totalEvents: filtered.length,
      currentPage: 1,
    });
  },
  clearFilters: () => {
    set({ subIndicatorFilter: "all", regionFilter: "all" });
    const state = get();
    const filtered = filterEvents(
      state.events,
      state.searchQuery,
      "all",
      "all"
    );
    set({
      filteredEvents: filtered,
      totalEvents: filtered.length,
      currentPage: 1,
    });
  },

  // Pagination
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),

  // Actions
  addEvent: () => {
    window.location.href = "/events/new";
  },
  editEvent: (event) => {
    window.location.href = `/events/${event.id}/edit`;
  },
  deleteEvent: async (eventId) => {
    try {
      set({ isLoading: true });
      // TODO: Add API call to delete event
      set((state) => {
        const newEvents = state.events.filter((e) => e.id !== eventId);
        const filtered = filterEvents(
          newEvents,
          state.searchQuery,
          state.subIndicatorFilter,
          state.regionFilter
        );
        return {
          events: newEvents,
          filteredEvents: filtered,
          totalEvents: filtered.length,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error("Failed to delete event:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  exportToExcel: async () => {
    try {
      set({ isExporting: true });
      const blob = await exportEventsToExcelApi();

      // Create a download link and trigger the download
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

      set({ isExporting: false });
    } catch (error) {
      console.error("Failed to export events:", error);
      set({ isExporting: false });
      throw error;
    }
  },
}));
