import { Suspense } from "react";
import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { SituationalReportingToolbar } from "@/components/modules/main/situational-reporting/SituationalReportingToolbar";
import { SituationalReportingTable } from "@/components/modules/main/situational-reporting/SituationalReportingTable";
import { InitializeSituationalReporting } from "./initialize";

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
          <AdminPageHeader
            title="Situational Reporting"
            description="Organize situational reporting within the system. Add, edit, or remove situational reportings."
          />
        }
      >
        <SituationalReportingToolbar />
        <SituationalReportingTable />
      </AdminPageLayout>
    </>
  );
}
