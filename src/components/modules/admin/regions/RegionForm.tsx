"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button, Switch, Skeleton } from "@heroui/react";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { useRegionsStore } from "@/store/regions";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const {
    createRegion,
    updateRegion,
    deleteRegion,
    currentRegion,
    isLoading,
    setLoading,
  } = useRegionsStore();
  const [localLoading, setLocalLoading] = useState(true);
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

  // Handle loading state and form reset
  useEffect(() => {
    if (isNew) {
      setLoading(false);
      setLocalLoading(false);
    } else if (!isLoading && currentRegion) {
      reset(getDefaultValues());
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setLocalLoading(true);
    }
  }, [isNew, currentRegion, isLoading, reset, getDefaultValues, setLoading]);

  const onSubmit = async (data: RegionFormValues) => {
    try {
      if (currentRegion) {
        await updateRegion(currentRegion.id, {
          name: data.name,
          status: data.status ? "active" : "inactive",
        });
      } else {
        await createRegion({
          name: data.name,
          status: data.status ? "active" : "inactive",
        });
      }
      router.push("/admin/regions");
    } catch (error) {
      console.error("Failed to save region:", error);
    }
  };

  const handleDelete = async () => {
    if (!currentRegion) return;

    try {
      setIsDeleting(true);
      await deleteRegion(currentRegion.id);
      router.push("/admin/regions");
    } catch (error) {
      console.error("Failed to delete region:", error);
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
      <div className="space-y-6">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Region Name"
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
