import Event from "@/database/event.model";
import connectToMongoDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
  try {
    await connectToMongoDB();
    const formData = await req.formData();
    let event;

    try {
      event = Object.fromEntries(formData.entries());
      event = Object.fromEntries(formData.entries());
    } catch (err) {
      return NextResponse.json(
        {
          message: "Invalid form data",
          error: err instanceof Error ? err.message : "Unknown error",
        },
        { status: 400 }
      );
    }
    // image file

    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        {
          message: "Image file is required",
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "GrappleGo" },
          (error, results) => {
            if (error) return reject(error);
            resolve(results);
          }
        )
        .end(buffer);
    });

    event.image = (uploadResult as { secure_url: string }).secure_url;

    const createdEvent = await Event.create(event);
    return NextResponse.json(
      {
        message: "Event created successfully",
        event: createdEvent,
      },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: "Creating event failed",
        error: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToMongoDB();
    // sort event ascend - newest first
    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Event fetched successfully", events },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: "Event fetching failed",
        error: err instanceof Error ? err.message : "unknown error",
      },
      { status: 500 }
    );
  }
}
