// Basic types
export type EventStatus = "pending" | "approved";

export interface Event {
  id: string;
  reporter_id: string;
  report_date: string;
  details?: string;
  status: EventStatus;
  event_date?: string;
  region: string;
  district: string;
  city: string;
  coordinates: string;
  location_details?: string;
  sub_indicator_id: string;
  perpetrator?: string;
  pep_gender?: string;
  pep_age?: string;
  pep_occupation?: string;
  pep_note?: string;
  victim?: string;
  victim_age?: string;
  victim_gender?: string;
  victim_occupation?: string;
  victim_note?: string;
  death_count_men?: number;
  death_count_women_chldren?: number;
  death_details?: string;
  injury_count_men?: number;
  injury_count_women_chldren?: number;
  injury_details?: string;
  losses_count?: number;
  losses_details?: string;
  info_source?: string;
  impact?: string;
  weapons_use?: string;
  context_details?: string;
  files?: string[];
  follow_ups?: string[];
  created_at: string;
  updated_at: string;
  reporter: {
    id: string;
    name: string;
  };
  sub_indicator: {
    id: string;
    name: string;
    main_indicator: {
      id: string;
      name: string;
      thematic_area: {
        id: string;
        name: string;
      };
    };
  };
}

// API Response Types
export interface EventListResponse {
  message: string;
  events: Event[];
  totalEvents: number;
  totalPages: number;
}

export interface EventDetailResponse {
  message: string;
  event: Event;
}

// Create Event Input
export interface EventCreateInput {
  reporter_id: string; // Will be from logged-in user
  report_date: string;
  region: string;
  district: string;
  city: string;
  coordinates: string;
  sub_indicator_id: string;
  details?: string;
  event_date?: string;
  location_details?: string;
  perpetrator?: string;
  pep_gender?: string;
  pep_age?: string;
  pep_occupation?: string;
  pep_note?: string;
  victim?: string;
  victim_age?: string;
  victim_gender?: string;
  victim_occupation?: string;
  victim_note?: string;
  death_count_men?: number;
  death_count_women_chldren?: number;
  death_details?: string;
  injury_count_men?: number;
  injury_count_women_chldren?: number;
  injury_details?: string;
  losses_count?: number;
  losses_details?: string;
  info_source?: string;
  impact?: string;
  weapons_use?: string;
  context_details?: string;
  docs?: File[];
}

// Update Event Input
export interface EventUpdateInput {
  region: string;
  district: string;
  city: string;
  coordinates: string;
  sub_indicator_id: string;
  details?: string;
  event_date?: string;
  location_details?: string;
  perpetrator?: string;
  pep_gender?: string;
  pep_age?: string;
  pep_occupation?: string;
  pep_note?: string;
  victim?: string;
  victim_age?: string;
  victim_gender?: string;
  victim_occupation?: string;
  victim_note?: string;
  death_count_men?: number;
  death_count_women_chldren?: number;
  death_details?: string;
  injury_count_men?: number;
  injury_count_women_chldren?: number;
  injury_details?: string;
  losses_count?: number;
  losses_details?: string;
  info_source?: string;
  impact?: string;
  weapons_use?: string;
  context_details?: string;
  files?: string[];
  newDocs?: File[];
  follow_ups?: string[];
}

// Query Parameters
export interface EventQueryParams {
  page: number;
  limit: number;
  status?: EventStatus;
  thematic_area?: string;
  search?: string;
}

export interface EventValidateInput {
  status: "approved" | "rejected";
}
