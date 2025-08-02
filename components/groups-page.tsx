"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Users,
  TrendingUp,
  Lock,
  Globe,
  UserPlus,
  MessageCircle,
  Filter,
  Sun,
  Moon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { allGroups, categories, trendingGroups } from "@/data/mocks/group.mock";


export function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredGroups, setFilteredGroups] = useState(allGroups);
  const [isAlertOpen, setIsAlertOpen] = useState(true);

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

  const GroupCard = ({
    group,
    isTrending = false,
  }: {
    group: any;
    isTrending?: boolean;
  }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-not-allowed group bg-white dark:bg-slate-800 dark:border-slate-700">
      <div className="relative h-32 bg-gradient-to-r from-blue-400 to-purple-500">
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div className="absolute top-3 right-3 flex gap-2">
          {isTrending && group.growthRate && (
            <Badge className="bg-green-500 text-white">
              <TrendingUp className="w-3 h-3 mr-1" />
              {group.growthRate}
            </Badge>
          )}
          <div className="flex items-center gap-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
            {group.isPrivate ? (
              <Lock className="w-3 h-3" />
            ) : (
              <Globe className="w-3 h-3" />
            )}
            {group.isPrivate ? "Private" : "Public"}
          </div>
        </div>
        <div className="absolute bottom-3 left-3">
          <Avatar className="w-16 h-16 border-4 border-white dark:border-slate-800">
            <AvatarImage
              src={group.avatar || "/placeholder.svg"}
              alt={group.name}
            />
            <AvatarFallback>
              {group.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">
            {group.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2 mb-2">
            {group.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-500 mb-3">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{group.members.toLocaleString()} members</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>{group.posts} posts</span>
            </div>
            <div
              className={`px-2 py-1 rounded-full text-xs ${
                group.activity === "Very Active"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400"
                  : group.activity === "Active"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400"
              }`}
            >
              {group.activity}
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {group.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={group.isJoined ? "outline" : "default"}
            className="flex-1"
            disabled
          >
            {group.isJoined ? (
              <>
                <Users className="w-4 h-4 mr-2" />
                Joined
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                {group.isPrivate ? "Request" : "Join"}
              </>
            )}
          </Button>
          <Button size="sm" variant="outline" disabled>
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white">
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">
              Feature coming soon
            </AlertDialogTitle>
            <AlertDialogDescription className="dark:text-slate-400">
              The groups feature is under construction and will be available
              soon. Stay with Trip Otter.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>
              <Link href="/" className="w-full">
                Back to Home
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
              <Button
                variant="outline"
                size="sm"
                // The actual onClick for toggling the theme would be provided by next-themes.
                // For example: onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                // This button is just a placeholder and will not change the theme.
              >
                {/* The icon would also be dynamic based on the current theme from next-themes */}
                <Moon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Categories */}
        <div className="mb-8">
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.name}
                    variant={
                      selectedCategory === category.name ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleCategoryFilter(category.name)}
                    className="flex items-center gap-2 whitespace-nowrap"
                    disabled
                  >
                    <IconComponent className="w-4 h-4" />
                    {category.name}
                    <Badge variant="secondary" className="ml-1">
                      {category.count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Trending Groups */}
        {selectedCategory === "All" && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold dark:text-white">
                  Trending Groups
                </h2>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Groups gaining popularity this week
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingGroups.map((group) => (
                <GroupCard key={group.id} group={group} isTrending />
              ))}
            </div>
          </section>
        )}

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
                {filteredGroups.length} groups found
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
