"use client";

import { Button } from "@heroui/react";
import { buttonStyles } from "@/lib/styles";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";

export function OverviewSummaryButton() {
  const router = useRouter();
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();

  const canViewOverview = hasPermission("situational_report", "view");

  if (permissionsLoading || !canViewOverview) {
    return null;
  }

  return (
    <Button
      color="primary"
      variant="bordered"
      className={`bg-brand-red-dark text-white px-8 ${buttonStyles}`}
      onPress={() => router.push("/situational-reporting/overview-summary")}
    >
      View Overview Summary
    </Button>
  );
}
