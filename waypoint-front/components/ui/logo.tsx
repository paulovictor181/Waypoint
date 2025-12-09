import { MapPin } from "lucide-react";


function Logo() {
  return (
    <div className="flex items-center justify-center gap-2 m-6">
      <MapPin className="h-10 w-10 text-orange-500" />
      <span className="text-3xl font-bold text-gray-900">Waypoint</span>
    </div>
  );
}

export default Logo;