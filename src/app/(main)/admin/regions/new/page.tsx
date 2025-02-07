import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { RegionForm } from "@/components/modules/admin/regions/RegionForm";

export default function NewRegionPage() {
  return (
    <AdminPageLayout
      header={
        <AdminPageHeader
          title="Add New Region"
          description="Create a new region in the system."
        />
      }
    >
      <div className="max-w-2xl">
        <RegionForm isNew />
      </div>
    </AdminPageLayout>
  );
}
