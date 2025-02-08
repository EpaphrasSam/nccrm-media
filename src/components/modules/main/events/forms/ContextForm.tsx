"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Input,
  Button,
  Skeleton,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { useEventsStore } from "@/store/events";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { FaChevronLeft } from "react-icons/fa";

const contextSchema = z.object({
  informationCredibility: z
    .string()
    .min(1, "Information credibility is required"),
  informationSource: z.string().min(1, "Information source is required"),
  geographicScope: z.string().min(1, "Geographic scope is required"),
  impact: z.string().min(1, "Impact is required"),
  weaponsUse: z.string().min(1, "Weapons use is required"),
  details: z.string().min(1, "Details are required"),
});

type ContextFormValues = z.infer<typeof contextSchema>;

interface ContextFormProps {
  isNew?: boolean;
}

export function ContextForm({ isNew = false }: ContextFormProps) {
  const router = useRouter();
  const {
    updateEvent,
    createEvent,
    currentEvent,
    isLoading,
    setLoading,
    setContextForm,
    formData,
    setCurrentStep
  } = useEventsStore();

  const [localLoading, setLocalLoading] = useState(true);

  const getDefaultValues = useCallback(
    () => ({
      informationCredibility:
        currentEvent?.context?.informationCredibility || "",
      informationSource: currentEvent?.context?.informationSource || "",
      geographicScope: currentEvent?.context?.geographicScope || "",
      impact: currentEvent?.context?.impact || "",
      weaponsUse: currentEvent?.context?.weaponsUse || "",
      details: currentEvent?.context?.details || "",
    }),
    [currentEvent]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContextFormValues>({
    resolver: zodResolver(contextSchema),
    defaultValues: getDefaultValues(),
  });

  // Handle loading state and form reset
  useEffect(() => {
    if (isNew) {
      setLoading(false);
      setLocalLoading(false);
    } else if (!isLoading && currentEvent) {
      reset(getDefaultValues());
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setLocalLoading(true);
    }
  }, [isNew, currentEvent, isLoading, reset, getDefaultValues, setLoading]);

  const onSubmit = async (data: ContextFormValues) => {
    try {
      // Save context form data to store
      setContextForm(data);

      // Now submit the complete form data
      const completeFormData = {
        ...formData.event,
        perpetrator: formData.perpetrator || {
          name: "",
          age: "",
          gender: "",
          occupation: "",
          organization: "",
          note: "",
        },
        victim: formData.victim || {
          name: "",
          age: "",
          gender: "",
          occupation: "",
          organization: "",
          note: "",
        },
        outcome: formData.outcome || {
          deathsMen: 0,
          deathsWomenChildren: 0,
          deathDetails: "",
          injuriesMen: 0,
          injuriesWomenChildren: 0,
          injuriesDetails: "",
          lossesProperty: 0,
          lossesDetails: "",
        },
        context: data,
      };

      if (currentEvent) {
        await updateEvent(currentEvent.id, completeFormData);
      } else {
        await createEvent(completeFormData);
      }

      router.push("/events");
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

  if (isLoading || localLoading) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-14rem)]">
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
            <Skeleton className="h-10 w-full max-w-2xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full max-w-2xl" />
          </div>
        </div>
        <div className="flex justify-center mt-auto pt-8">
          <Skeleton className="h-10 w-[110px]" />
        </div>
      </div>
    );
  }

  const credibilityOptions = [
    { id: "high", name: "High" },
    { id: "medium", name: "Medium" },
    { id: "low", name: "Low" },
  ];

  const impactOptions = [
    { id: "high", name: "High" },
    { id: "medium", name: "Medium" },
    { id: "low", name: "Low" },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col min-h-[calc(100vh-14rem)]"
    >
      <div className="flex flex-col gap-6">
        <Controller
          name="informationCredibility"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="Information Credibility"
              labelPlacement="outside"
              placeholder="Select the level of information credibility"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.informationCredibility}
              errorMessage={errors.informationCredibility?.message}
            >
              {credibilityOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </Select>
          )}
        />

        <Controller
          name="informationSource"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Information Source"
              labelPlacement="outside"
              placeholder="Enter the type of information source"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.informationSource}
              errorMessage={errors.informationSource?.message}
            />
          )}
        />

        <Controller
          name="geographicScope"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Geographic Scope"
              labelPlacement="outside"
              placeholder="Enter the geographic scope definition"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.geographicScope}
              errorMessage={errors.geographicScope?.message}
            />
          )}
        />

        <Controller
          name="impact"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="Impact"
              labelPlacement="outside"
              placeholder="Select the level of impact"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.impact}
              errorMessage={errors.impact?.message}
            >
              {impactOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </Select>
          )}
        />

        <Controller
          name="weaponsUse"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Weapons Use"
              labelPlacement="outside"
              placeholder="Enter the weapon use description"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.weaponsUse}
              errorMessage={errors.weaponsUse?.message}
            />
          )}
        />

        <Controller
          name="details"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Details"
              labelPlacement="outside"
              placeholder="Enter any additional details"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.details}
              errorMessage={errors.details?.message}
            />
          )}
        />
      </div>

      <div className="flex gap-4 justify-between mt-auto pt-8">
        <Button
          type="button"
          variant="flat"
          startContent={<FaChevronLeft />}
          className={cn(buttonStyles, "bg-brand-red-dark px-10 text-white")}
          onClick={() => setCurrentStep("outcome")}
        >
          Previous
        </Button>
        <Button
          type="submit"
          color="primary"
          className={cn(buttonStyles, "bg-brand-green-dark px-10")}
          isLoading={isSubmitting}
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
