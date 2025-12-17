import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const hospitals = [
  { id: 1, name: 'City Hospital', location: 'Kathmandu', beds: 200, status: 'Active', admin: 'John Doe' },
  { id: 2, name: 'General Hospital', location: 'Pokhara', beds: 150, status: 'Active', admin: 'Jane Smith' },
  { id: 3, name: 'Medicare Center', location: 'Lalitpur', beds: 100, status: 'Pending', admin: 'Robert Johnson' },
  { id: 4, name: 'Sunrise Hospital', location: 'Biratnagar', beds: 80, status: 'Active', admin: 'Sarah Williams' },
  { id: 5, name: 'Life Care Hospital', location: 'Birgunj', beds: 120, status: 'Inactive', admin: 'Michael Brown' },
];

export default function HospitalsPage() {
  const [search, setSearch] = useState('');

  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.name.toLowerCase().includes(search.toLowerCase()) ||
    hospital.location.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hospitals</h1>
          <p className="text-gray-600 mt-2">Manage all hospitals in the system</p>
        </div>
        <Link to="/hospitals/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Hospital
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Hospitals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search hospitals..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Hospital Name</th>
                  <th className="text-left py-3 px-4 font-medium">Location</th>
                  <th className="text-left py-3 px-4 font-medium">Total Beds</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Admin</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHospitals.map((hospital) => (
                  <tr key={hospital.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{hospital.name}</td>
                    <td className="py-3 px-4">{hospital.location}</td>
                    <td className="py-3 px-4">{hospital.beds}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(hospital.status)}`}>
                        {hospital.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{hospital.admin}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                        <button className="text-green-600 hover:text-green-800 text-sm">Edit</button>
                        <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}