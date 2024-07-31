"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useAudio } from "@/lib/providers/AudioProvider";
import { PodcastProps, ProfileCardProps } from "@/types";

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
  userFirstName,
  isOwner,
  clerkId,
}: ProfileCardProps) => {
  const router = useRouter();
  const { setAudio, audio } = useAudio();
  const { user, signOut } = useClerk();

  const [randomPodcast, setRandomPodcast] = useState<PodcastProps | null>(null);

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
    if (audio?.audioUrl) {
      setAudio((prev) => ({ ...prev, isPlaying: !prev?.isPlaying }));
      return;
    }

    const randomIndex = Math.floor(Math.random() * podcastData.podcasts.length);

    setRandomPodcast(podcastData.podcasts[randomIndex]);
  };

  useEffect(() => {
    if (!randomPodcast) return;

    setAudio((prev) => ({
      ...prev,
      title: randomPodcast.podcastTitle,
      audioUrl: randomPodcast.audioUrl || "",
      imageUrl: randomPodcast.imageUrl || "",
      author: randomPodcast.author,
      podcastId: randomPodcast._id,
      isPlaying: !prev?.isPlaying,
    }));
  }, [randomPodcast, setAudio]);

  if (!imageUrl) return <LoaderSpinner />;

  return (
    <div className="mt-6 flex w-full justify-between max-md:justify-center">
      <div className="flex flex-col gap-6 max-md:items-center md:flex-row">
        <Image
          src={imageUrl}
          width={250}
          height={250}
          alt="Podcaster"
          className="aspect-square rounded-lg"
        />
        <div className="flex flex-col justify-center max-md:items-center">
          <div className="flex flex-col gap-2.5">
            <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1">
              {userFirstName}
            </h1>
            <figure className="flex gap-2 max-md:justify-center">
              <Image
                src="/icons/verified.svg"
                width={15}
                height={15}
                alt="verified"
              />
              <h2 className="text-14 font-medium text-white-2">
                Verified Creator
              </h2>
            </figure>
          </div>
          <figure className="flex gap-3 py-6">
            <Image
              src="/icons/headphone.svg"
              width={24}
              height={24}
              alt="headphones"
            />
            <h2 className="text-16 font-semibold text-white-1">
              {podcastData?.listeners} &nbsp;
              <span className="font-normal text-white-2">total listeners</span>
            </h2>
          </figure>
          {podcastData?.podcasts.length > 0 && (
            <Button
              onClick={playRandomPodcast}
              className="text-16 bg-orange-1 font-extrabold text-white-1"
            >
              <Image
                src={audio?.isPlaying ? "/icons/Pause.svg" : "/icons/Play.svg"}
                width={20}
                height={20}
                alt="random play"
              />
              &nbsp; {audio?.isPlaying ? "Pause" : "Play"} a random podcast
            </Button>
          )}
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
            <div className="absolute top-10 left-3 z-10 flex w-40 justify-center cursor-pointer gap-2 rounded-md bg-black-6 py-1.5 hover:bg-black-2">
              <Image
                src="/icons/delete.svg"
                width={16}
                height={16}
                alt="Delete icon"
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <h2 className="text-16 font-normal text-white-1">
                    Delete Account
                  </h2>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <Button
                        variant="outline"
                        className="text-16 border-orange-1 font-extrabold text-white-1 ring-0"
                      >
                        Cancel
                      </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        onClick={handleDelete}
                        className="text-16 bg-orange-1 font-extrabold text-white-1"
                      >
                        Yes,Delete
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
