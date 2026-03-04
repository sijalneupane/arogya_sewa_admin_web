import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface CardActionMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  showEdit?: boolean;
  showDelete?: boolean;
  editLabel?: string;
  deleteLabel?: string;
}

/**
 * Reusable CardActionMenu component for card-based layouts.
 * Provides Edit and Delete actions with button styling.
 * Actions are justified to the right bottom end of the card.
 *
 * @param onEdit - Callback function when edit is clicked
 * @param onDelete - Callback function when delete is clicked
 * @param showEdit - Whether to show the Edit action (default: true)
 * @param showDelete - Whether to show the Delete action (default: true)
 * @param editLabel - Custom label for Edit action (default: "Edit")
 * @param deleteLabel - Custom label for Delete action (default: "Delete")
 */
export function CardActionMenu({
  onEdit,
  onDelete,
  showEdit = true,
  showDelete = true,
  editLabel = 'Edit',
  deleteLabel = 'Delete',
}: CardActionMenuProps) {
  return (
    <div className="flex justify-end gap-2 select-none">
      {showEdit && onEdit && (
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          onMouseDown={(e) => e.preventDefault()}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 border-blue-200 select-none"
        >
          <Edit2 className="h-4 w-4 mr-1" />
          {editLabel}
        </Button>
      )}

      {showDelete && onDelete && (
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          onMouseDown={(e) => e.preventDefault()}
          className="text-red-600 hover:text-red-800 hover:bg-red-50 border-red-200 select-none"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {deleteLabel}
        </Button>
      )}
    </div>
  );
}
