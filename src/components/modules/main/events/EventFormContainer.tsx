"use client";

import { useEventsStore } from "@/store/events";
import { StepTracker } from "./StepTracker";
import { EventForm } from "./forms/EventForm";
import { PerpetratorForm } from "./forms/PerpetratorForm";
import { VictimForm } from "./forms/VictimForm";
import { OutcomeForm } from "./forms/OutcomeForm";
import { ContextForm } from "./forms/ContextForm";

interface EventFormContainerProps {
  eventId?: string;
}

export function EventFormContainer({ eventId }: EventFormContainerProps) {
  const { currentStep, setCurrentStep } = useEventsStore();

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

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <StepTracker
        currentStep={currentStep}
        onStepClick={setCurrentStep}
        isEditing={!!eventId}
      />
      <div className="w-full mx-auto">{renderCurrentStep()}</div>
    </div>
  );
}
