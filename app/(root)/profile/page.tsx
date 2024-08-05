"use client";

import PodcastCard from "@/components/cards/PodcastCard";
import ProfileCard from "@/components/cards/ProfileCard";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import React from "react";

const MyProfilePage = () => {
  const { user: clerkUser } = useUser();

  const user = useQuery(api.users.getUserById, {
    clerkId: clerkUser?.id || "",
  });

  const podcastsData = useQuery(api.podcasts.getPodcastByAuthorId, {
    authorId: clerkUser?.id || "",
  });

  if (!user || !podcastsData) return <LoaderSpinner />;

  return (
    <section className="my-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        My Profile
      </h1>
      <div className="mt-1 md:mt-9 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          podcastData={podcastsData!}
          imageUrl={user?.imageUrl!}
          userName={user?.name!}
          isOwner
          clerkId={clerkUser?.id!}
        />
      </div>
      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1 max-md:text-center">
          My Podcasts
        </h1>
        {podcastsData && podcastsData.podcasts.length > 0 ? (
          <div className="podcast_grid">
            {podcastsData?.podcasts
              ?.slice(0, 4)
              .map((podcast) => (
                <PodcastCard
                  key={podcast._id}
                  imgUrl={podcast.imageUrl!}
                  title={podcast.podcastTitle!}
                  description={podcast.podcastDescription}
                  podcastId={podcast._id}
                  isOwner={user?.clerkId === podcast.authorId}
                />
              ))}
          </div>
        ) : (
          <EmptyState
            title="You have not created any podcasts yet"
            buttonLink="/create-podcast"
            buttonText="Create Podcast"
          />
        )}
      </section>
    </section>
  );
};

export default MyProfilePage;
