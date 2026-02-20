import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { useHospitalById } from '@/features/super-admin/hospitals/hooks/useHospitalById';
import HospitalDetailView from '@/features/super-admin/hospitals/components/HospitalDetailView';
import { hospitalApi } from '@/api/hospital.api';

export default function HospitalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hospital, loading, error } = useHospitalById(id);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!hospital) return;
    
    setIsDeleting(true);
    try {
      await hospitalApi.delete(hospital.hospital_id);
      toast.success('Hospital deleted successfully');
      navigate('/hospitals');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete hospital');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/hospitals')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Hospitals
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="inline-block animate-spin">
                <div className="h-12 w-12 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
              </div>
              <p className="text-gray-600 mt-4">Loading hospital details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/hospitals')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Hospitals
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-600 p-4 bg-red-50 rounded-lg">
              <p className="font-semibold">Error loading hospital details</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/hospitals')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Hospitals
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-gray-600">Hospital not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate('/hospitals')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Hospitals
        </Button>
        <div className="flex gap-3">
          <Link to={`/hospitals/edit/${hospital.hospital_id}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Hospital
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete Hospital
          </Button>
        </div>
      </div>

      {/* Hospital Details */}
      <HospitalDetailView hospital={hospital} />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Hospital"
        description={
          <>Are you sure you want to delete <strong>{hospital.name}</strong>? This action cannot be undone and will remove all associated data.</>
        }
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
