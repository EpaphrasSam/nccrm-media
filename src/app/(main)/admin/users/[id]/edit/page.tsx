import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { UserEditForm } from "@/components/modules/admin/users/UserEditForm";
import { InitializeUser } from "./initialize";

interface EditUserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  return (
    <>
      <InitializeUser id={id} />
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="View User Details"
            description="View and manage detailed information about the user."
          />
        }
      >
        <UserEditForm />
      </AdminPageLayout>
    </>
  );
}
