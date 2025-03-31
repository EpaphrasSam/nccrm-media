import { Suspense } from "react";
import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { InitializeOverviewSummary } from "./initialize";
import { OverviewHeader } from "@/components/modules/main/situational-reporting/overview-summary/OverviewHeader";
import { OverviewTable } from "@/components/modules/main/situational-reporting/overview-summary/OverviewTable";

function getStringParam(
  param: string | string[] | undefined
): string | undefined {
  return typeof param === "string" ? param : undefined;
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OverviewSummaryPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const initialFilters = {
    from: getStringParam(resolvedSearchParams.from)
      ? Number(getStringParam(resolvedSearchParams.from))
      : undefined,
    to: getStringParam(resolvedSearchParams.to)
      ? Number(getStringParam(resolvedSearchParams.to))
      : undefined,
    reports: getStringParam(resolvedSearchParams.reports),
  };

  return (
    <>
      <Suspense fallback={null}>
        <InitializeOverviewSummary initialFilters={initialFilters} />
      </Suspense>
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Summary"
            description="View summary of all situational reporting data"
          />
        }
      >
        <OverviewHeader />
        <OverviewTable />
      </AdminPageLayout>
    </>
  );
}
