"use client";

import { AdminPageLayout } from "@/components/modules/admin/layout/AdminPageLayout";
import { AdminPageHeader } from "@/components/modules/admin/layout/AdminPageHeader";
import { SituationalReportingForm } from "@/components/modules/main/situational-reporting/SituationalReportingForm";

export default function NewSituationalReportingPage() {
  return (
    <AdminPageLayout
      header={
        <AdminPageHeader
          title="Add Situational Reporting"
          description="Create a new situational reporting by specifying its name"
          showBackButton={true}
          backButtonText="Situational Reporting"
        />
      }
    >
      <div className="max-w-2xl">
        <SituationalReportingForm isNew />
      </div>
    </AdminPageLayout>
  );
}
