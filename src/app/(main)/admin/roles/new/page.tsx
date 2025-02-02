import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { RoleForm } from "@/components/modules/admin/roles/RoleForm";

export default function NewRolePage() {
  return (
    <AdminPageLayout
      header={
        <AdminPageHeader
          title="Add New Role"
          description="Create a new role and define its permissions."
        />
      }
    >
      <RoleForm isNew />
    </AdminPageLayout>
  );
}
