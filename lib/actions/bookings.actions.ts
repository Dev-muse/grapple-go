"use server";

import Booking from "@/database/booking.model";
import connectToMongoDB from "../mongodb";

export const createBooking = async ({
  eventId,
  slug,
  email,
}: {
  eventId: string;
  slug: string;
  email: string;
}) => {
  try {
    await connectToMongoDB();
    const bookingDoc = await Booking.create({ eventId, slug, email });
    const booking = bookingDoc.toObject();

    return { success: true };
  } catch (error) {
    console.log("booking failed", error);
    return {
      success: false,
    };
  }
};
