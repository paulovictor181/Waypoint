import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import { RightNavBar } from "@/components/rightNavBar";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <MapPin className="h-8 w-8 text-orange-500" />
      <span className="text-2xl font-bold text-gray-900">Waypoint</span>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen w-full text-gray-100">
        <RightNavBar />
        <div>
            Page
        </div>
    </div>
  );
}
