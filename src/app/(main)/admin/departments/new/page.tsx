"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { DepartmentForm } from "@/components/modules/admin/departments/DepartmentForm";

export default function NewDepartmentPage() {
  return (
    <>
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Add New Department"
            description="Create a new department in the system."
            showBackButton={true}
            backButtonText="Departments"
          />
        }
      >
        <div className="max-w-2xl">
          <DepartmentForm isNew />
        </div>
      </AdminPageLayout>
    </>
  );
}
