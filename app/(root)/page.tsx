"use client";

import PodcastCard from "@/components/cards/PodcastCard";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

const Home = () => {
  const { user } = useUser();

  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts, {
    clerkId: user?.id ?? "",
  });

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
                    authorImageUrl={podcast.authorImageUrl}
                    author={podcast.author}
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
