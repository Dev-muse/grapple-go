import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const EventsPage = async () => {
    "use cache";
    cacheLife("hours");
  
    const response = await fetch(`${baseUrl}/api/events`);
    const { events } = await response.json();
  return (
    <section>
      <h1 className="text-center">
       All Upcoming Events
      </h1>
      <p className="text-center mt-5">
        BJJ seminars, grappling retreats and more.{" "}
      </p>
      
      <div className="mt-20 space-y-7">
         <ul className="events list-none">
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => (
              <li key={event.title}>
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default EventsPage;
