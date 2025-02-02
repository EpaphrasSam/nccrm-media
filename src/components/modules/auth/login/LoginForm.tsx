"use client";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input, Button } from "@heroui/react";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Logo } from "@/components/common/misc/Logo";
import { inputStyles } from "@/lib/styles";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="w-full backdrop-blur-sm  lg:p-8 p-4 max-sm:px-0 space-y-8">
      <Logo className="mb-8 justify-center" hideTextOnMobile={false} />
      <div className="space-y-2 text-center">
        <h1 className="text-title font-bold">Welcome Back</h1>
        <p className="text-md-plus font-light">
          Enter your email and password to continue
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

        <div className="space-y-1">
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
                variant="bordered"
                radius="sm"
                size="md"
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
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-brand-red-dark hover:underline underline-offset-4 hover:opacity-75"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <div className="flex justify-center w-full">
          <Button
            type="submit"
            radius="sm"
            className="w-full lg:w-4/5 h-12 bg-brand-red-dark text-white"
          >
            Login
          </Button>
        </div>
      </form>

      <p className="text-center text-base text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-brand-red-dark hover:underline underline-offset-4 hover:opacity-75"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
