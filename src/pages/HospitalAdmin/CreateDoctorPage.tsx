import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DoctorCreateForm } from '@/features/hospital-admin/doctors/components/DoctorCreateForm';
import { CreateDoctorData } from '@/types/doctor.type';
import { doctorApi } from '@/api/doctor.api';
import toast from 'react-hot-toast';

export default function CreateDoctorPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreateDoctorData) => {
    setLoading(true);
    try {
      await doctorApi.create(data);
      toast.success('Doctor created successfully');
      navigate('/doctors');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to create doctor';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/doctors')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Doctors
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Doctor</h1>
          <p className="text-gray-600 mt-2">Register a new doctor in your hospital</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doctor Information</CardTitle>
        </CardHeader>
        <CardContent>
          <DoctorCreateForm onSubmit={handleSubmit} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
