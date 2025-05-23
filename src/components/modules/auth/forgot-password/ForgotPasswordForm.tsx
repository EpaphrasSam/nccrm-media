"use client";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input, Button } from "@heroui/react";
import { Logo } from "@/components/common/misc/Logo";
import { inputStyles } from "@/lib/styles";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth/api";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const RESET_EMAIL_EXPIRY_MINUTES = 10;

export function ForgotPasswordForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const result = await authService.forgotPassword(
        { email: data.email },
        {
          handleError: (error: string) => {
            console.error("Forgot Password Form Error:", error);
            throw new Error(error);
          },
        }
      );
      if (result) {
        const expiry = Date.now() + RESET_EMAIL_EXPIRY_MINUTES * 60 * 1000;
        localStorage.setItem(
          "resetEmail",
          JSON.stringify({ email: data.email, expiry })
        );
        setTimeout(() => {
          router.push("/reset-password");
        }, 1500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full backdrop-blur-sm  lg:p-8 p-4 max-sm:px-0 space-y-8">
      <Logo className="mb-8 justify-center" hideTextOnMobile={false} />
      <div className="space-y-2">
        <h1 className="text-title font-bold">Forgot password?</h1>
        <p className="text-md-plus font-light">
          Enter your email to receive your reset instructions
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
              classNames={inputStyles}
              errorMessage={errors.email?.message}
              isInvalid={!!errors.email}
            />
          )}
        />

        <div className="flex justify-center w-full">
          <Button
            type="submit"
            radius="sm"
            className="w-full lg:w-4/5 h-12 bg-brand-red-dark text-white"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Reset Password
          </Button>
        </div>
      </form>

      <p className="text-center text-base text-gray-600">
        Remember your password?{" "}
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
