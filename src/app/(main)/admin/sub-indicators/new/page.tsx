"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { SubIndicatorForm } from "@/components/modules/admin/sub-indicators/SubIndicatorForm";

export default function NewSubIndicatorPage() {
  return (
    <AdminPageLayout
      header={
        <AdminPageHeader
          title="Add New Sub Indicator"
          description="Create a new sub indicator in the system."
          showBackButton={true}
          backButtonText="Sub Indicators"
        />
      }
    >
      <div className="max-w-2xl">
        <SubIndicatorForm isNew />
      </div>
    </AdminPageLayout>
  );
}
