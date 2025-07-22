import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { MainIndicatorForm } from "@/components/modules/admin/main-indicators/MainIndicatorForm";
import { InitializeMainIndicator } from "./initialize";

interface EditMainIndicatorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditMainIndicatorPage({
  params,
}: EditMainIndicatorPageProps) {
  const { id } = await params;

  return (
    <>
      <InitializeMainIndicator id={id} />{" "}
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Edit Main Indicator"
            description="Modify main indicator details."
            showBackButton={true}
            backButtonText="Main Indicators"
          />
        }
      >
        <div className="max-w-2xl">
          <MainIndicatorForm isNew={false} />
        </div>
      </AdminPageLayout>
    </>
  );
}
