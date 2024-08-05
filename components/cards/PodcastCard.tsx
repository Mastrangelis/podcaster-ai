"use client";

import { api } from "@/convex/_generated/api";
import { PodcastCardProps } from "@/types";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";

const PodcastCard = ({
  imgUrl,
  title,
  description,
  podcastId,
  isOwner,
}: PodcastCardProps) => {
  const router = useRouter();
  const { user } = useUser();

  const updatePodcastViews = useMutation(api.podcasts.updatePodcastViews);

  const handleViews = async () => {
    if (user?.id) {
      await updatePodcastViews({
        podcastId: podcastId as Id<"podcasts">,
        clerkId: user.id,
      });
    }

    router.push(`/podcasts/${podcastId}`, {
      scroll: true,
    });
  };

  const onEditClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    router.push(`/podcasts/edit/${podcastId}`);
  };

  return (
    <div
      className="cursor-pointer shadow-md shadow-white-4/15 rounded-xl"
      onClick={handleViews}
    >
      <figure className="flex flex-col gap-2">
        <div className="relative">
          <Image
            src={imgUrl ?? ""}
            width={230}
            height={230}
            alt={title}
            className="aspect-square h-fit w-full rounded-xl"
          />

          {isOwner && (
            <div
              onClick={onEditClick}
              className="absolute right-5 top-3 w-8 h-6 bg-orange-1/50 rounded-xl flex items-center justify-center"
            >
              <Image
                src="/icons/edit.svg"
                width={14}
                height={14}
                alt="edit podcast"
                className="cursor-pointer"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col p-2">
          <h1 className="text-16 truncate font-bold text-white-1">{title}</h1>
          <h2 className="text-12 truncate font-normal capitalize text-white-4">
            {description}
          </h2>
        </div>
      </figure>
    </div>
  );
};

export default PodcastCard;
