"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X, Upload, ImageIcon, MapPin, Type } from "lucide-react";
import Image from "next/image";
import * as nsfwjs from "nsfwjs";
// import heic2any from 'heic2any'; // Removed direct import for dynamic loading

import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  postCreateSchema,
  type PostCreateInput,
  type CreatePostFormProps,
} from "@/utils/models/post.model";
import { useSession } from "next-auth/react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { usePostApi } from "@/lib/requests";
import { getSanityMedia } from "@/lib/getSanityImage";

// Load the NSFWJS model once
let nsfwModel: nsfwjs.NSFWJS | null = null;
const loadNsfwModel = async () => {
  if (!nsfwModel) {
    nsfwModel = await nsfwjs.load();
  }
};

export function CreatePost({
  children,
  profileId,
}: {
  children: React.ReactNode;
  profileId: string;
}) {
  const searchParams = useSearchParams();
  const formParam = searchParams.get("form");

  const shouldAutoOpen = formParam === "create";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (data: PostCreateInput) => {
    setIsSubmitting(true);
    try {
      const response = await usePostApi.createPost(data);
      // console.log("Post created:", response)
      setIsOpen(false);
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog defaultOpen={shouldAutoOpen} open={isOpen} onOpenChange={setIsOpen}>
      <form>
        <DialogTrigger asChild>
          {children ? children : <Button>Create Post</Button>}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogTitle></DialogTitle>
          <CreatePostForm
            onSubmit={handleSubmit}
            owner={profileId}
            isSubmitting={isSubmitting}
            submitState={setIsOpen} // Pass setIsOpen directly here
          />
        </DialogContent>
      </form>
    </Dialog>
  );
}

export function CreatePostForm({
  onSubmit,
  owner,
  isSubmitting,
  submitState,
}: CreatePostFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    loadNsfwModel();
  }, []);

  const form = useForm<PostCreateInput>({
    resolver: zodResolver(postCreateSchema),
    defaultValues: {
      caption: "",
      location: "",
      owner,
      image: [],
      likes: [],
      comments: [],
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const filteredFiles: File[] = [];
      const imagePromises = acceptedFiles.map(async (file) => {
        // Only check images
        if (!file.type.startsWith("image/")) {
          filteredFiles.push(file);
          return;
        }

        let processedFile = file;
        let fileSrc: string | undefined;

        // Handle HEIC files: Convert to JPEG before further processing
        if (file.type === "image/heic" || file.type === "image/heif") {
          try {
            // Dynamically import heic2any only when needed
            const heic2anyModule = await import("heic2any");
            const heic2any = heic2anyModule.default; // Access the default export

            // heic2any returns a Promise that resolves with a Blob
            const convertedBlob = await heic2any({
              blob: file,
              toType: "image/jpeg", // Convert to JPEG
              quality: 0.8, // Adjust quality as needed
            });
            // Create a new File object from the converted Blob
            processedFile = new File(
              [convertedBlob as Blob],
              file.name.replace(/\.heic$/i, ".jpeg"),
              { type: "image/jpeg" }
            );
            fileSrc = URL.createObjectURL(processedFile);
          } catch (error) {
            console.error("Error converting HEIC file:", error);
            toast.error(
              `Failed to process HEIC image: ${file.name}. Please try a different format.`
            );
            return; // Skip this file if conversion fails
          }
        } else {
          // For non-HEIC images, create an object URL directly
          fileSrc = URL.createObjectURL(file);
        }

        if (!fileSrc) {
          console.error("File source could not be created for", file.name);
          return;
        }

        const img = document.createElement("img");
        img.src = fileSrc;

        return new Promise<void>((resolve) => {
          img.onload = async () => {
            if (nsfwModel) {
              const predictions = await nsfwModel.classify(img);
              // Check if any of 'Porn', 'Sexy', or 'Hentai' classes have a probability above 50%
              const isExplicit = predictions.some(
                (p) =>
                  (p.className === "Porn" ||
                    p.className === "Sexy" ||
                    p.className === "Hentai") &&
                  p.probability > 0.5
              );

              if (isExplicit) {
                toast.error(
                  "Explicit image detected, please keep the platform safe for everyone."
                );
              } else {
                filteredFiles.push(processedFile); // Push the processed file (original or converted)
              }
            } else {
              // If NSFW model not loaded, still add the file
              filteredFiles.push(processedFile);
            }
            URL.revokeObjectURL(fileSrc); // Clean up the object URL after use
            resolve();
          };
          img.onerror = () => {
            console.error("Error loading image for NSFW check:", file.name);
            toast.error(
              `Failed to load image for content check: ${file.name}.`
            );
            URL.revokeObjectURL(fileSrc); // Clean up the object URL
            resolve(); // Resolve the promise to not block other files
          };
        });
      });

      await Promise.all(imagePromises);

      const newFiles = filteredFiles.slice(0, 10 - files.length);
      setFiles((prev) => [...prev, ...newFiles]);
    },
    [files.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".heic", ".heif"], // Added .heif for completeness
      "video/*": [".mp4", ".mov", ".avi", ".mkv"],
    },
    maxFiles: 10,
    disabled: files.length >= 10,
  });

  const handleSubmit = async (data: PostCreateInput) => {
    submitState(true); // Assuming submitState is a setter for a boolean like setIsSubmitting
    if (files.length === 0 && !data.caption?.trim()) {
      toast.error("Please add a caption or at least one image");
      submitState(false);
      return;
    }
    try {
      const uploadedImageIds: string[] = [];

      for (const file of files) {
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
        // console.log("file upload response", result);
        const mediaLink = await getSanityMedia(result.mediaId);
        uploadedImageIds.push(mediaLink.data.url);
      }

      const owner = (session?.user?.id as string) ?? "";
      await onSubmit({
        ...data,
        image: uploadedImageIds,
        owner,
      });

      setFiles([]);
      form.reset();
    } catch (error) {
      console.error("Error submitting post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      submitState(false);
    }
  };
  const caption = form.watch("caption");
  const image = form.watch("image");

  const isFormInvalid = !caption?.trim() && (!image || files.length === 0);

  return (
    <div className="overflow-y-auto max-h-[80vh]">
      <div>
        <div className="p-1">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Create New Post</h2>
            <p className="text-muted-foreground">
              Share your moment with the world
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Image Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Images</h3>
                  <span className="text-sm text-muted-foreground">
                    ({files.length}/10)
                  </span>
                </div>

                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50"
                  } ${
                    files.length >= 10 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  {isDragActive ? (
                    <p className="text-primary">Drop the images here...</p>
                  ) : (
                    <div>
                      <p className="text-lg font-medium mb-2">
                        {files.length >= 10
                          ? "Maximum 10 images allowed"
                          : "Drag & drop images here, or click to select"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supports: JPEG, PNG, GIF, WebP, Heic (Max 10 images)
                      </p>
                    </div>
                  )}
                </div>

                {/* Image Previews */}
                {files.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {files.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={URL.createObjectURL(file)} // This will now use the converted JPEG blob for HEIC files
                            alt={`Preview ${index + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() =>
                            setFiles((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Caption Field */}
              <FormField
                control={form.control}
                name="caption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Caption <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write a caption for your post..."
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Share what's on your mind or describe your post
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location Field */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Where was this taken?" {...field} />
                    </FormControl>
                    <FormDescription>
                      Add a location to help others discover your post
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isSubmitting}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || isFormInvalid}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? "Creating..." : "Create Post"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
