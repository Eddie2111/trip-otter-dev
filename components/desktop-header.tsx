"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Heart,
  MessageCircle,
  Camera,
  Search,
  User,
  Settings,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import type { Dispatch, SetStateAction } from "react"

interface IDesktopHeader {
  setShowSearchModal: (showSearchModal: boolean) => void
  setCurrentPage: Dispatch<SetStateAction<"feed" | "chat" | "shops" | "shop" | "product" | "groups" | "group" | "people" | "person" | "settings">>
  session: any;
  handleLogout: () => void
}

export function DesktopHeader({setShowSearchModal, setCurrentPage, session, handleLogout}: IDesktopHeader) {
    return (
        <div className="hidden md:block sticky top-0 z-10 bg-white border-b">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 ml-64">
              <Camera className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Tripotter</h1>
            </div>
            <div className="flex-1 max-w-xs mx-8">
              <Button
                variant="outline"
                className="w-full justify-start text-gray-500 bg-transparent"
                onClick={() => setShowSearchModal(true)}
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
            <div className="flex items-center gap-6 mr-8">
              <MessageCircle className="w-6 h-6 cursor-pointer" onClick={() => setCurrentPage("chat")} />
              <Heart className="w-6 h-6 cursor-pointer" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-8 h-8 cursor-pointer">
                    <AvatarImage src={session?.user?.image || "/placeholder.svg?height=32&width=32"} />
                    <AvatarFallback>{session?.user?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="cursor-pointer">
                    <Link href="/person/me" shallow className="cursor-pointer flex">
                      <User className="w-4 h-4 mr-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentPage("settings")} className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    )
}