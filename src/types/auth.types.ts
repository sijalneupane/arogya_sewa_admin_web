export type UserRole = "SUPER_ADMIN" | "HOSPITAL_ADMIN" | "DOCTOR";

export interface Role {
  role: UserRole;
  description: string;
}
export interface User {
  id: string;
  email: string;
  name: string;
  phone_number: string;
  role: Role;
  is_active: boolean;
  hospitalId?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data:LoginResponseData;
}
export interface LoginResponseData{
    access_token: string;
    refresh_token: string;
    user: User;
}

