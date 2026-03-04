import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  isActive: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
  className?: string;
}

/**
 * Reusable StatusBadge component for displaying active/inactive status.
 * 
 * @param isActive - Whether the item is active
 * @param activeLabel - Label for active state (default: "Active")
 * @param inactiveLabel - Label for inactive state (default: "Inactive")
 * @param className - Additional CSS classes
 */
export function StatusBadge({
  isActive,
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium',
        isActive
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-gray-600',
        className
      )}
    >
      {isActive ? activeLabel : inactiveLabel}
    </span>
  );
}
