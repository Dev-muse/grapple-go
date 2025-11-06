import CreateEventForm from "@/components/CreateEventForm";

const CreateEventPage = () => {
  return (
    <section>
      <h1 className="text-center">Create Event</h1>
      <p className="text-center mt-5">
        Let people know about a upcoming event{" "}
      </p>

      <div className="mt-20 space-y-7">
         <CreateEventForm />
      </div>
    </section>
  );
};

export default CreateEventPage;
