"use client";
import { useState } from "react"; // No need for useEffect for Modal.setAppElement anymore
import {
  Dialog,
  DialogContent,
  DialogTrigger, // Not directly used for programmatic open, but good to import
  DialogClose,
} from "@/components/ui/dialog"; // Import Dialog components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button"; // Ensure Button is imported

export default function GridMedia({ media }: { media: string[] }) {
  let mediaLinks: string[] = [];
  // Filter out null or invalid media links
  media.forEach((item) => {
    if (typeof item === "string" && item.includes("https://")) {
      mediaLinks.push(item);
    }
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  if (mediaLinks.length === 0) {
    return <div>&nbsp;</div>; // Return empty div if no valid media
  }

  // Helper function to open the modal
  const openModal = (index: number) => {
    setSelectedMediaIndex(index);
    setModalIsOpen(true);
  };

  // Helper function to close the modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Helper function to navigate to the next media item in the modal
  const goToNext = () => {
    setSelectedMediaIndex((prevIndex) => (prevIndex + 1) % mediaLinks.length);
  };

  // Helper function to navigate to the previous media item in the modal
  const goToPrevious = () => {
    setSelectedMediaIndex(
      (prevIndex) => (prevIndex - 1 + mediaLinks.length) % mediaLinks.length
    );
  };

  // Helper function to render image or video
  const renderMediaItem = (
    item: string,
    index: number,
    className: string = "w-full h-full object-cover rounded-md",
    clickable: boolean = true
  ) => {
    const mediaElement = item.includes("mp4") ? (
      <video key={index} src={item} controls className={className} />
    ) : (
      <img
        key={index}
        src={item}
        alt={`Media ${index}`}
        className={className}
      />
    );

    if (clickable) {
      return (
        <div
          onClick={() => openModal(index)}
          className="cursor-pointer w-full h-full"
        >
          {mediaElement}
        </div>
      );
    }
    return mediaElement;
  };

  return (
    <>
      {mediaLinks.length === 1 ? (
        // If only one media item, show it full width
        <div className="w-full">{renderMediaItem(mediaLinks[0], 0)}</div>
      ) : mediaLinks.length >= 5 ? (
        // If 5 or more media items, show in a carousel
        // Added 'relative' to the Carousel component to contain the absolute positioned arrows
        <Carousel className="w-full mt-4 relative">
          <CarouselContent className="-ml-1">
            {mediaLinks.map((item, index) => (
              <CarouselItem
                key={index}
                className="pl-1 md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card className="rounded-lg overflow-hidden">
                    <CardContent className="flex aspect-square items-center justify-center p-0">
                      {renderMediaItem(
                        item,
                        index,
                        "w-full h-full object-cover"
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Adjusted positioning for CarouselPrevious to be inside */}
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
          {/* Adjusted positioning for CarouselNext to be inside */}
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
      ) : (
        // For 2, 3, or 4 media items, use the existing grid layout
        <div className="grid grid-cols-2 gap-4 mt-4">
          {mediaLinks.map((item, index) => (
            <div key={index} className="relative aspect-square">
              {renderMediaItem(item, index)}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Dialog */}
      <Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
        {/* DialogTrigger is not used here as we open the dialog programmatically */}
        <DialogContent className="sm:max-w-[calc(100vw-40px)] md:max-w-[calc(100vw-80px)] lg:max-w-[calc(100vw-120px)] xl:max-w-[calc(100vw-160px)] max-h-[90vh] p-0 border-none bg-transparent flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <DialogClose asChild>
              <Button
                className="absolute top-4 right-4 z-50 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
                size="icon"
              >
                <X className="w-6 h-6" />
              </Button>
            </DialogClose>

            {/* Previous Button */}
            {mediaLinks.length > 1 && (
              <Button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
                size="icon"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            )}

            {/* Current Media */}
            <div className="max-w-full max-h-full flex items-center justify-center">
              {renderMediaItem(
                mediaLinks[selectedMediaIndex],
                selectedMediaIndex,
                "max-w-full max-h-full object-contain",
                false
              )}
            </div>

            {/* Next Button */}
            {mediaLinks.length > 1 && (
              <Button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
                size="icon"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
