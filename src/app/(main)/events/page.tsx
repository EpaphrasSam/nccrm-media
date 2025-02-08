import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { EventsToolbar } from "@/components/modules/main/events/EventsToolbar";
import { EventsTable } from "@/components/modules/main/events/EventsTable";
import { InitializeEvents } from "./initialize";

export default function EventsPage() {
  return (
    <>
      <InitializeEvents />
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
