interface RatingStarsProps {
  rating: number;
  onChange: (rating: number) => void;
  readonly?: boolean;
}

export function RatingStars({ rating, onChange, readonly = false }: RatingStarsProps) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange(star)}
          className={`text-2xl transition-colors ${
            star <= rating ? "text-yellow-400" : "text-gray-600"
          } ${!readonly && "hover:text-yellow-300"}`}
          disabled={readonly}
        >
          ⭐
        </button>
      ))}
    </div>
  );
}
