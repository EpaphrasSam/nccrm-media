"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button, Skeleton, Textarea, Checkbox } from "@heroui/react";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { useRolesStore } from "@/store/roles";
import { useState, useEffect, useCallback } from "react";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";
import type {
  BaseFunctions,
  RoleFunctions,
  RolePermissions,
} from "@/services/roles/types";

const PERMISSION_FUNCTIONS = ["view", "add", "edit", "delete"] as const;
type PermissionFunction = (typeof PERMISSION_FUNCTIONS)[number];

const baseFunctionsSchema = z.object({
  view: z.boolean(),
  add: z.boolean(),
  edit: z.boolean(),
  delete: z.boolean(),
});

const roleFunctionsSchema = baseFunctionsSchema.extend({
  approve: z.boolean(),
});

const rolePermissionsSchema = z.object({
  role: baseFunctionsSchema,
  department: baseFunctionsSchema,
  region: baseFunctionsSchema,
  thematic_area: baseFunctionsSchema,
  main_indicator: baseFunctionsSchema,
  sub_indicator: baseFunctionsSchema,
  event: roleFunctionsSchema,
  user: roleFunctionsSchema,
  situational_report: roleFunctionsSchema,
  situational_analysis: roleFunctionsSchema,
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

// Helper type to get keys of RolePermissions
type PermissionKey = keyof RolePermissions;

// Helper to check if a module has approve permission using type information
const hasApprovePermission = (key: PermissionKey): boolean => {
  // Use type guard to check if the permission has approve
  return (
    key === "event" ||
    key === "user" ||
    key === "situational_report" ||
    key === "situational_analysis"
  );
};

// Helper to format label from key
const formatLabel = (key: string): string => {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const BASE_FUNCTIONS: BaseFunctions = {
  view: false,
  add: false,
  edit: false,
  delete: false,
};

const ROLE_FUNCTIONS: RoleFunctions = {
  ...BASE_FUNCTIONS,
  approve: false,
};

const DEFAULT_PERMISSIONS: RolePermissions = {
  role: BASE_FUNCTIONS,
  department: BASE_FUNCTIONS,
  region: BASE_FUNCTIONS,
  thematic_area: BASE_FUNCTIONS,
  main_indicator: BASE_FUNCTIONS,
  sub_indicator: BASE_FUNCTIONS,
  event: ROLE_FUNCTIONS,
  user: ROLE_FUNCTIONS,
  situational_report: ROLE_FUNCTIONS,
  situational_analysis: ROLE_FUNCTIONS,
};

export function RoleForm({ isNew = false }: RoleFormProps) {
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
    } catch (error) {
      console.error("Failed to save role:", error);
    }
  };

  const handleDelete = async () => {
    if (!currentRole) return;

    try {
      setIsDeleting(true);
      await deleteRole(currentRole.id);
    } catch (error) {
      console.error("Failed to delete role:", error);
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
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 ">
      <div className="max-w-2xl space-y-6">
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
      </div>

      {/* Permissions Section */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Object.keys(DEFAULT_PERMISSIONS) as PermissionKey[]).map((key) => (
            <div key={key} className="flex">
              <div className="w-32 shrink-0">
                <h4 className="text-base font-medium">{formatLabel(key)}</h4>
              </div>
              <div className="flex flex-col gap-2">
                {PERMISSION_FUNCTIONS.map((func: PermissionFunction) => (
                  <Controller
                    key={func}
                    name={`functions.${key}.${func}` as const}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Checkbox
                        isSelected={!!value}
                        onValueChange={onChange}
                        color="danger"
                      >
                        Can {func}
                      </Checkbox>
                    )}
                  />
                ))}
                {hasApprovePermission(key) && (
                  <Controller
                    name={`functions.${key}.approve` as keyof RoleFormValues}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Checkbox
                        isSelected={!!value}
                        onValueChange={onChange}
                        color="danger"
                      >
                        Can approve
                      </Checkbox>
                    )}
                  />
                )}
              </div>
            </div>
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
