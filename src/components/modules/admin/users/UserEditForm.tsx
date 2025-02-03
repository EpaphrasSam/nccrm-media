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
import {
  USER_ROLES,
  DEPARTMENTS,
  GENDERS,
  UserRole,
  Department,
  Gender,
} from "@/lib/constants";
import { useState, useEffect, useRef } from "react";
import { FaCamera } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { generateUsername, generatePassword } from "@/helpers/userHelpers";

// Section schemas
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(Object.values(USER_ROLES) as [UserRole, ...UserRole[]]),
});

const personalInfoSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
  gender: z.enum([GENDERS.MALE, GENDERS.FEMALE]) as z.ZodEnum<
    [Gender, ...Gender[]]
  >,
});

const accountInfoSchema = z.object({
  username: z.string().min(1, "Username is required"),
  department: z.enum(
    Object.values(DEPARTMENTS) as [Department, ...Department[]]
  ),
  password: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
type AccountInfoFormData = z.infer<typeof accountInfoSchema>;

export function UserEditForm() {
  const { currentUser, updateUser, isLoading } = useUsersStore();
  const [localLoading, setLocalLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | undefined>(
    currentUser?.avatarUrl
  );
  const [showPassword, setShowPassword] = useState(false);
  const [autoGenerateUsername, setAutoGenerateUsername] = useState(false);

  // Hidden file input for image upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Section Form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      role: currentUser?.role,
    },
  });

  // Personal Info Section Form
  const personalInfoForm = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      phoneNumber: currentUser?.phoneNumber || "",
      gender: currentUser?.gender,
    },
  });

  // Account Info Section Form
  const accountInfoForm = useForm<AccountInfoFormData>({
    resolver: zodResolver(accountInfoSchema),
    defaultValues: {
      username: currentUser?.username || "",
      department: currentUser?.department,
      password: "",
    },
  });

  // Reset forms when currentUser changes
  useEffect(() => {
    if (!isLoading && currentUser) {
      profileForm.reset({
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      });
      personalInfoForm.reset({
        phoneNumber: currentUser.phoneNumber || "",
        gender: currentUser.gender,
      });
      accountInfoForm.reset({
        username: currentUser.username || "",
        department: currentUser.department,
        password: "",
      });
      setProfileImage(currentUser.avatarUrl);
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentUser, isLoading, profileForm, personalInfoForm, accountInfoForm]);

  // Auto-generate username when name changes and auto-generate is enabled
  useEffect(() => {
    if (autoGenerateUsername && currentUser) {
      accountInfoForm.setValue("username", generateUsername(currentUser.name));
    }
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

  const handleProfileSubmit = async (data: ProfileFormData) => {
    if (!currentUser) return;
    try {
      await updateUser(currentUser.id, {
        ...data,
        avatarUrl: profileImage,
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handlePersonalInfoSubmit = async (data: PersonalInfoFormData) => {
    if (!currentUser) return;
    try {
      await updateUser(currentUser.id, data);
    } catch (error) {
      console.error("Failed to update personal info:", error);
    }
  };

  const handleAccountInfoSubmit = async (data: AccountInfoFormData) => {
    if (!currentUser) return;
    try {
      await updateUser(currentUser.id, data);
    } catch (error) {
      console.error("Failed to update account info:", error);
    }
  };

  if (isLoading || localLoading) {
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

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Profile Section */}
      <section className="space-y-10">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <form
          onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
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
                      isInvalid={!!profileForm.formState.errors.email}
                      errorMessage={profileForm.formState.errors.email?.message}
                    />
                  )}
                />
                <Controller
                  name="role"
                  control={profileForm.control}
                  render={({ field }) => (
                    <Select
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) => {
                        const value = Array.from(keys)[0]?.toString();
                        if (value) field.onChange(value);
                      }}
                      label="Role"
                      labelPlacement="outside"
                      placeholder="Select role"
                      variant="underlined"
                      classNames={{ label: "text-base font-medium" }}
                      isInvalid={!!profileForm.formState.errors.role}
                      errorMessage={profileForm.formState.errors.role?.message}
                    >
                      {Object.values(USER_ROLES).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
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
              isLoading={profileForm.formState.isSubmitting}
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
              name="phoneNumber"
              control={personalInfoForm.control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Phone Number"
                  labelPlacement="outside"
                  placeholder="Enter phone number"
                  variant="bordered"
                  classNames={inputStyles}
                  isInvalid={!!personalInfoForm.formState.errors.phoneNumber}
                  errorMessage={
                    personalInfoForm.formState.errors.phoneNumber?.message
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
                    if (value) field.onChange(value);
                  }}
                  label="Gender"
                  labelPlacement="outside"
                  placeholder="Select gender"
                  variant="bordered"
                  classNames={inputStyles}
                  isInvalid={!!personalInfoForm.formState.errors.gender}
                  errorMessage={
                    personalInfoForm.formState.errors.gender?.message
                  }
                >
                  <SelectItem key={GENDERS.MALE} value={GENDERS.MALE}>
                    Male
                  </SelectItem>
                  <SelectItem key={GENDERS.FEMALE} value={GENDERS.FEMALE}>
                    Female
                  </SelectItem>
                </Select>
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              color="primary"
              isLoading={personalInfoForm.formState.isSubmitting}
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
              name="department"
              control={accountInfoForm.control}
              render={({ field }) => (
                <Select
                  selectedKeys={field.value ? [field.value] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0]?.toString();
                    if (value) field.onChange(value);
                  }}
                  label="Department"
                  labelPlacement="outside"
                  placeholder="Select department"
                  variant="bordered"
                  classNames={inputStyles}
                  isInvalid={!!accountInfoForm.formState.errors.department}
                  errorMessage={
                    accountInfoForm.formState.errors.department?.message
                  }
                >
                  {Object.values(DEPARTMENTS).map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
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
              isLoading={accountInfoForm.formState.isSubmitting}
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
