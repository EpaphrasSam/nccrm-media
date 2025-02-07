import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { DepartmentForm } from "@/components/modules/admin/departments/DepartmentForm";
import { InitializeDepartment } from "./initialize";

interface EditDepartmentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditDepartmentPage({
  params,
}: EditDepartmentPageProps) {
  const { id } = await params;

  return (
    <>
      <InitializeDepartment id={id} />
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Edit Department"
            description="Modify department details."
          />
        }
      >
        <div className="max-w-2xl">
          <DepartmentForm />
        </div>
      </AdminPageLayout>
    </>
  );
}
