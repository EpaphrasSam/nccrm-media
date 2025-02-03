"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useCallback, useState } from "react";
import { Input, Textarea, Checkbox, Button, Skeleton } from "@heroui/react";
import { MODULE_PERMISSIONS, ModulePermissions } from "@/services/roles/types";
import { buttonStyles, checkboxStyles, inputStyles } from "@/lib/styles";
import { useRolesStore } from "@/store/roles";
import { useRouter } from "next/navigation";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";

const roleFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  permissions: z.record(z.array(z.string())).default({}),
});

type RoleFormData = z.infer<typeof roleFormSchema>;

const formatModuleName = (key: string): string => {
  // First split by camelCase
  const words = key.replace(/([A-Z])/g, " $1").trim();
  // Then capitalize first letter of each word
  return words
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

interface RoleFormProps {
  isNew?: boolean;
}

export function RoleForm({ isNew = false }: RoleFormProps) {
  const router = useRouter();
  const {
    createRole,
    updateRole,
    deleteRole,
    currentRole,
    isLoading,
    setLoading,
  } = useRolesStore();
  const [localLoading, setLocalLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getDefaultValues = useCallback(
    () => ({
      name: currentRole?.name || "",
      description: currentRole?.description || "",
      permissions:
        currentRole?.permissions ||
        Object.keys(MODULE_PERMISSIONS).reduce((acc, module) => {
          acc[module] = [];
          return acc;
        }, {} as Record<string, string[]>),
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
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: getDefaultValues(),
  });

  const watchPermissions = watch("permissions");

  // Combined loading state and form reset handling
  useEffect(() => {
    if (isNew) {
      setLoading(false);
      setLocalLoading(false);
    } else if (!isLoading && currentRole) {
      reset(getDefaultValues());
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setLocalLoading(true);
    }
  }, [isNew, currentRole, isLoading, reset, getDefaultValues, setLoading]);

  const handlePermissionChange = useCallback(
    (
      module: keyof typeof MODULE_PERMISSIONS,
      permission: string,
      checked: boolean
    ) => {
      const currentPermissions = watchPermissions[module] || [];
      const newPermissions = checked
        ? [...currentPermissions, permission]
        : currentPermissions.filter((p) => p !== permission);

      setValue(`permissions.${module}`, newPermissions);
    },
    [watchPermissions, setValue]
  );

  const onSubmit = async (data: RoleFormData) => {
    try {
      const roleData = {
        ...data,
        permissions: data.permissions as Partial<ModulePermissions>,
      };

      if (currentRole) {
        await updateRole(currentRole.id, roleData);
      } else {
        await createRole(roleData);
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

  if (isLoading || localLoading) {
    return (
      <div className="space-y-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full max-w-2xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full max-w-2xl" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.keys(MODULE_PERMISSIONS).map((module) => (
              <div key={module}>
                <div className="flex items-start gap-4">
                  <Skeleton className="h-4 w-[100px]" />
                  <div className="flex flex-col gap-3 flex-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Skeleton className="h-10 w-[110px]" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      <div className="space-y-6">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              classNames={inputStyles}
              variant="bordered"
              label="Role"
              labelPlacement="outside"
              placeholder="Enter the name of the role..."
              className="max-w-2xl"
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
              classNames={inputStyles}
              variant="bordered"
              label="Description"
              labelPlacement="outside"
              placeholder="Enter the description of the role..."
              className="max-w-2xl"
              isInvalid={!!errors.description}
              errorMessage={errors.description?.message}
            />
          )}
        />
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(MODULE_PERMISSIONS).map(([module, permissions]) => (
            <div key={module}>
              <div className="flex items-start gap-4">
                <h3 className="text-sm font-medium min-w-[100px]">
                  {formatModuleName(module)}
                </h3>
                <div className="flex flex-col gap-3">
                  {permissions.map((permission) => (
                    <div
                      key={`${module}.${permission}`}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        isSelected={watchPermissions[module]?.includes(
                          permission
                        )}
                        onValueChange={(checked) =>
                          handlePermissionChange(
                            module as keyof typeof MODULE_PERMISSIONS,
                            permission,
                            checked
                          )
                        }
                        radius="sm"
                        className={checkboxStyles}
                      />
                      <span className="text-sm">
                        Can {permission}{" "}
                        {formatModuleName(module).toLowerCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-center">
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
