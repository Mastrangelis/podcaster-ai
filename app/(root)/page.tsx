"use client";

import PodcastCard from "@/components/cards/PodcastCard";
import LoaderSpinner from "@/components/LoaderSpinner";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";

const Home = () => {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);

  const latestPodcasts = useQuery(api.podcasts.getLatestPodcasts);

  if (!trendingPodcasts || !latestPodcasts) return <LoaderSpinner />;

  return (
    <div className="my-9 flex flex-col gap-9 md:overflow-hidden">
      <section className="flex flex-col gap-5">
        {Array.isArray(trendingPodcasts) && trendingPodcasts.length > 0 && (
          <>
            <h1 className="text-20 font-bold text-white-1">
              Trending Podcasts
            </h1>
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
          </>
        )}

        {Array.isArray(latestPodcasts) && latestPodcasts.length > 0 && (
          <div className="flex flex-col gap-5 mt-12 w-full max-md:overflow-x-hidden">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-20 font-bold text-white-1">
                Latest Podcasts
              </h1>
              <Link href="/discover" className="text-18 text-orange-1">
                See All
              </Link>
            </div>
            <DataTable columns={columns} data={latestPodcasts} />
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
