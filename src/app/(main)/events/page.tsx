import { Suspense } from "react";
import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { EventsToolbar } from "@/components/modules/main/events/EventsToolbar";
import { EventsTable } from "@/components/modules/main/events/EventsTable";
import { InitializeEvents } from "./initialize";

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

export default async function EventsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const initialFilters = {
    page: getNumberParam(resolvedSearchParams.page),
    limit: getNumberParam(resolvedSearchParams.limit),
    thematic_area: getStringParam(resolvedSearchParams.thematic_area),
    region: getStringParam(resolvedSearchParams.region),
    search: getStringParam(resolvedSearchParams.search),
  };

  return (
    <>
      <Suspense fallback={null}>
        <InitializeEvents initialFilters={initialFilters} />
      </Suspense>
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Events"
            description="View and manage events in the system."
          />
        }
      >
        <EventsToolbar />
        <EventsTable />
      </AdminPageLayout>
    </>
  );
}
