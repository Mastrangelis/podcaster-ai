"use client";
import Image from "next/image";
import { useState } from "react";

import { useAudio } from "@/lib/providers/AudioProvider";
import { ProfileCardProps } from "@/types";

import LoaderSpinner from "../LoaderSpinner";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

const ProfileCard = ({
  podcastData,
  imageUrl,
  userName,
  isOwner,
  clerkId,
}: ProfileCardProps) => {
  const router = useRouter();
  const { setAudio } = useAudio();
  const { user } = useClerk();

  const [isDeleting, setIsDeleting] = useState(false);
  const deleteUser = useMutation(api.users.deleteUser);

  const handleDelete = async () => {
    try {
      if (user) {
        await deleteUser({ clerkId: clerkId ?? "" });

        await user?.delete();

        toast({
          title: "Account deleted",
          variant: "destructive",
        });

        router.push("/");
      }
    } catch (error) {
      console.error("Error deleting podcast", error);
      toast({
        title: "Error deleting account",
        variant: "destructive",
      });
    }
  };

  const playRandomPodcast = () => {
    const randomIndex = Math.floor(Math.random() * podcastData.podcasts.length);

    const randomPodcast = podcastData.podcasts[randomIndex];

    setAudio({
      ...randomPodcast,
      isPlaying: true,
    });
  };

  if (!imageUrl) return <LoaderSpinner />;

  return (
    <div className="mt-6 flex w-full justify-between max-md:justify-center">
      <div className="flex gap-4 md:gap-6 items-center flex-row">
        <Image
          src={imageUrl}
          width={130}
          height={130}
          alt="Podcaster"
          className="aspect-square rounded-lg size-32 md:size-64"
        />
        <div className="flex flex-col justify-center">
          <div className="flex flex-col gap-1">
            <h1 className="text-24 md:text-32 font-extrabold tracking-[-0.32px] text-white-1 line-clamp-1 break-all">
              {userName}
            </h1>
            <figure className="flex gap-2">
              <Image
                src="/icons/verified.svg"
                width={15}
                height={15}
                alt="verified"
              />
              <h2 className="text-12 md:text-14 font-medium text-white-2">
                Verified Creator
              </h2>
            </figure>
          </div>
          <figure className="flex gap-3 py-3 md:py-6">
            <Image
              src="/icons/headphone.svg"
              width={24}
              height={24}
              alt="headphones"
              className="size-5 md:size-6"
            />
            <h2 className="text-14 md:text-16 font-semibold text-white-1">
              {podcastData?.listeners} &nbsp;
              <span className="text-12 md:text-14 font-normal text-white-2">
                total listeners
              </span>
            </h2>
          </figure>
          {podcastData?.podcasts.length > 0 && (
            <Button
              onClick={playRandomPodcast}
              className="bg-orange-1 font-extrabold text-white-1 cursor-pointer"
            >
              <Image
                src="/icons/Play.svg"
                width={20}
                height={20}
                alt="random play"
                className="size-4 md:size-5"
              />
              <span className="text-12 md:text-16">
                &nbsp; Play a user random podcast
              </span>
            </Button>
          )}
        </div>
      </div>
      {isOwner && (
        <div className="relative mt-2 md:mt-8">
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
                    className="size-3 md:size-4"
                  />

                  <h2 className="text-12 md:text-16 font-normal text-white-1">
                    Delete Account
                  </h2>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-lg border-white-2/30">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
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

export default ProfileCard;
