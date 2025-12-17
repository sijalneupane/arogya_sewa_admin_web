import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CreateDoctorPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/doctors');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/doctors')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Doctor</h1>
          <p className="text-gray-600 mt-2">Register a new doctor in your hospital</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doctor Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Dr. John Smith"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Specialization</label>
                  <select className="w-full px-3 py-2 border rounded-lg" required>
                    <option value="">Select specialization</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="General">General Medicine</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="doctor@hospital.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="+977 9841000000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Consultation Fee</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="5"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/doctors')}
              >
                Cancel
              </Button>
              <Button type="submit"
              //  loading={loading}
              disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Doctor'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}