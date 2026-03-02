import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
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
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/hospitals')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Hospital</h1>
          <p className="text-gray-600 mt-2">Register a new hospital with complete details and admin credentials</p>
        </div>
      </div>

      <HospitalForm onSuccess={handleSuccess} />
    </div>
  );
}