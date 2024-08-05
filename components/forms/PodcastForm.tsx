"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../ui/form";
import { Input } from "../ui/input";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useToast } from "../ui/use-toast";
import { Loader } from "lucide-react";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import clsx from "clsx";
import { PodcastProps } from "@/types";
import useGeneratePodcast from "@/lib/hooks/useGeneratePodcast";
import useGenerateThumbnail from "@/lib/hooks/useGenerateThumbnail";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

const voiceCategories = ["alloy", "shimmer", "nova", "echo", "fable", "onyx"];

const formSchema = z.object({
  podcastTitle: z.string().min(2, {
    message: "Podcast title must be at least 2 characters",
  }),
  podcastDescription: z.string().min(2, {
    message: "Podcast description must be at least 2 characters",
  }),
  podcastVoiceType: z
    .string()
    .refine((value) => voiceCategories.includes(value)),
  audio: z.object({
    url: z.string().url({
      message: "Please generate audio",
    }),
    duration: z.number({
      required_error: "Please generate audio",
    }),
    prompt: z
      .string()
      .min(100, {
        message: "Audio rompt must be at least 100 characters",
      })
      .max(4096, {
        message: "Audio prompt must be between 100 and 4096 characters",
      }),
    storageId: z.string({
      required_error: "Please generate audio",
    }),
  }),
  thumbnail: z.object({
    url: z.string().url(),
    prompt: z
      .union([z.string().length(0), z.string().min(4)])
      .optional()
      .transform((e) => (e === "" ? undefined : e)),
    storageId: z.string({
      required_error: "Please generate thumbnail",
    }),
  }),
});

interface PodcastFormProps {
  podcast?: PodcastProps;
  type?: "edit" | "create";
}

const PodcastForm = ({ podcast, type = "create" }: PodcastFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPodcast = useMutation(api.podcasts.createPodcast);
  const updatePodcast = useMutation(api.podcasts.updatePodcastById);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: podcast?.podcastTitle || "",
      podcastDescription: podcast?.podcastDescription || "",
      podcastVoiceType: podcast?.voiceType || "",
      audio: {
        url: podcast?.audioUrl || "",
        duration: podcast?.audioDuration || 0,
        prompt: podcast?.voicePrompt || "",
        storageId: podcast?.audioStorageId || "",
      },
      thumbnail: {
        url: podcast?.imageUrl || "",
        prompt: podcast?.imagePrompt || "",
        storageId: podcast?.imageStorageId || "",
      },
    },
  });

  const [podcastVoiceType, audio, thumbnail] = form.watch([
    "podcastVoiceType",
    "audio",
    "thumbnail",
  ]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (type === "create") {
      return await onCreateSubmit(data);
    } else {
      return await onEditSubmit(data);
    }
  };

  const onCreateSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (!data.audio.url || !data.thumbnail.url || !data.podcastVoiceType) {
        toast({
          title: "Error",
          description: "Please generate audio and image",
          variant: "destructive",
        });
        setIsSubmitting(false);
        throw new Error("Please generate audio and image");
      }

      await createPodcast({
        viewedBy: [],
        audioUrl: data.audio.url,
        imageUrl: data.thumbnail.url,
        voicePrompt: data.audio.prompt,
        podcastTitle: data.podcastTitle,
        voiceType: data.podcastVoiceType,
        imagePrompt: data.thumbnail.prompt || "",
        audioDuration: data.audio.duration,
        podcastDescription: data.podcastDescription,
        audioStorageId: data.audio.storageId! as Id<"_storage">,
        imageStorageId: data.thumbnail.storageId! as Id<"_storage">,
      });
      toast({ title: "Podcast created!", variant: "success" });
      setIsSubmitting(false);
      router.push("/");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Error creating podcast",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const onEditSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      await updatePodcast({
        podcastId: podcast?._id!,
        authorId: podcast?.authorId!,
        clerkId: user?.id!,
        audioUrl: data.audio.url,
        imageUrl: data.thumbnail.url,
        voicePrompt: data.audio.prompt,
        podcastTitle: data.podcastTitle,
        voiceType: data.podcastVoiceType,
        imagePrompt: data.thumbnail.prompt,
        audioDuration: data.audio.duration,
        podcastDescription: data.podcastDescription,
        audioStorageId: data.audio.storageId! as Id<"_storage">,
        imageStorageId: data.thumbnail.storageId! as Id<"_storage">,
      });
      toast({ title: "Podcast updated!", variant: "success" });

      setIsSubmitting(false);
      router.push("/");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Error updating podcast",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const { isGenerating, generatePodcast } = useGeneratePodcast({
    setAudio: (value) =>
      form.setValue("audio", {
        ...audio,
        ...value,
      }),
    voiceType: podcastVoiceType,
    voicePrompt: audio.prompt,
  });

  const {
    isAiThumbnail,
    uploadThumbnailRef,
    isThumbnailLoading,
    uploadImage,
    generateImage,
    setIsAiThumbnail,
  } = useGenerateThumbnail({
    imagePrompt: thumbnail.prompt || "",
    setThumbnail: (value) => {
      form.setValue("thumbnail", {
        ...thumbnail,
        ...value,
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-12 flex w-full flex-col"
      >
        <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
          <FormField
            control={form.control}
            name="podcastTitle"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel className="text-16 font-bold text-white-1">
                  Title <span className="text-red-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="input-class"
                    placeholder="Podcast Title"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="podcastVoiceType"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel className="text-16 font-bold text-white-1">
                  Select AI Voice <span className="text-red-400">*</span>
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      className={cn(
                        "text-16 w-full border-none bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1 !focus:border-orange-1"
                      )}
                    >
                      <SelectValue
                        placeholder="Select AI Voice"
                        className="placeholder:text-gray-1 "
                      />
                    </SelectTrigger>
                    <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:border-orange-1">
                      {voiceCategories.map((category: string) => (
                        <SelectItem
                          key={category}
                          value={category}
                          className="capitalize focus:bg-orange-1"
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                    {podcastVoiceType && !audio.url && (
                      <audio
                        src={`/${podcastVoiceType}.mp3`}
                        autoPlay
                        className="hidden"
                      />
                    )}
                  </Select>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="podcastDescription"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel className="text-16 font-bold text-white-1">
                  Description <span className="text-red-400">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="input-class focus-visible:ring-offset-orange-1"
                    placeholder="Write a short podcast description"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="audio"
          render={({ field }) => (
            <div className="mt-10">
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel className="text-16 font-bold text-white-1">
                  AI Prompt to generate Podcast
                  <span className="text-red-400">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="input-class font-light focus-visible:ring-offset-orange-1"
                    placeholder="Provide text to generate audio"
                    rows={5}
                    value={field.value.prompt}
                    onChange={(e) =>
                      field.onChange({
                        ...field.value,
                        prompt: e.target.value,
                      })
                    }
                  />
                </FormControl>
                {form.formState.errors.audio?.prompt && (
                  <span className="text-red-500 text-12">
                    {form.formState.errors.audio?.prompt.message}
                  </span>
                )}
              </FormItem>
              <div className="mt-5 flex flex-col gap-3 w-full">
                <div className="w-full max-w-[200px]">
                  <Button
                    type="submit"
                    disabled={
                      isGenerating || !audio.prompt || !podcastVoiceType
                    }
                    className="text-16 bg-orange-1 py-4 font-bold text-white-1 transition-all duration-500 hover:opacity-80"
                    onClick={generatePodcast}
                  >
                    {isGenerating ? (
                      <>
                        Generating
                        <Loader size={20} className="animate-spin ml-2" />
                      </>
                    ) : (
                      "Generate"
                    )}
                  </Button>
                </div>
                {!podcastVoiceType && (
                  <p className="text-white-2 text-12">
                    ( Tip: You must select a voice type first to generate the
                    podcast )
                  </p>
                )}
              </div>
              {!isGenerating && audio && (
                <audio
                  controls
                  src={audio.url}
                  autoPlay
                  className="mt-5"
                  onLoadedMetadata={(e) =>
                    field.onChange({
                      ...audio,
                      duration: e.currentTarget.duration,
                    })
                  }
                />
              )}
            </div>
          )}
        />

        <div className="border-b border-black-5 py-5" />

        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <div className="mt-10 w-full">
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel className="text-16 font-bold text-white-1">
                  Thumbnail <span className="text-red-400">*</span>
                </FormLabel>
                <div className="generate_thumbnail">
                  <Button
                    type="button"
                    variant="plain"
                    onClick={() => setIsAiThumbnail(true)}
                    className={cn("", {
                      "bg-black-6": isAiThumbnail,
                    })}
                  >
                    Use AI to generate thumbnail
                  </Button>
                  <Button
                    type="button"
                    variant="plain"
                    onClick={() => setIsAiThumbnail(false)}
                    className={cn("", {
                      "bg-black-6": !isAiThumbnail,
                    })}
                  >
                    Upload custom image
                  </Button>
                </div>

                <FormControl>
                  {isAiThumbnail ? (
                    <div className="flex flex-col gap-5 mt-2">
                      <div className="mt-1">
                        <Textarea
                          className="input-class font-light focus-visible:ring-offset-orange-1"
                          placeholder="Provide text to generate thumbnail"
                          rows={5}
                          value={field.value.prompt}
                          onChange={(e) =>
                            field.onChange({
                              ...field.value,
                              prompt: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="w-full max-w-[200px]">
                        <Button
                          type="submit"
                          disabled={isThumbnailLoading || !thumbnail.prompt}
                          className={clsx({
                            "text-16 bg-orange-1 py-4 font-bold text-white-1 transition-all duration-500 hover:opacity-80":
                              true,
                          })}
                          onClick={generateImage}
                        >
                          {isAiThumbnail && isThumbnailLoading ? (
                            <>
                              Generating
                              <Loader size={20} className="animate-spin ml-2" />
                            </>
                          ) : (
                            "Generate"
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="image_div"
                      onClick={() => uploadThumbnailRef?.current?.click()}
                    >
                      <Input
                        type="file"
                        className="hidden"
                        ref={uploadThumbnailRef}
                        onChange={(e) => uploadImage(e)}
                      />
                      {!isThumbnailLoading ? (
                        <Image
                          src="/icons/upload-image.svg"
                          width={40}
                          height={40}
                          alt="upload"
                        />
                      ) : (
                        <div className="text-16 flex-center font-medium text-white-1">
                          Uploading
                          <Loader size={20} className="animate-spin ml-2" />
                        </div>
                      )}
                      <div className="flex flex-col items-center gap-1">
                        <h2 className="text-12 font-bold text-orange-1">
                          Click to upload
                        </h2>
                        <p className="text-12 font-normal text-gray-1">
                          SVG, PNG, JPG, or GIF (max. 1080x1080px)
                        </p>
                      </div>
                    </div>
                  )}
                </FormControl>
                {isAiThumbnail && form.formState.errors.audio?.prompt && (
                  <span className="text-red-500 text-12">
                    {form.formState.errors.thumbnail?.prompt?.message}
                  </span>
                )}
              </FormItem>

              {!isThumbnailLoading && thumbnail.url && (
                <div className="flex-center w-full">
                  <Image
                    src={thumbnail.url}
                    width={200}
                    height={200}
                    className="mt-5"
                    alt="thumbnail"
                  />
                </div>
              )}
            </div>
          )}
        />

        <div className="mt-10 w-full">
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              form.formState.isSubmitting ||
              !audio.url ||
              !thumbnail.url
            }
            className={clsx({
              "text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:opacity-80 disabled:cursor-not-allowed":
                true,
            })}
          >
            {isSubmitting ? (
              <>
                Submitting
                <Loader size={20} className="animate-spin ml-2" />
              </>
            ) : (
              <>Submit & {type === "create" ? "Publish" : "Update"} Podcast</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PodcastForm;
