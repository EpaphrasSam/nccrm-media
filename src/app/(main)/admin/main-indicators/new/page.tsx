"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";

export default function NewMainIndicatorPage() {
  return (
    <AdminPageLayout
      header={
        <AdminPageHeader
          title="Add New Main Indicator"
          description="Create a new main indicator in the system."
        />
      }
    >
      <div className="max-w-2xl">{/* Form will be added later */}</div>
    </AdminPageLayout>
  );
}
