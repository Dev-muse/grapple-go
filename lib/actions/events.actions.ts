"use server";

import { Event } from "@/database";
import connectToMongoDB from "../mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    // connect to db
    await connectToMongoDB();

    // get event
    const event = await Event.findOne({ slug });

    // similar event
    return await Event.find({
      _id: { $ne: event?._id },tags: { $in: event?.tags}
    }).lean();
  } catch (error) {
    if (error instanceof Error) console.log("error occured", error);

    return [];
  }
};
