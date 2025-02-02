"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { MainIndicatorsToolbar } from "@/components/modules/admin/main-indicators/MainIndicatorsToolbar";
import { MainIndicatorsTable } from "@/components/modules/admin/main-indicators/MainIndicatorsTable";
import { InitializeMainIndicators } from "@/app/(main)/admin/main-indicators/initialize";

export default function MainIndicatorsPage() {
  return (
    <>
      <InitializeMainIndicators />
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Manage Main Indicators"
            description="Organize main indicators within the system. Add, edit, or remove main indicators."
          />
        }
        toolbar={<MainIndicatorsToolbar />}
      >
        <MainIndicatorsTable />
      </AdminPageLayout>
    </>
  );
}
