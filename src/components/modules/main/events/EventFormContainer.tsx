"use client";

import { useEventsStore } from "@/store/events";
import { StepTracker } from "./StepTracker";
import { EventForm } from "./forms/EventForm";
import { PerpetratorForm } from "./forms/PerpetratorForm";
import { VictimForm } from "./forms/VictimForm";
import { OutcomeForm } from "./forms/OutcomeForm";
import { ContextForm } from "./forms/ContextForm";
import { useEffect, useState } from "react";
import { Skeleton } from "@heroui/react";

interface EventFormContainerProps {
  eventId?: string;
}

export function EventFormContainer({ eventId }: EventFormContainerProps) {
  const {
    currentStep,
    setCurrentStep,
    resetForm,
    isFormLoading,
    setFormLoading,
  } = useEventsStore();
  const [localLoading, setLocalLoading] = useState(true);

  // Handle initialization and loading states
  useEffect(() => {
    if (!eventId) {
      resetForm();
      setCurrentStep("event");
      setLocalLoading(false);
      setFormLoading(false);
    } else if (!isFormLoading) {
      // For edit mode, add delay only on initial load
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [eventId, isFormLoading, resetForm, setCurrentStep, setFormLoading]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "event":
        return <EventForm isNew={!eventId} />;
      case "perpetrator":
        return <PerpetratorForm isNew={!eventId} />;
      case "victim":
        return <VictimForm isNew={!eventId} />;
      case "outcome":
        return <OutcomeForm isNew={!eventId} />;
      case "context":
        return <ContextForm isNew={!eventId} />;
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
    <div className="flex flex-col md:flex-row gap-8 md:min-h-screen">
      <StepTracker
        currentStep={currentStep}
        onStepClick={setCurrentStep}
        isEditing={!!eventId}
      />
      <div className="w-full mx-auto h-[calc(100vh-200px)] md:h-auto overflow-y-auto md:overflow-visible max-md:pt-4">
        {renderCurrentStep()}
      </div>
    </div>
  );
}
