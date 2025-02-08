"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button, Skeleton, Textarea } from "@heroui/react";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { useEventsStore } from "@/store/events";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const outcomeSchema = z.object({
  deathsMen: z.coerce.number().min(0, "Deaths (Men) must be 0 or greater"),
  deathsWomenChildren: z.coerce
    .number()
    .min(0, "Deaths (Women and Children) must be 0 or greater"),
  deathDetails: z.string().min(1, "Death details are required"),
  injuriesMen: z.coerce.number().min(0, "Injuries (Men) must be 0 or greater"),
  injuriesWomenChildren: z.coerce
    .number()
    .min(0, "Injuries (Women and Children) must be 0 or greater"),
  injuriesDetails: z.string().min(1, "Injuries details are required"),
  lossesProperty: z.coerce
    .number()
    .min(0, "Property losses must be 0 or greater"),
  lossesDetails: z.string().min(1, "Losses details are required"),
});

type OutcomeFormValues = z.infer<typeof outcomeSchema>;

interface OutcomeFormProps {
  isNew?: boolean;
}

export function OutcomeForm({ isNew = false }: OutcomeFormProps) {
  const { setOutcomeForm, currentEvent, isLoading, setCurrentStep } =
    useEventsStore();
  const [localLoading, setLocalLoading] = useState(true);

  const getDefaultValues = useCallback(
    () => ({
      deathsMen: currentEvent?.outcome?.deathsMen || 0,
      deathsWomenChildren: currentEvent?.outcome?.deathsWomenChildren || 0,
      deathDetails: currentEvent?.outcome?.deathDetails || "",
      injuriesMen: currentEvent?.outcome?.injuriesMen || 0,
      injuriesWomenChildren: currentEvent?.outcome?.injuriesWomenChildren || 0,
      injuriesDetails: currentEvent?.outcome?.injuriesDetails || "",
      lossesProperty: currentEvent?.outcome?.lossesProperty || 0,
      lossesDetails: currentEvent?.outcome?.lossesDetails || "",
    }),
    [currentEvent]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OutcomeFormValues>({
    resolver: zodResolver(outcomeSchema),
    defaultValues: getDefaultValues(),
  });

  // Handle loading state and form reset
  useEffect(() => {
    if (isNew) {
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
  }, [isNew, currentEvent, isLoading, reset, getDefaultValues]);

  const onSubmit = async (data: OutcomeFormValues) => {
    setOutcomeForm(data);
    setCurrentStep("context");
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
          name="deathsMen"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Input
              {...field}
              type="number"
              value={value.toString()}
              onChange={(e) => onChange(Number(e.target.value))}
              label="Deaths (Men)"
              labelPlacement="outside"
              placeholder="Enter the count of dead men"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.deathsMen}
              errorMessage={errors.deathsMen?.message}
            />
          )}
        />

        <Controller
          name="deathsWomenChildren"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Input
              {...field}
              type="number"
              value={value.toString()}
              onChange={(e) => onChange(Number(e.target.value))}
              label="Deaths (Women and Children)"
              labelPlacement="outside"
              placeholder="Enter the count of dead women and children"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.deathsWomenChildren}
              errorMessage={errors.deathsWomenChildren?.message}
            />
          )}
        />

        <Controller
          name="deathDetails"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Death Details"
              labelPlacement="outside"
              placeholder="Enter details about the deaths"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.deathDetails}
              errorMessage={errors.deathDetails?.message}
            />
          )}
        />

        <Controller
          name="injuriesMen"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Input
              {...field}
              type="number"
              value={value.toString()}
              onChange={(e) => onChange(Number(e.target.value))}
              label="Injuries (Men)"
              labelPlacement="outside"
              placeholder="Enter the count of injured men"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.injuriesMen}
              errorMessage={errors.injuriesMen?.message}
            />
          )}
        />

        <Controller
          name="injuriesWomenChildren"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Input
              {...field}
              type="number"
              value={value.toString()}
              onChange={(e) => onChange(Number(e.target.value))}
              label="Injuries (Women and Children)"
              labelPlacement="outside"
              placeholder="Enter the count of injured women and children"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.injuriesWomenChildren}
              errorMessage={errors.injuriesWomenChildren?.message}
            />
          )}
        />

        <Controller
          name="injuriesDetails"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Injuries Details"
              labelPlacement="outside"
              placeholder="Enter details about the injuries"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.injuriesDetails}
              errorMessage={errors.injuriesDetails?.message}
            />
          )}
        />

        <Controller
          name="lossesProperty"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Input
              {...field}
              type="number"
              value={value.toString()}
              onChange={(e) => onChange(Number(e.target.value))}
              label="Losses (Property)"
              labelPlacement="outside"
              placeholder="Enter the estimated property losses"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.lossesProperty}
              errorMessage={errors.lossesProperty?.message}
            />
          )}
        />

        <Controller
          name="lossesDetails"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Losses Details"
              labelPlacement="outside"
              placeholder="Enter details about the property losses"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.lossesDetails}
              errorMessage={errors.lossesDetails?.message}
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
