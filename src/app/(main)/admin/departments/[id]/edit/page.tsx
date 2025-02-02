"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";

interface EditDepartmentPageProps {
  params: {
    id: string;
  };
}

export default function EditDepartmentPage({
  params,
}: EditDepartmentPageProps) {
  return (
    <AdminPageLayout
      header={
        <AdminPageHeader
          title="Edit Department"
          description="Modify department details."
        />
      }
    >
      <div className="max-w-2xl">{/* Form will be added later */}</div>
    </AdminPageLayout>
  );
}
