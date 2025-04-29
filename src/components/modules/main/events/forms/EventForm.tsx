"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";
import {
  Input,
  Button,
  Textarea,
  Skeleton,
  Autocomplete,
  AutocompleteItem,
  addToast,
} from "@heroui/react";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { useEventsStore } from "@/store/events";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { FaChevronRight, FaPlus, FaTrash } from "react-icons/fa";
import useSWR from "swr";

// Helper functions for date formatting
const formatDateForInput = (dateString: string | null | undefined) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const formatDateForSubmit = (dateString: string) => {
  return new Date(dateString).toISOString();
};

const eventSchema = z.object({
  reporter_id: z.string().min(1, "Reporter is required"),
  report_date: z.string().min(1, "Report date is required"),
  details: z.string().optional(),
  event_date: z.string().optional(),
  region: z.string().min(1, "Region is required"),
  district: z.string().min(1, "District is required"),
  location_details: z.string().optional(),
  sub_indicator_id: z.string().min(1, "Sub indicator is required"),
  follow_ups: z.array(z.string()).default([]),
  location: z.string().optional(),
  coordinates: z.object({ lat: z.number(), lon: z.number() }).optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  isNew?: boolean;
}

export interface EventFormData {
  reporter_id: string;
  report_date: string;
  details?: string;
  event_date?: string;
  region: string;
  district: string;
  location_details?: string;
  sub_indicator_id: string;
  follow_ups: string[];
  location: string;
}

// Add these interfaces before the EventForm component
interface SubIndicatorItem {
  id: string;
  name: string;
  type: "sub";
  textValue: string;
  selectable: true;
}

interface MainIndicatorGroup {
  id: string;
  name: string;
  type: "main";
  textValue: string;
  selectable: false;
  subIndicators: SubIndicatorItem[];
}

interface ThematicAreaGroup {
  id: string;
  name: string;
  type: "thematic";
  textValue: string;
  selectable: false;
  mainIndicators: Record<string, MainIndicatorGroup>;
}

// Define NominatimResult type
interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

// Update nominatimFetcher to handle errors and show toast
const nominatimFetcher = async (query: string) => {
  if (!query) return [];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&addressdetails=1`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "NCCRM-Media/1.0",
        },
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch locations");
    }
    return res.json();
  } catch (error: unknown) {
    addToast({
      title: "Location Error",
      description:
        error instanceof Error ? error.message : "Failed to fetch locations.",
      color: "danger",
    });
    return [];
  }
};

export function EventForm({ isNew = false }: EventFormProps) {
  const { data: session } = useSession();
  const {
    setEventForm,
    currentEvent,
    formData,
    setCurrentStep,
    subIndicators,
    isFormLoading,
    setFormLoading,
  } = useEventsStore();

  const [localLoading, setLocalLoading] = useState(!formData.event);

  // Location state
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<NominatimResult | null>(null);

  // SWR for Nominatim
  const { data: locationResults, isValidating: isLocationLoading } = useSWR<
    NominatimResult[]
  >(locationQuery.length > 2 ? locationQuery : null, nominatimFetcher, {
    dedupingInterval: 60000,
  });

  const getDefaultValues = useCallback(
    () => ({
      reporter_id: session?.user?.id || "",
      report_date: formatDateForInput(
        formData.event?.report_date || new Date().toISOString()
      ),
      details: formData.event?.details || "",
      event_date: formatDateForInput(formData.event?.event_date) || "",
      region: formData.event?.region || "",
      district: formData.event?.district || "",
      location_details: formData.event?.location_details || "",
      sub_indicator_id: formData.event?.sub_indicator_id || "",
      follow_ups: currentEvent?.follow_ups || [],
      location: formData.event?.location || "",
      coordinates: formData.event?.coordinates || undefined,
    }),
    [formData.event, currentEvent, session?.user?.id]
  );

  const {
    control,
    handleSubmit,
    reset,
    register,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      ...getDefaultValues(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "follow_ups" as never,
  });

  const watchedLocation = watch("location");
  const watchedDistrict = watch("district");
  const watchedRegion = watch("region");

  // Handle loading states
  useEffect(() => {
    if (formData.event) {
      // If we already have form data, no loading needed
      setLocalLoading(false);
      setFormLoading(false);
    } else if (!isFormLoading) {
      // Add delay only on initial load
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.event, isFormLoading, setFormLoading]);

  // Handle form reset
  useEffect(() => {
    reset({
      ...getDefaultValues(),
      reporter_id: session?.user?.id || "",
    });
  }, [reset, getDefaultValues, session?.user?.id]);

  const onSubmit = async (data: EventFormValues) => {
    // Check if event_date is in the future
    if (data.event_date) {
      const eventDate = new Date(data.event_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison

      if (eventDate > today) {
        setError("event_date", {
          type: "manual",
          message: "Event date cannot be in the future",
        });
        return;
      }
    }

    const formattedData = {
      ...data,
      report_date: formatDateForSubmit(data.report_date),
      event_date: data.event_date ? formatDateForSubmit(data.event_date) : "",
      details: data.details || "",
      location_details: data.location_details || "",
    };
    setEventForm(formattedData);
    setCurrentStep("perpetrator");
  };

  // Handle location selection
  const handleLocationSelect = (item: NominatimResult) => {
    setSelectedLocation(item);
    console.log(item);
    const parts = item.display_name.split(",").map((s: string) => s.trim());
    const [location, district, region] = parts;
    setValue("location", location || "");
    setValue("district", district || "");
    setValue("region", region || "");
    setValue("coordinates", {
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    });
  };

  if (isFormLoading || localLoading) {
    return (
      <div className="flex flex-col h-screen">
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
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full max-w-2xl" />
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
        <Input
          value={session?.user?.name || ""}
          label="Reporter"
          labelPlacement="outside"
          readOnly
          variant="bordered"
          classNames={inputStyles}
        />

        <Controller
          name="reporter_id"
          control={control}
          defaultValue={session?.user?.id || ""}
          render={({ field }) => <Input {...field} type="hidden" />}
        />

        <Input
          value={formatDateForInput(new Date().toISOString())}
          type="date"
          label="Report Date"
          labelPlacement="outside"
          variant="bordered"
          classNames={inputStyles}
          readOnly
        />

        <Controller
          name="report_date"
          control={control}
          render={({ field }) => <Input {...field} type="hidden" />}
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

        {/* Location Autocomplete Section */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="block font-medium">Search Location</label>
            <Autocomplete
              inputValue={locationQuery}
              onInputChange={setLocationQuery}
              items={locationResults || []}
              isLoading={isLocationLoading}
              inputProps={{
                classNames: {
                  inputWrapper: "py-6 rounded-xlg",
                },
              }}
              placeholder="Type a location (e.g. Takoradi)"
              onSelectionChange={(key) => {
                const item = (locationResults || []).find(
                  (i) => String(i.place_id) === String(key)
                );
                if (item) handleLocationSelect(item);
              }}
              selectedKey={selectedLocation?.place_id}
              labelPlacement="outside"
              variant="bordered"
            >
              {(item: NominatimResult) => (
                <AutocompleteItem
                  key={item.place_id}
                  textValue={item.display_name}
                >
                  {item.display_name}
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>

          <div className="border-b-2 border-brand-gray-light" />

          <Input
            label="Location"
            labelPlacement="outside"
            placeholder="Location"
            value={watchedLocation || ""}
            isReadOnly
            variant="bordered"
            classNames={inputStyles}
          />
          <Input
            label="District"
            labelPlacement="outside"
            placeholder="District"
            value={watchedDistrict || ""}
            isReadOnly
            variant="bordered"
            classNames={inputStyles}
          />
          <Input
            label="Region"
            labelPlacement="outside"
            placeholder="Region"
            value={watchedRegion || ""}
            isReadOnly
            variant="bordered"
            classNames={inputStyles}
          />
        </div>

        <Controller
          name="sub_indicator_id"
          control={control}
          render={({ field }) => {
            // Group items hierarchically but keep flat structure
            const groupedItems = subIndicators?.reduce((acc, subIndicator) => {
              const thematicArea = subIndicator.main_indicator?.thematic_area;
              const mainIndicator = subIndicator.main_indicator;

              if (!thematicArea || !mainIndicator) return acc;

              // Initialize thematic area if not exists
              if (!acc[thematicArea.id]) {
                acc[thematicArea.id] = {
                  id: thematicArea.id,
                  name: thematicArea.name,
                  type: "thematic",
                  textValue: thematicArea.name,
                  selectable: false,
                  mainIndicators: {},
                };
              }

              // Initialize main indicator if not exists
              if (!acc[thematicArea.id].mainIndicators[mainIndicator.id]) {
                acc[thematicArea.id].mainIndicators[mainIndicator.id] = {
                  id: mainIndicator.id,
                  name: mainIndicator.name,
                  type: "main",
                  textValue: mainIndicator.name,
                  selectable: false,
                  subIndicators: [],
                };
              }

              // Add sub indicator with simplified textValue
              acc[thematicArea.id].mainIndicators[
                mainIndicator.id
              ].subIndicators.push({
                id: subIndicator.id,
                name: subIndicator.name,
                type: "sub",
                textValue: subIndicator.name, // Only use sub-indicator name for search
                selectable: true,
              });

              return acc;
            }, {} as Record<string, ThematicAreaGroup>);

            // Flatten the structure
            const items = Object.values(groupedItems || {}).flatMap(
              (thematicArea: ThematicAreaGroup) => [
                thematicArea,
                ...Object.values(thematicArea.mainIndicators).flatMap(
                  (mainIndicator: MainIndicatorGroup) => [
                    mainIndicator,
                    ...mainIndicator.subIndicators,
                  ]
                ),
              ]
            );

            return (
              <Autocomplete
                selectedKey={field.value ? field.value : undefined}
                onSelectionChange={(key) => {
                  if (key) {
                    field.onChange(key.toString());
                    // Only show sub-indicator name when selected
                    const selectedItem = items.find((item) => item.id === key);
                    if (selectedItem?.type === "sub") {
                      const input = document.querySelector(
                        `input[name="${field.name}"]`
                      ) as HTMLInputElement;
                      if (input) input.value = selectedItem.name;
                    }
                  }
                }}
                defaultInputValue={
                  field.value
                    ? (() => {
                        const selectedItem = items.find(
                          (item) => item.id === field.value
                        );
                        return selectedItem?.type === "sub"
                          ? selectedItem.name
                          : "";
                      })()
                    : ""
                }
                items={items}
                label="Sub Indicator"
                labelPlacement="outside"
                placeholder="Search for a sub indicator"
                variant="bordered"
                classNames={{
                  // ...inputStyles,
                  listbox: "overflow-visible", // Enable overflow for sticky positioning
                }}
                inputProps={{
                  classNames: {
                    label: "text-base font-medium pb-2",
                    inputWrapper: "py-6 rounded-xlg",
                    base: "border-brand-gray-light",
                  },
                }}
                isInvalid={!!errors.sub_indicator_id}
                errorMessage={errors.sub_indicator_id?.message}
                disabledKeys={items
                  .filter((item) => !item.selectable)
                  .map((item) => item.id)}
              >
                {(item) => (
                  <AutocompleteItem
                    key={item.id}
                    textValue={item.textValue}
                    className={cn(
                      "transition-colors",
                      item.type === "thematic" &&
                        "flex w-full sticky top-0 z-20 py-2 px-2 bg-default-100 shadow-small rounded-small",
                      item.type === "main" &&
                        "flex w-full sticky top-10 z-10 py-1.5 px-2 bg-gray-50/80 border-b",
                      item.type === "sub" &&
                        "py-2 px-2 hover:bg-gray-100 cursor-pointer",
                      !item.selectable && "pointer-events-none"
                    )}
                  >
                    {item.type === "thematic" ? (
                      <div className="flex items-center w-full">
                        <span className="font-semibold text-sm text-gray-900">
                          {item.name}
                        </span>
                      </div>
                    ) : item.type === "main" ? (
                      <div className="flex items-center w-full">
                        <span className="font-medium text-sm ml-1 text-gray-800">
                          {item.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm pl-2">{item.name}</span>
                    )}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            );
          }}
        />

        {!isNew && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Follow-ups</h2>
              <Button
                type="button"
                variant="light"
                color="primary"
                startContent={<FaPlus className="h-4 w-4" />}
                onPress={() => append("")}
                className={buttonStyles}
              >
                Add Follow-up
              </Button>
            </div>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <Textarea
                    {...register(`follow_ups.${index}`)}
                    placeholder={`Follow-up ${index + 1}`}
                    className="flex-1"
                    classNames={inputStyles}
                  />
                  <Button
                    type="button"
                    isIconOnly
                    variant="light"
                    color="danger"
                    onPress={() => remove(index)}
                    className="mt-1"
                  >
                    <FaTrash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
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
