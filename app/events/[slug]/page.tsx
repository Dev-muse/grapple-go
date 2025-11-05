import { notFound } from "next/navigation";

type EventDetailsProps = {
  params: Promise<{
    slug: string;
  }>;
};

const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const EventDetailsPage = async ({ params }: EventDetailsProps) => {
  const { slug } = await params;
  const response = await fetch(`${BaseUrl}/api/events/${slug}`);
  const {event} = await response.json();

  if(!event) return notFound()

  console.log("data",event)
  return (
    <section id="event">
      <h1>Event: {slug}</h1>
    </section>
  );
};

export default EventDetailsPage;
