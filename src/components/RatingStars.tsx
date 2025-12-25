import { useState } from "react";

interface RatingStarsProps {
  rating: number;
  onChange: (rating: number) => void;
  onHoverChange?: (rating: number) => void;
  readonly?: boolean;
}

export function RatingStars({ rating, onChange, onHoverChange, readonly = false }: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (star: number) => {
    if (!readonly) {
      setHoverRating(star);
      onHoverChange?.(star);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
      onHoverChange?.(0);
    }
  };

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          className={`relative p-1 transition-all duration-200 transform ${!readonly ? "hover:scale-125 active:scale-95" : ""
            }`}
          disabled={readonly}
        >
          <svg
            className={`w-8 h-8 ${(hoverRating || rating) >= star
              ? "text-yellow-400 fill-current drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
              : "text-gray-600 fill-transparent stroke-current"
              } transition-colors duration-200`}
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>

          {/* Subtle glow for selected stars */}
          {rating >= star && (
            <div className="absolute inset-0 bg-yellow-400/10 blur-xl rounded-full -z-10" />
          )}
        </button>
      ))}
    </div>
  );
}
