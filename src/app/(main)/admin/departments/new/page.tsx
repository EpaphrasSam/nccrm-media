"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";

export default function NewDepartmentPage() {
  return (
    <AdminPageLayout
      header={
        <AdminPageHeader
          title="Add New Department"
          description="Create a new department in the system."
        />
      }
    >
      <div className="max-w-2xl">{/* Form will be added later */}</div>
    </AdminPageLayout>
  );
}
