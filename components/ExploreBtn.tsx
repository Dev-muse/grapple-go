"use client";

import Link from "next/link";

const ExploreBtn = () => {
  return (
    <button type="button" id="explore-btn" className="mx-auto mt-7">
      <Link href="/events">
        {" "}
        Explore events
        {/* <Image
          src="/icons/arrow-down.svg"
          alt="arrow down icon"
          width={20}
          height={20}
        /> */}
      </Link>
    </button>
  );
};

export default ExploreBtn;
