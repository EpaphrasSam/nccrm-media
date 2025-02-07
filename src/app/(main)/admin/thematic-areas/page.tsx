import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { ThematicAreasToolbar } from "@/components/modules/admin/thematic-areas/ThematicAreasToolbar";
import { ThematicAreasTable } from "@/components/modules/admin/thematic-areas/ThematicAreasTable";
import { InitializeThematicAreas } from "@/app/(main)/admin/thematic-areas/initialize";

export default function ThematicAreasPage() {
  return (
    <>
      <InitializeThematicAreas />
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Manage Thematic Areas"
            description="Organize thematic areas within the system. Add, edit, or remove thematic areas."
          />
        }
        toolbar={<ThematicAreasToolbar />}
      >
        <ThematicAreasTable />
      </AdminPageLayout>
    </>
  );
}
