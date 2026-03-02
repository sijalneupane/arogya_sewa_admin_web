import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import HospitalForm from '@/features/super-admin/hospitals/components/HospitalForm';
import { hospitalApi } from '@/api/hospital.api';
import { useAuthStore } from '@/store/auth.store';
import { useEffect } from 'react';

export default function EditHospitalPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role.role === 'SUPER_ADMIN';
  const isHospitalAdmin = user?.role.role === 'HOSPITAL_ADMIN';

  // Check if hospital admin is trying to edit their own hospital
  useEffect(() => {
    if (isHospitalAdmin && user?.hospitalId !== id) {
      navigate('/unauthorized');
    }
    if (!isSuperAdmin && !isHospitalAdmin) {
      navigate('/unauthorized');
    }
  }, [user, id, navigate, isSuperAdmin, isHospitalAdmin]);

  const { data: response, isLoading } = useQuery({
    queryKey: ['hospital', id],
    queryFn: () => hospitalApi.getById(id!),
    enabled: !!id && (isSuperAdmin || (isHospitalAdmin && user?.hospitalId === id)),
  });

  const handleSuccess = () => {
    navigate('/hospitals');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading hospital details...</div>
      </div>
    );
  }

  if (!response?.data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-600">Hospital not found</div>
      </div>
    );
  }

  const hospital = response.data;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/hospitals')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Hospital</h1>
          <p className="text-gray-600 mt-2">Update hospital information and settings</p>
        </div>
      </div>

      <HospitalForm hospital={{ ...hospital, id }} onSuccess={handleSuccess} />
    </div>
  );
}
