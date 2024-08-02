import PodcastForm from "@/components/forms/PodcastForm";
import React from "react";

const CreatePodcastPage = () => {
  return (
    <section className="mt-10 flex flex-col pb-5">
      <h1 className="text-20 font-bold text-white-1">Create Podcast</h1>
      <PodcastForm />
    </section>
  );
};

export default CreatePodcastPage;
