"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Skeleton, Textarea, cn } from "@heroui/react";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { useEventsStore } from "@/store/events";
import { useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { outcomeSchema, type OutcomeFormValues } from "./schemas";

interface OutcomeFormProps {
  isNew?: boolean;
  registerSaveCallback?: (stepKey: string, callback: () => void) => void;
  registerValidateCallback?: (
    stepKey: string,
    callback: () => Promise<boolean>
  ) => void;
}

export function OutcomeForm({
  isNew = false,
  registerSaveCallback,
  registerValidateCallback,
}: OutcomeFormProps) {
  const {
    setOutcomeForm,
    currentEvent,
    isFormLoading,
    setFormLoading,
    formData,
    setCurrentStep,
  } = useEventsStore();

  const getDefaultValues = useCallback(
    () => ({
      death_count_men:
        currentEvent?.death_count_men ?? formData.outcome?.death_count_men ?? 0,
      death_count_women_chldren:
        currentEvent?.death_count_women_chldren ??
        formData.outcome?.death_count_women_chldren ??
        0,
      death_details:
        currentEvent?.death_details || formData.outcome?.death_details || "",
      injury_count_men:
        currentEvent?.injury_count_men ??
        formData.outcome?.injury_count_men ??
        0,
      injury_count_women_chldren:
        currentEvent?.injury_count_women_chldren ??
        formData.outcome?.injury_count_women_chldren ??
        0,
      injury_details:
        currentEvent?.injury_details || formData.outcome?.injury_details || "",
      losses_count:
        currentEvent?.losses_count ?? formData.outcome?.losses_count ?? 0,
      losses_details:
        currentEvent?.losses_details || formData.outcome?.losses_details || "",
    }),
    [formData.outcome, currentEvent]
  );

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<OutcomeFormValues>({
    resolver: zodResolver(outcomeSchema),
    defaultValues: getDefaultValues(),
  });

  // Register save callback for step navigation
  useEffect(() => {
    if (registerSaveCallback) {
      const saveFormData = () => {
        const currentData = getValues();
        setOutcomeForm(currentData);
      };
      registerSaveCallback("outcome", saveFormData);
    }
  }, [registerSaveCallback, getValues, setOutcomeForm]);

  // Register validation callback for step navigation
  useEffect(() => {
    if (registerValidateCallback) {
      const validateFormData = async () => {
        const result = await trigger();
        return result;
      };
      registerValidateCallback("outcome", validateFormData);
    }
  }, [registerValidateCallback, trigger]);

  useEffect(() => {
    if (isNew) {
      setFormLoading(false);
    } else if (!isFormLoading && currentEvent) {
      reset(getDefaultValues());
    }
  }, [
    isNew,
    currentEvent,
    isFormLoading,
    reset,
    getDefaultValues,
    setFormLoading,
  ]);

  const onSubmit = async (data: OutcomeFormValues) => {
    setOutcomeForm(data);
    setCurrentStep("context");
  };

  if (isFormLoading) {
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
        <div className="flex justify-between mt-auto pt-8">
          <Skeleton className="h-10 w-[110px]" />
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
          name="death_count_men"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Input
              {...field}
              type="number"
              value={value?.toString() || ""}
              onChange={(e) => onChange(Number(e.target.value))}
              label="Deaths (Men)"
              labelPlacement="outside"
              placeholder="Enter the count of dead men"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.death_count_men}
              errorMessage={errors.death_count_men?.message}
            />
          )}
        />

        <Controller
          name="death_count_women_chldren"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Input
              {...field}
              type="number"
              value={value?.toString() || ""}
              onChange={(e) => onChange(Number(e.target.value))}
              label="Deaths (Women and Children)"
              labelPlacement="outside"
              placeholder="Enter the count of dead women and children"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.death_count_women_chldren}
              errorMessage={errors.death_count_women_chldren?.message}
            />
          )}
        />

        <Controller
          name="death_details"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Death Details"
              labelPlacement="outside"
              placeholder="Enter details about the deaths"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.death_details}
              errorMessage={errors.death_details?.message}
            />
          )}
        />

        <Controller
          name="injury_count_men"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Input
              {...field}
              type="number"
              value={value?.toString() || ""}
              onChange={(e) => onChange(Number(e.target.value))}
              label="Injuries (Men)"
              labelPlacement="outside"
              placeholder="Enter the count of injured men"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.injury_count_men}
              errorMessage={errors.injury_count_men?.message}
            />
          )}
        />

        <Controller
          name="injury_count_women_chldren"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Input
              {...field}
              type="number"
              value={value?.toString() || ""}
              onChange={(e) => onChange(Number(e.target.value))}
              label="Injuries (Women and Children)"
              labelPlacement="outside"
              placeholder="Enter the count of injured women and children"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.injury_count_women_chldren}
              errorMessage={errors.injury_count_women_chldren?.message}
            />
          )}
        />

        <Controller
          name="injury_details"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Injuries Details"
              labelPlacement="outside"
              placeholder="Enter details about the injuries"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.injury_details}
              errorMessage={errors.injury_details?.message}
            />
          )}
        />

        <Controller
          name="losses_count"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Input
              {...field}
              type="number"
              value={value?.toString() || ""}
              onChange={(e) => onChange(Number(e.target.value))}
              label="Losses (Property)"
              labelPlacement="outside"
              placeholder="Enter the estimated property losses"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.losses_count}
              errorMessage={errors.losses_count?.message}
            />
          )}
        />

        <Controller
          name="losses_details"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Losses Details"
              labelPlacement="outside"
              placeholder="Enter details about the property losses"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.losses_details}
              errorMessage={errors.losses_details?.message}
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
          onClick={() => setCurrentStep("victim")}
        >
          Previous
        </Button>
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
