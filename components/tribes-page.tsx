"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
import CreateTribeForm from "@/components/tribes-page/create-tribe";

import {
  Search,
  Users,
  Filter,
  // TrendingUp,
  // Lock,
  // Globe,
  // UserPlus,
  // MessageCircle,
  // Moon,
} from "lucide-react";

import { TribeCard } from "./tribes-page/tribe-card";
// import Link from "next/link";
import { allGroups, categories, trendingGroups } from "@/data/mocks/group.mock";
import { useTribeAPI } from "@/lib/requests";
import { LoadingScreen } from "./ui/loading-splash";

interface ITribe {
  __v: number;
  _id: string;
  category: string;
  coverImage: string;
  createdAt: string;
  createdBy: string;
  description: string;
  name: string;
  privacy: "PUBLIC" | "PRIVATE";
  profileImage: string;
  serial: string;
  tags: string[];
  updatedAt: string;
}

export function TribesPage_Header_V1({children}: {children: React.ReactNode}) {
    const [searchQuery, setSearchQuery] = useState("");
  return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Discover Groups</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                <Input
                  placeholder="Search groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder:text-gray-500"
                  disabled
                />
              </div>
              <Button variant="outline" size="sm" disabled>
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <CreateTribeForm />
            </div>
          </div>
        </div>
      </div>
      {children}
      </div>
  )
}

export function TribesPage_V1() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredGroups, setFilteredGroups] = useState(allGroups);

  // 🚀 Tanstack Query replacing useEffect
  const { data: tribes, isLoading, isError } = useQuery<ITribe[]>({
    queryKey: ["tribes", 1, 10],
    queryFn: async () => {
      const response = await useTribeAPI.getTribes(1, 10);
      return response.data;
    },
  });

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredGroups(allGroups);
    } else {
      setFilteredGroups(
        allGroups.filter((group) => group.category === category)
      );
    }
  };

  const handleJoinToggle = (groupId: number) => {
    setFilteredGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, isJoined: !group.isJoined } : group
      )
    );
  };

  if (isLoading) return <LoadingScreen />;
  if (isError) return <div className="text-red-500">Failed to load groups</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white">
      <TribesPage_Header_V1>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* All Groups */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold dark:text-white">
                {selectedCategory === "All"
                  ? "All Groups"
                  : `${selectedCategory} Groups`}
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                {tribes?.length ?? 0} groups found
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tribes?.map((group, index) => (
              <TribeCard key={index} group={group} />
            ))}
          </div>
        </section>
      </div>
      </TribesPage_Header_V1>
    </div>
  );
}
