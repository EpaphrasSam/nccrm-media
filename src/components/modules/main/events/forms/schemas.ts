import { z } from "zod";

// Centralized Age Brackets (AU Standard)
export const ageBrackets = [
  { key: "0-18 years", label: "0-18 years (Child)", value: "0-18 years" },
  { key: "15-35 years", label: "15-35 years (Youth)", value: "15-35 years" },
  { key: "36-59 years", label: "36-59 years (Adult)", value: "36-59 years" },
  {
    key: "60+ years",
    label: "60+ years (Older Persons/Elderly)",
    value: "60+ years",
  },
  { key: "Mixed", label: "Mixed", value: "Mixed" },
  { key: "Unknown", label: "Unknown", value: "Unknown" },
];

// Event Form Schema
export const eventSchema = z.object({
  reporter_id: z.string().min(1, "Reporter is required"),
  report_date: z.string().min(1, "Report date is required"),
  details: z.string().optional(),
  event_date: z.string().min(1, "Event date is required"),
  region: z.string().min(1, "Region is required"),
  district: z.string().min(1, "District is required"),
  location_details: z.string().optional(),
  sub_indicator_id: z.string().min(1, "What is required"),
  follow_ups: z.array(z.string()).default([]),
  city: z.string().min(1, "City is required"),
  coordinates: z.string().min(1, "Coordinates are required"),
});

// Perpetrator Form Schema
export const perpetratorSchema = z.object({
  perpetrator: z.string().optional(),
  pep_age: z.string().optional(),
  pep_gender: z.string().optional(),
  pep_occupation: z.string().optional(),
  pep_note: z.string().optional(),
});

// Victim Form Schema
export const victimSchema = z.object({
  victim: z.string().optional(),
  victim_age: z.string().optional(),
  victim_gender: z.string().optional(),
  victim_occupation: z.string().optional(),
  victim_note: z.string().optional(),
});

// Outcome Form Schema
export const outcomeSchema = z.object({
  death_count_men: z.coerce.number().optional(),
  death_count_women_chldren: z.coerce.number().optional(),
  death_details: z.string().optional(),
  injury_count_men: z.coerce.number().optional(),
  injury_count_women_chldren: z.coerce.number().optional(),
  injury_details: z.string().optional(),
  losses_count: z.coerce.number().optional(),
  losses_details: z.string().optional(),
});

// Context Form Schema
export const contextSchema = z.object({
  info_source: z.string().optional(),
  impact: z.string().optional(),
  weapons_use: z.string().optional(),
  context_details: z.string().optional(),
  docs: z.array(z.instanceof(File)).optional(),
  files: z.array(z.string()).optional(),
  newDocs: z.array(z.instanceof(File)).optional(),
});

// Type exports
export type EventFormValues = z.infer<typeof eventSchema>;
export type PerpetratorFormValues = z.infer<typeof perpetratorSchema>;
export type VictimFormValues = z.infer<typeof victimSchema>;
export type OutcomeFormValues = z.infer<typeof outcomeSchema>;
export type ContextFormValues = z.infer<typeof contextSchema>;

// Helper function to validate specific step
export const validateFormStep = (stepKey: string, data: unknown) => {
  switch (stepKey) {
    case "event":
      return eventSchema.safeParse(data);
    case "perpetrator":
      return perpetratorSchema.safeParse(data);
    case "victim":
      return victimSchema.safeParse(data);
    case "outcome":
      return outcomeSchema.safeParse(data);
    case "context":
      return contextSchema.safeParse(data);
    default:
      return { success: false, error: { message: "Invalid step" } };
  }
};

// Helper function to validate all form data
export const validateFullEventForm = (formData: {
  event?: unknown;
  perpetrator?: unknown;
  victim?: unknown;
  outcome?: unknown;
  context?: unknown;
}) => {
  const results = {
    event: eventSchema.safeParse(formData.event),
    perpetrator: perpetratorSchema.safeParse(formData.perpetrator),
    victim: victimSchema.safeParse(formData.victim),
    outcome: outcomeSchema.safeParse(formData.outcome),
    context: contextSchema.safeParse(formData.context),
  };

  const errors: Record<string, unknown> = {};
  const hasErrors = Object.entries(results).some(([key, result]) => {
    if (!result.success) {
      errors[key] = result.error;
      return true;
    }
    return false;
  });

  return {
    success: !hasErrors,
    errors,
    results,
  };
};
