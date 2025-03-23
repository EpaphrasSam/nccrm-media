"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Input,
  Button,
  Switch,
  Skeleton,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { useMainIndicatorsStore } from "@/store/main-indicators";
import { useState, useEffect, useCallback } from "react";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";
import useSWR from "swr";
import { thematicAreaService } from "@/services/thematic-areas/api";
import type { ThematicAreaListResponse } from "@/services/thematic-areas/types";

const mainIndicatorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  thematic_area_id: z.string().min(1, "Thematic Area is required"),
  status: z.boolean().default(true),
});

type MainIndicatorFormValues = z.infer<typeof mainIndicatorSchema>;

interface MainIndicatorFormProps {
  isNew?: boolean;
}

export function MainIndicatorForm({ isNew = false }: MainIndicatorFormProps) {
  const {
    createMainIndicator,
    updateMainIndicator,
    deleteMainIndicator,
    currentMainIndicator,
    isFormLoading,
  } = useMainIndicatorsStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch thematic areas using SWR
  const { data: thematicAreasResponse, error: thematicAreasError } =
    useSWR<ThematicAreaListResponse>("thematicAreas", async () => {
      const response = await thematicAreaService.fetchAll();
      return response as ThematicAreaListResponse;
    });

  // Extract thematic areas from the wrapped response
  const thematicAreas = Array.isArray(thematicAreasResponse?.thematicAreas)
    ? thematicAreasResponse.thematicAreas
    : [];

  const getDefaultValues = useCallback(
    () => ({
      name: currentMainIndicator?.name || "",
      description: currentMainIndicator?.description || "",
      thematic_area_id: currentMainIndicator?.thematic_area?.id || "",
      status: currentMainIndicator
        ? currentMainIndicator.status === "active"
        : true,
    }),
    [currentMainIndicator]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MainIndicatorFormValues>({
    resolver: zodResolver(mainIndicatorSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (!isNew && currentMainIndicator) {
      reset(getDefaultValues());
    }
  }, [isNew, currentMainIndicator, reset, getDefaultValues]);

  const onSubmit = async (data: MainIndicatorFormValues) => {
    try {
      if (isNew) {
        await createMainIndicator({
          name: data.name,
          description: data.description,
          thematicArea: data.thematic_area_id,
          status: data.status ? "active" : "inactive",
        });
      } else if (currentMainIndicator) {
        await updateMainIndicator(currentMainIndicator.id, {
          newName: data.name,
          newDescription: data.description,
          thematicArea: data.thematic_area_id,
          status: data.status ? "active" : "inactive",
        });
      }
    } catch (error) {
      console.error("Failed to save main indicator:", error);
    }
  };

  const handleDelete = async () => {
    if (!currentMainIndicator) return;

    try {
      setIsDeleting(true);
      await deleteMainIndicator(currentMainIndicator.id);
    } catch (error) {
      console.error("Failed to delete main indicator:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isFormLoading || !thematicAreas) {
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

  if (thematicAreasError) {
    return <div>Error loading thematic areas</div>;
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
            placeholder="Enter main indicator name"
            variant="bordered"
            classNames={inputStyles}
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            label="Description"
            labelPlacement="outside"
            placeholder="Enter main indicator description"
            variant="bordered"
            classNames={inputStyles}
            isInvalid={!!errors.description}
            errorMessage={errors.description?.message}
          />
        )}
      />

      <Controller
        name="thematic_area_id"
        control={control}
        render={({ field }) => (
          <Select
            selectedKeys={field.value ? [field.value] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0]?.toString();
              if (value) field.onChange(value);
            }}
            label="Thematic Area"
            labelPlacement="outside"
            placeholder="Select thematic area"
            variant="bordered"
            classNames={inputStyles}
            isInvalid={!!errors.thematic_area_id}
            errorMessage={errors.thematic_area_id?.message}
          >
            {thematicAreas.map((area) => (
              <SelectItem key={area.id} textValue={area.name}>
                {area.name}
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
          {isNew ? "Create Main Indicator" : "Save Changes"}
        </Button>
        {!isNew && (
          <Button
            type="button"
            color="primary"
            onPress={() => setShowDeleteModal(true)}
            className={`${buttonStyles} bg-brand-red-dark px-8`}
          >
            Delete Main Indicator
          </Button>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Main Indicator"
        description={`Are you sure you want to delete the main indicator "${currentMainIndicator?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </form>
  );
}
