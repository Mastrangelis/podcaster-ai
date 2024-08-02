"use client";

import { GeneratePodcastProps } from "@/types";
import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

import { useUploadFiles } from "@xixixao/uploadstuff/react";

const useGeneratePodcast = ({
  setAudio,
  voiceType,
  voicePrompt,
}: GeneratePodcastProps) => {
  const { toast } = useToast();

  const [isGenerating, setIsGenerating] = useState(false);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  const getPodcastAudio = useAction(api.openai.generateAudioAction);

  const getAudioUrl = useMutation(api.podcasts.getUrl);

  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio({
      url: "",
      storageId: "",
    });

    if (!voicePrompt) {
      toast({
        title: "Please provide a voice type to generate a podcast",
      });
      return setIsGenerating(false);
    }

    try {
      const response = await getPodcastAudio({
        voice: voiceType,
        input: voicePrompt,
      });

      const fileName = `podcast-${uuidv4()}.mp3`;
      const blob = new Blob([response], { type: "audio/mpeg" });
      const file = new File([blob], fileName, { type: "audio/mpeg" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      const audioUrl = await getAudioUrl({ storageId });
      setAudio({ url: audioUrl!, storageId });

      setIsGenerating(false);

      toast({
        title: "Podcast generated successfully",
        variant: "success",
      });
    } catch (error) {
      console.log("Error generating podcast", error);
      toast({
        title: "Error creating a podcast",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return { isGenerating, generatePodcast };
};

export default useGeneratePodcast;
