"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";

interface EditUserPageProps {
  params: {
    id: string;
  };
}

export default function EditUserPage({ params }: EditUserPageProps) {
  return (
    <AdminPageLayout
      header={
        <AdminPageHeader
          title="Edit User"
          description="Modify user account details and permissions."
        />
      }
    >
      {/* Form will be added later */}
    </AdminPageLayout>
  );
}
