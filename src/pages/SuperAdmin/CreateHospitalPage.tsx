import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CreateHospitalPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/hospitals');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/hospitals')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Hospital</h1>
          <p className="text-gray-600 mt-2">Register a new hospital with admin credentials</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hospital Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hospital Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Hospital Details</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Hospital Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter hospital name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter address"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="State"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Admin Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Hospital Admin</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Admin Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter admin name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Admin Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter admin email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/hospitals')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Hospital'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}