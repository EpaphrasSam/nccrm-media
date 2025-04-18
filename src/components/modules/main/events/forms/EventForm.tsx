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
  Checkbox,
  Card,
  CardBody,
} from "@heroui/react";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { useEventsStore } from "@/store/events";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  FaChevronRight,
  FaMapMarkerAlt,
  FaPlus,
  FaSync,
  FaTrash,
} from "react-icons/fa";
import useSWR from "swr";
import { regionService, Coordinates } from "@/services/regions/api";
import dynamic from "next/dynamic";

// Dynamically import the map component with no SSR
// This is necessary because Leaflet requires window/document
const LocationMap = dynamic(() => import("@/components/common/LocationMap"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse" />,
});

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
  latitude: z.number().optional(),
  longitude: z.number().optional(),
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
  latitude?: number;
  longitude?: number;
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
  const [useCurrentLocation, setUseCurrentLocation] = useState(isNew);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(
    formData.event?.latitude && formData.event?.longitude
      ? {
          latitude: formData.event.latitude,
          longitude: formData.event.longitude,
        }
      : null
  );
  const [updateLocationMode, setUpdateLocationMode] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // SWR fetch for location data based on coordinates
  const { data: locationData, isLoading: isLoadingLocation } = useSWR(
    coordinates ? ["location", coordinates] : null,
    async () => {
      if (!coordinates) return null;
      const response = await regionService.fetchByCoordinates(coordinates);
      return "data" in response ? response.data : response;
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  );

  // Get current location using browser geolocation
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCoordinates(newCoordinates);
        setIsGettingLocation(false);
      },
      (error) => {
        setLocationError(`Error getting location: ${error.message}`);
        setIsGettingLocation(false);
        // Automatically enable map when geolocation fails
        setShowMap(true);
      },
      { enableHighAccuracy: true, maximumAge: 60000 }
    );
  }, []);

  // Handle checkbox change for current location
  const handleLocationToggle = (isChecked: boolean) => {
    setUseCurrentLocation(isChecked);
    setShowMap(!isChecked);

    if (isChecked) {
      getCurrentLocation();
    } else {
      // In edit mode without update mode, restore original coordinates
      if (
        !isNew &&
        !updateLocationMode &&
        formData.event?.latitude &&
        formData.event?.longitude
      ) {
        setCoordinates({
          latitude: formData.event.latitude,
          longitude: formData.event.longitude,
        });
      }
    }
  };

  // Handle map location selection
  const handleMapLocationSelect = (lat: number, lng: number) => {
    setCoordinates({
      latitude: lat,
      longitude: lng,
    });
  };

  // Function to start location update mode in edit
  const startLocationUpdate = () => {
    setUpdateLocationMode(true);
    // Default to using current location when updating
    setUseCurrentLocation(true);
    setShowMap(false);
    getCurrentLocation();
  };

  // Cancel location update in edit mode
  const cancelLocationUpdate = () => {
    setUpdateLocationMode(false);
    setShowMap(false);
    // Restore original coordinates
    if (formData.event?.latitude && formData.event?.longitude) {
      setCoordinates({
        latitude: formData.event.latitude,
        longitude: formData.event.longitude,
      });
    } else {
      setCoordinates(null);
    }
  };

  // Update form fields when location data is received
  useEffect(() => {
    if (locationData) {
      // Update the form values for region and district
      setValue("region", locationData.region);
      setValue("district", locationData.district);

      // Also update the latitude and longitude
      if (coordinates) {
        setValue("latitude", coordinates.latitude);
        setValue("longitude", coordinates.longitude);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationData, coordinates]);

  // Trigger geolocation on initial load for new events
  useEffect(() => {
    if (isNew && useCurrentLocation) {
      getCurrentLocation();
    }
  }, [isNew, useCurrentLocation, getCurrentLocation]);

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
      latitude: formData.event?.latitude,
      longitude: formData.event?.longitude,
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
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: getDefaultValues(),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "follow_ups" as never,
  });

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

        {/* Location Section */}
        <Card>
          <CardBody className="gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Location Information</h3>
                {!isNew && !updateLocationMode && (
                  <Button
                    type="button"
                    color="primary"
                    variant="light"
                    startContent={<FaMapMarkerAlt />}
                    onPress={startLocationUpdate}
                  >
                    Update Location
                  </Button>
                )}
                {!isNew && updateLocationMode && (
                  <Button
                    type="button"
                    color="danger"
                    variant="light"
                    onPress={cancelLocationUpdate}
                  >
                    Cancel Update
                  </Button>
                )}
              </div>

              {(isNew || updateLocationMode) && (
                <div className="mb-4">
                  <Checkbox
                    isSelected={useCurrentLocation}
                    onValueChange={handleLocationToggle}
                    color="danger"
                    className="mb-2"
                    size="sm"
                  >
                    Use my current location
                  </Checkbox>

                  {useCurrentLocation && (
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="flat"
                        color="primary"
                        startContent={<FaSync />}
                        isLoading={isGettingLocation}
                        onPress={getCurrentLocation}
                      >
                        Refresh location
                      </Button>
                      {coordinates && (
                        <span className="text-sm text-gray-500">
                          {coordinates.latitude.toFixed(4)},{" "}
                          {coordinates.longitude.toFixed(4)}
                        </span>
                      )}
                    </div>
                  )}

                  {!useCurrentLocation && (
                    <div className="mt-2">
                      {showMap && (
                        <div className="mb-4">
                          <LocationMap
                            initialPosition={
                              coordinates
                                ? {
                                    lat: coordinates.latitude,
                                    lng: coordinates.longitude,
                                  }
                                : undefined
                            }
                            onLocationSelect={handleMapLocationSelect}
                          />
                          {coordinates && (
                            <p className="mt-2 text-sm text-gray-500">
                              {coordinates.latitude.toFixed(6)},{" "}
                              {coordinates.longitude.toFixed(6)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {locationError && (
                    <p className="text-sm text-danger mt-1">{locationError}</p>
                  )}
                </div>
              )}

              <Controller
                name="region"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Region"
                    labelPlacement="outside"
                    placeholder={
                      isLoadingLocation ? "Loading region..." : "Region"
                    }
                    variant="bordered"
                    className="mb-2"
                    classNames={inputStyles}
                    isInvalid={!!errors.region}
                    errorMessage={errors.region?.message}
                    isDisabled={
                      isLoadingLocation || isNew || updateLocationMode
                    }
                    isReadOnly={isNew || updateLocationMode}
                  />
                )}
              />

              <Controller
                name="district"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="District"
                    labelPlacement="outside"
                    placeholder={
                      isLoadingLocation ? "Loading district..." : "District"
                    }
                    variant="bordered"
                    classNames={inputStyles}
                    isInvalid={!!errors.district}
                    errorMessage={errors.district?.message}
                    isDisabled={
                      isLoadingLocation || isNew || updateLocationMode
                    }
                    isReadOnly={isNew || updateLocationMode}
                  />
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
                    placeholder="Enter additional location details"
                    variant="bordered"
                    classNames={inputStyles}
                    isInvalid={!!errors.location_details}
                    errorMessage={errors.location_details?.message}
                  />
                )}
              />

              {/* Hidden fields for coordinates */}
              <input
                type="hidden"
                {...register("latitude", {
                  setValueAs: (value) =>
                    value === "" ? undefined : parseFloat(value),
                })}
              />
              <input
                type="hidden"
                {...register("longitude", {
                  setValueAs: (value) =>
                    value === "" ? undefined : parseFloat(value),
                })}
              />
            </div>
          </CardBody>
        </Card>

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
