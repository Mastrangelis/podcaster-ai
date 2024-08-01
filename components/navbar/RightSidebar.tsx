"use client";

import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import Header from "../Header";
import Carousel from "../Carousel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useAudio } from "@/lib/providers/AudioProvider";
import { cn } from "@/lib/utils";
import clsx from "clsx";

function dataURItoBlob(dataURI: string) {
  const byteString = atob(decodeURIComponent(dataURI.split(",")[1]));
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

function dataURLtoFile(dataurl: string, filename: string) {
  var arr = dataurl.split(","),
    mime = arr[0]?.match(/:(.*?);/)?.[1],
    bstr = atob(decodeURIComponent(arr[arr.length - 1])),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const RightSidebar = () => {
  const router = useRouter();

  const { user } = useUser();

  const { audio } = useAudio();

  const topPodcasters = useQuery(api.users.getTopUserByPodcastCount, {
    clerkId: user?.id ?? "",
  });

  const dbUser = useQuery(api.users.getUserById, {
    clerkId: user?.id ?? "",
  });

  useEffect(() => {
    if (!dbUser || !user) return;

    let dataToUpdate = {};

    if (
      dbUser?.firstName &&
      dbUser?.firstName !== null &&
      dbUser?.firstName !== user.firstName
    ) {
      dataToUpdate = { ...dataToUpdate, firstName: dbUser.firstName };
    }

    if (
      dbUser?.lastName &&
      dbUser?.lastName !== null &&
      dbUser?.lastName !== user.lastName
    ) {
      dataToUpdate = { ...dataToUpdate, lastName: dbUser.lastName };
    }

    if (Object.keys(dataToUpdate).length > 0) {
      user.update(dataToUpdate);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbUser?.firstName, dbUser?.lastName, dbUser?.imageUrl]);

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
                {dbUser?.firstName} {dbUser?.lastName}
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
      <section className={clsx({ "pt-12": user, "pt-0": !user })}>
        <Header headerTitle="Fans Like You" />
        <Carousel fansLikeDetail={topPodcasters!} />
      </section>
      <section className="flex flex-col gap-8 pt-12 ">
        <Header headerTitle="Top Podcasters" />
        <div className="flex flex-col gap-6 h-screen overflow-y-auto pr-3.5">
          {topPodcasters?.slice(0, 8).map((podcaster) => (
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
