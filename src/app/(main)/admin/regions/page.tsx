"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { RegionsToolbar } from "@/components/modules/admin/regions/RegionsToolbar";
import { RegionsTable } from "@/components/modules/admin/regions/RegionsTable";
import { InitializeRegions } from "@/services/regions/initialize";

export default function RegionsPage() {
  return (
    <>
      <InitializeRegions />
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Manage Regions"
            description="Organize regions within the system. Add, edit, or remove regions."
          />
        }
        toolbar={<RegionsToolbar />}
      >
        <RegionsTable />
      </AdminPageLayout>
    </>
  );
}
