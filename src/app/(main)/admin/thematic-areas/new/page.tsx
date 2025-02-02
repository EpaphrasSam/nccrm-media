"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";

export default function NewThematicAreaPage() {
  return (
    <AdminPageLayout
      header={
        <AdminPageHeader
          title="Add New Thematic Area"
          description="Create a new thematic area in the system."
        />
      }
    >
      <div className="max-w-2xl">{/* Form will be added later */}</div>
    </AdminPageLayout>
  );
}
