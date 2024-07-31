"use client";

import PodcastCard from "@/components/cards/PodcastCard";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export const Home = () => {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);

  return (
    <div className="mt-9 flex flex-col gap-9 md:overflow-hidden">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>

        {trendingPodcasts ? (
          <>
            {Array.isArray(trendingPodcasts) && trendingPodcasts.length > 0 ? (
              <div className="podcast_grid">
                {trendingPodcasts?.map((podcast) => (
                  <PodcastCard
                    key={podcast._id}
                    title={podcast.podcastTitle}
                    description={podcast.podcastDescription}
                    imgUrl={podcast.imageUrl ?? ""}
                    podcastId={podcast._id}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No podcasters found yet"
                buttonText="Be the first"
                buttonLink="/create-podcast"
              />
            )}
          </>
        ) : (
          <LoaderSpinner />
        )}
      </section>
    </div>
  );
};

export default Home;
