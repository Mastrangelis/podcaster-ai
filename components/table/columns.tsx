/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { PodcastProps } from "@/types";
import { formatTime } from "@/lib/utils";
import { useAudio } from "@/lib/providers/AudioProvider";
import clsx from "clsx";
import Link from "next/link";

export const columns: ColumnDef<PodcastProps>[] = [
  {
    accessorKey: "podcast",
    header: "Podcast",
    cell: ({ row }) => {
      const { audio } = useAudio();
      const podcast = row.original;

      const isActive = audio?.audioUrl === podcast.audioUrl;

      return (
        <Link
          href={`/podcasts/${podcast._id}`}
          className="flex items-center gap-3"
        >
          <Image
            src={podcast.imageUrl ?? ""}
            width={50}
            height={50}
            alt="podcast"
            className="size-11 md:size-14 aspect-square rounded-lg"
          />

          <p
            className={clsx({
              "max-sm:hidden text-14 md:text-16 line-clamp-1 break-words font-extrabold":
                true,
              "text-orange-1": isActive,
              "text-white-1": !isActive,
            })}
          >
            {podcast.podcastTitle}
          </p>
        </Link>
      );
    },
  },
  {
    accessorKey: "listeners",
    header: "Listeners",
    cell: ({ row }) => {
      const podcast = row.original;

      return (
        <div className="flex items-center gap-3">
          <Image
            src="/icons/headphone.svg"
            width={28}
            height={28}
            alt="headphones"
            className="size-[18px] md:size-7"
          />
          <p className="text-11 md:text-16 pt-1 text-white-1">
            {podcast.viewedBy.length ?? 0}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const podcast = row.original;

      return (
        <div className="flex items-center gap-3">
          <Image
            src="/icons/clock.svg"
            width={28}
            height={28}
            alt="clock"
            className="size-4 md:size-7"
          />
          <p className="text-12 md:text-16 pt-1 text-white-1">
            {formatTime(podcast.audioDuration)}
          </p>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: () => <div className="p-0 md:pl-4">Actions</div>,
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { audio, setAudio } = useAudio();

      const podcast = row.original;

      const handlePlay = () => {
        if (audio?.audioUrl === podcast.audioUrl) {
          setAudio((prev) => ({
            ...prev,
            isPlaying: !prev?.isPlaying,
          }));
          return;
        }

        setAudio((prev) => ({
          ...prev,
          title: row.original.podcastTitle,
          audioUrl: row.original.audioUrl,
          imageUrl: row.original.imageUrl,
          isPlaying: !prev?.isPlaying,
        }));
      };

      return (
        <div className="flex items-center justify-center hover:opacity-80">
          <Image
            src={
              audio?.audioUrl === podcast.audioUrl
                ? audio?.isPlaying
                  ? "/icons/Pause.svg"
                  : "/icons/Play.svg"
                : "/icons/Play.svg"
            }
            width={20}
            height={20}
            alt={audio?.isPlaying ? "pause" : "play"}
            className="cursor-pointer size-4 md:size-7"
            onClick={handlePlay}
          />
        </div>
      );
    },
  },
];
