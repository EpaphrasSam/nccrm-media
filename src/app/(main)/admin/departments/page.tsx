"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { DepartmentsToolbar } from "@/components/modules/admin/departments/DepartmentsToolbar";
import { DepartmentsTable } from "@/components/modules/admin/departments/DepartmentsTable";
import { InitializeDepartments } from "@/services/departments/initialize";

export default function DepartmentsPage() {
  return (
    <>
      <InitializeDepartments />
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Manage Departments"
            description="Organize departments within the system. Add, edit, or remove departments."
          />
        }
        toolbar={<DepartmentsToolbar />}
      >
        <DepartmentsTable />
      </AdminPageLayout>
    </>
  );
}
