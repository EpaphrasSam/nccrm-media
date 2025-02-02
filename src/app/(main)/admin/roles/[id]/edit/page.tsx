"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";

interface EditRolePageProps {
  params: {
    id: string;
  };
}

export default function EditRolePage({ params }: EditRolePageProps) {
  return (
    <AdminPageLayout
      header={
        <AdminPageHeader
          title="Edit Role"
          description="Modify role details and permissions."
        />
      }
    >
      {/* Form will be added later */}
    </AdminPageLayout>
  );
}
