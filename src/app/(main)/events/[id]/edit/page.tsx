import { MainPageLayout } from "@/components/modules/main/layout/MainPageLayout";
import { MainPageHeader } from "@/components/modules/main/layout/MainPageHeader";
import { EventFormContainer } from "@/components/modules/main/events/EventFormContainer";
import { InitializeEvent } from "./initialize";

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  return (
    <>
      <InitializeEvent id={id} />
      <MainPageLayout
        header={
          <MainPageHeader
            title="Edit Event"
            description="Update the details of an existing event"
          />
        }
      >
        <EventFormContainer eventId={id} />
      </MainPageLayout>
    </>
  );
}
