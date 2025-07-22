import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { AnalysisContainer } from "@/components/modules/main/situational-reporting/analysis/AnalysisContainer";
import { InitializeAnalysis } from "./initialize";

interface AnalysisPageProps {
  params: Promise<{
    reportId: string;
  }>;
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { reportId } = await params;
  return (
    <>
      <InitializeAnalysis reportId={reportId} />
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Situational Analysis"
            description="Fill in the details for situational analysis"
            showBackButton={true}
            backButtonText="Situational Reporting"
          />
        }
      >
        <AnalysisContainer />
      </AdminPageLayout>
    </>
  );
}
