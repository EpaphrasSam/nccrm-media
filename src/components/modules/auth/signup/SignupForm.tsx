"use client";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input, Button, Autocomplete, AutocompleteItem } from "@heroui/react";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import useSWR from "swr";
import { Logo } from "@/components/common/misc/Logo";
import { inputStyles } from "@/lib/styles";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth/api";
import type { SignupData } from "@/services/auth/types";
import type { Department } from "@/services/departments/types";

const signupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    department: z.string().min(1, "Please select a department"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deptInputValue, setDeptInputValue] = useState("");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });
  const router = useRouter();

  // Fetch departments
  const { data: departments } = useSWR<Department[]>(
    "departments",
    () => authService.getDepartment() as Promise<Department[]>
  );

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    const signupData: SignupData = {
      email: data.email,
      name: data.fullName,
      departmentId: data.department,
      phoneNumber: data.phoneNumber,
      password: data.password,
    };

    try {
      const result = await authService.signup(signupData, {
        handleError: (error: string) => {
          console.error("Signup Form Error:", error);
          throw new Error(error);
        },
      });
      if (result) {
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <div className="w-full backdrop-blur-sm lg:p-8 p-4 max-sm:px-0 space-y-8">
      <Logo className="mb-8 justify-center" hideTextOnMobile={false} />
      <div className="space-y-3">
        <h1 className="text-title font-bold">Account Creation</h1>
        <p className="text-md-plus font-light">
          Join the community of truth seekers!
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="email"
              label="Email"
              labelPlacement="outside"
              placeholder="Enter your email"
              isRequired
              radius="sm"
              variant="bordered"
              size="md"
              classNames={inputStyles}
              errorMessage={errors.email?.message}
              isInvalid={!!errors.email}
            />
          )}
        />

        <Controller
          name="fullName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Full name"
              labelPlacement="outside"
              placeholder="Enter your full name"
              isRequired
              variant="bordered"
              radius="sm"
              size="md"
              classNames={inputStyles}
              errorMessage={errors.fullName?.message}
              isInvalid={!!errors.fullName}
            />
          )}
        />

        <Controller
          name="department"
          control={control}
          render={({ field }) => {
            // Filter departments by input value
            const filteredDepartments = (departments || []).filter((dept) =>
              dept.name.toLowerCase().includes(deptInputValue.toLowerCase())
            );
            return (
              <Autocomplete
                {...field}
                label="Department"
                labelPlacement="outside"
                placeholder="Select a department"
                isRequired
                radius="sm"
                variant="bordered"
                size="md"
                classNames={{
                  listbox: "overflow-visible",
                }}
                inputProps={{
                  classNames: {
                    label: "text-base font-medium pb-2",
                    inputWrapper: "py-6 rounded-xlg",
                    base: "border-brand-gray-light",
                  },
                }}
                errorMessage={errors.department?.message}
                isInvalid={!!errors.department}
                isLoading={!departments}
                items={filteredDepartments}
                selectedKey={field.value || undefined}
                onSelectionChange={(key) =>
                  field.onChange(key?.toString() || "")
                }
                inputValue={deptInputValue}
                onInputChange={setDeptInputValue}
                defaultFilter={(textValue, inputValue) =>
                  textValue.toLowerCase().includes(inputValue.toLowerCase())
                }
              >
                {(item) => (
                  <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                )}
              </Autocomplete>
            );
          }}
        />

        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="tel"
              label="Phone number"
              labelPlacement="outside"
              placeholder="Enter your phone number"
              isRequired
              radius="sm"
              variant="bordered"
              size="md"
              classNames={inputStyles}
              errorMessage={errors.phoneNumber?.message}
              isInvalid={!!errors.phoneNumber}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type={isPasswordVisible ? "text" : "password"}
              label="Password"
              labelPlacement="outside"
              placeholder="Enter your password"
              isRequired
              radius="sm"
              size="md"
              variant="bordered"
              classNames={inputStyles}
              errorMessage={errors.password?.message}
              isInvalid={!!errors.password}
              endContent={
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="focus:outline-none p-2 text-brand-gray hover:text-brand-gray-dark"
                >
                  {isPasswordVisible ? (
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
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type={isConfirmPasswordVisible ? "text" : "password"}
              label="Confirm Password"
              labelPlacement="outside"
              placeholder="Enter your password again"
              isRequired
              radius="sm"
              variant="bordered"
              size="md"
              classNames={inputStyles}
              errorMessage={errors.confirmPassword?.message}
              isInvalid={!!errors.confirmPassword}
              endContent={
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="focus:outline-none p-2 text-brand-gray hover:text-brand-gray-dark"
                >
                  {isConfirmPasswordVisible ? (
                    <FiEyeOff className="h-4 w-4" />
                  ) : (
                    <FiEye className="h-4 w-4" />
                  )}
                </button>
              }
            />
          )}
        />

        <div className="flex justify-center w-full">
          <Button
            type="submit"
            radius="sm"
            className="w-full lg:w-4/5 h-12 bg-brand-red-dark text-white"
            isLoading={isLoading}
          >
            Sign Up
          </Button>
        </div>
      </form>

      <p className="text-center text-base text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-brand-red-dark hover:underline underline-offset-4 hover:opacity-75"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
