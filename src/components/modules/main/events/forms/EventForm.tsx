"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { eventSchema, type EventFormValues } from "./schemas";

interface EventFormProps {
  isNew?: boolean;
  registerSaveCallback?: (stepKey: string, callback: () => void) => void;
  registerValidateCallback?: (
    stepKey: string,
    callback: () => Promise<boolean>
  ) => void;
}

// Helper functions for date formatting
const formatDateForInput = (dateString: string | null | undefined) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const formatDateForSubmit = (dateString: string) => {
  return new Date(dateString).toISOString();
};

// Define NominatimResult type
interface NominatimResult {
  place_id: number;
  name: string;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    county: string;
    state: string;
    region: string;
  };
}

// Update nominatimFetcher to handle errors and show toast
const nominatimFetcher = async (query: string) => {
  if (!query) return [];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&addressdetails=1&countrycodes=gh`,
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

export function EventForm({
  isNew = false,
  registerSaveCallback,
  registerValidateCallback,
}: EventFormProps) {
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
  const {
    data: locationResults,
    isValidating: isLocationLoading,
    mutate: mutateLocation,
  } = useSWR<NominatimResult[]>(
    locationQuery.length > 2 ? locationQuery : null,
    nominatimFetcher,
    {
      dedupingInterval: 60000,
    }
  );

  // Add state for What Autocomplete search
  const [whatQuery, setWhatQuery] = useState("");
  // Filter subIndicators by the search query
  const filteredSubIndicators = whatQuery
    ? (subIndicators || []).filter((item) =>
        item.name.toLowerCase().includes(whatQuery.toLowerCase())
      )
    : subIndicators || [];

  const getDefaultValues = useCallback(
    () => ({
      reporter_id: currentEvent?.reporter?.id || session?.user?.id || "",
      report_date: formatDateForInput(
        currentEvent?.report_date ||
          formData.event?.report_date ||
          new Date().toISOString()
      ),
      details: currentEvent?.details || formData.event?.details || "",
      event_date:
        formatDateForInput(
          currentEvent?.event_date || formData.event?.event_date
        ) || formatDateForInput(new Date().toISOString()),
      region: currentEvent?.region || formData.event?.region || "",
      district: currentEvent?.district || formData.event?.district || "",
      location_details:
        currentEvent?.location_details ||
        formData.event?.location_details ||
        "",
      sub_indicator_id:
        currentEvent?.sub_indicator_id ||
        formData.event?.sub_indicator_id ||
        "",
      follow_ups: currentEvent?.follow_ups || [],
      city: currentEvent?.city || formData.event?.city || "",
      coordinates:
        currentEvent?.coordinates || formData.event?.coordinates || "",
    }),
    [formData.event, currentEvent, session?.user?.id]
  );

  const {
    control,
    handleSubmit,
    register,
    setError,
    setValue,
    watch,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: getDefaultValues(),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "follow_ups" as never,
  });

  const watchedCity = watch("city");
  const watchedDistrict = watch("district");
  const watchedRegion = watch("region");
  const watchedSubIndicatorId = watch("sub_indicator_id");

  // Sync input value with selected item
  useEffect(() => {
    if (watchedSubIndicatorId) {
      const selected = (subIndicators || []).find(
        (item) => item.id === watchedSubIndicatorId
      );
      if (selected && whatQuery !== selected.name) {
        setWhatQuery(selected.name);
      }
    } else if (!watchedSubIndicatorId && whatQuery !== "") {
      setWhatQuery("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedSubIndicatorId, subIndicators]);

  // Register save callback for step navigation
  useEffect(() => {
    if (registerSaveCallback) {
      const saveFormData = () => {
        const currentData = getValues();
        const formattedData = {
          ...currentData,
          report_date: formatDateForSubmit(currentData.report_date),
          event_date: currentData.event_date
            ? formatDateForSubmit(currentData.event_date)
            : "",
          details: currentData.details || "",
          location_details: currentData.location_details || "",
        };
        setEventForm(formattedData);
      };
      registerSaveCallback("event", saveFormData);
    }
  }, [registerSaveCallback, getValues, setEventForm]);

  // Register validation callback for step navigation
  useEffect(() => {
    if (registerValidateCallback) {
      const validateFormData = async () => {
        // Instead of just trigger(), actually submit the form to activate reValidateMode
        return new Promise<boolean>((resolve) => {
          handleSubmit(
            () => {
              // Valid - resolve true
              resolve(true);
            },
            () => {
              // Invalid - resolve false, but form errors are now shown and reValidateMode is active
              resolve(false);
            }
          )();
        });
      };
      registerValidateCallback("event", validateFormData);
    }
  }, [registerValidateCallback, handleSubmit]);

  // Handle loading state and form reset for edit mode
  useEffect(() => {
    if (isNew) {
      setFormLoading(false);
    } else if (!isFormLoading && currentEvent) {
      // Only reset on initial load, not when store updates
      reset(getDefaultValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, currentEvent?.id, isFormLoading, reset, setFormLoading]);

  // Handle form reset for new mode (including Clear Form)
  useEffect(() => {
    if (isNew) {
      reset(getDefaultValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, formData.event, reset]);

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
    setValue("city", item.name || "");
    setValue("district", item.address?.county || "");
    setValue("region", item.address?.state || item.address?.region || "");
    setValue("coordinates", `(${item.lat}, ${item.lon})`);
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
          value={currentEvent?.reporter?.name || session?.user?.name || ""}
          label="Reporter"
          labelPlacement="outside"
          readOnly
          variant="bordered"
          classNames={inputStyles}
        />
        <Controller
          name="reporter_id"
          control={control}
          defaultValue={currentEvent?.reporter?.id || session?.user?.id || ""}
          render={({ field }) => <Input {...field} type="hidden" />}
        />{" "}
        <Controller
          name="report_date"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              label="Report Date"
              labelPlacement="outside"
              variant="bordered"
              classNames={inputStyles}
              readOnly
            />
          )}
        />
        <Controller
          name="sub_indicator_id"
          control={control}
          render={({ field }) => {
            return (
              <Autocomplete
                selectedKey={field.value || null}
                onSelectionChange={(key) => {
                  field.onChange(key || "");
                  const selected = (subIndicators || []).find(
                    (item) => item.id === key
                  );
                  setWhatQuery(selected ? selected.name : "");
                }}
                items={filteredSubIndicators}
                inputValue={whatQuery}
                onInputChange={setWhatQuery}
                label="What"
                labelPlacement="outside"
                placeholder="Search for what"
                variant="bordered"
                classNames={{
                  listbox: "overflow-visible",
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
              >
                {(item) => (
                  <AutocompleteItem
                    key={item.id}
                    textValue={item.name}
                    className={cn("py-2 px-2 hover:bg-gray-100 cursor-pointer")}
                  >
                    <span className="text-sm pl-2">{item.name}</span>
                  </AutocompleteItem>
                )}
              </Autocomplete>
            );
          }}
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
              allowsCustomValue={true}
              inputProps={{
                classNames: {
                  inputWrapper: "py-6 rounded-xlg",
                },
              }}
              placeholder="Type a location"
              onFocus={() => {
                // If there's a value, trigger a fresh search
                if (locationQuery && locationQuery.length > 2) {
                  // Use SWR's mutate to force a fresh API call
                  mutateLocation();
                }
              }}
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
            label="City"
            labelPlacement="outside"
            placeholder="City"
            value={watchedCity || ""}
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
