"use client";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "@/convex/_generated/api";
import { useAudio } from "@/lib/providers/AudioProvider";
import { PodcastDetailPlayerProps } from "@/types";

import LoaderSpinner from "./LoaderSpinner";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

const PodcastDetailPlayer = ({
  audioUrl,
  podcastTitle,
  author,
  imageUrl,
  podcastId,
  imageStorageId,
  audioStorageId,
  isOwner,
  authorImageUrl,
  authorId,
}: PodcastDetailPlayerProps) => {
  const router = useRouter();
  const { setAudio, audio } = useAudio();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const deletePodcast = useMutation(api.podcasts.deletePodcast);

  const handleDelete = async () => {
    try {
      await deletePodcast({ podcastId, imageStorageId, audioStorageId });
      toast({
        title: "Podcast deleted",
        variant: "destructive",
      });
      router.push("/");
    } catch (error) {
      console.error("Error deleting podcast", error);
      toast({
        title: "Error deleting podcast",
        variant: "destructive",
      });
    }
  };

  const handlePlay = () => {
    setAudio((prev) => ({
      title: podcastTitle,
      audioUrl,
      imageUrl,
      author,
      podcastId,
      isPlaying: !prev?.isPlaying,
    }));
  };

  const onFigureClick = () => {
    if (isOwner) {
      return router.push("/profile");
    }

    return router.push(`/profile/${authorId}`);
  };

  if (!imageUrl || !authorImageUrl) return <LoaderSpinner />;

  return (
    <div className="mt-6 flex w-full justify-between max-md:justify-center">
      <div className="flex gap-8 max-md:items-center md:flex-row">
        <Image
          src={imageUrl}
          width={250}
          height={250}
          alt="Podcast image"
          className="aspect-square rounded-lg size-36 md:size-64"
        />
        <div className="flex w-full flex-col gap-5 md:gap-9">
          <article className="flex flex-col gap-2">
            <h1 className="text-16 md:text-32 line-clamp-2 font-extrabold tracking-[-0.32px] text-white-1">
              {podcastTitle}
            </h1>
            <figure
              className="flex cursor-pointer items-center gap-2"
              onClick={onFigureClick}
            >
              <Image
                src={authorImageUrl}
                width={30}
                height={30}
                alt="Caster icon"
                className="size-[30px] rounded-full object-cover"
              />
              <h2 className="text-16 font-normal text-white-3">{author}</h2>
            </figure>
          </article>

          <Button
            onClick={handlePlay}
            className="w-full max-w-[250px] bg-orange-1 font-extrabold text-white-1"
          >
            <Image
              src={audio?.isPlaying ? "/icons/Pause.svg" : "/icons/Play.svg"}
              width={20}
              height={20}
              alt="random play"
              className="size-4 md:size-5"
            />
            <span className="text-12 md:text-16">
              &nbsp; {audio?.isPlaying ? "Pause" : "Play"} podcast
            </span>
          </Button>
        </div>
      </div>
      {isOwner && (
        <div className="relative mt-2">
          <Image
            src="/icons/three-dots.svg"
            width={36}
            height={36}
            alt="Three dots icon"
            className="cursor-pointer"
            onClick={() => setIsDeleting((prev) => !prev)}
          />
          {isDeleting && (
            <AlertDialog
              onOpenChange={(open) => {
                if (!open && isDeleting) {
                  setIsDeleting(false);
                }
              }}
            >
              <AlertDialogTrigger asChild>
                <div className="absolute top-8 right-3 md:top-10 z-10 flex w-32 md:w-40 justify-center cursor-pointer gap-2 rounded-md bg-black-6 py-2 hover:bg-red-400 border border-orange-1 transition-all duration-300 items-center">
                  <Image
                    src="/icons/delete.svg"
                    width={16}
                    height={16}
                    alt="Delete icon"
                  />

                  <h2 className="text-12 md:text-16 font-normal text-white-1">
                    Delete Podcast
                  </h2>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-lg border-white-2/30">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your podcast and all related metadata to it from our
                    servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <Button
                      variant="outline"
                      className="text-16 border-orange-1 font-extrabold text-white-1 ring-0 hover:border-orange-1/80 hover:text-white-2 hover:bg-black-3"
                    >
                      Cancel
                    </Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      onClick={handleDelete}
                      className="text-16 bg-orange-1 font-extrabold text-white-1 hover:bg-orange-1/80"
                    >
                      Yes, Delete
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}
    </div>
  );
};

export default PodcastDetailPlayer;
