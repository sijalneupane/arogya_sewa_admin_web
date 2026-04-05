import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, Calendar, TrendingUp, TrendingDown, Minus, DollarSign, UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { dashboardApi } from '@/api/dashboard.api';
import type { SuperAdminDashboardSummary, MonthlyTrend } from '@/types/dashboard.types';

const getTrendIcon = (trendType: string) => {
  switch (trendType) {
    case 'INCREASED':
      return TrendingUp;
    case 'DECREASED':
      return TrendingDown;
    default:
      return Minus;
  }
};

const getTrendColor = (trendType: string) => {
  switch (trendType) {
    case 'INCREASED':
      return 'text-green-600';
    case 'DECREASED':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string;
  trend?: MonthlyTrend;
  showTrend?: boolean;
}

function StatCard({ label, value, icon: Icon, iconColor, trend, showTrend = true }: StatCardProps) {
  const TrendIcon = trend ? getTrendIcon(trend.trend_type) : TrendingUp;
  const trendColor = trend ? getTrendColor(trend.trend_type) : 'text-gray-600';

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <p className="text-2xl font-bold">{typeof value === 'number' ? formatNumber(value) : value}</p>
            {showTrend && trend && (
              <p className={`text-sm ${trendColor} mt-2 flex items-center gap-1`}>
                <TrendIcon className="h-4 w-4" />
                {trend.percentage_rise > 0 ? '+' : ''}{trend.percentage_rise}% from last month
              </p>
            )}
          </div>
          <div className={`p-4 rounded-full ${iconColor}`}>
            <Icon className="h-7 w-7" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SuperAdminDashboard() {
  const [data, setData] = useState<SuperAdminDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dashboardApi.getSuperAdminSummary();
        setData(response);
      } catch (err: any) {
        console.error('Failed to fetch super admin dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Loading...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-red-600 mt-2">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { 
      label: 'Total Hospitals', 
      value: data.total_hospitals, 
      icon: Building, 
      iconColor: 'bg-blue-100',
      trend: data.hospitals_monthly 
    },
    { 
      label: 'Total Doctors', 
      value: data.total_doctors, 
      icon: Users, 
      iconColor: 'bg-purple-100',
      trend: data.doctors_monthly 
    },
    { 
      label: 'Total Patients', 
      value: data.total_patients, 
      icon: UserCheck, 
      iconColor: 'bg-green-100'
    },
    { 
      label: 'Total Appointments', 
      value: data.total_appointments, 
      icon: Calendar, 
      iconColor: 'bg-orange-100',
      trend: data.appointments_monthly 
    },
    { 
      label: 'Total Revenue', 
      value: `$${data.total_paid_amount.toLocaleString()}`, 
      icon: DollarSign, 
      iconColor: 'bg-emerald-100',
      showTrend: false
    },
    { 
      label: 'Available Doctors Today', 
      value: data.available_doctors_today, 
      icon: UserCheck, 
      iconColor: 'bg-cyan-100',
      showTrend: false
    },
  ];

  const AppointmentsTrendIcon = getTrendIcon(data.appointments_monthly.trend_type);
  const DoctorsTrendIcon = getTrendIcon(data.doctors_monthly.trend_type);
  const HospitalsTrendIcon = getTrendIcon(data.hospitals_monthly.trend_type);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of all hospitals, doctors, and patients in the system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            iconColor={stat.iconColor}
            trend={stat.trend}
            showTrend={stat.showTrend}
          />
        ))}
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Appointments</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{data.appointments_monthly.this_month}</p>
                    <p className="text-sm text-gray-500">This month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{data.appointments_monthly.last_month}</p>
                    <p className="text-sm text-gray-500">Last month</p>
                  </div>
                </div>
                <p className={`text-sm ${getTrendColor(data.appointments_monthly.trend_type)} flex items-center gap-1`}>
                  <AppointmentsTrendIcon className="h-4 w-4" />
                  {data.appointments_monthly.percentage_rise > 0 ? '+' : ''}{data.appointments_monthly.percentage_rise}%
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Doctors</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{data.doctors_monthly.this_month}</p>
                    <p className="text-sm text-gray-500">This month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{data.doctors_monthly.last_month}</p>
                    <p className="text-sm text-gray-500">Last month</p>
                  </div>
                </div>
                <p className={`text-sm ${getTrendColor(data.doctors_monthly.trend_type)} flex items-center gap-1`}>
                  <DoctorsTrendIcon className="h-4 w-4" />
                  {data.doctors_monthly.percentage_rise > 0 ? '+' : ''}{data.doctors_monthly.percentage_rise}%
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Hospitals</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{data.hospitals_monthly.this_month}</p>
                    <p className="text-sm text-gray-500">This month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{data.hospitals_monthly.last_month}</p>
                    <p className="text-sm text-gray-500">Last month</p>
                  </div>
                </div>
                <p className={`text-sm ${getTrendColor(data.hospitals_monthly.trend_type)} flex items-center gap-1`}>
                  <HospitalsTrendIcon className="h-4 w-4" />
                  {data.hospitals_monthly.percentage_rise > 0 ? '+' : ''}{data.hospitals_monthly.percentage_rise}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}