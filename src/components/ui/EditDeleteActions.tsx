import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';

interface EditDeleteActionsProps {
  editHref?: string;
  onEdit?: () => void;
  editLabel?: string;
  onDelete: () => Promise<void>;
  deleteLabel?: string;
  deleteDialogTitle?: string;
  deleteDialogDescription?: React.ReactNode;
}

export function EditDeleteActions({
  editHref,
  onEdit,
  editLabel = 'Edit',
  onDelete,
  deleteLabel = 'Delete',
  deleteDialogTitle = 'Confirm Delete',
  deleteDialogDescription = 'Are you sure you want to delete this item? This action cannot be undone.',
}: EditDeleteActionsProps) {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClick = () => {
    if (editHref) navigate(editHref);
    else onEdit?.();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleEditClick}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          {editLabel}
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          <Trash2 className="h-4 w-4" />
          {deleteLabel}
        </Button>
      </div>

      <ConfirmationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={deleteDialogTitle}
        description={deleteDialogDescription}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
