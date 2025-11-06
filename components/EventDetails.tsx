import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/events.actions";
import { cacheLife } from "next/cache";

import Image from "next/image";
import { notFound } from "next/navigation";

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

const EventDetails = async ({ params }: { params: Promise<string> }) => {
  "use cache";
  cacheLife("hours");

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

  // similar events
  const similarEvents = (await getSimilarEventsBySlug(
    slug
  )) as unknown as IEvent[];
  console.log("similar events", similarEvents);

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
          <EventAgenda agendaItems={agenda} />
          <section className="flex-col-gap-2">
            <h2>About</h2>
            <p>{organizer}</p>
          </section>
          <EventTags tags={tags} />
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

            <BookEvent eventId={event._id} slug={event.slug} />
          </div>
        </aside>
      </div>

      <div className="flex flex-col gap-4 w-full pt-20">
        {similarEvents?.length > 0 && <h2>Similar Events</h2>}

        <div className="events">
          {similarEvents.length > 0 &&
            similarEvents?.map((similarEvent: IEvent) => {
              return <EventCard key={similarEvent.title} {...similarEvent} />;
            })}
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
