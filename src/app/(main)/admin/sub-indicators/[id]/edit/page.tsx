"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";

interface EditSubIndicatorPageProps {
  params: {
    id: string;
  };
}

export default function EditSubIndicatorPage({
  params,
}: EditSubIndicatorPageProps) {
  return (
    <AdminPageLayout
      header={
        <AdminPageHeader
          title="Edit Sub Indicator"
          description="Modify sub indicator details."
        />
      }
    >
      <div className="max-w-2xl">{/* Form will be added later */}</div>
    </AdminPageLayout>
  );
}
