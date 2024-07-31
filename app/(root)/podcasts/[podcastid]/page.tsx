"use client";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/cards/PodcastCard";
import PodcastDetailPlayer from "@/components/PodcastDetailPlayer";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import React from "react";
import { SearchParamProps } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PodcastDetailsPage = ({ params: { podcastid } }: SearchParamProps) => {
  const { user } = useUser();

  const podcast = useQuery(api.podcasts.getPodcastById, {
    podcastId: podcastid,
  });

  const similarPodcasts = useQuery(api.podcasts.getPodcastByVoiceType, {
    podcastId: podcastid,
  });

  const podcastFollowers = useQuery(api.users.getFollowersByPodcastId, {
    podcastId: podcastid,
  });

  const podcastViews = podcast?.viewedBy.length || 0;

  const isOwner = user?.id === podcast?.authorId;

  if (!similarPodcasts || !podcast || !podcastFollowers)
    return <LoaderSpinner />;

  return (
    <section className="flex w-full flex-col pb-5">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">Currenty Playing</h1>
        <figure className="flex items-center gap-3">
          <div className="flex items-center mr-2">
            {Array.isArray(podcastFollowers) &&
              podcastFollowers.length > 0 &&
              podcastFollowers.slice(0, 3).map((follower) => (
                <Tooltip key={follower?._id} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Avatar
                      className="w-[32px] h-[32px] border-[3px] border-white-2 cursor-pointer bg-orange-1
                    -mr-2"
                    >
                      <AvatarImage src={follower?.imageUrl} />
                      <AvatarFallback>
                        {follower?.name?.split(" ")[0][0]}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent className="border-white-3 bg-black-6">
                    <p className="text-12 text-white-1">{follower?.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            {Array.isArray(podcastFollowers) && podcastFollowers.length > 3 && (
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Avatar className="w-[32px] h-[32px] border-[3px] border-white-2 cursor-pointer bg-orange-1 text-white-1">
                    <AvatarFallback>
                      +{podcastFollowers.length - 3}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent className="border-white-3 bg-black-6">
                  <p className="text-12 text-white-1">
                    {podcastFollowers.length - 3} more
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt="headphone"
          />
          <h2 className="text-16 font-bold text-white-1">{podcastViews}</h2>
        </figure>
      </header>

      <PodcastDetailPlayer
        isOwner={isOwner}
        podcastId={podcast._id}
        imageUrl={podcast.imageUrl!}
        audioUrl={podcast.audioUrl!}
        audioStorageId={podcast.audioStorageId!}
        imageStorageId={podcast.imageStorageId!}
        {...podcast}
      />

      <p className="text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center">
        {podcast?.podcastDescription}
      </p>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Transcription</h1>
          <p className="text-16 font-medium text-white-2">
            {podcast?.voicePrompt}
          </p>
        </div>
        {podcast?.imagePrompt && (
          <div className="flex flex-col gap-4">
            <h1 className="text-18 font-bold text-white-1">Thumbnail Prompt</h1>
            <p className="text-16 font-medium text-white-2">
              {podcast?.imagePrompt}
            </p>
          </div>
        )}
      </div>
      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Similar Podcasts</h1>

        {similarPodcasts && similarPodcasts.length > 0 ? (
          <div className="podcast_grid">
            {similarPodcasts?.map(
              ({ _id, podcastTitle, podcastDescription, imageUrl }) => (
                <PodcastCard
                  key={_id}
                  imgUrl={imageUrl as string}
                  title={podcastTitle}
                  description={podcastDescription}
                  podcastId={_id}
                />
              )
            )}
          </div>
        ) : (
          <>
            <EmptyState
              title="No similar podcasts found"
              buttonLink="/discover"
              buttonText="Discover more podcasts"
            />
          </>
        )}
      </section>
    </section>
  );
};

export default PodcastDetailsPage;
