/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { PodcastProps } from "@/types";
import { formatTime } from "@/lib/utils";
import { useAudio } from "@/lib/providers/AudioProvider";
import clsx from "clsx";

export const columns: ColumnDef<PodcastProps>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      const { audio } = useAudio();
      const podcast = row.original;

      const isActive = audio?.audioUrl === podcast.audioUrl;

      return (
        <p
          className={clsx({
            "text-16": true,
            "text-white-1": !isActive,
            "text-orange-1": isActive,
          })}
        >
          {row.index + 1}
        </p>
      );
    },
  },
  {
    accessorKey: "podcast",
    header: "Podcast",
    cell: ({ row }) => {
      const { audio } = useAudio();
      const podcast = row.original;

      const isActive = audio?.audioUrl === podcast.audioUrl;

      return (
        <div className="flex items-center gap-3">
          <Image
            src={podcast.imageUrl ?? ""}
            width={50}
            height={50}
            alt="podcast"
            className="size-14 aspect-square rounded-lg"
          />
          <p
            className={clsx({
              "max-sm:hidden text-16 line-clamp-1 break-words font-extrabold":
                true,
              "text-orange-1": isActive,
              "text-white-1": !isActive,
            })}
          >
            {podcast.podcastTitle}
          </p>
        </div>
      );
    },
  },
  //   {
  //     accessorKey: "author",
  //     header: "Author",
  //     cell: ({ row }) => {
  //       const podcast = row.original;
  //       return (
  //         <div className="flex items-center gap-3 max-w-80">
  //           <Image
  //             src={podcast.authorImageUrl ?? ""}
  //             width={50}
  //             height={50}
  //             alt="podcaster icon"
  //             className="size-14 aspect-square rounded-lg"
  //           />
  //           <p className="text-14 line-clamp-1 break-words">{podcast.author}</p>
  //         </div>
  //       );
  //     },
  //   },
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
            className="size-7"
          />
          <p className="text-16 pt-1 text-white-1">
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
            className="size-7"
          />
          <p className="text-16 pt-1 text-white-1">
            {formatTime(podcast.audioDuration)}
          </p>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
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
            className="cursor-pointer size-7"
            onClick={handlePlay}
          />
        </div>
      );
    },
  },
];
