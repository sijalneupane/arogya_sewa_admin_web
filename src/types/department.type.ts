export interface Department {
  department_id: string;
  name: string;
  description: string;
  is_active: boolean;
  hospital_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDepartmentData {
  name: string;
  description: string;
  is_active: boolean;
}

export interface UpdateDepartmentData {
  name: string;
  description: string;
  is_active: boolean;
}

export interface DepartmentListResponse {
  message: string;
  data: Department[];
}
