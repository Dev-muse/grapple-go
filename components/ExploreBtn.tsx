"use client";

import Image from "next/image";

const ExploreBtn = () => {
  return (
    <button type="button" id="explore-btn" className="mx-auto mt-7">
      <a href="#explore">
        {" "}
        Explore events
        <Image
          src="/icons/arrow-down.svg"
          alt="arrow down icon"
          width={20}
          height={20}
        />
      </a>
    </button>
  );
};

export default ExploreBtn;
