import { Suspense } from "react";
import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { DepartmentsToolbar } from "@/components/modules/admin/departments/DepartmentsToolbar";
import { DepartmentsTable } from "@/components/modules/admin/departments/DepartmentsTable";
import { InitializeDepartments } from "./initialize";

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

export default async function DepartmentsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const initialFilters = {
    page: getNumberParam(resolvedParams.page),
    limit: getNumberParam(resolvedParams.limit),
    search: getStringParam(resolvedParams.search),
  };

  return (
    <>
      <Suspense fallback={null}>
        <InitializeDepartments initialFilters={initialFilters} />
      </Suspense>
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Manage Departments"
            description="Add, edit and manage departments"
          />
        }
        toolbar={<DepartmentsToolbar />}
      >
        <DepartmentsTable />
      </AdminPageLayout>
    </>
  );
}
