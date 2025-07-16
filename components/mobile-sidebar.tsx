"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Home, Users, Boxes, Settings, LogOut, Menu, Router } from "lucide-react"
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"
import { signOut } from "next-auth/react"
import { useRouter } from "next/router"

export function Sidebar() {
  const router = useRouter();
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()
  const sidebarRef = useRef<HTMLDivElement>(null)

  const toggleSidebar = () => {
    setOpen((prev) => !prev)
  }

  const handleLogOut = async () => { 
    try {
      await signOut({
        redirect: true,
        callbackUrl: "/login",
      });
    } catch (err) {
      router.push("/login")
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <>
      <Button variant="outline" size="icon" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          ref={sidebarRef}
          side="left"
          className={`w-full max-w-xs sm:max-w-md ${
            isMobile ? "inset-0 h-full w-full" : ""
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="mb-8 mt-4 flex items-center gap-2 px-4 text-xl font-bold">
              🦦 Trip Otter
            </div>
            <nav className="flex-1 space-y-2 px-2">
              <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary">
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link href="/people" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary">
                <Users className="h-4 w-4" />
                People
              </Link>
              <Link href="/groups" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary">
                <Boxes className="h-4 w-4" />
                Groups
              </Link>
              <Link href="/shops" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary">
                <Boxes className="h-4 w-4" />
                Shops
              </Link>
              <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <Button onClick={ ()=>handleLogOut()} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </nav>
            <div className="mt-auto p-4 text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Trip Otter
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
};
