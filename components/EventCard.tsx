import Image from "next/image";
import Link from "next/link";
import React from "react";

type EventCardProps = {
  title: string;
  image: string;
  slug: string;
  date: string;
  location: string;
  time: string;
};

const EventCard = ({
  title,
  image,
  location,
  date,
  slug,
  time,
}: EventCardProps) => {
  return (
    <Link href={ `/events/${slug}`} id="event-card">
      <Image
        className="poster"
        width={410}
        height={300}
        src={image}
        alt={title}
      />

      <div className="flex items-center gap-2">
        <Image
          src={"/icons/pin.svg"}
          width={14}
          height={14}
          alt="location pin"
        />
        <p>{location}</p>
      </div>
      <div className="datetime">
        <div className="flex items-center gap-2">
          <Image
            src={"/icons/calendar.svg"}
            width={14}
            height={14}
            alt="calendar icon"
          />
          <p>{date}</p>
        </div>
        <div className="flex items-center gap-2">
          <Image
            src={"/icons/clock.svg"}
            width={14}
            height={14}
            alt="clock icon"
          />
          <p>{time}</p>
        </div>
      </div>

      <p className="title">{title}</p>
    </Link>
  );
};

export default EventCard;
