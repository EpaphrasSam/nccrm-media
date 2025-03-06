import { Suspense } from "react";
import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { SubIndicatorsToolbar } from "@/components/modules/admin/sub-indicators/SubIndicatorsToolbar";
import { SubIndicatorsTable } from "@/components/modules/admin/sub-indicators/SubIndicatorsTable";
import { InitializeSubIndicators } from "./initialize";

function getNumberParam(
  param: string | string[] | undefined
): number | undefined {
  if (typeof param === "string") {
    const num = parseInt(param, 10);
    return isNaN(num) ? undefined : num;
  }
  return undefined;
}

function getStringParam(
  param: string | string[] | undefined
): string | undefined {
  return typeof param === "string" ? param : undefined;
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SubIndicatorsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const initialFilters = {
    page: getNumberParam(resolvedParams.page),
    limit: getNumberParam(resolvedParams.limit),
    search: getStringParam(resolvedParams.search),
    main_indicator: getStringParam(resolvedParams.main_indicator),
  };

  return (
    <>
      <Suspense fallback={null}>
        <InitializeSubIndicators initialFilters={initialFilters} />
      </Suspense>
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Manage Sub Indicators"
            description="Add, edit and manage sub indicators"
          />
        }
        toolbar={<SubIndicatorsToolbar />}
      >
        <SubIndicatorsTable />
      </AdminPageLayout>
    </>
  );
}
