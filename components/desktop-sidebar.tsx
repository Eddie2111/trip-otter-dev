"use client";
import { Button } from "@/components/ui/button"
import {
  Home,
  User,
  Users,
  ShoppingBag,
  Settings,
  LogOut,
} from "lucide-react"
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link"
import type {Dispatch, SetStateAction} from "react"
import { toast } from "sonner";

interface IDesktopSidebarProps {
  setCurrentPage: Dispatch<SetStateAction<"feed" | "chat" | "shops" | "shop" | "product" | "groups" | "group" | "people" | "person" | "settings">>
  currentPage: string
}

export function DesktopSidebar({ setCurrentPage, currentPage }: IDesktopSidebarProps) {
  const router = useRouter();
    const handleLogout = async () => {
        try {
          await signOut({
            redirect: false,
            callbackUrl: "/",
          })
          toast.success("Come back soon!")
          setCurrentPage("feed")
        } catch (error) {
          console.error("Logout error:", error)
          toast.error("Something went wrong during logout. Please try again.")
        }
      }
    return (
        <div className="hidden md:block fixed left-0 top-0 h-screen w-64 bg-white border-r pt-20 z-20 overflow-y-auto">
            <div className="p-4">
            <nav className="space-y-2">
                <Button
                variant={currentPage === "feed" ? "default" : "ghost"}
                className="w-full justify-start gap-3 h-12 text-base"
                onClick={() => router.push("/")}
                >
                <Home className="w-5 h-5" />
                Home
                </Button>
                <Button
                variant={currentPage === "people" ? "default" : "ghost"}
                className="w-full justify-start gap-3 h-12 text-base"
                onClick={() => router.push("/people")}
                >
                <Users className="w-5 h-5" />
                People
                </Button>
                <Button
                variant={currentPage === "groups" || currentPage === "group" ? "default" : "ghost"}
                className="w-full justify-start gap-3 h-12 text-base"
                onClick={() => router.push("/groups")}
                >
                <User className="w-5 h-5" />
                Groups
                </Button>
                <Button
                variant={currentPage === "shops" ? "default" : "ghost"}
                className="w-full justify-start gap-3 h-12 text-base"
                onClick={() => router.push("/shop")}
                >
                <ShoppingBag className="w-5 h-5" />
                Shops
                </Button>
                <Link href="/settings">
                <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-base">
                    <Settings className="w-5 h-5" />
                    Settings
                </Button>
                </Link>
            </nav>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
            <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-12 text-base text-red-600"
                onClick={handleLogout}
            >
                <LogOut className="w-5 h-5" />
                Logout
            </Button>
            </div>
        </div>
    )
}