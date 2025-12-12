import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number; // 0 a 5
  setRating?: (rating: number) => void; // Opcional, se for read-only não passa
  size?: number;
}

export function StarRating({ rating, setRating, size = 16 }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!setRating}
          onClick={() => setRating && setRating(star)}
          className={`${
            !setRating ? "cursor-default" : "cursor-pointer hover:scale-110"
          } transition-transform`}
        >
          <Star
            size={size}
            className={`${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
