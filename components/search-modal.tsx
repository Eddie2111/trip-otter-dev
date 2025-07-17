"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Users,
  Store,
  Star,
  Wand2,
  Loader2,
} from "lucide-react";
import { ai } from "@/lib/gemini";
import { Textarea } from "@/components/ui/textarea";
import { mockSearchData, recentSearches, trendingSearches } from "@/data/mocks/search.mock";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPersonSelect: (personId: number) => void;
  onGroupSelect?: (groupId: number) => void;
  onShopSelect: (shopId: number) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  onPersonSelect,
  onGroupSelect,
  onShopSelect,
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filteredResults, setFilteredResults] = useState(mockSearchData);

  // State for AI tab
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState<{
    suggestions: string[];
    highlight: string[];
  } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredResults(mockSearchData);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = {
      people: mockSearchData.people.filter(
        (person) =>
          person.username.toLowerCase().includes(query) ||
          person.name.toLowerCase().includes(query)
      ),
      hashtags: mockSearchData.hashtags.filter((hashtag) =>
        hashtag.tag.toLowerCase().includes(query)
      ),
      locations: mockSearchData.locations.filter((location) =>
        location.name.toLowerCase().includes(query)
      ),
      groups: mockSearchData.groups.filter(
        (group) =>
          group.name.toLowerCase().includes(query) ||
          group.category.toLowerCase().includes(query)
      ),
      shops: mockSearchData.shops.filter(
        (shop) =>
          shop.name.toLowerCase().includes(query) ||
          shop.category.toLowerCase().includes(query)
      ),
    };
    setFilteredResults(filtered);
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handlePersonClick = (personId: number) => {
    onPersonSelect(personId);
    onClose();
  };

  const handleGroupClick = (groupId: number) => {
    // Ensure onGroupSelect is defined before calling
    if (onGroupSelect) {
      onGroupSelect(groupId);
    }
    onClose();
  };

  const handleShopClick = (shopId: number) => {
    onShopSelect(shopId);
    onClose();
  };

  const handleGenerateAIResponse = async () => {
    if (!aiPrompt.trim()) {
      setAiError("Please enter a prompt for AI suggestions.");
      return;
    }
    setAiLoading(true);
    setAiError(null);
    setAiResponse(null); // Clear previous response

    try {
      const response = await ai(aiPrompt);
      if (response) {
        setAiResponse(response);
        console.log(response);
      } else {
        setAiError("Failed to get AI suggestions. Please try again.");
      }
    } catch (err) {
      console.error("Error calling AI:", err);
      setAiError("An unexpected error occurred while generating suggestions.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="sr-only">Search</DialogTitle>
          {activeTab !== "ai" && ( // Only show search input if not on AI tab
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search people, hashtags, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-12 text-base"
                autoFocus
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8"
                  onClick={clearSearch}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </DialogHeader>

        <div className="px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="people">People</TabsTrigger>
              <TabsTrigger value="locations">Places</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="shops">Shops</TabsTrigger>
              <TabsTrigger value="ai" className="bg-blue-500 hover:bg-blue-500/50 transition ease-in-out duration-300 text-white font-bold"> <Wand2 className="mr-2 h-4 w-4" /> AI</TabsTrigger> {/* New AI Tab */}
            </TabsList>

            <ScrollArea className="h-96 mt-4">
              {activeTab !== "ai" &&
                !searchQuery && ( // Show recent/trending only for non-AI tabs when no search query
                  <div className="space-y-6">
                    {/* Recent Searches */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <h3 className="font-semibold text-sm">Recent</h3>
                      </div>
                      <div className="space-y-2">
                        {recentSearches.map((search, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <search.icon className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{search.query}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-6 h-6"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Trending */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                        <h3 className="font-semibold text-sm">Trending</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {trendingSearches.map((trend, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer hover:bg-gray-200"
                          >
                            {trend}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              <TabsContent value="all" className="mt-0">
                {searchQuery && (
                  <div className="space-y-6">
                    {/* People Results */}
                    {filteredResults.people.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          People
                        </h3>
                        <div className="space-y-2">
                          {filteredResults.people.slice(0, 3).map((person) => (
                            <div
                              key={person.id}
                              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                              onClick={() => handlePersonClick(person.id)}
                            >
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={person.avatar || "/placeholder.svg"}
                                />
                                <AvatarFallback>
                                  {person.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold text-sm">
                                    {person.username}
                                  </span>
                                  {person.verified && (
                                    <Star className="w-3 h-3 text-blue-500 fill-current" />
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {person.name} • {person.followers} followers
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Groups Results */}
                    {filteredResults.groups.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Groups
                        </h3>
                        <div className="space-y-2">
                          {filteredResults.groups.slice(0, 2).map((group) => (
                            <div
                              key={group.id}
                              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                              onClick={() => handleGroupClick(group.id)}
                            >
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={group.avatar || "/placeholder.svg"}
                                />
                                <AvatarFallback>{group.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="font-semibold text-sm">
                                  {group.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {group.members} members • {group.category}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Shops Results */}
                    {filteredResults.shops.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <Store className="w-4 h-4" />
                          Shops
                        </h3>
                        <div className="space-y-2">
                          {filteredResults.shops.slice(0, 2).map((shop) => (
                            <div
                              key={shop.id}
                              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                              onClick={() => handleShopClick(shop.id)}
                            >
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={shop.avatar || "/placeholder.svg"}
                                />
                                <AvatarFallback>{shop.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="font-semibold text-sm">
                                  {shop.name}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                  <span>⭐ {shop.rating}</span>
                                  <span>•</span>
                                  <span>{shop.products} products</span>
                                  <span>•</span>
                                  <span>{shop.category}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* AI Tab Content */}
              <TabsContent value="ai" className="mt-0 p-4">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Tell me about your travel preferences, e.g., 'I want a relaxing beach vacation in Europe with good seafood and historical sites.'"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button
                    onClick={handleGenerateAIResponse}
                    disabled={aiLoading}
                    className="w-full"
                  >
                    {aiLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Ask AI
                      </>
                    )}
                  </Button>

                  {aiError && (
                    <div className="text-red-500 text-sm mt-2">{aiError}</div>
                  )}

                  {aiResponse && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <h4 className="font-semibold text-md mb-2 flex items-center gap-2">
                          <Wand2 className="w-4 h-4" />
                          AI Suggestions
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {aiResponse.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-sm">
                              {aiResponse.highlight.includes(suggestion) ? (
                                <span className="font-bold text-blue-600">
                                  {suggestion}
                                </span>
                              ) : (
                                suggestion
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
