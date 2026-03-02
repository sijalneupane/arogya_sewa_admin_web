import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export interface ActionMenuProps {
  viewUrl?: string;
  editUrl?: string;
  onDelete?: () => void;
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
}

/**
 * Reusable ActionMenu component for table action columns.
 * Provides View, Edit, and Delete actions with consistent styling.
 * 
 * @param viewUrl - URL to navigate to for viewing (uses Link component)
 * @param editUrl - URL to navigate to for editing (uses Link component)
 * @param onDelete - Callback function when delete is clicked
 * @param showView - Whether to show the View action (default: true)
 * @param showEdit - Whether to show the Edit action (default: true)
 * @param showDelete - Whether to show the Delete action (default: false)
 * @param viewLabel - Custom label for View action (default: "View")
 * @param editLabel - Custom label for Edit action (default: "Edit")
 * @param deleteLabel - Custom label for Delete action (default: "Delete")
 */
export function ActionMenu({
  viewUrl,
  editUrl,
  onDelete,
  showView = true,
  showEdit = true,
  showDelete = false,
  viewLabel = 'View',
  editLabel = 'Edit',
  deleteLabel = 'Delete',
}: ActionMenuProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      {showView && viewUrl && (
        <Link
          to={viewUrl}
          className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1"
        >
          <Eye className="h-4 w-4" />
          {viewLabel}
        </Link>
      )}

      {showEdit && editUrl && (
        <Link
          to={editUrl}
          className="text-green-600 hover:text-green-800 text-sm inline-flex items-center gap-1"
        >
          <Pencil className="h-4 w-4" />
          {editLabel}
        </Link>
      )}

      {showDelete && onDelete && (
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-800 text-sm inline-flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          {deleteLabel}
        </button>
      )}
    </div>
  );
}
