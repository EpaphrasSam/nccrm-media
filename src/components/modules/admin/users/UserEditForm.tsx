"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Input,
  Button,
  Select,
  SelectItem,
  Avatar,
  Skeleton,
  Badge,
  Checkbox,
} from "@heroui/react";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { useUsersStore } from "@/store/users";
import { GENDERS } from "@/lib/constants";
import { useState, useEffect, useRef } from "react";
import { FaCamera } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { generateUsername, generatePassword } from "@/helpers/userHelpers";
import useSWR from "swr";
import { departmentService } from "@/services/departments/api";
import { roleService } from "@/services/roles/api";
import type { DepartmentListResponse } from "@/services/departments/types";
import type { RoleListResponse } from "@/services/roles/types";
import { usePermissions } from "@/hooks/usePermissions";

// Section schemas
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role_id: z.string().optional(),
});

const personalInfoSchema = z.object({
  phone_number: z.string().optional(),
  gender: z.enum([GENDERS.MALE, GENDERS.FEMALE]),
});

const accountInfoSchema = z.object({
  username: z.string().optional(),
  department_id: z.string().min(1, "Department is required"),
  password: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
type AccountInfoFormData = z.infer<typeof accountInfoSchema>;

export function UserEditForm() {
  const {
    currentUser,
    updateUser,
    isFormLoading: storeLoading,
  } = useUsersStore();
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();
  const [localLoading, setLocalLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | undefined>(
    currentUser?.image
  );
  const [showPassword, setShowPassword] = useState(false);
  const [autoGenerateUsername, setAutoGenerateUsername] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPersonalInfo, setIsSubmittingPersonalInfo] =
    useState(false);
  const [isSubmittingAccountInfo, setIsSubmittingAccountInfo] = useState(false);

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

  // Hidden file input for image upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Section Form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      role_id: currentUser?.role?.id || "",
    },
  });

  // Personal Info Section Form
  const personalInfoForm = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      phone_number: currentUser?.phone_number || "",
      gender: currentUser?.gender || GENDERS.MALE,
    },
  });

  // Account Info Section Form
  const accountInfoForm = useForm<AccountInfoFormData>({
    resolver: zodResolver(accountInfoSchema),
    defaultValues: {
      username: currentUser?.username || "",
      department_id: currentUser?.department?.id || "",
      password: "",
    },
  });

  // Reset forms when currentUser changes
  useEffect(() => {
    if (!storeLoading && currentUser) {
      profileForm.reset({
        name: currentUser.name || "",
        email: currentUser.email || "",
        role_id: currentUser.role?.id || "",
      });
      personalInfoForm.reset({
        phone_number: currentUser.phone_number || "",
        gender: currentUser.gender || GENDERS.MALE,
      });
      accountInfoForm.reset({
        username: currentUser.username || "",
        department_id: currentUser.department?.id || "",
        password: "",
      });
      // Only update profile image if it's not already set (to preserve user's new selection)
      if (!profileImage || profileImage === currentUser.image) {
        setProfileImage(currentUser.image || "");
      }
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [
    currentUser,
    storeLoading,
    profileForm,
    personalInfoForm,
    accountInfoForm,
    profileImage,
  ]);

  // Auto-generate username when name changes and auto-generate is enabled
  useEffect(() => {
    if (autoGenerateUsername && currentUser) {
      accountInfoForm.setValue("username", generateUsername(currentUser.name));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.name, autoGenerateUsername, accountInfoForm]);

  const handleGeneratePassword = () => {
    accountInfoForm.setValue("password", generatePassword());
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Permissions Check ---
  const canEditUser = hasPermission("user", "edit");

  const onSubmitProfile = async (data: ProfileFormData) => {
    if (!currentUser || !canEditUser) return;
    try {
      setIsSubmittingProfile(true);
      const updateData: Partial<ProfileFormData & { image?: File }> = {
        name: data.name,
        email: data.email,
      };

      // Only include role_id if it's not empty
      if (data.role_id && data.role_id.trim() !== "") {
        updateData.role_id = data.role_id;
      }

      if (profileImage && profileImage !== currentUser.image) {
        // Only include image if it has changed
        const response = await fetch(profileImage);
        const blob = await response.blob();
        const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
        updateData.image = file;
      }
      await updateUser(currentUser.id, updateData);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handlePersonalInfoSubmit = async (data: PersonalInfoFormData) => {
    if (!currentUser || !canEditUser) return;
    try {
      setIsSubmittingPersonalInfo(true);
      const updateData: Partial<PersonalInfoFormData> = {
        gender: data.gender,
      };

      // Only include phone_number if it's not empty
      if (data.phone_number && data.phone_number.trim() !== "") {
        updateData.phone_number = data.phone_number;
      }

      await updateUser(currentUser.id, updateData);
    } catch (error) {
      console.error("Failed to update personal info:", error);
    } finally {
      setIsSubmittingPersonalInfo(false);
    }
  };

  const handleAccountInfoSubmit = async (data: AccountInfoFormData) => {
    if (!currentUser || !canEditUser) return;
    try {
      setIsSubmittingAccountInfo(true);
      const updateData: Partial<AccountInfoFormData> = {
        department_id: data.department_id,
      };

      // Only include username if it's not empty
      if (data.username && data.username.trim() !== "") {
        updateData.username = data.username;
      }

      // Only include password if it's not empty
      if (data.password && data.password.trim() !== "") {
        updateData.password = data.password;
      }

      await updateUser(currentUser.id, updateData);
    } catch (error) {
      console.error("Failed to update account info:", error);
    } finally {
      setIsSubmittingAccountInfo(false);
    }
  };

  const isOverallLoading =
    (storeLoading &&
      !(
        isSubmittingProfile ||
        isSubmittingPersonalInfo ||
        isSubmittingAccountInfo
      )) ||
    permissionsLoading ||
    !departments ||
    !roles ||
    localLoading;

  if (isOverallLoading) {
    return (
      <div className="space-y-8 max-w-5xl">
        {/* Profile Section Loading */}
        <section className="space-y-6">
          <Skeleton className="h-6 w-48" />
          <div className="flex items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </section>

        {/* Personal Info Section Loading */}
        <section className="space-y-6">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </section>

        {/* Account Info Section Loading */}
        <section className="space-y-6">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <div className="flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </section>
      </div>
    );
  }

  if (departmentsError || rolesError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Profile Section */}
      <section className="space-y-10">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <form
          onSubmit={profileForm.handleSubmit(onSubmitProfile)}
          className="space-y-6"
        >
          <div className="flex items-start gap-6">
            <Badge
              content={
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer hover:opacity-75"
                >
                  <FaCamera size={20} className="text-brand-red-dark" />
                </div>
              }
              placement="bottom-right"
              showOutline={false}
              className="bg-white p-2 mr-4 mb-2"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Avatar
                src={profileImage}
                size="lg"
                isBordered
                className="w-28 h-28"
              />
            </Badge>
            <div className="flex-1 space-y-4">
              <Controller
                name="name"
                control={profileForm.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Full Name"
                    labelPlacement="outside"
                    placeholder="Enter full name"
                    variant="underlined"
                    classNames={{ label: "text-base font-medium" }}
                    isRequired
                    isInvalid={!!profileForm.formState.errors.name}
                    errorMessage={profileForm.formState.errors.name?.message}
                  />
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="email"
                  control={profileForm.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Email"
                      labelPlacement="outside"
                      placeholder="Enter email"
                      variant="underlined"
                      classNames={{ label: "text-base font-medium" }}
                      isRequired
                      isInvalid={!!profileForm.formState.errors.email}
                      errorMessage={profileForm.formState.errors.email?.message}
                    />
                  )}
                />
                <Controller
                  name="role_id"
                  control={profileForm.control}
                  render={({ field }) => (
                    <Select
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) => {
                        const value = Array.from(keys)[0]?.toString();
                        field.onChange(value || "");
                      }}
                      label="Role"
                      labelPlacement="outside"
                      placeholder="Select role"
                      variant="underlined"
                      classNames={{ label: "text-base font-medium" }}
                      isInvalid={!!profileForm.formState.errors.role_id}
                      errorMessage={
                        profileForm.formState.errors.role_id?.message
                      }
                    >
                      {roles.map((role: { id: string; name: string }) => (
                        <SelectItem key={role.id} textValue={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              color="primary"
              isLoading={isSubmittingProfile}
              isDisabled={!canEditUser || isSubmittingProfile}
              className={`${buttonStyles} bg-brand-green-dark px-8`}
            >
              Save
            </Button>
          </div>
        </form>
      </section>

      {/* Personal Info Section */}
      <section className="space-y-10">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <form
          onSubmit={personalInfoForm.handleSubmit(handlePersonalInfoSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="phone_number"
              control={personalInfoForm.control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Phone Number"
                  labelPlacement="outside"
                  placeholder="Enter phone number"
                  variant="bordered"
                  classNames={inputStyles}
                  isInvalid={!!personalInfoForm.formState.errors.phone_number}
                  errorMessage={
                    personalInfoForm.formState.errors.phone_number?.message
                  }
                />
              )}
            />
            <Controller
              name="gender"
              control={personalInfoForm.control}
              render={({ field }) => (
                <Select
                  selectedKeys={field.value ? [field.value] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0]?.toString();
                    field.onChange(value || "");
                  }}
                  label="Gender"
                  labelPlacement="outside"
                  placeholder="Select gender"
                  variant="bordered"
                  classNames={inputStyles}
                  isRequired
                  isInvalid={!!personalInfoForm.formState.errors.gender}
                  errorMessage={
                    personalInfoForm.formState.errors.gender?.message
                  }
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
          <div className="flex justify-end">
            <Button
              type="submit"
              color="primary"
              isLoading={isSubmittingPersonalInfo}
              isDisabled={!canEditUser || isSubmittingPersonalInfo}
              className={`${buttonStyles} bg-brand-green-dark px-8`}
            >
              Save
            </Button>
          </div>
        </form>
      </section>

      {/* Account Info Section */}
      <section className="space-y-10">
        <h2 className="text-xl font-semibold">Account Information</h2>
        <form
          onSubmit={accountInfoForm.handleSubmit(handleAccountInfoSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 !gap-6">
            <Controller
              name="username"
              control={accountInfoForm.control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Input
                    {...field}
                    label="Username"
                    labelPlacement="outside"
                    placeholder="Enter username"
                    variant="bordered"
                    classNames={inputStyles}
                    isInvalid={!!accountInfoForm.formState.errors.username}
                    errorMessage={
                      accountInfoForm.formState.errors.username?.message
                    }
                    isReadOnly={autoGenerateUsername}
                  />
                  <div className="flex items-center gap-2">
                    <Checkbox
                      isSelected={autoGenerateUsername}
                      onValueChange={setAutoGenerateUsername}
                      size="sm"
                    >
                      Auto-generate from full name
                    </Checkbox>
                  </div>
                </div>
              )}
            />

            <Controller
              name="password"
              control={accountInfoForm.control}
              render={({ field }) => (
                <Input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  label="Change Password"
                  labelPlacement="outside"
                  placeholder="Enter new password (optional)"
                  variant="bordered"
                  classNames={inputStyles}
                  isInvalid={!!accountInfoForm.formState.errors.password}
                  errorMessage={
                    accountInfoForm.formState.errors.password?.message
                  }
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
              name="department_id"
              control={accountInfoForm.control}
              render={({ field }) => (
                <Select
                  selectedKeys={field.value ? [field.value] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0]?.toString();
                    field.onChange(value || "");
                  }}
                  label="Department"
                  labelPlacement="outside"
                  placeholder="Select department"
                  variant="bordered"
                  classNames={inputStyles}
                  isRequired
                  isInvalid={!!accountInfoForm.formState.errors.department_id}
                  errorMessage={
                    accountInfoForm.formState.errors.department_id?.message
                  }
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
          <div className="flex justify-end">
            <Button
              type="submit"
              color="primary"
              isLoading={isSubmittingAccountInfo}
              isDisabled={!canEditUser || isSubmittingAccountInfo}
              className={`${buttonStyles} bg-brand-green-dark px-8`}
            >
              Save
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
