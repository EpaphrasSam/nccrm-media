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
import useSWR from "swr";
import { fetchReporters } from "@/services/reporters/api";
import { fetchSubIndicators } from "@/services/sub-indicators/api";
import { fetchThematicAreas } from "@/services/thematic-areas/api";
import { cn } from "@/lib/utils";
import { FaChevronRight } from "react-icons/fa";

const eventSchema = z.object({
  reporterId: z.string().min(1, "Reporter is required"),
  date: z.string().min(1, "Report date is required"),
  eventDetails: z.string().min(1, "Event details are required"),
  when: z.string().min(1, "When is required"),
  where: z.string().min(1, "Where is required"),
  locationDetails: z.string().min(1, "Location details are required"),
  subIndicatorId: z.string().min(1, "What is required"),
  thematicAreaId: z.string().min(1, "Thematic area is required"),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  isNew?: boolean;
}

export function EventForm({ isNew = false }: EventFormProps) {
  const { setEventForm, currentEvent, isLoading, setLoading, setCurrentStep } =
    useEventsStore();

  const { data: reporters } = useSWR("reporters", fetchReporters);
  const { data: subIndicators } = useSWR("subIndicators", fetchSubIndicators);
  const { data: thematicAreas } = useSWR("thematicAreas", fetchThematicAreas);
  const [localLoading, setLocalLoading] = useState(true);

  const getDefaultValues = useCallback(
    () => ({
      reporterId: currentEvent?.reporterId || "",
      date: currentEvent?.date || "",
      eventDetails: currentEvent?.eventDetails || "",
      when: currentEvent?.when || "",
      where: currentEvent?.where || "",
      locationDetails: currentEvent?.locationDetails || "",
      subIndicatorId: currentEvent?.subIndicatorId || "",
      thematicAreaId: currentEvent?.thematicAreaId || "",
    }),
    [currentEvent]
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

  const onSubmit = async (data: EventFormValues) => {
    const formData = {
      reporterId: data.reporterId,
      date: data.date,
      eventDetails: data.eventDetails,
      when: data.when,
      where: data.where,
      locationDetails: data.locationDetails,
      subIndicatorId: data.subIndicatorId,
      thematicAreaId: data.thematicAreaId,
    };
    setEventForm(formData);
    setCurrentStep("perpetrator");
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
          name="reporterId"
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
              isInvalid={!!errors.reporterId}
              errorMessage={errors.reporterId?.message}
            >
              {reporters?.map((reporter) => (
                <SelectItem key={reporter.id} value={reporter.id}>
                  {reporter.name}
                </SelectItem>
              )) || []}
            </Select>
          )}
        />

        <Controller
          name="date"
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
              isInvalid={!!errors.date}
              errorMessage={errors.date?.message}
            />
          )}
        />

        <Controller
          name="eventDetails"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Event Details"
              labelPlacement="outside"
              placeholder="Enter the event details"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.eventDetails}
              errorMessage={errors.eventDetails?.message}
            />
          )}
        />

        <Controller
          name="when"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              label="When"
              labelPlacement="outside"
              placeholder="Select the date"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.when}
              errorMessage={errors.when?.message}
            />
          )}
        />

        <Controller
          name="where"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Where"
              labelPlacement="outside"
              placeholder="Select the region"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.where}
              errorMessage={errors.where?.message}
            />
          )}
        />

        <Controller
          name="locationDetails"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Location Details"
              labelPlacement="outside"
              placeholder="Enter the location details"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.locationDetails}
              errorMessage={errors.locationDetails?.message}
            />
          )}
        />

        <Controller
          name="subIndicatorId"
          control={control}
          render={({ field }) => (
            <Select
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0]?.toString();
                if (value) field.onChange(value);
              }}
              label="What"
              labelPlacement="outside"
              placeholder="Select the sub indicator"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.subIndicatorId}
              errorMessage={errors.subIndicatorId?.message}
            >
              {subIndicators?.map((subIndicator) => (
                <SelectItem key={subIndicator.id} value={subIndicator.id}>
                  {subIndicator.name}
                </SelectItem>
              )) || []}
            </Select>
          )}
        />

        <Controller
          name="thematicAreaId"
          control={control}
          render={({ field }) => (
            <Select
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0]?.toString();
                if (value) field.onChange(value);
              }}
              label="Thematic area"
              labelPlacement="outside"
              placeholder="Select the thematic area"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.thematicAreaId}
              errorMessage={errors.thematicAreaId?.message}
            >
              {thematicAreas?.map((thematicArea) => (
                <SelectItem key={thematicArea.id} value={thematicArea.id}>
                  {thematicArea.name}
                </SelectItem>
              )) || []}
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
