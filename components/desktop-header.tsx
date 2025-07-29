"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageCircle,
  Camera,
  Search,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { NotificationContainer } from "./notification-container";

interface IDesktopHeader {
  setShowSearchModal: (showSearchModal: boolean) => void;
  session: any;
  handleLogout: () => void;
  userData: any;
}

export function DesktopHeader({
  setShowSearchModal,
  session,
  handleLogout,
  userData,
}: IDesktopHeader) {
  return (
    <div className="hidden md:block sticky top-0 z-10 bg-white border-b dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-full mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 ml-64">
            <Camera className="w-8 h-8 text-gray-900 dark:text-gray-100" />
            {/* Link for the home/dashboard page */}
            <Link href="/" passHref>
              <h1 className="text-2xl font-bold cursor-pointer text-gray-900 dark:text-gray-100">
                Tripotter
              </h1>
            </Link>
          </div>
          <div className="flex-1 max-w-xs mx-8">
            <Button
              variant="outline"
              className="w-full justify-start text-gray-500 bg-transparent dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              onClick={() => setShowSearchModal(true)}
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
          <div className="flex items-center gap-6 mr-8">
            {/* Link for the chat page */}
            <Link href="/chat" passHref>
              <MessageCircle className="w-6 h-6 cursor-pointer text-gray-900 dark:text-gray-100" />
            </Link>
            {/* Assuming Heart icon might also lead to a page, e.g., /likes or /notifications */}
            {/* If it's just an icon without navigation, it can remain as is or be wrapped in a Link if needed */}
            <NotificationContainer />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-8 h-8 cursor-pointer dark:bg-gray-700 dark:text-gray-300">
                  <AvatarImage
                    src={userData?.profileImage ?? userData?.image}
                  />
                  <AvatarFallback>
                    {session?.user?.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 dark:bg-gray-800 dark:border-gray-700"
              >
                <DropdownMenuItem className="cursor-pointer dark:text-gray-100 dark:hover:bg-gray-700">
                  {/* Existing Link for Profile */}
                  <Link
                    href="/person/me"
                    shallow
                    className="cursor-pointer flex w-full"
                  >
                    <User className="w-4 h-4 mr-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {/* Link for the Settings page */}
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  <Link href="/settings" passHref className="flex w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 dark:text-red-400 dark:hover:bg-gray-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
