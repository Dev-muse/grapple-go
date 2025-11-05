import BookEvent from "@/components/BookEvent";
import Image from "next/image";
import { notFound } from "next/navigation";

type EventDetailsProps = {
  params: Promise<{
    slug: string;
  }>;
};
type EventDetailItemProps = {
  icon: string;
  alt: string;
  label: string;
};

type AgendaItemsProps = {
  agendaItems: string[];
};

const EventDetailItem = ({ icon, alt, label }: EventDetailItemProps) => {
  return (
    <div className="flex gap-1 items-center">
      <Image src={icon} alt={alt} width={17} height={17} />
      <p>{label}</p>
    </div>
  );
};

const EventTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className="flex gap-1.5 items-center flex-wrap">
      {tags.map((tag) => {
        return (
          <div className="pill" key={tag}>
            {tag}
          </div>
        );
      })}
    </div>
  );
};

const EventAgenda = ({ agendaItems }: AgendaItemsProps) => {
  return (
    <div className="agenda">
      <h2>Agenda</h2>
      <ul>
        {agendaItems.map((item) => {
          return <li key={item}>{item}</li>;
        })}
      </ul>
    </div>
  );
};

const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/";
const bookings = 10;
const EventDetailsPage = async ({ params }: EventDetailsProps) => {
  const { slug } = await params;
  const response = await fetch(`${BaseUrl}/api/events/${slug}`);
  const { event } = await response.json();
  const {
    title,
    description,
    agenda,
    tags,
    overview,
    date,
    venue,
    image,
    location,
    mode,
    time,
    organizer,
    audience,
  } = event;

  console.log("event data", event);
  if (!event) return notFound();

  console.log("data", event);
  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p className="mt-2">{description}</p>
      </div>
      <div className="details">
        {/* left details  */}
        <div className="content">
          <Image
            src={image}
            width={800}
            height={800}
            alt="event banner"
            className="banner"
          />
          <section className="flex-col-gap-2">
            <h2 className="mt-2">Overview</h2>
            <p>{overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2 className="mt-2">Event Details</h2>
            <EventDetailItem
              alt="date"
              icon="/icons/calendar.svg"
              label={date}
            />
            <EventDetailItem alt="time" icon="/icons/clock.svg" label={time} />
            <EventDetailItem
              alt="location"
              icon="/icons/pin.svg"
              label={location}
            />
            <EventDetailItem alt="mode" icon="/icons/mode.svg" label={mode} />
            <EventDetailItem
              alt="audience"
              icon="/icons/audience.svg"
              label={audience}
            />
          </section>
          <EventAgenda agendaItems={JSON.parse(agenda[0])} />
          <section className="flex-col-gap-2">
            <h2>About</h2>
            <p>{organizer}</p>
          </section>
          <EventTags tags={JSON.parse(tags)} />
        </div>
        {/* right booking form  */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} others who&apos;ve already booked their seat{" "}
              </p>
            ) : (
              <p className="text-sm">Be the first to book a seat</p>
            )}

            <BookEvent />
          </div>
        </aside>
      </div>
    </section>
  );
};

export default EventDetailsPage;
