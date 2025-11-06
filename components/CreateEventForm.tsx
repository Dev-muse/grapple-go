"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type EventFormData = {
  title: string;
  description: string;
  overview: string;
  image: File | null;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string;
  organizer: string;
  tags: string;
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const CreateEventForm = () => {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    overview: "",
    image: null,
    venue: "",
    location: "",
    date: "",
    time: "",
    mode: "",
    audience: "",
    agenda: "",
    organizer: "",
    tags: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.image) {
      alert("Please select an image");
      return;
    }

    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("description", formData.description);
    fd.append("overview", formData.overview);
    fd.append("venue", formData.venue);
    fd.append("location", formData.location);
    fd.append("date", formData.date);
    fd.append("time", formData.time);
    fd.append("mode", formData.mode);
    fd.append("audience", formData.audience);
    fd.append("organizer", formData.organizer);

    // send agenda and tags as JSON strings
    fd.append(
      "agenda",
      JSON.stringify(formData.agenda.split(",").map((i) => i.trim()))
    );
    fd.append(
      "tags",
      JSON.stringify(formData.tags.split(",").map((i) => i.trim()))
    );

    fd.append("image", formData.image);

    try {
      const res = await fetch(`${baseUrl}/api/events`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("API error:", err);
        alert("Failed to create event");
        return;
      }

      const data = await res.json();
      console.log("Event created:", data);
      alert("Event created successfully");
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Error submitting form");
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold text-white">Event Details</h2>
          <p className="mt-1 text-sm text-gray-400">
            Provide information about the event.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Title */}
            <div className="sm:col-span-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-white"
              >
                Title
              </label>
              <input
                name="title"
                id="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white placeholder:text-gray-500 outline-1 -outline-offset-1 outline-white/10 focus:outline-indigo-500"
              />
            </div>

            {/* Description */}
            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-white"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white placeholder:text-gray-500 outline-1 -outline-offset-1 outline-white/10 focus:outline-indigo-500"
              />
            </div>

            {/* Overview */}
            <div className="col-span-full">
              <label
                htmlFor="overview"
                className="block text-sm font-medium text-white"
              >
                Overview
              </label>
              <textarea
                name="overview"
                id="overview"
                rows={3}
                value={formData.overview}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white placeholder:text-gray-500 outline-1 -outline-offset-1 outline-white/10 focus:outline-indigo-500"
              />
            </div>

            {/* Image */}
            <div className="sm:col-span-3">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-white"
              >
                Event Image
              </label>
              <input
                name="image"
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-indigo-500"
              />
            </div>

            {/* Venue, Location, Date, Time */}
            <div className="sm:col-span-3">
              <label
                htmlFor="venue"
                className="block text-sm font-medium text-white"
              >
                Venue
              </label>
              <input
                name="venue"
                id="venue"
                type="text"
                value={formData.venue}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-indigo-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-white"
              >
                Location
              </label>
              <input
                name="location"
                id="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-indigo-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-white"
              >
                Date
              </label>
              <input
                name="date"
                id="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-indigo-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="time"
                className="block text-sm font-medium text-white"
              >
                Time
              </label>
              <input
                name="time"
                id="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-indigo-500"
              />
            </div>

            {/* Mode, Audience */}
            <div className="col-span-full">
              <label
                htmlFor="mode"
                className="block text-sm font-medium text-white"
              >
                Mode
              </label>
              <input
                name="mode"
                id="mode"
                type="text"
                value={formData.mode}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-indigo-500"
              />
            </div>

            <div className="col-span-full">
              <label
                htmlFor="audience"
                className="block text-sm font-medium text-white"
              >
                Audience
              </label>
              <input
                name="audience"
                id="audience"
                type="text"
                value={formData.audience}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-indigo-500"
              />
            </div>

            {/* Agenda */}
            <div className="col-span-full">
              <label
                htmlFor="agenda"
                className="block text-sm font-medium text-white"
              >
                Agenda (comma separated)
              </label>
              <textarea
                name="agenda"
                id="agenda"
                rows={2}
                value={formData.agenda}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-indigo-500"
              />
            </div>

            {/* Organizer */}
            <div className="col-span-full">
              <label
                htmlFor="organizer"
                className="block text-sm font-medium text-white"
              >
                Organizer
              </label>
              <textarea
                name="organizer"
                id="organizer"
                rows={2}
                value={formData.organizer}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-indigo-500"
              />
            </div>

            {/* Tags */}
            <div className="col-span-full">
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-white"
              >
                Tags (comma separated)
              </label>
              <input
                name="tags"
                id="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Submit buttons */}
        <div className="flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold text-white">
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white focus:outline-indigo-500"
          >
            Save
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateEventForm;
