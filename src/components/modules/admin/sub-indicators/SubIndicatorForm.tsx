"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Input,
  Button,
  Switch,
  Select,
  SelectItem,
  Skeleton,
} from "@heroui/react";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { useSubIndicatorsStore } from "@/store/sub-indicators";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";
import useSWR from "swr";
import { mainIndicatorService } from "@/services/main-indicators/api";
import type {
  MainIndicatorListItem,
  MainIndicatorListResponse,
} from "@/services/main-indicators/types";

const subIndicatorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  // description: z.string().min(1, "Description is required"),
  main_indicator_id: z.string().min(1, "Main Indicator is required"),
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
    isFormLoading,
  } = useSubIndicatorsStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch main indicators using SWR
  const { data: mainIndicatorsResponse, error: mainIndicatorsError } =
    useSWR<MainIndicatorListResponse>("mainIndicators", async () => {
      const response = await mainIndicatorService.fetchAll();
      return response as MainIndicatorListResponse;
    });

  // Extract main indicators from the response
  const mainIndicators = Array.isArray(mainIndicatorsResponse?.mainIndicators)
    ? mainIndicatorsResponse.mainIndicators
    : [];

  const getDefaultValues = useCallback(
    () => ({
      name: currentSubIndicator?.name || "",
      description: currentSubIndicator?.description || "",
      main_indicator_id: currentSubIndicator?.main_indicator?.id || "",
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

  useEffect(() => {
    if (!isNew && currentSubIndicator) {
      reset(getDefaultValues());
    }
  }, [isNew, currentSubIndicator, reset, getDefaultValues]);

  const onSubmit = async (data: SubIndicatorFormValues) => {
    try {
      if (isNew) {
        await createSubIndicator({
          name: data.name,
          // description: data.description,
          mainIndicator: data.main_indicator_id,
          status: data.status ? "active" : "inactive",
        });
      } else if (currentSubIndicator) {
        await updateSubIndicator(currentSubIndicator.id, {
          newName: data.name,
          // newDescription: data.description,
          mainIndicator: data.main_indicator_id,
          status: data.status ? "active" : "inactive",
        });
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

  if (isFormLoading || !mainIndicators) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (mainIndicatorsError) {
    return <div>Error loading main indicators</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Name"
            labelPlacement="outside"
            placeholder="Enter sub indicator name"
            variant="bordered"
            classNames={inputStyles}
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
          />
        )}
      />

      {/* <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            label="Description"
            labelPlacement="outside"
            placeholder="Enter sub indicator description"
            variant="bordered"
            classNames={inputStyles}
            isInvalid={!!errors.description}
            errorMessage={errors.description?.message}
          />
        )}
      /> */}

      <Controller
        name="main_indicator_id"
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
            placeholder="Select main indicator"
            variant="bordered"
            classNames={inputStyles}
            isInvalid={!!errors.main_indicator_id}
            errorMessage={errors.main_indicator_id?.message}
          >
            {mainIndicators.map((indicator: MainIndicatorListItem) => (
              <SelectItem key={indicator.id} textValue={indicator.id}>
                <div className="flex flex-col">
                  <span>{indicator.name}</span>
                  <span className="text-tiny text-default-500">
                    {indicator.thematic_area.name}
                  </span>
                </div>
              </SelectItem>
            ))}
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

      <div className="flex gap-3 justify-center pt-6">
        <Button
          type="submit"
          color="primary"
          isLoading={isSubmitting}
          className={`${buttonStyles} bg-brand-green-dark px-6`}
        >
          {isNew ? "Create Sub Indicator" : "Save Changes"}
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
