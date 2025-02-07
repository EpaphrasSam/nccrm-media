import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { ThematicAreaForm } from "@/components/modules/admin/thematic-areas/ThematicAreaForm";
import { InitializeThematicArea } from "./initialize";

interface EditThematicAreaPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditThematicAreaPage({
  params,
}: EditThematicAreaPageProps) {
  const { id } = await params;

  return (
    <>
      <InitializeThematicArea id={id} />
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Edit Thematic Area"
            description="Modify thematic area details."
          />
        }
      >
        <div className="max-w-2xl">
          <ThematicAreaForm isNew={false} />
        </div>
      </AdminPageLayout>
    </>
  );
}
