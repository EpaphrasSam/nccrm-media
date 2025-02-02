"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { RolesToolbar } from "@/components/modules/admin/roles/RolesToolbar";
import { RolesTable } from "@/components/modules/admin/roles/RolesTable";
import { InitializeRoles } from "@/services/roles/initialize";

export default function RolesPage() {
  return (
    <>
      <InitializeRoles />
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Manage Roles"
            description="Create, edit, and assign roles to define user permissions and access levels within the system."
          />
        }
        toolbar={<RolesToolbar />}
      >
        <RolesTable />
      </AdminPageLayout>
    </>
  );
}
