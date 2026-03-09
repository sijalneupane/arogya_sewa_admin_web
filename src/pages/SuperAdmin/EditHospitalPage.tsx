import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import HospitalForm from '@/features/super-admin/hospitals/components/HospitalForm';
import { hospitalApi } from '@/api/hospital.api';
import { useAuthStore } from '@/store/auth.store';
import { useEffect } from 'react';
import { UserRole } from '@/types/auth.types';

export default function EditHospitalPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role.role === UserRole.SUPER_ADMIN;
  const isHospitalAdmin = user?.role.role === UserRole.HOSPITAL_ADMIN;

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
      <Breadcrumb items={[
        { label: 'Hospitals', href: '/hospitals' },
        { label: 'Edit Hospital' }
      ]} />

      <HospitalForm hospital={{ ...hospital, id }} onSuccess={handleSuccess} />
    </div>
  );
}
