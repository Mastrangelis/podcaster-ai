"use client";

import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Header from "../Header";
import Carousel from "../Carousel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useAudio } from "@/lib/providers/AudioProvider";
import { cn } from "@/lib/utils";
import clsx from "clsx";

const RightSidebar = () => {
  const { user } = useUser();

  const router = useRouter();

  const { audio } = useAudio();

  const topPodcasters = useQuery(api.users.getTopUserByPodcastCount, {
    clerkId: user?.id ?? "",
  });

  return (
    <section
      className={cn("hidden", {
        "h-[calc(100vh-112px)]": audio?.audioUrl,
        "right_sidebar h-[calc(100vh-5px)]":
          Array.isArray(topPodcasters) && topPodcasters?.length > 0,
      })}
    >
      <SignedIn>
        <Link
          href="/profile"
          className="flex flex-col gap-3 group cursor-pointer"
        >
          <div className="flex gap-3">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: {
                    width: 48,
                    height: 48,
                  },
                },
              }}
            />
            <div className="flex w-full items-center justify-between">
              <h1 className="text-16 truncate font-semibold text-white-1">
                {user?.firstName} {user?.lastName}
              </h1>
              <Image
                src="/icons/right-arrow.svg"
                alt="arrow"
                width={24}
                height={24}
                className="group-hover:animate-bounce"
              />
            </div>
          </div>
          <div className="bg-orange-1 h-[2px] w-0 group-hover:w-full transition-all duration-500"></div>
        </Link>
      </SignedIn>
      <section className={clsx({ "pt-12": true, "pt-0": !user })}>
        <Header headerTitle="Fans Like You" />
        <Carousel fansLikeDetail={topPodcasters!} />
      </section>
      <section className="flex flex-col gap-8 pt-12">
        <Header headerTitle="Top Podcasters" />
        <div className="flex flex-col gap-6">
          {topPodcasters?.slice(0, 3).map((podcaster) => (
            <div
              key={podcaster._id}
              className="flex cursor-pointer justify-between items-center"
              onClick={() => {
                if (podcaster.clerkId === user?.id) router.push("/profile");

                router.push(`/profile/${podcaster.clerkId}`);
              }}
            >
              <figure className="flex items-center gap-3">
                <Image
                  src={podcaster.imageUrl}
                  alt={podcaster.name}
                  width={32}
                  height={32}
                  className="aspect-square rounded-lg"
                />
                <h2 className="text-14 font-semibold text-white-1">
                  {podcaster.name}
                </h2>
              </figure>
              <div className="flex items-center">
                <p className="text-14 font-normal text-white-1">
                  {podcaster.totalPodcasts} &nbsp; podcast
                  {podcaster.totalPodcasts > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default RightSidebar;
