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

  return (
    <div className="cursor-pointer" onClick={handleViews}>
      <figure className="flex flex-col gap-2">
        <Image
          src={imgUrl ?? ""}
          width={230}
          height={230}
          alt={title}
          className="aspect-square h-fit w-full rounded-xl 2xl:size-[230px]"
        />
        <div className="flex flex-col">
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
