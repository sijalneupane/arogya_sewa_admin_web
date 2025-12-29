import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Clock, TrendingUp } from 'lucide-react';

export default function HospitalAdminDashboard() {
  const stats = [
    { label: 'Total Doctors', value: '24', icon: Users, change: '+3', color: 'blue' },
    { label: "Today's Appointments", value: '42', icon: Calendar, change: '+8', color: 'green' },
    { label: 'Pending Appointments', value: '12', icon: Clock, change: '-2', color: 'yellow' },
    { label: 'Completed Today', value: '30', icon: TrendingUp, change: '+5', color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hospital Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'} mt-1`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { patient: 'John Doe', doctor: 'Dr. Smith', time: '9:00 AM', status: 'Confirmed' },
                { patient: 'Jane Smith', doctor: 'Dr. Johnson', time: '10:30 AM', status: 'Confirmed' },
                { patient: 'Robert Brown', doctor: 'Dr. Williams', time: '11:45 AM', status: 'Pending' },
                { patient: 'Sarah Wilson', doctor: 'Dr. Davis', time: '2:00 PM', status: 'Confirmed' },
                { patient: 'Mike Taylor', doctor: 'Dr. Miller', time: '3:30 PM', status: 'Cancelled' },
              ].map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{appointment.patient}</p>
                    <p className="text-sm text-gray-500">with {appointment.doctor}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{appointment.time}</p>
                    <span className={`text-sm px-2 py-1 rounded ${
                      appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <p className="font-medium">Add New Doctor</p>
                <p className="text-sm text-gray-600">Register a new doctor</p>
              </button>
              <button className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <p className="font-medium">View Appointments</p>
                <p className="text-sm text-gray-600">See all appointments</p>
              </button>
              <button className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <p className="font-medium">Generate Report</p>
                <p className="text-sm text-gray-600">Monthly statistics</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}