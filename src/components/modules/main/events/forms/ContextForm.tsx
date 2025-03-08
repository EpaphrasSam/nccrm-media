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
import { cn } from "@/lib/utils";
import { FaChevronLeft } from "react-icons/fa";

const contextSchema = z.object({
  info_credibility: z.string().min(1, "Information credibility is required"),
  info_source: z.string().min(1, "Information source is required"),
  geo_scope: z.string().min(1, "Geographic scope is required"),
  impact: z.string().min(1, "Impact is required"),
  weapons_use: z.string().min(1, "Weapons use is required"),
  context_details: z.string().min(1, "Details are required"),
  docs: z.array(z.instanceof(File)).optional(),
});

type ContextFormValues = z.infer<typeof contextSchema>;

interface ContextFormProps {
  isNew?: boolean;
}

export function ContextForm({ isNew = false }: ContextFormProps) {
  const {
    setContextForm,
    currentEvent,
    isFormLoading,
    setFormLoading,
    formData,
    setCurrentStep,
    createEvent,
    updateEvent,
  } = useEventsStore();

  const [localLoading, setLocalLoading] = useState(true);

  const getDefaultValues = useCallback(
    () => ({
      info_credibility: formData.context?.info_credibility || "",
      info_source: formData.context?.info_source || "",
      geo_scope: formData.context?.geo_scope || "",
      impact: formData.context?.impact || "",
      weapons_use: formData.context?.weapons_use || "",
      context_details: formData.context?.context_details || "",
      docs: formData.context?.docs || [],
    }),
    [formData.context]
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
      setFormLoading(false);
      setLocalLoading(false);
    } else if (!isFormLoading && currentEvent) {
      reset(getDefaultValues());
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setLocalLoading(true);
    }
  }, [
    isNew,
    currentEvent,
    isFormLoading,
    reset,
    getDefaultValues,
    setFormLoading,
  ]);

  const onSubmit = async (data: ContextFormValues) => {
    try {
      // Save context form data to store
      setContextForm(data);

      // Get the complete form data with required fields
      const completeFormData = {
        reporter_id: formData.event?.reporter_id || "",
        report_date: formData.event?.report_date || "",
        details: formData.event?.details || "",
        event_date: formData.event?.event_date || "",
        region_id: formData.event?.region_id || "",
        location_details: formData.event?.location_details || "",
        sub_indicator_id: formData.event?.sub_indicator_id || "",
        thematic_area_id: formData.event?.thematic_area_id || "",
        perpetrator: formData.perpetrator?.perpetrator || "",
        pep_age: formData.perpetrator?.pep_age || 0,
        pep_gender: formData.perpetrator?.pep_gender || "",
        pep_occupation: formData.perpetrator?.pep_occupation || "",
        pep_organization: formData.perpetrator?.pep_organization || "",
        pep_note: formData.perpetrator?.pep_note || "",
        victim: formData.victim?.victim || "",
        victim_age: formData.victim?.victim_age || 0,
        victim_gender: formData.victim?.victim_gender || "",
        victim_occupation: formData.victim?.victim_occupation || "",
        victim_organization: formData.victim?.victim_organization || "",
        victim_note: formData.victim?.victim_note || "",
        death_count_men: formData.outcome?.death_count_men || 0,
        death_count_women_chldren:
          formData.outcome?.death_count_women_chldren || 0,
        death_details: formData.outcome?.death_details || "",
        injury_count_men: formData.outcome?.injury_count_men || 0,
        injury_count_women_chldren:
          formData.outcome?.injury_count_women_chldren || 0,
        injury_details: formData.outcome?.injury_details || "",
        losses_count: formData.outcome?.losses_count || 0,
        losses_details: formData.outcome?.losses_details || "",
        ...data,
      } as const;

      if (currentEvent) {
        await updateEvent(currentEvent.id, completeFormData);
      } else {
        await createEvent(completeFormData);
      }
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

  if (isFormLoading || localLoading) {
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
          name="info_credibility"
          control={control}
          render={({ field }) => (
            <Select
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0]?.toString();
                if (value) field.onChange(value);
              }}
              label="Information Credibility"
              labelPlacement="outside"
              placeholder="Select the level of information credibility"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.info_credibility}
              errorMessage={errors.info_credibility?.message}
            >
              {credibilityOptions.map((option) => (
                <SelectItem key={option.id} textValue={option.name}>
                  {option.name}
                </SelectItem>
              ))}
            </Select>
          )}
        />

        <Controller
          name="info_source"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Information Source"
              labelPlacement="outside"
              placeholder="Enter the type of information source"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.info_source}
              errorMessage={errors.info_source?.message}
            />
          )}
        />

        <Controller
          name="geo_scope"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Geographic Scope"
              labelPlacement="outside"
              placeholder="Enter the geographic scope definition"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.geo_scope}
              errorMessage={errors.geo_scope?.message}
            />
          )}
        />

        <Controller
          name="impact"
          control={control}
          render={({ field }) => (
            <Select
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0]?.toString();
                if (value) field.onChange(value);
              }}
              label="Impact"
              labelPlacement="outside"
              placeholder="Select the level of impact"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.impact}
              errorMessage={errors.impact?.message}
            >
              {impactOptions.map((option) => (
                <SelectItem key={option.id} textValue={option.name}>
                  {option.name}
                </SelectItem>
              ))}
            </Select>
          )}
        />

        <Controller
          name="weapons_use"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Weapons Use"
              labelPlacement="outside"
              placeholder="Enter the weapon use description"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.weapons_use}
              errorMessage={errors.weapons_use?.message}
            />
          )}
        />

        <Controller
          name="context_details"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Details"
              labelPlacement="outside"
              placeholder="Enter any additional details"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.context_details}
              errorMessage={errors.context_details?.message}
            />
          )}
        />

        <Controller
          name="docs"
          control={control}
          render={({ field }) => (
            <Input
              type="file"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                field.onChange(files);
              }}
              label="Documents"
              labelPlacement="outside"
              placeholder="Upload supporting documents"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.docs}
              errorMessage={errors.docs?.message}
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
