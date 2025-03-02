import { Suspense } from "react";
import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { UsersToolbar } from "@/components/modules/admin/users/UsersToolbar";
import { UsersTable } from "@/components/modules/admin/users/UsersTable";
import { InitializeUsers } from "./initialize";

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

export default async function UsersPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const initialFilters = {
    page: getNumberParam(resolvedParams.page),
    limit: getNumberParam(resolvedParams.limit),
    department: getStringParam(resolvedParams.department),
    role: getStringParam(resolvedParams.role),
  };

  return (
    <>
      <Suspense fallback={null}>
        <InitializeUsers initialFilters={initialFilters} />
      </Suspense>
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Manage Users"
            description="Add, edit and manage user accounts and roles"
          />
        }
        toolbar={<UsersToolbar />}
      >
        <UsersTable />
      </AdminPageLayout>
    </>
  );
}
