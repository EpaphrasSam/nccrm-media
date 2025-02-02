"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";

export default function NewRolePage() {
  return (
    <AdminPageLayout
      header={
        <AdminPageHeader
          title="Add New Role"
          description="Create a new role and define its permissions within the system."
        />
      }
    >
      {/* Form will be added later */}
    </AdminPageLayout>
  );
}
