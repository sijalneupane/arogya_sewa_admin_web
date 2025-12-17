export type UserRole = "SUPER_ADMIN" | "HOSPITAL_ADMIN" | "DOCTOR";

export interface Role {
  role: UserRole;
  description: string;
}
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  hospitalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
