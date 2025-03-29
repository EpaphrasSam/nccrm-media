import { Suspense } from "react";
import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { SituationalReportingToolbar } from "@/components/modules/main/situational-reporting/SituationalReportingToolbar";
import { SituationalReportingTable } from "@/components/modules/main/situational-reporting/SituationalReportingTable";
import { InitializeSituationalReporting } from "./initialize";
import { OverviewSummaryButton } from "@/components/modules/main/situational-reporting/OverviewSummaryButton";

function getStringParam(
  param: string | string[] | undefined
): string | undefined {
  return typeof param === "string" ? param : undefined;
}

function getNumberParam(
  param: string | string[] | undefined
): number | undefined {
  const value = getStringParam(param);
  return value ? Number(value) : undefined;
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SituationalReportingPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = await searchParams;
  const initialFilters = {
    page: getNumberParam(resolvedSearchParams.page),
    limit: getNumberParam(resolvedSearchParams.limit),
    search: getStringParam(resolvedSearchParams.search),
  };

  return (
    <>
      <Suspense fallback={null}>
        <InitializeSituationalReporting initialFilters={initialFilters} />
      </Suspense>
      <AdminPageLayout
        header={
          <div className="flex lg:flex-row flex-col justify-between items-center gap-4">
            <AdminPageHeader
              title="Situational Reporting"
              description="Organize situational reporting within the system. Add, edit, or remove situational reportings."
            />
            <div className="flex justify-end">
              <OverviewSummaryButton />
            </div>
          </div>
        }
      >
        <SituationalReportingToolbar />
        <SituationalReportingTable />
      </AdminPageLayout>
    </>
  );
}
