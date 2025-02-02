"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { UsersToolbar } from "@/components/modules/admin/users/UsersToolbar";
import { UsersTable } from "@/components/modules/admin/users/UsersTable";
import { InitializeUsers } from "@/app/(main)/admin/users/initialize";

export default function UsersPage() {
  return (
    <>
      <InitializeUsers />
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Manage Users"
            description="Add, edit and manage user accounts and roles"
          />
        }
        toolbar={<UsersToolbar />}
      >
        <UsersTable />
      </AdminPageLayout>
    </>
  );
}
