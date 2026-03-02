import { cn } from '@/lib/utils';

export interface AvatarPlaceholderProps {
  name: string;
  imageUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'rounded' | 'square';
  className?: string;
}

/**
 * Reusable Avatar/Logo placeholder component.
 * Displays an image if provided, otherwise shows a placeholder with the first letter of the name.
 * 
 * @param name - Name to extract the first letter from
 * @param imageUrl - URL of the image to display (optional)
 * @param size - Size of the avatar: sm (8), md (10), lg (12) - default: md
 * @param shape - Shape of the avatar: circle, rounded, square - default: circle
 * @param className - Additional CSS classes
 */
export function AvatarPlaceholder({
  name,
  imageUrl,
  size = 'md',
  shape = 'circle',
  className,
}: AvatarPlaceholderProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
  };

  const shapeClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded',
  };

  const getInitial = () => {
    if (!name) return '?';
    const trimmedName = name.trim();
    if (trimmedName.length === 0) return '?';
    return trimmedName.charAt(0).toUpperCase();
  };

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={cn(
          'object-cover',
          sizeClasses[size],
          shapeClasses[shape],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'bg-gray-200 flex items-center justify-center font-semibold text-gray-600',
        sizeClasses[size],
        shapeClasses[shape],
        className
      )}
    >
      {getInitial()}
    </div>
  );
}
