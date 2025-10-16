"use client";

import { useUserApi } from "@/lib/requests";
import { useStore } from "@nanostores/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { $userLayout } from "./chat.store";
import { useEffect } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

interface IResponseData {
  _id: string;
  fullName: string;
  username: string;
  profileImage: string;
}

export function ChatSettings() {
  const userOnArea = useStore($userLayout);
  const queryClient = useQueryClient();
  const { data: profileData, isLoading, isError } = useQuery({
    queryKey: ["chatarea", userOnArea],
    queryFn: async (): Promise<IResponseData> => {
      const response = await useUserApi.getUser(userOnArea);
      if (!response.data) {
        throw new Error("Failed to fetch user profile");
      }
      return response.data;
    },
    enabled: !!userOnArea,
    staleTime: 1000 * 60 * 15,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["chatarea", userOnArea] });
  }, [userOnArea]);

  if (isLoading) return <ChatSettingsLoader />;
  if (isError || !profileData) return <div className="w-[450px] p-6 text-center text-red-500">Failed to load profile</div>;

  return (
    <div className="w-[450px] p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-4">
          <img
            src={profileData.profileImage || "/default-avatar.png"}
            alt={profileData.fullName}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
          />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {profileData.fullName}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          @{profileData.username}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition-colors">
          <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
          <span className="text-red-700 dark:text-red-300 font-medium">
            Report Chat
          </span>
        </button>
        
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition-colors">
          <Trash2 className="w-5 h-5 text-red-500 dark:text-red-400" />
          <span className="text-red-700 dark:text-red-300 font-medium">
            Delete Chat
          </span>
        </button>
      </div>
    </div>
  );
}

export function ChatSettingsLoader() {
  return (
    <div className="w-[450px] p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse mb-4" />
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      
      <div className="space-y-3">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}