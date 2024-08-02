"use client";

import { useToast } from "@/components/ui/use-toast";
import { api } from "@/convex/_generated/api";
import { GenerateThumbnailProps } from "@/types";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useAction, useMutation } from "convex/react";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const useGenerateThumbnail = ({
  imagePrompt,
  setThumbnail,
}: GenerateThumbnailProps) => {
  const { toast } = useToast();

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getImageUrl = useMutation(api.podcasts.getUrl);

  const { startUpload } = useUploadFiles(generateUploadUrl);

  const handleGenerateThumbnail = useAction(api.openai.generateThumbnailAction);

  const uploadThumbnailRef = useRef<HTMLInputElement>(null);

  const [isAiThumbnail, setIsAiThumbnail] = useState(false);
  const [isThumbnailLoading, setIsThumbnailLoading] = useState(false);

  const handleImage = async (blob: Blob, fileName: string) => {
    setThumbnail({
      url: "",
      storageId: "",
    });

    try {
      const file = new File([blob], fileName, { type: "image/png" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      const imageUrl = await getImageUrl({ storageId });
      setThumbnail({ url: imageUrl!, storageId });

      setIsThumbnailLoading(false);

      toast({
        title: "Thumbnail generated successfully",
        variant: "success",
      });
    } catch (error) {
      setIsThumbnailLoading(false);

      toast({
        title: "Error generating thumbnail",
        variant: "destructive",
      });
    }
  };

  const generateImage = async () => {
    setIsThumbnailLoading(true);

    try {
      const response = await handleGenerateThumbnail({
        prompt: imagePrompt,
      });

      const blob = new Blob([response], { type: "image/png" });
      handleImage(blob, `thumbnail-${uuidv4()}`);
    } catch (error) {
      setIsThumbnailLoading(false);

      toast({
        title: "Error generating thumbnail",
        variant: "destructive",
      });
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      const files = e.target.files;
      if (!files) return;

      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));

      handleImage(blob, file.name);
    } catch (error) {
      toast({ title: "Error uploading image", variant: "destructive" });
    }
  };

  return {
    isAiThumbnail,
    uploadThumbnailRef,
    isThumbnailLoading,
    generateImage,
    uploadImage,
    setIsAiThumbnail,
  };
};

export default useGenerateThumbnail;
