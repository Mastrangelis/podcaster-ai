import CreatePodcastForm from "@/components/forms/CreatePodcastForm";
import React from "react";

const CreatePodcastPage = () => {
  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        <h1 className="text-white-1 font-bold text-20">Create Podcast</h1>
      </section>

      <CreatePodcastForm />
    </div>
  );
};

export default CreatePodcastPage;
