"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Input,
  Button,
  Switch,
  Skeleton,
  Select,
  SelectItem,
} from "@heroui/react";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { useSubIndicatorsStore } from "@/store/sub-indicators";
import { fetchMainIndicators } from "@/services/main-indicators/api";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";
import useSWR from "swr";
import { SubIndicatorStatus } from "@/services/sub-indicators/types";

const subIndicatorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  mainIndicatorId: z.string().min(1, "Main Indicator is required"),
  status: z.boolean().default(true),
});

type SubIndicatorFormValues = z.infer<typeof subIndicatorSchema>;

interface SubIndicatorFormProps {
  isNew?: boolean;
}

export function SubIndicatorForm({ isNew = false }: SubIndicatorFormProps) {
  const router = useRouter();
  const {
    createSubIndicator,
    updateSubIndicator,
    deleteSubIndicator,
    currentSubIndicator,
    isLoading,
    setLoading,
  } = useSubIndicatorsStore();

  // Fetch main indicators using SWR
  const { data: mainIndicators } = useSWR(
    "mainIndicators",
    fetchMainIndicators
  );

  const [localLoading, setLocalLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getDefaultValues = useCallback(
    () => ({
      name: currentSubIndicator?.name || "",
      mainIndicatorId: currentSubIndicator?.mainIndicatorId || "",
      status: currentSubIndicator
        ? currentSubIndicator.status === "active"
        : true,
    }),
    [currentSubIndicator]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubIndicatorFormValues>({
    resolver: zodResolver(subIndicatorSchema),
    defaultValues: getDefaultValues(),
  });

  // Handle loading state and form reset
  useEffect(() => {
    if (isNew) {
      setLoading(false);
      setLocalLoading(false);
    } else if (!isLoading && currentSubIndicator) {
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
    currentSubIndicator,
    isLoading,
    reset,
    getDefaultValues,
    setLoading,
  ]);

  const onSubmit = async (data: SubIndicatorFormValues) => {
    try {
      const submitData = {
        name: data.name,
        mainIndicatorId: data.mainIndicatorId,
        status: data.status ? "active" : ("inactive" as SubIndicatorStatus),
      };

      if (currentSubIndicator) {
        await updateSubIndicator(currentSubIndicator.id, submitData);
      } else {
        await createSubIndicator(submitData);
      }
      router.push("/admin/sub-indicators");
    } catch (error) {
      console.error("Failed to save sub indicator:", error);
    }
  };

  const handleDelete = async () => {
    if (!currentSubIndicator) return;

    try {
      setIsDeleting(true);
      await deleteSubIndicator(currentSubIndicator.id);
      router.push("/admin/sub-indicators");
    } catch (error) {
      console.error("Failed to delete sub indicator:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading || localLoading) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-14rem)]">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full max-w-2xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full max-w-2xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-16 w-full max-w-2xl rounded-lg" />
          </div>
        </div>
        <div className="flex justify-center mt-auto pt-8">
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
              label="Sub Indicator Name"
              labelPlacement="outside"
              placeholder="Enter sub indicator name"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <Controller
          name="mainIndicatorId"
          control={control}
          render={({ field }) => (
            <Select
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0]?.toString();
                if (value) field.onChange(value);
              }}
              label="Main Indicator"
              labelPlacement="outside"
              placeholder="Select a main indicator"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.mainIndicatorId}
              errorMessage={errors.mainIndicatorId?.message}
              items={mainIndicators || []}
            >
              {(indicator) => (
                <SelectItem key={indicator.id} value={indicator.id}>
                  {indicator.name}
                </SelectItem>
              )}
            </Select>
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <span className="text-sm font-medium">Status</span>
                <div className="text-sm text-default-500">
                  {field.value ? "Active" : "Inactive"}
                </div>
              </div>
              <Switch
                isSelected={field.value}
                onValueChange={field.onChange}
                classNames={inputStyles}
                color="danger"
              />
            </div>
          )}
        />
      </div>

      <div className="flex gap-3 justify-center mt-auto pt-8">
        <Button
          type="submit"
          color="primary"
          isLoading={isSubmitting}
          className={`${buttonStyles} bg-brand-green-dark px-6`}
        >
          {isNew ? "Save" : "Save Changes"}
        </Button>
        {!isNew && (
          <Button
            type="button"
            color="primary"
            onPress={() => setShowDeleteModal(true)}
            className={`${buttonStyles} bg-brand-red-dark px-8`}
          >
            Delete Sub Indicator
          </Button>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Sub Indicator"
        description={`Are you sure you want to delete the sub indicator "${currentSubIndicator?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </form>
  );
}
