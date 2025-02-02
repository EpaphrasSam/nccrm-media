"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";

interface EditThematicAreaPageProps {
  params: {
    id: string;
  };
}

export default function EditThematicAreaPage({
  params,
}: EditThematicAreaPageProps) {
  return (
    <AdminPageLayout
      header={
        <AdminPageHeader
          title="Edit Thematic Area"
          description="Modify thematic area details."
        />
      }
    >
      <div className="max-w-2xl">{/* Form will be added later */}</div>
    </AdminPageLayout>
  );
}
