"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button, Switch, Skeleton } from "@heroui/react";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { useRegionsStore } from "@/store/regions";
import { useState, useEffect, useCallback } from "react";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";

const regionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.boolean().default(true),
});

type RegionFormValues = z.infer<typeof regionSchema>;

interface RegionFormProps {
  isNew?: boolean;
}

export function RegionForm({ isNew = false }: RegionFormProps) {
  const {
    createRegion,
    updateRegion,
    deleteRegion,
    currentRegion,
    isFormLoading,
  } = useRegionsStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getDefaultValues = useCallback(
    () => ({
      name: currentRegion?.name || "",
      status: currentRegion ? currentRegion.status === "active" : true,
    }),
    [currentRegion]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegionFormValues>({
    resolver: zodResolver(regionSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (!isNew && currentRegion) {
      reset(getDefaultValues());
    }
  }, [isNew, currentRegion, reset, getDefaultValues]);

  const onSubmit = async (data: RegionFormValues) => {
    try {
      if (isNew) {
        await createRegion({
          name: data.name,
          status: data.status ? "active" : "inactive",
        });
      } else if (currentRegion) {
        await updateRegion(currentRegion.id, {
          newName: data.name,
          status: data.status ? "active" : "inactive",
        });
      }
    } catch (error) {
      console.error("Failed to save region:", error);
    }
  };

  const handleDelete = async () => {
    if (!currentRegion) return;

    try {
      setIsDeleting(true);
      await deleteRegion(currentRegion.id);
    } catch (error) {
      console.error("Failed to delete region:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isFormLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
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
            placeholder="Enter region name"
            variant="bordered"
            classNames={inputStyles}
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
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
          className={`${buttonStyles} bg-brand-green-dark px-6`}
        >
          {isNew ? "Create Region" : "Save Changes"}
        </Button>
        {!isNew && (
          <Button
            type="button"
            color="primary"
            onPress={() => setShowDeleteModal(true)}
            className={`${buttonStyles} bg-brand-red-dark px-8`}
          >
            Delete Region
          </Button>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Region"
        description={`Are you sure you want to delete the region "${currentRegion?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </form>
  );
}
