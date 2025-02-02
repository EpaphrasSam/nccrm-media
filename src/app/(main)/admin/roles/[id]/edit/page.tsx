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
            title="Edit Role"
            description="Modify role details and permissions."
          />
        }
      >
        <RoleForm isNew={false} />
      </AdminPageLayout>
    </>
  );
}
