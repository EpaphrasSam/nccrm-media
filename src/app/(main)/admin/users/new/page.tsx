"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { UserCreateForm } from "@/components/modules/admin/users/UserCreateForm";

export default function NewUserPage() {
  return (
    <AdminPageLayout
      header={
        <AdminPageHeader
          title="Add New User"
          description="Create a new user and assign their role and department."
        />
      }
    >
      <UserCreateForm />
    </AdminPageLayout>
  );
}
