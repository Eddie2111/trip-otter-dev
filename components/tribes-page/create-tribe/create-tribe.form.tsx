"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TribeCreateSchema,
  TribeCreateInput,
  TribeCategory,
  TribePrivacy,
} from "./create-tribe.validation";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import * as nsfwjs from "nsfwjs";
import { useSession } from "next-auth/react";
import { getSanityMedia } from "@/lib/getSanityImage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTribeAPI } from "@/lib/requests";

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/media", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const dataRes = await res.json();
    throw new Error(dataRes.error || "Failed to upload image");
  }

  const result = await res.json();
  const mediaLink = await getSanityMedia(result.mediaId);
  return mediaLink.data.url;
}

let nsfwModel: nsfwjs.NSFWJS | null = null;
const loadNsfwModel = async () => {
  if (!nsfwModel) {
    nsfwModel = await nsfwjs.load();
  }
};

function ImageDropzone({
  onFileUploaded,
  label,
  existingImage,
}: {
  onFileUploaded: (url: string) => void;
  label: string;
  existingImage?: string;
}) {
  const [preview, setPreview] = useState(existingImage || "");
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    loadNsfwModel();
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const filteredFiles: File[] = [];
      const imagePromises = acceptedFiles.map(async (file) => {
        if (!file.type.startsWith("image/")) return;

        let processedFile = file;
        let fileSrc: string | undefined;

        if (file.type === "image/heic" || file.type === "image/heif") {
          try {
            const heic2anyModule = await import("heic2any");
            const heic2any = heic2anyModule.default;

            const convertedBlob = await heic2any({
              blob: file,
              toType: "image/jpeg",
              quality: 0.8,
            });
            processedFile = new File(
              [convertedBlob as Blob],
              file.name.replace(/\.heic$/i, ".jpeg"),
              { type: "image/jpeg" }
            );
            fileSrc = URL.createObjectURL(processedFile);
          } catch {
            toast.error(`Failed to process HEIC image: ${file.name}`);
            return;
          }
        } else {
          fileSrc = URL.createObjectURL(file);
        }

        if (!fileSrc) return;

        const img = document.createElement("img");
        img.src = fileSrc;

        return new Promise<void>((resolve) => {
          img.onload = async () => {
            if (nsfwModel) {
              const predictions = await nsfwModel.classify(img);
              const isExplicit = predictions.some(
                (p) =>
                  (p.className === "Porn" ||
                    p.className === "Sexy" ||
                    p.className === "Hentai") &&
                  p.probability > 0.5
              );

              if (isExplicit) {
                toast.error("Explicit image detected.");
              } else {
                filteredFiles.push(processedFile);
              }
            } else {
              filteredFiles.push(processedFile);
            }
            URL.revokeObjectURL(fileSrc);
            resolve();
          };
          img.onerror = () => {
            toast.error(`Failed to load image: ${file.name}`);
            URL.revokeObjectURL(fileSrc);
            resolve();
          };
        });
      });

      await Promise.all(imagePromises);

      const finalFile = filteredFiles[0];
      if (!finalFile) return;

      try {
        setUploading(true);
        const uploadedUrl = await uploadImage(finalFile);
        setPreview(uploadedUrl);
        onFileUploaded(uploadedUrl);
      } catch (err) {
        toast.error("Image upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onFileUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".heic", ".heif"],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <div
        {...getRootProps()}
        className={cn(
          "border border-dashed rounded-md px-4 py-10 text-center cursor-pointer transition",
          isDragActive ? "bg-muted/50" : "bg-muted"
        )}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p>Uploading...</p>
        ) : preview ? (
          <img
            src={preview}
            alt="Preview"
            className="max-h-40 mx-auto object-cover rounded-md"
          />
        ) : (
          <p>Drag & drop or click to upload</p>
        )}
      </div>
    </div>
  );
}

export function CreateTribeForm({
  closeButton,
}: {
  closeButton: React.ReactNode;
}) {
  const { data: session } = useSession();
  const form = useForm<TribeCreateInput>({
    resolver: zodResolver(TribeCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "COMMUNITY",
      privacy: "PUBLIC",
      tags: [],
      coverImage: "",
      profileImage: "",
    },
  });

  const queryClient = useQueryClient();

  const { mutateAsync: createTribe, isLoading } = useMutation({
    mutationFn: (data: any) => useTribeAPI.createTribe(data),
    onSuccess: () => {
      toast.success("Tribe created!");
      queryClient.invalidateQueries({ queryKey: ["ProfileFeed"] });
      queryClient.invalidateQueries({ queryKey: ["HomeFeed"] });
    },
    onError: (error) => {
      toast.error(`Failed to create tribe: ${(error as any)?.message}`);
    },
  });

  const onSubmit = async (data: TribeCreateInput) => {
    try {
      const ownerId = (session?.user?.id as string) ?? "";

      await createTribe({
        ...data,
        createdBy: ownerId,
      });
    } catch (error) {
      console.error("Error creating tribe:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tribe Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter tribe name" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>Your tribe name</FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter tribe description" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>What is your tribe about?</FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TribeCategory.options.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Your tribe category</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="privacy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Privacy</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select privacy" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TribePrivacy.options.map((privacy) => (
                    <SelectItem key={privacy} value={privacy}>
                      {privacy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Public or private</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma-separated)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. travel, adventure"
                  value={field.value?.join(", ") || ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean)
                    )
                  }
                />
              </FormControl>
              <FormDescription>Keywords for your tribe</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <ImageDropzone
                label="Cover Image"
                onFileUploaded={field.onChange}
                existingImage={field.value}
              />
              <FormDescription>This will be public</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profileImage"
          render={({ field }) => (
            <FormItem>
              <ImageDropzone
                label="Profile Image"
                onFileUploaded={field.onChange}
                existingImage={field.value}
              />
              <FormDescription>This will be public</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          Create Tribe
        </Button>
        {closeButton}
      </form>
    </Form>
  );
}
