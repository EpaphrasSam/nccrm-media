"use client";

import { Button } from "@heroui/react";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { buttonStyles } from "@/lib/styles";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  onBack?: () => void;
}

export function AdminPageHeader({
  title,
  description,
  showBackButton = false,
  backButtonText = "",
  onBack,
}: AdminPageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="space-y-4">
      {showBackButton && (
        <Button
          variant="light"
          startContent={<FaChevronLeft />}
          onPress={handleBack}
          className={`text-brand-black-dark hover:opacity-85 ${buttonStyles}`}
        >
          Back to {backButtonText}
        </Button>
      )}
      <div className="space-y-1">
        <h1 className="text-title font-extrabold leading-117 text-brand-black">
          {title}
        </h1>
        {description && (
          <p className="text-sm-plus font-extrabold leading-117 text-brand-gray">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
