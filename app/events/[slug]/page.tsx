import EventDetails from "@/components/EventDetails";
import { Suspense } from "react";

type EventDetailsProps = {
  params: Promise<{
    slug: string;
  }>;
};
const EventDetailsPage = async ({ params }: EventDetailsProps) => {
  

  const slug = params.then(p=>p.slug)

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>} >
        <EventDetails params={slug} />
      </Suspense>
    </main>
  );
};

export default EventDetailsPage;
