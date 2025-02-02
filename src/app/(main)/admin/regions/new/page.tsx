"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";

export default function NewRegionPage() {
  return (
    <AdminPageLayout
      header={
        <AdminPageHeader
          title="Add New Region"
          description="Create a new region in the system."
        />
      }
    >
      <div className="max-w-2xl">{/* Form will be added later */}</div>
    </AdminPageLayout>
  );
}
