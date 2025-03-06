import { Suspense } from "react";
import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { RegionsToolbar } from "@/components/modules/admin/regions/RegionsToolbar";
import { RegionsTable } from "@/components/modules/admin/regions/RegionsTable";
import { InitializeRegions } from "./initialize";

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

export default async function RegionsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const initialFilters = {
    page: getNumberParam(resolvedParams.page),
    limit: getNumberParam(resolvedParams.limit),
    search: getStringParam(resolvedParams.search),
  };

  return (
    <>
      <Suspense fallback={null}>
        <InitializeRegions initialFilters={initialFilters} />
      </Suspense>
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Manage Regions"
            description="Add, edit and manage regions"
          />
        }
        toolbar={<RegionsToolbar />}
      >
        <RegionsTable />
      </AdminPageLayout>
    </>
  );
}
