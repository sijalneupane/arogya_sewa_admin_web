import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import HospitalForm from '@/features/super-admin/hospitals/components/HospitalForm';
import { useAuthStore } from '@/store/auth.store';
import { useEffect } from 'react';
import { UserRole } from '@/types/auth.types';

export default function CreateHospitalPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Only Super Admin can create hospitals
  useEffect(() => {
    if (user?.role.role !== UserRole.SUPER_ADMIN) {
      navigate('/unauthorized');
    }
  }, [user, navigate]);

  const handleSuccess = () => {
    navigate('/hospitals');
  };

  if (user?.role.role !== UserRole.SUPER_ADMIN) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Breadcrumb items={[
        { label: 'Hospitals', href: '/hospitals' },
        { label: 'Add New Hospital' }
      ]} />

      <HospitalForm onSuccess={handleSuccess} />
    </div>
  );
}