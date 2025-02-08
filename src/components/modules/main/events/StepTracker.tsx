"use client";

import { EventFormStep } from "@/store/events";
import { Step, StepLabel, Stepper } from "@mui/material";
import { styled } from "@mui/material/styles";

interface StepTrackerProps {
  currentStep: EventFormStep;
  onStepClick?: (step: EventFormStep) => void;
  isEditing?: boolean;
}

const steps: { key: EventFormStep; label: string }[] = [
  { key: "event", label: "Event" },
  { key: "perpetrator", label: "Perpetrator" },
  { key: "victim", label: "Victim" },
  { key: "outcome", label: "Outcomes" },
  { key: "context", label: "Context" },
];

// Custom styled components for the stepper
const CustomStepper = styled(Stepper)(() => ({
  "& .MuiStepConnector-line": {
    borderColor: "#C9C9C9",
  },
  "& .MuiStepConnector-active": {
    "& .MuiStepConnector-line": {
      borderColor: "#AC0000",
    },
  },
  "& .MuiStepConnector-completed": {
    "& .MuiStepConnector-line": {
      borderColor: "#AC0000",
    },
  },
  "& .MuiStep-root": {
    cursor: "pointer",
    padding: 0,
  },
  "& .MuiStepLabel-root": {
    padding: 0,
  },
  "& .MuiStepIcon-root": {
    color: "#C9C9C9",
    "&.Mui-active": {
      color: "#AC0000",
    },
    "&.Mui-completed": {
      color: "#AC0000",
    },
  },
  "& .MuiStepLabel-label": {
    fontFamily: "Roboto",
    fontSize: "14px",
    "&.Mui-active": {
      color: "#AC0000",
    },
    "&.Mui-completed": {
      color: "#374151",
    },
  },
}));

export function StepTracker({
  currentStep,
  onStepClick,
  isEditing = false,
}: StepTrackerProps) {
  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);

  const handleStepClick = (index: number) => {
    if (isEditing || index <= currentStepIndex) {
      onStepClick?.(steps[index].key);
    }
  };

  return (
    <div className="w-full md:w-[200px] py-6 px-4 md:sticky md:top-6">
      {/* Mobile View */}
      <div className="block md:hidden">
        <CustomStepper activeStep={currentStepIndex} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step.key} onClick={() => handleStepClick(index)}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </CustomStepper>
      </div>
      {/* Desktop View */}
      <div className="hidden md:block">
        <CustomStepper activeStep={currentStepIndex} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.key} onClick={() => handleStepClick(index)}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </CustomStepper>
      </div>
    </div>
  );
}
