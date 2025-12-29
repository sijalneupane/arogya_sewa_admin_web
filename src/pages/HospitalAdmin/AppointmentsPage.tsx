import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const appointments = [
  { id: 1, patient: 'John Doe', doctor: 'Dr. Smith', date: '2024-01-15', time: '9:00 AM', status: 'Confirmed' },
  { id: 2, patient: 'Jane Smith', doctor: 'Dr. Johnson', date: '2024-01-15', time: '10:30 AM', status: 'Confirmed' },
  { id: 3, patient: 'Robert Brown', doctor: 'Dr. Williams', date: '2024-01-15', time: '11:45 AM', status: 'Pending' },
  { id: 4, patient: 'Sarah Wilson', doctor: 'Dr. Davis', date: '2024-01-16', time: '2:00 PM', status: 'Confirmed' },
  { id: 5, patient: 'Mike Taylor', doctor: 'Dr. Miller', date: '2024-01-16', time: '3:30 PM', status: 'Cancelled' },
  { id: 6, patient: 'Emily Clark', doctor: 'Dr. Anderson', date: '2024-01-17', time: '4:15 PM', status: 'Confirmed' },
];

export default function AppointmentsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = apt.patient.toLowerCase().includes(search.toLowerCase()) ||
                         apt.doctor.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || apt.status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-600 mt-2">Manage patient appointments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Patient</th>
                  <th className="text-left py-3 px-4 font-medium">Doctor</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Time</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{apt.patient}</td>
                    <td className="py-3 px-4">{apt.doctor}</td>
                    <td className="py-3 px-4">{apt.date}</td>
                    <td className="py-3 px-4">{apt.time}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                        <button className="text-green-600 hover:text-green-800 text-sm">Confirm</button>
                        <button className="text-red-600 hover:text-red-800 text-sm">Cancel</button>
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