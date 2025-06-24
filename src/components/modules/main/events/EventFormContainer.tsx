"use client";

import { useEventsStore, EventFormStep } from "@/store/events";
import { StepTracker } from "./StepTracker";
import { EventForm } from "./forms/EventForm";
import { PerpetratorForm } from "./forms/PerpetratorForm";
import { VictimForm } from "./forms/VictimForm";
import { OutcomeForm } from "./forms/OutcomeForm";
import { ContextForm } from "./forms/ContextForm";
import { useEffect, useState, useRef, useCallback } from "react";
import { Skeleton, Button, addToast } from "@heroui/react";
import { buttonStyles } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { FaTrash, FaSave } from "react-icons/fa";
import { validateFullEventForm } from "./forms/schemas";

interface EventFormContainerProps {
  eventId?: string;
}

export function EventFormContainer({ eventId }: EventFormContainerProps) {
  const {
    currentStep,
    setCurrentStep,
    clearForm,
    isFormLoading,
    setFormLoading,
    mode,
    currentEvent,
    updateEvent,
  } = useEventsStore();
  const [localLoading, setLocalLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);
  const formSaveCallbacks = useRef<Record<string, () => void>>({});
  const formValidateCallbacks = useRef<Record<string, () => Promise<boolean>>>(
    {}
  );

  // Register form save callback
  const registerFormSaveCallback = useCallback(
    (stepKey: string, callback: () => void) => {
      formSaveCallbacks.current[stepKey] = callback;
    },
    []
  );

  // Register form validation callback
  const registerFormValidateCallback = useCallback(
    (stepKey: string, callback: () => Promise<boolean>) => {
      formValidateCallbacks.current[stepKey] = callback;
    },
    []
  );

  // Handle step click with form save and validation
  const handleStepClick = useCallback(
    async (newStep: EventFormStep) => {
      const stepOrder = [
        "event",
        "perpetrator",
        "victim",
        "outcome",
        "context",
      ];
      const currentStepIndex = stepOrder.indexOf(currentStep);
      const newStepIndex = stepOrder.indexOf(newStep);

      // If moving forward, validate current step BEFORE saving
      if (newStepIndex > currentStepIndex) {
        // Get current form validation callback
        const currentValidateCallback =
          formValidateCallbacks.current[currentStep];
        if (!currentValidateCallback) {
          // If no validation callback, just save and proceed
          const currentSaveCallback = formSaveCallbacks.current[currentStep];
          if (currentSaveCallback) {
            currentSaveCallback();
          }
          setCurrentStep(newStep);
          return;
        }

        // Trigger form validation - this will show field-level errors
        const isValid = await currentValidateCallback();

        if (!isValid) {
          // Form validation failed - errors are already shown on the form fields
          // Don't navigate, just return
          return;
        }

        // Validation passed - save current step data and navigate
        const currentSaveCallback = formSaveCallbacks.current[currentStep];
        if (currentSaveCallback) {
          currentSaveCallback();
        }
      } else {
        // Moving backward - always save current step data
        const currentSaveCallback = formSaveCallbacks.current[currentStep];
        if (currentSaveCallback) {
          currentSaveCallback();
        }
      }

      // Navigation allowed - either going backward or current step validation passed
      setCurrentStep(newStep);
    },
    [currentStep, setCurrentStep]
  );

  // Auto-save timer for new events only
  useEffect(() => {
    if (!eventId && mode === "new") {
      // Clear any existing interval
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }

      // Set up auto-save every 5 seconds
      autoSaveInterval.current = setInterval(() => {
        // Save current form data using the registered callback
        const currentStepCallback = formSaveCallbacks.current[currentStep];
        if (currentStepCallback) {
          currentStepCallback();
        }
      }, 5000);

      return () => {
        if (autoSaveInterval.current) {
          clearInterval(autoSaveInterval.current);
          autoSaveInterval.current = null;
        }
      };
    }
  }, [eventId, mode, currentStep]);

  // Handle initialization and loading states
  useEffect(() => {
    if (!eventId) {
      // For new events, don't reset form (use persisted data)
      setLocalLoading(false);
      setFormLoading(false);
    } else if (!isFormLoading) {
      // For edit mode, add delay only on initial load
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [eventId, isFormLoading, setFormLoading]);

  // Clear Form Handler (New mode only)
  const handleClearForm = () => {
    clearForm();
  };

  // Save Anywhere Handler (Edit mode only)
  const handleSaveAnywhere = async () => {
    if (!currentEvent) {
      addToast({
        title: "Error",
        description: "No event to save.",
        color: "danger",
      });
      return;
    }

    setIsSaving(true);
    try {
      // First, save current form data using callback
      const currentStepCallback = formSaveCallbacks.current[currentStep];
      if (currentStepCallback) {
        currentStepCallback();
      }

      // Wait a bit for the store to update
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Get fresh form data from store
      const storeState = useEventsStore.getState();
      const freshFormData = storeState.formData;

      // Validate all form data
      const validationResult = validateFullEventForm(freshFormData);

      if (!validationResult.success) {
        // Find the first step with errors
        const stepOrder = [
          "event",
          "perpetrator",
          "victim",
          "outcome",
          "context",
        ];
        let firstErrorStep = null;

        for (const step of stepOrder) {
          if (validationResult.errors[step]) {
            firstErrorStep = step;
            break;
          }
        }

        if (firstErrorStep) {
          // Navigate to the step with errors
          setCurrentStep(
            firstErrorStep as
              | "event"
              | "perpetrator"
              | "victim"
              | "outcome"
              | "context"
          );

          // Trigger form validation on the error step after a brief delay to ensure form is rendered
          setTimeout(async () => {
            const errorStepValidateCallback =
              formValidateCallbacks.current[firstErrorStep];
            if (errorStepValidateCallback) {
              await errorStepValidateCallback();
            }
          }, 100);

          addToast({
            title: "Validation Error",
            description: `Please fix the errors in the ${firstErrorStep} step before saving.`,
            color: "danger",
          });

          return;
        }
      }

      if (!freshFormData.event) {
        setCurrentStep("event");
        addToast({
          title: "Error",
          description:
            "Event data is missing. Please fill out the event details.",
          color: "danger",
        });
        return;
      }

      const completeFormData = {
        reporter_id: freshFormData.event.reporter_id || "",
        report_date:
          freshFormData.event.report_date || new Date().toISOString(),
        details: freshFormData.event.details || "",
        event_date: freshFormData.event.event_date || new Date().toISOString(),
        city: freshFormData.event.city,
        region: freshFormData.event.region,
        district: freshFormData.event.district,
        coordinates: freshFormData.event.coordinates,
        location_details: freshFormData.event.location_details || "",
        sub_indicator_id: freshFormData.event.sub_indicator_id || "",
        follow_ups: freshFormData.event.follow_ups || [],
        perpetrator: freshFormData.perpetrator?.perpetrator || "",
        pep_age: freshFormData.perpetrator?.pep_age || "",
        pep_gender: freshFormData.perpetrator?.pep_gender || "",
        pep_occupation: freshFormData.perpetrator?.pep_occupation || "",
        pep_note: freshFormData.perpetrator?.pep_note || "",
        victim: freshFormData.victim?.victim || "",
        victim_age: freshFormData.victim?.victim_age || "",
        victim_gender: freshFormData.victim?.victim_gender || "",
        victim_occupation: freshFormData.victim?.victim_occupation || "",
        victim_note: freshFormData.victim?.victim_note || "",
        death_count_men: freshFormData.outcome?.death_count_men || 0,
        death_count_women_chldren:
          freshFormData.outcome?.death_count_women_chldren || 0,
        death_details: freshFormData.outcome?.death_details || "",
        injury_count_men: freshFormData.outcome?.injury_count_men || 0,
        injury_count_women_chldren:
          freshFormData.outcome?.injury_count_women_chldren || 0,
        injury_details: freshFormData.outcome?.injury_details || "",
        losses_count: freshFormData.outcome?.losses_count || 0,
        losses_details: freshFormData.outcome?.losses_details || "",
        info_source: freshFormData.context?.info_source || "",
        impact: freshFormData.context?.impact || "",
        weapons_use: freshFormData.context?.weapons_use || "",
        context_details: freshFormData.context?.context_details || "",
      };

      await updateEvent(currentEvent.id, completeFormData);
    } catch (error) {
      console.error("Failed to save event:", error);
      addToast({
        title: "Error",
        description: "Failed to save event. Please try again.",
        color: "danger",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "event":
        return (
          <EventForm
            isNew={!eventId}
            registerSaveCallback={registerFormSaveCallback}
            registerValidateCallback={registerFormValidateCallback}
          />
        );
      case "perpetrator":
        return (
          <PerpetratorForm
            isNew={!eventId}
            registerSaveCallback={registerFormSaveCallback}
            registerValidateCallback={registerFormValidateCallback}
          />
        );
      case "victim":
        return (
          <VictimForm
            isNew={!eventId}
            registerSaveCallback={registerFormSaveCallback}
            registerValidateCallback={registerFormValidateCallback}
          />
        );
      case "outcome":
        return (
          <OutcomeForm
            isNew={!eventId}
            registerSaveCallback={registerFormSaveCallback}
            registerValidateCallback={registerFormValidateCallback}
          />
        );
      case "context":
        return (
          <ContextForm
            isNew={!eventId}
            registerSaveCallback={registerFormSaveCallback}
            registerValidateCallback={registerFormValidateCallback}
          />
        );
      default:
        return null;
    }
  };

  if (isFormLoading || localLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-8 md:min-h-screen">
        {/* Stepper Skeleton */}
        <div className="w-full md:h-fit md:sticky md:top-6 md:w-[200px] py-6 px-4 bg-[#D30D0D08] z-10">
          <div className="space-y-8">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* Form Skeleton */}
        <div className="w-full mx-auto h-[calc(100vh-200px)] md:h-auto overflow-y-auto md:overflow-visible max-md:pt-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full max-w-2xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full max-w-2xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-32 w-full max-w-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Action Buttons Section - Top */}
      <div className="flex justify-end gap-4">
        {/* Clear Form Button - New mode only */}
        {!eventId && mode === "new" && (
          <Button
            onPress={handleClearForm}
            variant="flat"
            color="danger"
            startContent={<FaTrash />}
            className={cn(buttonStyles, "w-fit")}
          >
            Clear Form
          </Button>
        )}

        {/* Save Button - Edit mode only */}
        {eventId && mode === "edit" && (
          <Button
            onClick={handleSaveAnywhere}
            color="primary"
            startContent={<FaSave />}
            className={cn(buttonStyles, "bg-brand-green-dark w-fit")}
            isLoading={isSaving}
          >
            Save Event
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8 md:min-h-screen">
        {/* Step Tracker Section */}
        <div className="w-full md:w-[200px]">
          <StepTracker
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
        </div>

        <div className="w-full mx-auto h-[calc(100vh-200px)] md:h-auto overflow-y-auto md:overflow-visible max-md:pt-4">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}
