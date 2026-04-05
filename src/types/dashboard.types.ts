export type TrendType = 'INCREASED' | 'DECREASED' | 'NO_CHANGE';

export interface MonthlyTrend {
  last_month: number;
  this_month: number;
  percentage_rise: number;
  trend_type: TrendType;
}

export interface SuperAdminDashboardSummary {
  total_users: number;
  total_doctors: number;
  total_hospitals: number;
  total_patients: number;
  total_appointments: number;
  appointments_monthly: MonthlyTrend;
  doctors_monthly: MonthlyTrend;
  hospitals_monthly: MonthlyTrend;
  total_paid_amount: number;
  available_doctors_today: number;
}

export interface HospitalAdminDashboardSummary {
  total_doctors: number;
  total_appointments: number;
  total_revenue: number;
  total_departments: number;
  appointments_monthly: MonthlyTrend;
  doctors_monthly: MonthlyTrend;
}
