"use client";

import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const publicRoutes = ["/", "/login", "/cadastrar", "/search"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/itinerary/view/") ||
    pathname.startsWith("/search");

  useEffect(() => {
    if (!loading) {
      if (!isPublicRoute && !isAuthenticated) {
        router.push("/login");
      }
    }
  }, [isAuthenticated, loading, isPublicRoute, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!isPublicRoute && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
