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
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const perpetratorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  occupation: z.string().min(1, "Occupation is required"),
  organization: z.string().min(1, "Organization is required"),
  note: z.string().min(1, "Note is required"),
});

type PerpetratorFormValues = z.infer<typeof perpetratorSchema>;

interface PerpetratorFormProps {
  isNew?: boolean;
}

export function PerpetratorForm({ isNew = false }: PerpetratorFormProps) {
  const {
    setPerpetratorForm,
    currentEvent,
    isLoading,
    setLoading,
    setCurrentStep,
  } = useEventsStore();

  const [localLoading, setLocalLoading] = useState(true);

  const getDefaultValues = useCallback(
    () => ({
      name: currentEvent?.perpetrator?.name || "",
      age: currentEvent?.perpetrator?.age || "",
      gender: currentEvent?.perpetrator?.gender || "",
      occupation: currentEvent?.perpetrator?.occupation || "",
      organization: currentEvent?.perpetrator?.organization || "",
      note: currentEvent?.perpetrator?.note || "",
    }),
    [currentEvent]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PerpetratorFormValues>({
    resolver: zodResolver(perpetratorSchema),
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

  const onSubmit = async (data: PerpetratorFormValues) => {
    setPerpetratorForm(data);
    setCurrentStep("victim");
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
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Group or Individual name"
              labelPlacement="outside"
              placeholder="Enter the name"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Age"
              labelPlacement="outside"
              placeholder="Enter the age"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.age}
              errorMessage={errors.age?.message}
            />
          )}
        />

        <Controller
          name="gender"
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
              isInvalid={!!errors.gender}
              errorMessage={errors.gender?.message}
            >
              <SelectItem key="male" value="male">
                Male
              </SelectItem>
              <SelectItem key="female" value="female">
                Female
              </SelectItem>
            </Select>
          )}
        />

        <Controller
          name="occupation"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Occupation/Identity"
              labelPlacement="outside"
              placeholder="Enter the occupation/identity"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.occupation}
              errorMessage={errors.occupation?.message}
            />
          )}
        />

        <Controller
          name="organization"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Organization"
              labelPlacement="outside"
              placeholder="Enter the organization"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.organization}
              errorMessage={errors.organization?.message}
            />
          )}
        />

        <Controller
          name="note"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Note"
              labelPlacement="outside"
              placeholder="Enter any additional note"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.note}
              errorMessage={errors.note?.message}
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
          onClick={() => setCurrentStep("event")}
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
