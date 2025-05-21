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
import { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const victimSchema = z.object({
  victim: z.string().optional(),
  victim_age: z.coerce.number().optional(),
  victim_gender: z.string().optional(),
  victim_occupation: z.string().optional(),
  victim_organization: z.string().optional(),
  victim_note: z.string().optional(),
});

type VictimFormValues = z.infer<typeof victimSchema>;

interface VictimFormProps {
  isNew?: boolean;
}

export function VictimForm({ isNew = false }: VictimFormProps) {
  const {
    setVictimForm,
    currentEvent,
    isFormLoading,
    setFormLoading,
    formData,
    setCurrentStep,
  } = useEventsStore();

  const getDefaultValues = useCallback(
    () => ({
      victim: formData.victim?.victim || "",
      victim_age: formData.victim?.victim_age || 0,
      victim_gender: formData.victim?.victim_gender || "",
      victim_occupation: formData.victim?.victim_occupation || "",
      victim_organization: formData.victim?.victim_organization || "",
      victim_note: formData.victim?.victim_note || "",
    }),
    [formData.victim]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VictimFormValues>({
    resolver: zodResolver(victimSchema),
    defaultValues: getDefaultValues(),
  });

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

  const onSubmit = async (data: VictimFormValues) => {
    setVictimForm(data);
    setCurrentStep("outcome");
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
          name="victim"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Group or Individual name"
              labelPlacement="outside"
              placeholder="Enter the name"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.victim}
              errorMessage={errors.victim?.message}
            />
          )}
        />

        <Controller
          name="victim_age"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Input
              {...field}
              type="number"
              value={value?.toString() || ""}
              onChange={(e) => onChange(Number(e.target.value))}
              label="Age"
              labelPlacement="outside"
              placeholder="Enter the age"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.victim_age}
              errorMessage={errors.victim_age?.message}
            />
          )}
        />

        <Controller
          name="victim_gender"
          control={control}
          render={({ field }) => (
            <Select
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0]?.toString();
                if (value) field.onChange(value);
              }}
              label="Gender"
              labelPlacement="outside"
              placeholder="Select gender"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.victim_gender}
              errorMessage={errors.victim_gender?.message}
            >
              <SelectItem key="male" textValue="Male">
                Male
              </SelectItem>
              <SelectItem key="female" textValue="Female">
                Female
              </SelectItem>
              <SelectItem key="mix" textValue="Mix">
                Mixed
              </SelectItem>
              <SelectItem key="unknown" textValue="Unknown">
                Unknown
              </SelectItem>
            </Select>
          )}
        />

        <Controller
          name="victim_occupation"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Occupation/Identity"
              labelPlacement="outside"
              placeholder="Enter the occupation/identity"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.victim_occupation}
              errorMessage={errors.victim_occupation?.message}
            />
          )}
        />

        <Controller
          name="victim_organization"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Organization"
              labelPlacement="outside"
              placeholder="Enter the organization"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.victim_organization}
              errorMessage={errors.victim_organization?.message}
            />
          )}
        />

        <Controller
          name="victim_note"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Note"
              labelPlacement="outside"
              placeholder="Enter any additional note"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.victim_note}
              errorMessage={errors.victim_note?.message}
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
          onClick={() => setCurrentStep("perpetrator")}
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
