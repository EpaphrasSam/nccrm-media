"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button, Switch, Skeleton, Textarea } from "@heroui/react";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { useThematicAreasStore } from "@/store/thematic-areas";
import { useState, useEffect, useCallback } from "react";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";
import { usePermissions } from "@/hooks/usePermissions";

const thematicAreaSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.boolean().default(true),
});

type ThematicAreaFormValues = z.infer<typeof thematicAreaSchema>;

interface ThematicAreaFormProps {
  isNew?: boolean;
}

export function ThematicAreaForm({ isNew = false }: ThematicAreaFormProps) {
  const {
    createThematicArea,
    updateThematicArea,
    deleteThematicArea,
    currentThematicArea,
    isFormLoading: storeLoading,
  } = useThematicAreasStore();

  const { hasPermission, isLoading: permissionsLoading } = usePermissions();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  const getDefaultValues = useCallback(
    () => ({
      name: currentThematicArea?.name || "",
      description: currentThematicArea?.description || "",
      status: currentThematicArea
        ? currentThematicArea.status === "active"
        : true,
    }),
    [currentThematicArea]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ThematicAreaFormValues>({
    resolver: zodResolver(thematicAreaSchema),
    defaultValues: getDefaultValues(),
  });

  // Handle loading states
  useEffect(() => {
    if (isNew) {
      // For new forms, no loading needed
      setLocalLoading(false);
    } else if (!storeLoading && currentThematicArea) {
      // For edit mode, add delay only on initial load
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isNew, currentThematicArea, storeLoading]);

  // Handle form reset
  useEffect(() => {
    if (isNew) {
      // Clear the store and reset form when in new mode
      useThematicAreasStore.setState({ currentThematicArea: undefined });
      reset({
        name: "",
        description: "",
        status: true,
      });
    } else if (currentThematicArea) {
      // Only reset with current data in edit mode
      reset(getDefaultValues());
    }
  }, [isNew, currentThematicArea, reset, getDefaultValues]);

  // --- Permissions Check ---
  const canSubmit = isNew
    ? hasPermission("thematic_area", "add")
    : hasPermission("thematic_area", "edit");
  const canDelete = !isNew && hasPermission("thematic_area", "delete");

  const onSubmit = async (data: ThematicAreaFormValues) => {
    if (!canSubmit) return;
    try {
      setIsDeleting(true);
      if (isNew) {
        await createThematicArea({
          name: data.name,
          description: data.description,
          status: data.status ? "active" : "inactive",
        });
      } else if (currentThematicArea) {
        await updateThematicArea(currentThematicArea.id, {
          newName: data.name,
          newDescription: data.description,
          status: data.status ? "active" : "inactive",
        });
      }
    } catch (error) {
      console.error("Failed to save thematic area:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentThematicArea || !canDelete) return;

    try {
      setIsDeleting(true);
      await deleteThematicArea(currentThematicArea.id);
    } catch (error) {
      console.error("Failed to delete thematic area:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const isOverallLoading = storeLoading || permissionsLoading || localLoading;

  if (isOverallLoading) {
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
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    );
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
            placeholder="Enter thematic area name"
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
            placeholder="Enter thematic area description"
            variant="bordered"
            classNames={inputStyles}
            isInvalid={!!errors.description}
            errorMessage={errors.description?.message}
          />
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
          isDisabled={!canSubmit || isSubmitting}
          className={`${buttonStyles} bg-brand-green-dark px-6`}
        >
          {isNew ? "Create Thematic Area" : "Save Changes"}
        </Button>
        {canDelete && (
          <Button
            type="button"
            color="primary"
            onPress={() => setShowDeleteModal(true)}
            className={`${buttonStyles} bg-brand-red-dark px-8`}
            isDisabled={isDeleting}
          >
            Delete Thematic Area
          </Button>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Thematic Area"
        description={`Are you sure you want to delete the thematic area "${currentThematicArea?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </form>
  );
}
