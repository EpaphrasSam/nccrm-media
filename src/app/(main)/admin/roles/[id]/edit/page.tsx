import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { RoleForm } from "@/components/modules/admin/roles/RoleForm";
import { InitializeRoleEdit } from "./initialize";

interface EditRolePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditRolePage({ params }: EditRolePageProps) {
  const { id } = await params;

  return (
    <>
      <InitializeRoleEdit roleId={id} />
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="View Role Details"
            description="View and manage detailed information about the role."
          />
        }
      >
        <RoleForm isNew={false} />
      </AdminPageLayout>
    </>
  );
}
