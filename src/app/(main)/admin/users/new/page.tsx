"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";

export default function NewUserPage() {
  return (
    <AdminPageLayout
      header={
        <AdminPageHeader
          title="Add New User"
          description="Create a new user account and assign their role and permissions."
        />
      }
    >
      {/* Form will be added later */}
    </AdminPageLayout>
  );
}
