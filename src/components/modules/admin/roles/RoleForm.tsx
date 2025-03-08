"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button, Skeleton, Textarea, Checkbox } from "@heroui/react";
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

const PERMISSION_FUNCTIONS = ["view", "add", "edit", "delete"] as const;

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
          {PERMISSION_SECTIONS.map(({ key, label, hasApprove }) => (
            <div key={key} className="flex">
              <div className="w-32 shrink-0">
                <h4 className="text-base font-medium">{label}</h4>
              </div>
              <div className="flex flex-col gap-2">
                {PERMISSION_FUNCTIONS.map((func) => (
                  <Controller
                    key={func}
                    name={`functions.${key}.${func}`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        isSelected={field.value}
                        onValueChange={field.onChange}
                        color="danger"
                      >
                        Can {func} {label.toLowerCase().slice(0, -1)}
                      </Checkbox>
                    )}
                  />
                ))}
                {hasApprove && (
                  <Controller
                    name={`functions.${key}.approve`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        isSelected={field.value}
                        onValueChange={field.onChange}
                        color="danger"
                      >
                        Can approve {label.toLowerCase().slice(0, -1)}
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
