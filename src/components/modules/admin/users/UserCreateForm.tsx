"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Input,
  Button,
  Select,
  SelectItem,
  Checkbox,
  Skeleton,
} from "@heroui/react";
import { buttonStyles, checkboxStyles, inputStyles } from "@/lib/styles";
import { useUsersStore } from "@/store/users";
import { useRouter } from "next/navigation";
import { GENDERS } from "@/lib/constants";
import { generateUsername, generatePassword } from "@/helpers/userHelpers";
import { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import useSWR from "swr";
import { departmentService } from "@/services/departments/api";
import { roleService } from "@/services/roles/api";
import type { DepartmentListResponse } from "@/services/departments/types";
import type { RoleListResponse } from "@/services/roles/types";

const userCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(1, "Phone number is required"),
  gender: z.enum([GENDERS.MALE, GENDERS.FEMALE]),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role_id: z.string().min(1, "Role is required"),
  department_id: z.string().min(1, "Department is required"),
});

type UserCreateFormData = z.infer<typeof userCreateSchema>;

export function UserCreateForm() {
  const router = useRouter();
  const { createUser, isFormLoading } = useUsersStore();
  const [showPassword, setShowPassword] = useState(false);
  const [autoGenerateUsername, setAutoGenerateUsername] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch departments and roles using SWR
  const { data: departmentsResponse, error: departmentsError } =
    useSWR<DepartmentListResponse>("departments", async () => {
      const response = await departmentService.fetchAll();
      return response as DepartmentListResponse;
    });
  const { data: rolesResponse, error: rolesError } = useSWR<RoleListResponse>(
    "roles",
    async () => {
      const response = await roleService.fetchAll();
      return response as RoleListResponse;
    }
  );

  // Extract data from the wrapped responses
  const departments = Array.isArray(departmentsResponse?.departments)
    ? departmentsResponse.departments
    : [];
  const roles = Array.isArray(rolesResponse?.roles) ? rolesResponse.roles : [];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserCreateFormData>({
    resolver: zodResolver(userCreateSchema),
  });

  const fullName = watch("name");

  // Auto-generate username when name changes and auto-generate is enabled
  useEffect(() => {
    if (autoGenerateUsername && fullName) {
      setValue("username", generateUsername(fullName));
    }
  }, [fullName, autoGenerateUsername, setValue]);

  const handleGeneratePassword = () => {
    setValue("password", generatePassword());
  };

  const onSubmit = async (data: UserCreateFormData) => {
    try {
      setIsSubmitting(true);
      await createUser(data);
    } catch (error) {
      console.error("Failed to create user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if ((isFormLoading && !isSubmitting) || !departments || !roles) {
    return (
      <div className="space-y-12 max-w-5xl mx-auto">
        {/* Personal Information Section Loading */}
        <section className="space-y-6">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </section>

        {/* Account Details Section Loading */}
        <section className="space-y-6">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </section>

        <div className="flex justify-center gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  if (departmentsError || rolesError) {
    return <div>Error loading data</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-12 max-w-5xl mx-auto"
    >
      {/* Personal Information Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <div className="grid grid-cols-2 gap-6">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Full Name"
                labelPlacement="outside"
                placeholder="Enter full name"
                variant="bordered"
                classNames={inputStyles}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Email Address"
                labelPlacement="outside"
                placeholder="Enter email address"
                variant="bordered"
                classNames={inputStyles}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            name="phone_number"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Phone Number"
                labelPlacement="outside"
                placeholder="Enter phone number"
                variant="bordered"
                classNames={inputStyles}
                isInvalid={!!errors.phone_number}
                errorMessage={errors.phone_number?.message}
              />
            )}
          />

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select
                selectedKeys={field.value ? [field.value] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0]?.toString();
                  if (value) field.onChange(value);
                }}
                label="Gender"
                labelPlacement="outside"
                placeholder="Select gender"
                variant="bordered"
                classNames={inputStyles}
                isInvalid={!!errors.gender}
                errorMessage={errors.gender?.message}
              >
                {Object.entries(GENDERS).map(([key, value]) => (
                  <SelectItem key={value} textValue={value}>
                    {key.charAt(0) + key.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
        </div>
      </section>

      {/* Account Details Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Account Details</h2>
        <div className="grid grid-cols-2 gap-6">
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Input
                  {...field}
                  label="Username"
                  labelPlacement="outside"
                  placeholder="Enter username"
                  variant="bordered"
                  classNames={inputStyles}
                  isInvalid={!!errors.username}
                  errorMessage={errors.username?.message}
                  isReadOnly={autoGenerateUsername}
                />
                <div className="flex items-center gap-2">
                  <Checkbox
                    isSelected={autoGenerateUsername}
                    onValueChange={setAutoGenerateUsername}
                    size="sm"
                    className={checkboxStyles}
                    color="danger"
                  >
                    Auto-generate from full name
                  </Checkbox>
                </div>
              </div>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                label="Password"
                labelPlacement="outside"
                placeholder="Enter password"
                variant="bordered"
                classNames={inputStyles}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                description={
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      type="button"
                      size="sm"
                      className="bg-brand-green-dark text-white"
                      onPress={handleGeneratePassword}
                    >
                      Generate Password
                    </Button>
                  </div>
                }
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-4 w-4" />
                    ) : (
                      <FiEye className="h-4 w-4" />
                    )}
                  </button>
                }
              />
            )}
          />

          <Controller
            name="role_id"
            control={control}
            render={({ field }) => (
              <Select
                selectedKeys={field.value ? [field.value] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0]?.toString();
                  if (value) field.onChange(value);
                }}
                label="Role"
                labelPlacement="outside"
                placeholder="Select a role"
                variant="bordered"
                classNames={inputStyles}
                isInvalid={!!errors.role_id}
                errorMessage={errors.role_id?.message}
              >
                {roles.map((role: { id: string; name: string }) => (
                  <SelectItem key={role.id} textValue={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          <Controller
            name="department_id"
            control={control}
            render={({ field }) => (
              <Select
                selectedKeys={field.value ? [field.value] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0]?.toString();
                  if (value) field.onChange(value);
                }}
                label="Department"
                labelPlacement="outside"
                placeholder="Select a department"
                variant="bordered"
                classNames={inputStyles}
                isInvalid={!!errors.department_id}
                errorMessage={errors.department_id?.message}
              >
                {departments.map((dept: { id: string; name: string }) => (
                  <SelectItem key={dept.id} textValue={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
        </div>
      </section>

      <div className="flex justify-center gap-3">
        <Button
          type="submit"
          color="primary"
          isLoading={isSubmitting}
          className={`${buttonStyles} bg-brand-green-dark px-6`}
        >
          Create User
        </Button>
        <Button
          type="button"
          variant="bordered"
          onPress={() => router.back()}
          className={buttonStyles}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
