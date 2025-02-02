"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";

interface EditMainIndicatorPageProps {
  params: {
    id: string;
  };
}

export default function EditMainIndicatorPage({
  params,
}: EditMainIndicatorPageProps) {
  return (
    <AdminPageLayout
      header={
        <AdminPageHeader
          title="Edit Main Indicator"
          description="Modify main indicator details."
        />
      }
    >
      <div className="max-w-2xl">{/* Form will be added later */}</div>
    </AdminPageLayout>
  );
}
