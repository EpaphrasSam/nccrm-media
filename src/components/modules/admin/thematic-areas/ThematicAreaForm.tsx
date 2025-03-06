"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button, Switch, Skeleton } from "@heroui/react";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { useThematicAreasStore } from "@/store/thematic-areas";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";

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
  const router = useRouter();
  const {
    createThematicArea,
    updateThematicArea,
    deleteThematicArea,
    currentThematicArea,
    isFormLoading,
  } = useThematicAreasStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  useEffect(() => {
    if (!isNew && currentThematicArea) {
      reset(getDefaultValues());
    }
  }, [isNew, currentThematicArea, reset, getDefaultValues]);

  const onSubmit = async (data: ThematicAreaFormValues) => {
    try {
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
      router.push("/admin/thematic-areas");
    } catch (error) {
      console.error("Failed to save thematic area:", error);
    }
  };

  const handleDelete = async () => {
    if (!currentThematicArea) return;

    try {
      setIsDeleting(true);
      await deleteThematicArea(currentThematicArea.id);
      router.push("/admin/thematic-areas");
    } catch (error) {
      console.error("Failed to delete thematic area:", error);
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
          <Input
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
          className={`${buttonStyles} bg-brand-green-dark px-6`}
        >
          {isNew ? "Create Thematic Area" : "Save Changes"}
        </Button>
        {!isNew && (
          <Button
            type="button"
            color="primary"
            onPress={() => setShowDeleteModal(true)}
            className={`${buttonStyles} bg-brand-red-dark px-8`}
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
