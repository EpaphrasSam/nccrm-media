import { Suspense } from "react";
import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { MainIndicatorsToolbar } from "@/components/modules/admin/main-indicators/MainIndicatorsToolbar";
import { MainIndicatorsTable } from "@/components/modules/admin/main-indicators/MainIndicatorsTable";
import { InitializeMainIndicators } from "./initialize";

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

export default async function MainIndicatorsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const initialFilters = {
    page: getNumberParam(resolvedParams.page),
    limit: getNumberParam(resolvedParams.limit),
    search: getStringParam(resolvedParams.search),
    thematic_area: getStringParam(resolvedParams.thematic_area),
  };

  return (
    <>
      <Suspense fallback={null}>
        <InitializeMainIndicators initialFilters={initialFilters} />
      </Suspense>
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Manage Main Indicators"
            description="Add, edit and manage main indicators"
          />
        }
        toolbar={<MainIndicatorsToolbar />}
      >
        <MainIndicatorsTable />
      </AdminPageLayout>
    </>
  );
}
