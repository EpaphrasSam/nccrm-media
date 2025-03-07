"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Input,
  Button,
  Skeleton,
  Textarea,
  Card,
  CardHeader,
  CardBody,
  Checkbox,
  Divider,
} from "@heroui/react";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { useRolesStore } from "@/store/roles";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";
import type { RoleFunctions, RolePermissions } from "@/services/roles/types";

const roleFunctionsSchema = z.object({
  view: z.boolean(),
  add: z.boolean(),
  edit: z.boolean(),
  delete: z.boolean(),
  approve: z.boolean().optional(),
});

const rolePermissionsSchema = z.object({
  role: roleFunctionsSchema,
  department: roleFunctionsSchema,
  region: roleFunctionsSchema,
  thematic_area: roleFunctionsSchema,
  main_indicator: roleFunctionsSchema,
  sub_indicator: roleFunctionsSchema,
  event: roleFunctionsSchema.extend({ approve: z.boolean() }),
  user: roleFunctionsSchema.extend({ approve: z.boolean() }),
});

const roleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  functions: rolePermissionsSchema,
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleFormProps {
  isNew?: boolean;
}

const PERMISSION_SECTIONS = [
  { key: "role" as const, label: "Roles", hasApprove: false },
  { key: "department" as const, label: "Departments", hasApprove: false },
  { key: "region" as const, label: "Regions", hasApprove: false },
  { key: "thematic_area" as const, label: "Thematic Areas", hasApprove: false },
  {
    key: "main_indicator" as const,
    label: "Main Indicators",
    hasApprove: false,
  },
  { key: "sub_indicator" as const, label: "Sub Indicators", hasApprove: false },
  { key: "event" as const, label: "Events", hasApprove: true },
  { key: "user" as const, label: "Users", hasApprove: true },
] as const;

const DEFAULT_FUNCTIONS: RoleFunctions = {
  view: false,
  add: false,
  edit: false,
  delete: false,
};

const DEFAULT_PERMISSIONS: RolePermissions = {
  role: DEFAULT_FUNCTIONS,
  department: DEFAULT_FUNCTIONS,
  region: DEFAULT_FUNCTIONS,
  thematic_area: DEFAULT_FUNCTIONS,
  main_indicator: DEFAULT_FUNCTIONS,
  sub_indicator: DEFAULT_FUNCTIONS,
  event: { ...DEFAULT_FUNCTIONS, approve: false },
  user: { ...DEFAULT_FUNCTIONS, approve: false },
};

export function RoleForm({ isNew = false }: RoleFormProps) {
  const router = useRouter();
  const { createRole, updateRole, deleteRole, currentRole, isFormLoading } =
    useRolesStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getDefaultValues = useCallback(
    () => ({
      name: currentRole?.name || "",
      description: currentRole?.description || "",
      functions: currentRole?.functions || DEFAULT_PERMISSIONS,
    }),
    [currentRole]
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (!isNew && currentRole) {
      reset(getDefaultValues());
    }
  }, [isNew, currentRole, reset, getDefaultValues]);

  const onSubmit = async (data: RoleFormValues) => {
    try {
      if (isNew) {
        await createRole(data);
      } else if (currentRole) {
        await updateRole(currentRole.id, {
          newName: data.name,
          newDescription: data.description,
          functions: data.functions,
        });
      }
      router.push("/admin/roles");
    } catch (error) {
      console.error("Failed to save role:", error);
    }
  };

  const handleDelete = async () => {
    if (!currentRole) return;

    try {
      setIsDeleting(true);
      await deleteRole(currentRole.id);
      router.push("/admin/roles");
    } catch (error) {
      console.error("Failed to delete role:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleSelectAll = (section: keyof RolePermissions) => {
    const currentFunctions = watch(`functions.${section}`);
    const allChecked = Object.values(currentFunctions).every((v) => v);
    const newValue = !allChecked;

    // Update all checkboxes in the section
    setValue(`functions.${section}.view`, newValue);
    setValue(`functions.${section}.add`, newValue);
    setValue(`functions.${section}.edit`, newValue);
    setValue(`functions.${section}.delete`, newValue);
    if ("approve" in currentFunctions) {
      setValue(`functions.${section}.approve`, newValue);
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
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
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
            placeholder="Enter role name"
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
            placeholder="Enter role description"
            variant="bordered"
            classNames={inputStyles}
            isInvalid={!!errors.description}
            errorMessage={errors.description?.message}
          />
        )}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PERMISSION_SECTIONS.map(({ key, label, hasApprove }) => (
            <Card key={key} className="p-0">
              <CardHeader className="flex flex-row justify-between items-center">
                <h4 className="text-base font-medium">{label}</h4>
                <Button
                  type="button"
                  variant="light"
                  size="sm"
                  color="primary"
                  onPress={() => handleSelectAll(key)}
                >
                  Toggle All
                </Button>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="flex flex-col gap-2">
                  <Controller
                    name={`functions.${key}.view`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        isSelected={field.value}
                        onValueChange={field.onChange}
                      >
                        View
                      </Checkbox>
                    )}
                  />
                  <Controller
                    name={`functions.${key}.add`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        isSelected={field.value}
                        onValueChange={field.onChange}
                      >
                        Add
                      </Checkbox>
                    )}
                  />
                  <Controller
                    name={`functions.${key}.edit`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        isSelected={field.value}
                        onValueChange={field.onChange}
                      >
                        Edit
                      </Checkbox>
                    )}
                  />
                  <Controller
                    name={`functions.${key}.delete`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        isSelected={field.value}
                        onValueChange={field.onChange}
                      >
                        Delete
                      </Checkbox>
                    )}
                  />
                  {hasApprove && (
                    <Controller
                      name={`functions.${key}.approve`}
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          isSelected={field.value}
                          onValueChange={field.onChange}
                        >
                          Approve
                        </Checkbox>
                      )}
                    />
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-center pt-6">
        <Button
          type="submit"
          color="primary"
          isLoading={isSubmitting}
          className={`${buttonStyles} bg-brand-green-dark px-6`}
        >
          {isNew ? "Create Role" : "Save Changes"}
        </Button>
        {!isNew && (
          <Button
            type="button"
            color="primary"
            onPress={() => setShowDeleteModal(true)}
            className={`${buttonStyles} bg-brand-red-dark px-8`}
          >
            Delete Role
          </Button>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Role"
        description={`Are you sure you want to delete the role "${currentRole?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </form>
  );
}
