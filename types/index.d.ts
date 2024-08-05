import { Dispatch, SetStateAction } from "react";

import { Id } from "@/convex/_generated/dataModel";
import { UseFormSetValue } from "react-hook-form";

declare type SearchParamProps = {
  params: { [key: string]: string | Id };
  searchParams: { [key: string]: string | string[] | undefined };
};

export interface EmptyStateProps {
  title: string;
  search?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export interface TopPodcastersProps {
  _id: Id<"users">;
  _creationTime: number;
  email: string;
  imageUrl: string;
  clerkId: string;
  name: string;
  podcast: {
    podcastTitle: string;
    podcastId: Id<"podcasts">;
  }[];
  totalPodcasts: number;
}

export interface PodcastProps {
  _id: Id<"podcasts">;
  _creationTime: number;
  audioStorageId?: Id<"_storage">;
  user: Id<"users">;
  podcastTitle: string;
  podcastDescription: string;
  audioUrl?: string;
  imageUrl?: string;
  imageStorageId?: Id<"_storage">;
  author: string;
  authorId: string;
  authorImageUrl: string;
  voicePrompt: string;
  imagePrompt?: string;
  voiceType: string;
  audioDuration: number;
  viewedBy: Id<"users">[];
}

export interface ProfilePodcastProps {
  podcasts: PodcastProps[];
  listeners: number;
}

export interface GeneratePodcastProps {
  voiceType: string;
  voicePrompt: string;
  setAudio: (val: { url: string; storageId: string }) => void;
}

export interface GenerateThumbnailProps {
  imagePrompt: string;
  setThumbnail: (val: { url: string; storageId: string }) => void;
}

export interface LatestPodcastCardProps {
  imgUrl: string;
  title: string;
  duration: string;
  index: number;
  audioUrl: string;
  author: string;
  viewedBy: Id<"users">[];
  podcastId: Id<"podcasts">;
}

export interface PodcastDetailPlayerProps {
  audioUrl: string;
  podcastTitle: string;
  author: string;
  isOwner: boolean;
  imageUrl: string;
  podcastId: Id<"podcasts">;
  imageStorageId: Id<"_storage">;
  audioStorageId: Id<"_storage">;
  authorImageUrl: string;
  authorId: string;
}

export interface AudioProps {
  title?: string;
  audioUrl?: string;
  author?: string;
  imageUrl?: string;
  podcastId?: string;
  isPlaying?: boolean;
  canRestart?: boolean;
}

export interface AudioContextType {
  audio: AudioProps | undefined;
  setAudio: React.Dispatch<React.SetStateAction<AudioProps | undefined>>;
}

export interface PodcastCardProps {
  imgUrl: string;
  title: string;
  description: string;
  isOwner?: boolean;
  podcastId: Id<"podcasts">;
}

export interface CarouselProps {
  fansLikeDetail: TopPodcastersProps[];
}

export interface ProfileCardProps {
  podcastData: ProfilePodcastProps;
  imageUrl: string;
  userName: string;
  isOwner?: boolean;
  clerkId?: string;
}

export type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};
