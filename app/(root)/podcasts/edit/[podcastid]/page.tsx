"use client";

import PodcastForm from "@/components/forms/PodcastForm";
import LoaderSpinner from "@/components/LoaderSpinner";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SearchParamProps } from "@/types";
import { useQuery } from "convex/react";
import React from "react";

const EditPodcastPage = ({ params: { podcastid } }: SearchParamProps) => {
  const podcast = useQuery(api.podcasts.getPodcastById, {
    podcastId: podcastid as Id<"podcasts">,
  });

  if (!podcast) return <LoaderSpinner />;

  return (
    <section className="mt-10 flex flex-col pb-5">
      <h1 className="text-20 font-bold text-white-1">Edit Podcast</h1>
      <PodcastForm podcast={podcast} type="edit" />
    </section>
  );
};

export default EditPodcastPage;
