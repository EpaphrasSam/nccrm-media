"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";

interface EditRegionPageProps {
  params: {
    id: string;
  };
}

export default function EditRegionPage({ params }: EditRegionPageProps) {
  return (
    <AdminPageLayout
      header={
        <AdminPageHeader
          title="Edit Region"
          description="Modify region details."
        />
      }
    >
      <div className="max-w-2xl">{/* Form will be added later */}</div>
    </AdminPageLayout>
  );
}
