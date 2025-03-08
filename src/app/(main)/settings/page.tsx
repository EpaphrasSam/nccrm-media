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
  addToast,
} from "@heroui/react";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { GENDERS } from "@/lib/constants";
import { useState, useEffect, useRef } from "react";
import { FaCamera } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { generateUsername, generatePassword } from "@/helpers/userHelpers";
import { useSession } from "next-auth/react";
import { userService } from "@/services/users/api";

// Section schemas
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

const personalInfoSchema = z.object({
  phone_number: z.string().min(1, "Phone number is required"),
  gender: z.enum([GENDERS.MALE, GENDERS.FEMALE]),
});

const accountInfoSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
type AccountInfoFormData = z.infer<typeof accountInfoSchema>;

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [localLoading, setLocalLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | undefined>(
    session?.user?.image || ""
  );
  const [showPassword, setShowPassword] = useState(false);
  const [autoGenerateUsername, setAutoGenerateUsername] = useState(false);

  // Hidden file input for image upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Section Form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    },
  });

  // Personal Info Section Form
  const personalInfoForm = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      phone_number: session?.user?.phone_number || "",
      gender: (session?.user?.gender as "male" | "female") || GENDERS.MALE,
    },
  });

  // Account Info Section Form
  const accountInfoForm = useForm<AccountInfoFormData>({
    resolver: zodResolver(accountInfoSchema),
    defaultValues: {
      username: session?.user?.username || "",
      password: "",
    },
  });

  // Reset forms when session changes
  useEffect(() => {
    if (status !== "loading" && session?.user) {
      profileForm.reset({
        name: session.user.name || "",
        email: session.user.email || "",
      });
      personalInfoForm.reset({
        phone_number: session.user.phone_number || "",
        gender: (session.user.gender as "male" | "female") || GENDERS.MALE,
      });
      accountInfoForm.reset({
        username: session.user.username || "",
        password: "",
      });
      setProfileImage(session.user.image || "");
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [session, status, profileForm, personalInfoForm, accountInfoForm]);

  // Auto-generate username when name changes and auto-generate is enabled
  useEffect(() => {
    if (autoGenerateUsername && session?.user) {
      accountInfoForm.setValue("username", generateUsername(session.user.name));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.name, autoGenerateUsername, accountInfoForm]);

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
    if (!session?.user?.id) return;

    try {
      const updateData = { ...data };
      if (profileImage && profileImage !== session?.user?.image) {
        const response = await fetch(profileImage);
        const blob = await response.blob();
        const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
        Object.assign(updateData, { image: file });
      }

      await userService.update(session.user.id, updateData);
      addToast({
        title: "Success",
        description: "Profile updated successfully",
        color: "success",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      addToast({
        title: "Error",
        description: "Failed to update profile",
        color: "danger",
      });
    }
  };

  const handlePersonalInfoSubmit = async (data: PersonalInfoFormData) => {
    if (!session?.user?.id) return;

    try {
      await userService.update(session.user.id, data);
      addToast({
        title: "Success",
        description: "Personal information updated successfully",
        color: "success",
      });
    } catch (error) {
      console.error("Failed to update personal info:", error);
      addToast({
        title: "Error",
        description: "Failed to update personal information",
        color: "danger",
      });
    }
  };

  const handleAccountInfoSubmit = async (data: AccountInfoFormData) => {
    if (!session?.user?.id) return;

    try {
      await userService.update(session.user.id, data);
      addToast({
        title: "Success",
        description: "Account information updated successfully",
        color: "success",
      });
    } catch (error) {
      console.error("Failed to update account info:", error);
      addToast({
        title: "Error",
        description: "Failed to update account information",
        color: "danger",
      });
    }
  };

  if (status === "loading" || localLoading) {
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

  if (!session?.user) {
    return <div>Not authenticated</div>;
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
                <Input
                  label="Role"
                  labelPlacement="outside"
                  isReadOnly
                  value={session?.user?.role?.name || ""}
                  variant="underlined"
                  classNames={{ label: "text-base font-medium" }}
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

            <Input
              label="Department"
              placeholder="Department"
              labelPlacement="outside"
              isReadOnly
              value={session?.user?.department || ""}
              variant="bordered"
              classNames={inputStyles}
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
