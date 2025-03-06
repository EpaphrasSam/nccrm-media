"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { ThematicAreaForm } from "@/components/modules/admin/thematic-areas/ThematicAreaForm";

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
      <div className="max-w-2xl">
        <ThematicAreaForm isNew />
      </div>
    </AdminPageLayout>
  );
}
