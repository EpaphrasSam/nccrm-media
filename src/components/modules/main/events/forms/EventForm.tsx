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
import { FaChevronRight } from "react-icons/fa";

const eventSchema = z.object({
  reporter_id: z.string().min(1, "Reporter is required"),
  report_date: z.string().min(1, "Report date is required"),
  details: z.string().min(1, "Event details are required"),
  event_date: z.string().min(1, "Event date is required"),
  region_id: z.string().min(1, "Region is required"),
  location_details: z.string().min(1, "Location details are required"),
  sub_indicator_id: z.string().min(1, "Sub indicator is required"),
  thematic_area_id: z.string().min(1, "Thematic area is required"),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  isNew?: boolean;
}

export function EventForm({ isNew = false }: EventFormProps) {
  const {
    setEventForm,
    currentEvent,
    isFormLoading,
    setFormLoading,
    formData,
    setCurrentStep,
    reporters,
    regions,
    subIndicators,
    thematicAreas,
  } = useEventsStore();

  const [localLoading, setLocalLoading] = useState(true);

  const getDefaultValues = useCallback(
    () => ({
      reporter_id: formData.event?.reporter_id || "",
      report_date: formData.event?.report_date || "",
      details: formData.event?.details || "",
      event_date: formData.event?.event_date || "",
      region_id: formData.event?.region_id || "",
      location_details: formData.event?.location_details || "",
      sub_indicator_id: formData.event?.sub_indicator_id || "",
      thematic_area_id: formData.event?.thematic_area_id || "",
    }),
    [formData.event]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
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

  const onSubmit = async (data: EventFormValues) => {
    setEventForm(data);
    setCurrentStep("perpetrator");
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
        <div className="flex justify-end mt-auto pt-8">
          <Skeleton className="h-10 w-[110px]" />
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col min-h-[calc(100vh-14rem)]"
    >
      <div className="flex flex-col gap-6">
        <Controller
          name="reporter_id"
          control={control}
          render={({ field }) => (
            <Select
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0]?.toString();
                if (value) field.onChange(value);
              }}
              label="Reporter"
              labelPlacement="outside"
              placeholder="Select the reporter"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.reporter_id}
              errorMessage={errors.reporter_id?.message}
            >
              {reporters?.map((reporter) => (
                <SelectItem key={reporter.id} textValue={reporter.name}>
                  {reporter.name}
                </SelectItem>
              ))}
            </Select>
          )}
        />

        <Controller
          name="report_date"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              label="Report Date"
              labelPlacement="outside"
              placeholder="Select the report date"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.report_date}
              errorMessage={errors.report_date?.message}
            />
          )}
        />

        <Controller
          name="details"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Event Details"
              labelPlacement="outside"
              placeholder="Enter the event details"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.details}
              errorMessage={errors.details?.message}
            />
          )}
        />

        <Controller
          name="event_date"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              label="Event Date"
              labelPlacement="outside"
              placeholder="Select the event date"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.event_date}
              errorMessage={errors.event_date?.message}
            />
          )}
        />

        <Controller
          name="region_id"
          control={control}
          render={({ field }) => (
            <Select
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0]?.toString();
                if (value) field.onChange(value);
              }}
              label="Region"
              labelPlacement="outside"
              placeholder="Select the region"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.region_id}
              errorMessage={errors.region_id?.message}
            >
              {regions?.map((region) => (
                <SelectItem key={region.id} textValue={region.name}>
                  {region.name}
                </SelectItem>
              ))}
            </Select>
          )}
        />

        <Controller
          name="location_details"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Location Details"
              labelPlacement="outside"
              placeholder="Enter the location details"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.location_details}
              errorMessage={errors.location_details?.message}
            />
          )}
        />

        <Controller
          name="sub_indicator_id"
          control={control}
          render={({ field }) => (
            <Select
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0]?.toString();
                if (value) field.onChange(value);
              }}
              label="Sub Indicator"
              labelPlacement="outside"
              placeholder="Select the sub indicator"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.sub_indicator_id}
              errorMessage={errors.sub_indicator_id?.message}
            >
              {subIndicators?.map((indicator) => (
                <SelectItem key={indicator.id} textValue={indicator.name}>
                  {indicator.name}
                </SelectItem>
              ))}
            </Select>
          )}
        />

        <Controller
          name="thematic_area_id"
          control={control}
          render={({ field }) => (
            <Select
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0]?.toString();
                if (value) field.onChange(value);
              }}
              label="Thematic Area"
              labelPlacement="outside"
              placeholder="Select the thematic area"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.thematic_area_id}
              errorMessage={errors.thematic_area_id?.message}
            >
              {thematicAreas?.map((area) => (
                <SelectItem key={area.id} textValue={area.name}>
                  {area.name}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </div>

      <div className="flex justify-end mt-auto pt-8">
        <Button
          type="submit"
          color="primary"
          endContent={<FaChevronRight />}
          className={cn(buttonStyles, "bg-brand-red-dark px-10")}
          isLoading={isSubmitting}
        >
          Next
        </Button>
      </div>
    </form>
  );
}
