import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { SubIndicatorsToolbar } from "@/components/modules/admin/sub-indicators/SubIndicatorsToolbar";
import { SubIndicatorsTable } from "@/components/modules/admin/sub-indicators/SubIndicatorsTable";
import { InitializeSubIndicators } from "@/app/(main)/admin/sub-indicators/initialize";

export default function SubIndicatorsPage() {
  return (
    <>
      <InitializeSubIndicators />
      <AdminPageLayout
        header={
          <AdminPageHeader
            title="Manage Sub Indicators"
            description="Organize sub indicators within the system. Add, edit, or remove sub indicators."
          />
        }
        toolbar={<SubIndicatorsToolbar />}
      >
        <SubIndicatorsTable />
      </AdminPageLayout>
    </>
  );
}
