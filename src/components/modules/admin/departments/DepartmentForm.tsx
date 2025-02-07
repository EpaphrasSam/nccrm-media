"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button, Switch, Skeleton } from "@heroui/react";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { useDepartmentsStore } from "@/store/departments";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";

const departmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.boolean().default(true),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  isNew?: boolean;
}

export function DepartmentForm({ isNew = false }: DepartmentFormProps) {
  const router = useRouter();
  const {
    createDepartment,
    updateDepartment,
    deleteDepartment,
    currentDepartment,
    isLoading,
    setLoading,
  } = useDepartmentsStore();
  const [localLoading, setLocalLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getDefaultValues = useCallback(
    () => ({
      name: currentDepartment?.name || "",
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

  // Handle loading state and form reset
  useEffect(() => {
    if (isNew) {
      setLoading(false);
      setLocalLoading(false);
    } else if (!isLoading && currentDepartment) {
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
    currentDepartment,
    isLoading,
    reset,
    getDefaultValues,
    setLoading,
  ]);

  const onSubmit = async (data: DepartmentFormValues) => {
    try {
      if (currentDepartment) {
        await updateDepartment(currentDepartment.id, {
          name: data.name,
          status: data.status ? "active" : "inactive",
        });
      } else {
        await createDepartment({
          name: data.name,
          status: data.status ? "active" : "inactive",
        });
      }
      router.push("/admin/departments");
    } catch (error) {
      console.error("Failed to save department:", error);
    }
  };

  const handleDelete = async () => {
    if (!currentDepartment) return;

    try {
      setIsDeleting(true);
      await deleteDepartment(currentDepartment.id);
      router.push("/admin/departments");
    } catch (error) {
      console.error("Failed to delete department:", error);
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
              label="Department Name"
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
