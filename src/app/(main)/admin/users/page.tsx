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
            title="Users"
            description="Manage user accounts and permissions"
          />
        }
        toolbar={<UsersToolbar />}
      >
        <UsersTable />
      </AdminPageLayout>
    </>
  );
}
