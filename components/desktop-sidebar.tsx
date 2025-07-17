"use client";
import { Button } from "@/components/ui/button";
import { Home, User, Users, ShoppingBag, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export function DesktopSidebar() {
  const pathname = usePathname();
  const handleLogout = async () => {
    try {
      await signOut({
        redirect: true,
        callbackUrl: "/login",
      });
      toast.success("Come back soon!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong during logout. Please try again.");
    }
  };

  // Condition to not render if the pathname is /login OR /signup
  if (pathname === "/login" || pathname === "/signup") {
    return null; // Do not render the sidebar on login or signup pages
  }

  // Render the sidebar for all other paths
  return (
    <div className="hidden md:block fixed left-0 top-0 h-screen w-64 bg-white border-r pt-20 z-20 overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-2">
          {/* Home Link */}
          <Link href="/" passHref>
            <Button
              variant={pathname === "/" ? "default" : "ghost"}
              className="w-full justify-start gap-3 h-12 text-base"
            >
              <Home className="w-5 h-5" />
              Home
            </Button>
          </Link>

          {/* People Link */}
          <Link href="/people" passHref>
            <Button
              variant={pathname === "/people" ? "default" : "ghost"}
              className="w-full justify-start gap-3 h-12 text-base"
            >
              <Users className="w-5 h-5" />
              People
            </Button>
          </Link>

          {/* Groups Link */}
          <Link href="/groups" passHref>
            <Button
              variant={
                pathname === "/groups" || pathname.startsWith("/group")
                  ? "default"
                  : "ghost"
              }
              className="w-full justify-start gap-3 h-12 text-base"
            >
              <User className="w-5 h-5" />
              Groups
            </Button>
          </Link>

          {/* Shops Link */}
          <Link href="/shop" passHref>
            <Button
              variant={pathname === "/shop" ? "default" : "ghost"}
              className="w-full justify-start gap-3 h-12 text-base"
            >
              <ShoppingBag className="w-5 h-5" />
              Shops
            </Button>
          </Link>

          {/* Settings Link (already using Link) */}
          <Link href="/settings" passHref>
            <Button
              variant={pathname === "/settings" ? "default" : "ghost"}
              className="w-full justify-start gap-3 h-12 text-base"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Button>
          </Link>
        </nav>
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        {/* Logout Button (remains a button as it performs an action, not navigation) */}
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
  );
}
