import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { RegionForm } from "@/components/modules/admin/regions/RegionForm";
import { InitializeRegion } from "./initialize";

interface EditRegionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditRegionPage({ params }: EditRegionPageProps) {
  const { id } = await params;

  return (
    <>
      <InitializeRegion id={id} />
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Edit Region"
            description="Modify region details."
          />
        }
      >
        <div className="max-w-2xl">
          <RegionForm />
        </div>
      </AdminPageLayout>
    </>
  );
}
