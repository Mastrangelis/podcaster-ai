"use client";

import PodcastCard from "@/components/cards/PodcastCard";
import ProfileCard from "@/components/cards/ProfileCard";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
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
          userFirstName={user?.name!}
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
      {/* <section className="mt-9 flex flex-col items-center gap-5">
        <Button
          variant="outline"
          className="cursor-pointer text-white-2 border-red-400 flex items-center gap-2 max-w-[200px] hover:bg-black-1 hover:text-white-1 hover:border-red-600"
        >
          <Image src="/icons/delete.svg" width={16} height={16} alt="Delete" />
          Delete Account
        </Button>
      </section> */}
    </section>
  );
};

export default MyProfilePage;
