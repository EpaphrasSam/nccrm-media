import { MainPageLayout } from "@/components/modules/main/layout/MainPageLayout";
import { MainPageHeader } from "@/components/modules/main/layout/MainPageHeader";
import { EventFormContainer } from "@/components/modules/main/events/EventFormContainer";
import { InitializeEvent } from "./initialize";
import { auth } from "@/utils/auth";

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const user = await auth();
  return (
    <>
      <InitializeEvent id={id} userId={user?.user?.id || ""} />{" "}
      <MainPageLayout
        header={
          <MainPageHeader
            title="Edit Event"
            description="Update the details of an existing event"
            showBackButton={true}
            backButtonText="Events"
          />
        }
      >
        <EventFormContainer eventId={id} />
      </MainPageLayout>
    </>
  );
}
