import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, Calendar, TrendingUp } from 'lucide-react';

export default function SuperAdminDashboard() {
  const stats = [
    { label: 'Total Hospitals', value: '42', icon: Building, change: '+12%', color: 'blue' },
    { label: 'Active Hospitals', value: '38', icon: Building, change: '+8%', color: 'green' },
    { label: 'Total Doctors', value: '1,248', icon: Users, change: '+15%', color: 'purple' },
    { label: 'Appointments Today', value: '342', icon: Calendar, change: '+5%', color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of all hospitals in the system</p>
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
                  <p className="text-sm text-green-600 mt-1 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { hospital: 'City Hospital', action: 'New hospital added', time: '10 min ago' },
              { hospital: 'General Hospital', action: '5 new doctors added', time: '1 hour ago' },
              { hospital: 'Medicare Center', action: 'Updated hospital info', time: '2 hours ago' },
              { hospital: 'Sunrise Hospital', action: 'Status changed to Active', time: '3 hours ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{activity.hospital}</p>
                  <p className="text-sm text-gray-500">{activity.action}</p>
                </div>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}