import { useParams, useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EditDeleteActions } from '@/components/ui/EditDeleteActions';
import { useHospitalById } from '@/features/super-admin/hospitals/hooks/useHospitalById';
import HospitalDetailView from '@/features/super-admin/hospitals/components/HospitalDetailView';
import { hospitalApi } from '@/api/hospital.api';

export default function HospitalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hospital, loading, error, refetch } = useHospitalById(id);

  const handleDelete = async () => {
    if (!hospital) return;
    await hospitalApi.delete(hospital.hospital_id);
    toast.success('Hospital deleted successfully');
    navigate('/hospitals');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="h-12 w-12 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading hospital details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-red-600 font-semibold">Error loading hospital details</p>
            <p className="text-red-500 text-sm mt-1">{error}</p>
            <Button
              variant="outline"
              className="mt-3 text-red-600 border-red-300 hover:bg-red-100"
              onClick={refetch}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hospital) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-gray-600">Hospital not found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{hospital.name}</h1>
          <p className="text-gray-600 mt-1">Hospital Details</p>
        </div>
        <EditDeleteActions
          editHref={`/hospitals/edit/${hospital.hospital_id}`}
          editLabel="Edit Hospital"
          onDelete={handleDelete}
          deleteLabel="Delete Hospital"
          deleteDialogTitle="Delete Hospital"
          deleteDialogDescription={
            <>Are you sure you want to delete <strong>{hospital.name}</strong>? This action cannot be undone and will remove all associated data.</>
          }
        />
      </div>

      {/* Hospital Details */}
      <HospitalDetailView hospital={hospital} />
    </div>
  );
}
