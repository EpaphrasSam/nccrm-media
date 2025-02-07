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
import { fetchThematicAreas } from "@/services/thematic-areas/api";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";
import useSWR from "swr";
import { MainIndicatorStatus } from "@/services/main-indicators/types";

const mainIndicatorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  thematicAreaId: z.string().min(1, "Thematic Area is required"),
  status: z.boolean().default(true),
});

type MainIndicatorFormValues = z.infer<typeof mainIndicatorSchema>;

interface MainIndicatorFormProps {
  isNew?: boolean;
}

export function MainIndicatorForm({ isNew = false }: MainIndicatorFormProps) {
  const router = useRouter();
  const {
    createMainIndicator,
    updateMainIndicator,
    deleteMainIndicator,
    currentMainIndicator,
    isLoading,
    setLoading,
  } = useMainIndicatorsStore();

  // Fetch thematic areas using SWR
  const { data: thematicAreas } = useSWR("thematicAreas", fetchThematicAreas);

  const [localLoading, setLocalLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getDefaultValues = useCallback(
    () => ({
      name: currentMainIndicator?.name || "",
      description: currentMainIndicator?.description || "",
      thematicAreaId: currentMainIndicator?.thematicAreaId || "",
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

  // Handle loading state and form reset
  useEffect(() => {
    if (isNew) {
      setLoading(false);
      setLocalLoading(false);
    } else if (!isLoading && currentMainIndicator) {
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
    currentMainIndicator,
    isLoading,
    reset,
    getDefaultValues,
    setLoading,
  ]);

  const onSubmit = async (data: MainIndicatorFormValues) => {
    try {
      const submitData = {
        name: data.name,
        description: data.description,
        thematicAreaId: data.thematicAreaId,
        status: data.status ? "active" : ("inactive" as MainIndicatorStatus),
      };

      if (currentMainIndicator) {
        await updateMainIndicator(currentMainIndicator.id, submitData);
      } else {
        await createMainIndicator(submitData);
      }
      router.push("/admin/main-indicators");
    } catch (error) {
      console.error("Failed to save main indicator:", error);
    }
  };

  const handleDelete = async () => {
    if (!currentMainIndicator) return;

    try {
      setIsDeleting(true);
      await deleteMainIndicator(currentMainIndicator.id);
      router.push("/admin/main-indicators");
    } catch (error) {
      console.error("Failed to delete main indicator:", error);
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
            <Skeleton className="h-32 w-full max-w-2xl" />
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
              label="Main Indicator Name"
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
          name="thematicAreaId"
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
              placeholder="Select a thematic area"
              variant="bordered"
              classNames={inputStyles}
              isInvalid={!!errors.thematicAreaId}
              errorMessage={errors.thematicAreaId?.message}
              items={thematicAreas || []}
            >
              {(area) => (
                <SelectItem key={area.id} value={area.id}>
                  {area.name}
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
