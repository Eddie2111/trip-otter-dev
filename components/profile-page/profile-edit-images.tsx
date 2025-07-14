"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useCallback, useEffect } from "react";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { useMediaApi, useUserApi } from "@/lib/requests";
import { Upload, Camera, X } from "lucide-react"; // Added X icon for removal
import { useDropzone } from "react-dropzone"; // Import useDropzone
import { useForm } from "react-hook-form"; // Import useForm
import { zodResolver } from "@hookform/resolvers/zod"; // Import zodResolver
import Image from "next/image"; // Import Image component
import { getSanityMedia } from "@/lib/getSanityImage";

type ImageType = "COVER" | "PROFILE";

// Validation schema for image upload
const imageUploadSchema = z.object({
  image: z
    .any() // Use z.any() for File object, validation will be done in refine
    .refine((file) => file instanceof File, "Image is required.")
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only JPEG, PNG, and WebP images are allowed"
    ),
});

type ImageFormData = z.infer<typeof imageUploadSchema>;

export function ProfileEditImages({
  type,
  children,
}: {
  type: ImageType;
  children: React.ReactNode;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ImageFormData>({
    resolver: zodResolver(imageUploadSchema),
    defaultValues: {
      image: undefined,
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    reset,
  } = form;

  const getModalConfig = () => {
    switch (type) {
      case "COVER":
        return {
          title: "Update Cover Image",
          description:
            "Upload a new cover image for your profile. Maximum file size: 5MB.",
          triggerText: "Edit Cover",
          fieldName: "coverImage",
        };
      case "PROFILE":
        return {
          title: "Update Profile Image",
          description: "Upload a new profile picture. Maximum file size: 5MB.",
          triggerText: "Edit Profile Picture",
          fieldName: "profileImage",
        };
      default:
        return {
          title: "Upload Image",
          description: "Upload an image file.",
          triggerText: "Upload Image",
          fieldName: "image",
        };
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setImageFile(file);
        setValue("image", file, { shouldValidate: true });

        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        clearErrors("image");
      }
    },
    [setValue, clearErrors]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
  });

  const onSubmit = async (data: ImageFormData) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", data.image);
      formData.append("type", type.toLowerCase());

      const response = await useMediaApi.uploadMedia(data.image) as any;
      const mediaLink = await getSanityMedia(response.mediaId);
      const config = getModalConfig();

      const updatePayload = {
        [config.fieldName]: mediaLink.data.url,
      };

      await useUserApi.updateUser(updatePayload);

      console.log(`${type} image uploaded successfully:`, response);
      setImageFile(null);
      setImagePreview(null);
      reset();
    } catch (error: any) {
      console.error("Error uploading image:", error);
      // Display error message from API or Zod
      if (error.response && error.response.data && error.response.data.error) {
        form.setError("image", {
          type: "manual",
          message: error.response.data.error,
        });
      } else if (error instanceof z.ZodError) {
        form.setError("image", {
          type: "manual",
          message: error.errors[0].message,
        });
      } else {
        form.setError("image", {
          type: "manual",
          message: "Failed to upload image. Please try again.",
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setValue("image", undefined);
    clearErrors("image");
  };

  const config = getModalConfig();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Badge variant="outline" className="cursor-pointer">
            {config.triggerText}
          </Badge>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{config.title}</DialogTitle>
            <DialogDescription>{config.description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="image-upload">
                {type === "COVER" ? "Cover Image" : "Profile Image"}
              </Label>

              <div className="flex flex-col gap-3">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50"
                  } ${imageFile ? "hidden" : ""}`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  {isDragActive ? (
                    <p className="text-primary">Drop the image here...</p>
                  ) : (
                    <div>
                      <p className="text-lg font-medium mb-2">
                        Drag & drop image here, or click to select
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supports: JPEG, PNG, WebP (Max 5MB)
                      </p>
                    </div>
                  )}
                </div>

                {imagePreview && (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Image preview"
                      width={type === "COVER" ? 400 : 200} // Adjust width for cover vs profile
                      height={type === "COVER" ? 150 : 200} // Adjust height for cover vs profile
                      className={`w-full object-cover rounded-md border ${
                        type === "COVER" ? "h-32" : "h-48"
                      }`}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              {errors.image && (
                <span className="text-red-500 text-sm">
                  {errors.image.message}
                </span>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!imageFile || isUploading}>
              {isUploading ? "Uploading..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
