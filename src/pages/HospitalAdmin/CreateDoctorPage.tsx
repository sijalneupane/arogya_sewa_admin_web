import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { DoctorForm } from '@/features/hospital-admin/doctors/components/DoctorForm';

export default function CreateDoctorPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/doctors');
  };

  return (
    <div className="space-y-4">
      <Breadcrumb items={[
        { label: 'Doctors', href: '/doctors' },
        { label: 'Add New Doctor' }
      ]} />
      {/* <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/doctors')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Doctor</h1>
          <p className="text-gray-600 mt-2">Register a new doctor in your hospital</p>
        </div>
      </div> */}

      <Card>
        {/* <CardHeader>
          <CardTitle>Doctor Information</CardTitle>
        </CardHeader> */}
        <CardContent>
          <DoctorForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}
