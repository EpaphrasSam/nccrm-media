import { MainPageLayout } from "@/components/modules/main/layout/MainPageLayout";
import { MainPageHeader } from "@/components/modules/main/layout/MainPageHeader";
import { EventFormContainer } from "@/components/modules/main/events/EventFormContainer";

export default function NewEventPage() {
  return (
    <>
      <MainPageLayout
        header={
          <MainPageHeader
            title="New Event"
            description="Create a new event by filling out the form below"
          />
        }
      >
        <EventFormContainer />
      </MainPageLayout>
    </>
  );
}
