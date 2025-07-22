import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { SituationalReportingForm } from "@/components/modules/main/situational-reporting/SituationalReportingForm";
import { InitializeSituationalReporting } from "./initialize";

interface EditSituationalReportingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditSituationalReportingPage({
  params,
}: EditSituationalReportingPageProps) {
  const { id } = await params;

  return (
    <>
      <InitializeSituationalReporting id={id} />
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Edit Situational Reporting"
            description="Modify situational reporting details."
            showBackButton={true}
            backButtonText="Situational Reporting"
          />
        }
      >
        <div className="max-w-2xl">
          <SituationalReportingForm isNew={false} />
        </div>
      </AdminPageLayout>
    </>
  );
}
