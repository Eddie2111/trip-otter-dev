"use client";

// import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import {
  Camera,
  ImageIcon,
  Globe,
  Mountain,
  Plane,
} from "lucide-react";
import Dynamic from "next/dynamic";
import { LoadingSmall } from "./ui/loading";

const CreatePost = Dynamic(
  () => import("./create-post").then((mod) => mod.CreatePost),
  {
    ssr: false,
    loading: ()=> <Button className="bg-white dark:bg-black"><LoadingSmall /></Button>
  }
)

// const CreateJournal = Dynamic(
//   () => import("@/components/create-journal").then((mod) => mod.CreateJournal),
//   {
//     ssr: true,
//     loading: () => (
//       <Button className="bg-white dark:bg-black">
//         <LoadingSmall />
//       </Button>
//     ),
//   }
// );

export default function ContentCreator({ profileId, userImage }: { profileId: string, userImage: string }) {
  // const [postDialogOpen, setPostDialogOpen] = useState(false);
  // const [journeyDialogOpen, setJourneyDialogOpen] = useState(false);
  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 border-0 shadow-xl">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/30 to-transparent dark:from-blue-900/30 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-200/30 to-transparent dark:from-orange-900/30 rounded-full translate-y-12 -translate-x-12" />

        <CardHeader className="relative">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 ring-4 ring-white dark:ring-gray-800 shadow-lg">
              <AvatarImage src={ userImage } alt="User" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-orange-500 text-white text-xl font-bold">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold bg-gradient-to-br from-[#0099DB] to-[#00F0E4] bg-clip-text text-transparent">
                Share Your Adventure
              </h2>
              <p className="text-muted-foreground flex items-center gap-1">
                <Globe className="w-4 h-4" />
                What's your next story?
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
              <Mountain className="w-5 h-5" />
              <Plane className="w-5 h-5" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          <div className="flex flex-row justify-between gap-4">
            {/* Create Post Dialog */}
            <div className="w-full">
              <CreatePost profileId={profileId}>
                <Button
                  variant="outline"
                  className="w-full h-24 flex-col gap-3 bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-200 dark:border-blue-800 dark:bg-blue-900/10 hover:from-blue-500/20 hover:to-blue-600/30 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-2">
                    <Camera className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                    <ImageIcon className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-700 dark:text-blue-300">
                      Create Post
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      Share a moment
                    </div>
                  </div>
                </Button>
              </CreatePost>
            </div>

            {/* Create Journey Dialog */}
            {/* <Dialog
              open={journeyDialogOpen}
              onOpenChange={setJourneyDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-3 bg-gradient-to-br from-orange-500/10 to-orange-600/20 border-orange-200 dark:border-orange-800 dark:bg-orange-900/10 hover:from-orange-500/20 hover:to-orange-600/30 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-2">
                    <Compass className="w-6 h-6 text-orange-600 group-hover:rotate-12 transition-transform" />
                    <PenTool className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-orange-700 dark:text-orange-300">
                      Create Journey
                    </div>
                    <div className="text-xs text-orange-600 dark:text-orange-400">
                      Tell your story
                    </div>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto dark:bg-gray-900">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-orange-600" />
                    Create New Journey
                  </DialogTitle>
                  <DialogDescription>
                    Document your travel experience with rich storytelling.
                  </DialogDescription>
                </DialogHeader>
                <CreateJournal />
              </DialogContent>
            </Dialog> */}
          </div>

          {/* Quick stats or inspiration */}
          {/* <div className="flex items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Camera className="w-4 h-4" />
              <span>24 posts</span>
            </div>
            <div className="flex items-center gap-1">
              <Compass className="w-4 h-4" />
              <span>8 journeys</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>12 countries</span>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
