import { SearchParamProps } from "@/types";
import React from "react";

const PodcastPage = ({ params }: SearchParamProps) => {
  return (
    <p className="text-white-1">Podcast details for {params?.podcastid}</p>
  );
};

export default PodcastPage;
