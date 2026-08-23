import { Star } from 'lucide-react';

// Mirrors .stars: filled = var(--star) #f59e0b, empty = var(--border2) #c4d7e3 — same on light and dark backgrounds
const Stars = ({ rating, size = 16, className = '' }) => {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && hasHalf);
        return (
          <Star
            key={i}
            size={size}
            className={filled ? 'fill-[#f59e0b] text-[#f59e0b]' : 'fill-transparent text-[#c4d7e3]'}
            strokeWidth={1.5}
          />
        );
      })}
    </span>
  );
};

export default Stars;
