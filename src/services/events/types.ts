// Basic event interface
export interface Event {
  id: string;
  reporterId: string;
  subIndicatorId: string;
  regionId: string;
  thematicAreaId: string;
  date: string;
  createdAt: string;
  // UI display properties
  reporter?: string;
  subIndicator?: string;
  region?: string;
  thematicArea?: string;
}

// Event form data interfaces
export interface EventFormData {
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

// Event with all form data and UI display properties
export interface EventWithDetails extends Event {
  // Event details
  eventDetails: string;
  when: string;
  where: string;
  locationDetails: string;
  what: string;
  thematicArea: string;

  // Perpetrator details
  perpetrator: PerpetratorFormData;

  // Victim details
  victim: VictimFormData;

  // Outcome details
  outcome: OutcomeFormData;

  // Context details
  context: ContextFormData;

  // UI display properties
  reporter?: string;
}
