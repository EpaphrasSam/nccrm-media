"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Input,
  Button,
  Skeleton,
  Textarea,
  Select,
  SelectItem,
  cn,
} from "@heroui/react";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { useEventsStore } from "@/store/events";
import { useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  perpetratorSchema,
  type PerpetratorFormValues,
  ageBrackets,
} from "./schemas";

interface PerpetratorFormProps {
  isNew?: boolean;
  registerSaveCallback?: (stepKey: string, callback: () => void) => void;
}

export function PerpetratorForm({
  isNew = false,
  registerSaveCallback,
}: PerpetratorFormProps) {
  const {
    setPerpetratorForm,
    currentEvent,
    isFormLoading,
    setFormLoading,
    formData,
    setCurrentStep,
  } = useEventsStore();

  const getDefaultValues = useCallback(
    () => ({
      perpetrator:
        currentEvent?.perpetrator || formData.perpetrator?.perpetrator || "",
      pep_age: currentEvent?.pep_age || formData.perpetrator?.pep_age || "",
      pep_gender:
        currentEvent?.pep_gender || formData.perpetrator?.pep_gender || "",
      pep_occupation:
        currentEvent?.pep_occupation ||
        formData.perpetrator?.pep_occupation ||
        "",
      pep_note: currentEvent?.pep_note || formData.perpetrator?.pep_note || "",
    }),
    [formData.perpetrator, currentEvent]
  );

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<PerpetratorFormValues>({
    resolver: zodResolver(perpetratorSchema),
    defaultValues: getDefaultValues(),
  });

  // Register save callback for step navigation
  useEffect(() => {
    if (registerSaveCallback) {
      const saveFormData = () => {
        const currentData = getValues();
        setPerpetratorForm(currentData);
      };
      registerSaveCallback("perpetrator", saveFormData);
    }
  }, [registerSaveCallback, getValues, setPerpetratorForm]);

  // Handle loading state and form reset
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

  const onSubmit = async (data: PerpetratorFormValues) => {
    setPerpetratorForm(data);
    setCurrentStep("victim");
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
          name="perpetrator"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Group or Individual name"
              labelPlacement="outside"
              placeholder="Enter the name"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.perpetrator}
              errorMessage={errors.perpetrator?.message}
            />
          )}
        />

        <Controller
          name="pep_age"
          control={control}
          render={({ field }) => (
            <Select
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0]?.toString();
                if (selectedKey) {
                  // Find the bracket and use its value
                  const selectedBracket = ageBrackets.find(
                    (bracket) => bracket.key === selectedKey
                  );
                  field.onChange(selectedBracket?.value || selectedKey);
                }
              }}
              label="Age"
              labelPlacement="outside"
              placeholder="Select age"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.pep_age}
              errorMessage={errors.pep_age?.message}
            >
              {ageBrackets.map((bracket) => (
                <SelectItem key={bracket.key} textValue={bracket.key}>
                  {bracket.label}
                </SelectItem>
              ))}
            </Select>
          )}
        />

        <Controller
          name="pep_gender"
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
              isInvalid={!!errors.pep_gender}
              errorMessage={errors.pep_gender?.message}
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
          name="pep_occupation"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Occupation/Identity"
              labelPlacement="outside"
              placeholder="Enter the occupation/identity"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.pep_occupation}
              errorMessage={errors.pep_occupation?.message}
            />
          )}
        />

        <Controller
          name="pep_note"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Note"
              labelPlacement="outside"
              placeholder="Enter any additional note"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.pep_note}
              errorMessage={errors.pep_note?.message}
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
