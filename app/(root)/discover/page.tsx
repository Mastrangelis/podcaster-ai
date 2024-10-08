"use client";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/cards/PodcastCard";
import Searchbar from "@/components/Searchbar";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import { SearchParamProps } from "@/types";
import { useUser } from "@clerk/nextjs";
import * as Sentry from "@sentry/nextjs";

const Discover = ({ searchParams: { search } }: SearchParamProps) => {
  const { user: clerkUser } = useUser();

  Sentry.metrics.set(
    "discover-podcasts",
    clerkUser?.emailAddresses[0].emailAddress!
  );

  const podcastsData = useQuery(api.podcasts.getPodcastBySearch, {
    search: (search as string) || "",
    clerkId: clerkUser?.id || "",
  });

  return (
    <div className="mb-5 flex flex-col gap-9">
      <Searchbar />
      <div className="flex flex-col gap-9">
        <h1 className="text-20 font-bold text-white-1">
          {!search ? "Discover Community Podcasts" : "Search results for "}
          {search && <span className="text-white-2">{search}</span>}
        </h1>
        {podcastsData ? (
          <>
            {podcastsData.length > 0 ? (
              <div className="podcast_grid">
                {podcastsData?.map(
                  ({ _id, podcastTitle, podcastDescription, imageUrl }) => (
                    <PodcastCard
                      key={_id}
                      imgUrl={imageUrl!}
                      title={podcastTitle}
                      description={podcastDescription}
                      podcastId={_id}
                    />
                  )
                )}
              </div>
            ) : (
              <EmptyState title="No results found" />
            )}
          </>
        ) : (
          <LoaderSpinner />
        )}
      </div>
    </div>
  );
};

export default Discover;
