"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button, Switch, Skeleton } from "@heroui/react";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { useSituationalReportingStore } from "@/store/situational-reporting";
import { useState, useEffect, useCallback } from "react";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";

const situationalReportingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.boolean().default(true),
});

type SituationalReportingFormValues = z.infer<
  typeof situationalReportingSchema
>;

interface SituationalReportingFormProps {
  isNew?: boolean;
}

export function SituationalReportingForm({
  isNew = false,
}: SituationalReportingFormProps) {
  const {
    createReport,
    updateReport,
    deleteReport,
    currentReport,
    isFormLoading,
  } = useSituationalReportingStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getDefaultValues = useCallback(
    () => ({
      name: currentReport?.name || "",
      status: currentReport ? currentReport.status === "active" : true,
    }),
    [currentReport]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SituationalReportingFormValues>({
    resolver: zodResolver(situationalReportingSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (!isNew && currentReport) {
      reset(getDefaultValues());
    }
  }, [isNew, currentReport, reset, getDefaultValues]);

  const onSubmit = async (data: SituationalReportingFormValues) => {
    try {
      if (isNew) {
        await createReport({
          name: data.name,
          year: new Date().getFullYear(),
          status: data.status ? "active" : "inactive",
        });
      } else if (currentReport) {
        await updateReport(currentReport.id, {
          name: data.name,
          status: data.status ? "active" : "inactive",
        });
      }
    } catch (error) {
      console.error("Failed to save situational report:", error);
    }
  };

  const handleDelete = async () => {
    if (!currentReport) return;

    try {
      setIsDeleting(true);
      await deleteReport(currentReport.id);
    } catch (error) {
      console.error("Failed to delete situational report:", error);
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
            placeholder="Enter name of situational reporting..."
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
          {isNew ? "Create Report" : "Save Changes"}
        </Button>
        {!isNew && (
          <Button
            type="button"
            color="primary"
            onPress={() => setShowDeleteModal(true)}
            className={`${buttonStyles} bg-brand-red-dark px-8`}
          >
            Delete Report
          </Button>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Situational Report"
        description={`Are you sure you want to delete the situational report "${currentReport?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </form>
  );
}
