"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input, Button, Skeleton } from "@heroui/react";
import { Logo } from "@/components/common/misc/Logo";
import { inputStyles } from "@/lib/styles";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth/api";

const otpSchema = z.object({
  resetCode: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

const passwordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export function ResetPasswordForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("resetEmail");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as {
          email: string;
          expiry: number;
        };
        if (!parsed.email || !parsed.expiry || Date.now() > parsed.expiry) {
          localStorage.removeItem("resetEmail");
          router.replace("/forgot-password");
        } else {
          setEmail(parsed.email);
          setLoading(false);
        }
      } catch {
        localStorage.removeItem("resetEmail");
        router.replace("/forgot-password");
      }
    } else {
      router.replace("/forgot-password");
    }
  }, [router]);

  // Step 1: OTP form
  const {
    control: otpControl,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    watch: watchOtp,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  // Step 2: Password form
  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Handle OTP submit
  const onOtpSubmit = () => {
    setStep(2);
  };

  // Handle password reset submit
  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      const resetCode = watchOtp("resetCode");
      const result = await authService.resetPassword(
        {
          email,
          resetCode,
          newPassword: data.newPassword,
        },
        {
          handleError: (error: string) => {
            console.error("Reset Password Form Error:", error);
            throw new Error(error);
          },
        }
      );
      if (result) {
        localStorage.removeItem("resetEmail");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full backdrop-blur-sm lg:p-8 p-4 max-sm:px-0 space-y-8">
        <div className="mb-8 flex justify-center">
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded" />
          <Skeleton className="h-5 w-80 rounded" />
        </div>
        <div className="flex flex-col gap-8 mt-8">
          <Skeleton className="h-12 w-full lg:w-4/5 mx-auto rounded" />
          <Skeleton className="h-12 w-full lg:w-4/5 mx-auto rounded" />
          <Skeleton className="h-12 w-full lg:w-4/5 mx-auto rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full backdrop-blur-sm lg:p-8 p-4 max-sm:px-0 space-y-8">
      <Logo className="mb-8 justify-center" hideTextOnMobile={false} />
      <div className="space-y-2">
        <h1 className="text-title font-bold">Reset Password</h1>
        <p className="text-md-plus font-light">
          {step === 1
            ? "Enter the 6-digit code sent to your email."
            : "Enter your new password below."}
        </p>
      </div>

      {step === 1 && (
        <form
          onSubmit={handleOtpSubmit(onOtpSubmit)}
          className="flex flex-col gap-8"
        >
          <Controller
            name="resetCode"
            control={otpControl}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="OTP Code"
                labelPlacement="outside"
                placeholder="Enter 6-digit code"
                isRequired
                radius="sm"
                variant="bordered"
                classNames={inputStyles}
                errorMessage={otpErrors.resetCode?.message}
                isInvalid={!!otpErrors.resetCode}
                maxLength={6}
                pattern="[0-9]{6}"
              />
            )}
          />
          <div className="flex justify-center w-full">
            <Button
              type="submit"
              radius="sm"
              className="w-full lg:w-4/5 h-12 bg-brand-red-dark text-white"
            >
              Continue
            </Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={handlePasswordSubmit(onPasswordSubmit)}
          className="flex flex-col gap-8"
        >
          <Controller
            name="newPassword"
            control={passwordControl}
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                label="New Password"
                labelPlacement="outside"
                placeholder="Enter new password"
                isRequired
                radius="sm"
                variant="bordered"
                classNames={inputStyles}
                errorMessage={passwordErrors.newPassword?.message}
                isInvalid={!!passwordErrors.newPassword}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={passwordControl}
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                label="Confirm Password"
                labelPlacement="outside"
                placeholder="Re-enter new password"
                isRequired
                radius="sm"
                variant="bordered"
                classNames={inputStyles}
                errorMessage={passwordErrors.confirmPassword?.message}
                isInvalid={!!passwordErrors.confirmPassword}
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
              Reset Password
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
