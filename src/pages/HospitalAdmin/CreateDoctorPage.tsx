import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Doctor</h1>
        <p className="text-gray-600 mt-2">Register a new doctor in your hospital</p>
      </div>

      <Card>
        <CardContent>
          <DoctorCreateForm onSubmit={handleSubmit} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
