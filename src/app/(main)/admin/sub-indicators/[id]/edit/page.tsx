import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { SubIndicatorForm } from "@/components/modules/admin/sub-indicators/SubIndicatorForm";
import { InitializeSubIndicator } from "./initialize";

interface EditSubIndicatorPageProps {
  params: {
    id: string;
  };
}

export default async function EditSubIndicatorPage({
  params,
}: EditSubIndicatorPageProps) {
  const { id } = params;

  return (
    <>
      <InitializeSubIndicator id={id} />
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Edit Sub Indicator"
            description="Modify sub indicator details."
          />
        }
      >
        <div className="max-w-2xl">
          <SubIndicatorForm />
        </div>
      </AdminPageLayout>
    </>
  );
}
