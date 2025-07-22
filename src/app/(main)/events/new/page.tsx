import { MainPageLayout } from "@/components/modules/main/layout/MainPageLayout";
import { MainPageHeader } from "@/components/modules/main/layout/MainPageHeader";
import { EventFormContainer } from "@/components/modules/main/events/EventFormContainer";
import { InitializeNewEvent } from "./initialize";
export default function NewEventPage() {
  return (
    <>
      <InitializeNewEvent />{" "}
      <MainPageLayout
        header={
          <MainPageHeader
            title="New Event"
            description="Create a new event by filling out the form below"
            showBackButton={true}
            backButtonText="Events"
          />
        }
      >
        <EventFormContainer />
      </MainPageLayout>
    </>
  );
}
