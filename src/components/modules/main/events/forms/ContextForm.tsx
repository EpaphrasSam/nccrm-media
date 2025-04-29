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
  cn,
  addToast,
} from "@heroui/react";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { useEventsStore } from "@/store/events";
import { useEffect, useCallback } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { Gender } from "@/services/events/types";
import { FileUpload } from "./FileUpload";
import { usePermissions } from "@/hooks/usePermissions";

const contextSchema = z.object({
  info_credibility: z.string().optional(),
  info_source: z.string().optional(),
  geo_scope: z.string().optional(),
  impact: z.string().optional(),
  weapons_use: z.string().optional(),
  context_details: z.string().optional(),
  docs: z.array(z.instanceof(File)).optional(),
  files: z.array(z.string()).optional(),
  newDocs: z.array(z.instanceof(File)).optional(),
});

type ContextFormValues = z.infer<typeof contextSchema>;

interface ContextFormProps {
  isNew?: boolean;
}

export function ContextForm({ isNew = false }: ContextFormProps) {
  const {
    setContextForm,
    currentEvent,
    isFormLoading: storeLoading,
    setFormLoading,
    formData,
    setCurrentStep,
    createEvent,
    updateEvent,
  } = useEventsStore();

  const { hasPermission, isLoading: permissionsLoading } = usePermissions();

  const getDefaultValues = useCallback(
    () => ({
      info_credibility: formData.context?.info_credibility || "",
      info_source: formData.context?.info_source || "",
      geo_scope: formData.context?.geo_scope || "",
      impact: formData.context?.impact || "",
      weapons_use: formData.context?.weapons_use || "",
      context_details: formData.context?.context_details || "",
      docs: [],
      files: currentEvent?.files || [],
      newDocs: [],
    }),
    [formData.context, currentEvent]
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<ContextFormValues>({
    resolver: zodResolver(contextSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (isNew) {
      setFormLoading(false);
    } else if (!storeLoading && currentEvent) {
      reset(getDefaultValues());
    }
  }, [
    isNew,
    currentEvent,
    storeLoading,
    reset,
    getDefaultValues,
    setFormLoading,
  ]);

  const canSubmit = isNew
    ? hasPermission("event", "add")
    : hasPermission("event", "edit");

  const onSubmit = async (data: ContextFormValues) => {
    if (!canSubmit) return;
    try {
      setContextForm(data);

      if (!formData.event) {
        addToast({
          title: "Error",
          description: "Event is required",
          color: "danger",
        });
        return;
      }

      const completeFormData = {
        reporter_id: formData.event.reporter_id || "",
        report_date: formData.event.report_date || new Date().toISOString(),
        details: formData.event.details || "",
        event_date: formData.event.event_date || new Date().toISOString(),
        location: formData.event.location,
        region: formData.event.region,
        district: formData.event.district,
        coordinates: formData.event.coordinates,
        location_details: formData.event.location_details || "",
        sub_indicator_id: formData.event.sub_indicator_id || "",
        follow_ups: formData.event.follow_ups || [],
        perpetrator: formData.perpetrator?.perpetrator || "",
        pep_age: formData.perpetrator?.pep_age || 0,
        pep_gender: (formData.perpetrator?.pep_gender || "male") as Gender,
        pep_occupation: formData.perpetrator?.pep_occupation || "",
        pep_organization: formData.perpetrator?.pep_organization || "",
        pep_note: formData.perpetrator?.pep_note || "",
        victim: formData.victim?.victim || "",
        victim_age: formData.victim?.victim_age || 0,
        victim_gender: (formData.victim?.victim_gender || "male") as Gender,
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
      };

      if (currentEvent) {
        await updateEvent(currentEvent.id, completeFormData);
      } else {
        await createEvent(completeFormData);
      }
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

  const isOverallLoading = storeLoading || permissionsLoading;

  if (isOverallLoading) {
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
            />
          )}
        />

        <div className="space-y-4">
          <h2 className="text-base font-semibold">Documents</h2>
          {!isNew && currentEvent?.files && currentEvent.files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Existing Files:</p>
              <div className="flex flex-wrap gap-2">
                {currentEvent.files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-100 rounded"
                  >
                    <a
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      File {index + 1}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Controller
            name={isNew ? "docs" : "files"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <FileUpload
                isNew={isNew}
                existingFiles={isNew ? [] : (value as string[])}
                onFileChange={(files) => {
                  if (isNew) {
                    // In create mode, directly update docs array
                    const currentDocs = control._formValues?.docs || [];
                    onChange([...currentDocs, ...files]);
                  } else {
                    // In edit mode, update newDocs array
                    const currentNewDocs = control._formValues?.newDocs || [];
                    setValue("newDocs", [...currentNewDocs, ...files]);
                  }
                }}
                onExistingFileRemove={(fileUrl) => {
                  // Only handle in edit mode
                  if (!isNew) {
                    const currentFiles = value as string[];
                    onChange(currentFiles.filter((f: string) => f !== fileUrl));
                  }
                }}
                onNewFileRemove={(file) => {
                  if (isNew) {
                    // Remove from docs array in create mode
                    const currentDocs = control._formValues?.docs || [];
                    onChange(currentDocs.filter((f: File) => f !== file));
                  } else {
                    // Remove from newDocs array in edit mode
                    const currentNewDocs = control._formValues?.newDocs || [];
                    setValue(
                      "newDocs",
                      currentNewDocs.filter((f: File) => f !== file)
                    );
                  }
                }}
              />
            )}
          />
        </div>

        <div className="flex justify-between mt-auto pt-8">
          <Button
            type="button"
            variant="flat"
            startContent={<FaChevronLeft />}
            className={cn(buttonStyles, "bg-brand-red-dark px-10 text-white")}
            onClick={() => setCurrentStep("outcome")}
            isDisabled={isSubmitting}
          >
            Previous
          </Button>
          <Button
            type="submit"
            color="primary"
            className={`${buttonStyles} bg-brand-green-dark px-12`}
            isLoading={isSubmitting}
            isDisabled={!canSubmit || isSubmitting}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
