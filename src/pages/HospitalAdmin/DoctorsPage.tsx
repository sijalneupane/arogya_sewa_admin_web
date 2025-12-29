import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const doctors = [
  { id: 1, name: 'Dr. John Smith', specialization: 'Cardiology', email: 'john@hospital.com', phone: '+977 9841000001', status: 'Active' },
  { id: 2, name: 'Dr. Jane Doe', specialization: 'Neurology', email: 'jane@hospital.com', phone: '+977 9841000002', status: 'Active' },
  { id: 3, name: 'Dr. Robert Johnson', specialization: 'Orthopedics', email: 'robert@hospital.com', phone: '+977 9841000003', status: 'Active' },
  { id: 4, name: 'Dr. Sarah Williams', specialization: 'Pediatrics', email: 'sarah@hospital.com', phone: '+977 9841000004', status: 'On Leave' },
  { id: 5, name: 'Dr. Michael Brown', specialization: 'Dermatology', email: 'michael@hospital.com', phone: '+977 9841000005', status: 'Active' },
];

export default function DoctorsPage() {
  const [search, setSearch] = useState('');

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(search.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-600 mt-2">Manage doctors in your hospital</p>
        </div>
        <Link to="/doctors/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Doctor
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{doctor.name}</h3>
                      <p className="text-gray-600">{doctor.specialization}</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 mr-2" />
                          {doctor.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-2" />
                          {doctor.phone}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doctor.status)}`}>
                      {doctor.status}
                    </span>
                  </div>
                  <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                    <button className="text-green-600 hover:text-green-800 text-sm">Edit</button>
                    <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}