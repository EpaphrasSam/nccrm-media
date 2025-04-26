"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button, Switch, Skeleton, Textarea } from "@heroui/react";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { useDepartmentsStore } from "@/store/departments";
import { useState, useEffect, useCallback } from "react";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";
import { usePermissions } from "@/hooks/usePermissions";

const departmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.boolean().default(true),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  isNew?: boolean;
}

export function DepartmentForm({ isNew = false }: DepartmentFormProps) {
  const {
    createDepartment,
    updateDepartment,
    deleteDepartment,
    currentDepartment,
    isFormLoading: storeLoading,
  } = useDepartmentsStore();

  const { hasPermission, isLoading: permissionsLoading } = usePermissions();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  const getDefaultValues = useCallback(
    () => ({
      name: currentDepartment?.name || "",
      description: currentDepartment?.description || "",
      status: currentDepartment ? currentDepartment.status === "active" : true,
    }),
    [currentDepartment]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: getDefaultValues(),
  });

  // Handle loading states
  useEffect(() => {
    if (isNew) {
      // For new forms, no loading needed
      setLocalLoading(false);
    } else if (!storeLoading && currentDepartment) {
      // For edit mode, add delay only on initial load
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isNew, currentDepartment, storeLoading]);

  // Handle form reset
  useEffect(() => {
    if (isNew) {
      // Clear the store and reset form when in new mode
      useDepartmentsStore.setState({ currentDepartment: undefined });
      reset({
        name: "",
        description: "",
        status: true,
      });
    } else if (currentDepartment) {
      // Only reset with current department data in edit mode
      reset(getDefaultValues());
    }
  }, [isNew, currentDepartment, reset, getDefaultValues]);

  // --- Permissions Check ---
  const canSubmit = isNew
    ? hasPermission("department", "add")
    : hasPermission("department", "edit");
  const canDelete = !isNew && hasPermission("department", "delete");

  const onSubmit = async (data: DepartmentFormValues) => {
    if (!canSubmit) return;
    try {
      if (isNew) {
        await createDepartment({
          name: data.name,
          description: data.description,
          status: data.status ? "active" : "inactive",
        });
      } else if (currentDepartment) {
        await updateDepartment(currentDepartment.id, {
          newName: data.name,
          newDescription: data.description,
          status: data.status ? "active" : "inactive",
        });
      }
    } catch (error) {
      console.error("Failed to save department:", error);
    }
  };

  const handleDelete = async () => {
    if (!currentDepartment || !canDelete) return;

    try {
      setIsDeleting(true);
      await deleteDepartment(currentDepartment.id);
    } catch (error) {
      console.error("Failed to delete department:", error);
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
            placeholder="Enter department name"
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
            placeholder="Enter department description"
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
          {isNew ? "Create Department" : "Save Changes"}
        </Button>
        {canDelete && (
          <Button
            type="button"
            color="primary"
            onPress={() => setShowDeleteModal(true)}
            className={`${buttonStyles} bg-brand-red-dark px-8`}
            isDisabled={isDeleting}
          >
            Delete Department
          </Button>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Department"
        description={`Are you sure you want to delete the department "${currentDepartment?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </form>
  );
}
