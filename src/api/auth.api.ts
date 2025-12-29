import api from './axios';
import { API_ENDPOINTS } from './endpoints';
import { LoginData, LoginResponse, User } from '../types/auth.types';

// export const authApi = {
//   // Login user
//   login: async (data: LoginData): Promise<LoginResponse> => {
//     try {
//       // For now, simulate API response
//       // TODO: Replace with actual API call
//       return await simulateLogin(data);
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Logout user
//   logout: async (): Promise<void> => {
//     try {
//       // Clear token from server if needed
//       // TODO: Replace with actual API call
//       return Promise.resolve();
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get current user profile
//   getProfile: async (): Promise<User> => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No token found');
//       }
      
//       // TODO: Replace with actual API call
//       return await simulateGetProfile(token);
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Refresh token
//   refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
//     try {
//       // TODO: Replace with actual API call
//       return await simulateRefreshToken(refreshToken);
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Forgot password
//   forgotPassword: async (email: string): Promise<{ message: string }> => {
//     try {
//       // TODO: Replace with actual API call
//       return await simulateForgotPassword(email);
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Reset password
//   resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
//     try {
//       // TODO: Replace with actual API call
//       return await simulateResetPassword(token, newPassword);
//     } catch (error) {
//       throw error;
//     }
//   },
// };

// // Mock functions for simulation (remove when connecting to real API)
// const simulateLogin = async (data: LoginData): Promise<LoginResponse> => {
//   // Simulate API delay
//   await new Promise(resolve => setTimeout(resolve, 500));

//   // Determine role based on email
//   let role: 'SUPER_ADMIN' | 'HOSPITAL_ADMIN' = 'HOSPITAL_ADMIN';
//   let hospitalId: string | undefined = undefined;

//   if (data.email.includes('super') || data.email.includes('admin')) {
//     role = 'SUPER_ADMIN';
//   } else {
//     // For hospital admins, assign a mock hospital ID
//     hospitalId = 'hospital_' + Math.random().toString(36).substr(2, 9);
//   }

//   const user: User = {
//     id: 'user_' + Math.random().toString(36).substr(2, 9),
//     email: data.email,
//     name: data.email.split('@')[0].replace('.', ' '),
//     role,
//     hospitalId,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   };

//   return {
//     user,
//     token: 'mock_jwt_token_' + Math.random().toString(36).substr(2, 20),
//   };
// };

// const simulateGetProfile = async (token: string): Promise<User> => {
//   await new Promise(resolve => setTimeout(resolve, 300));

//   // Extract user info from token (in real app, decode JWT)
//   const storedUser = localStorage.getItem('user');
//   if (storedUser) {
//     return JSON.parse(storedUser);
//   }

//   throw new Error('User not found');
// };

// const simulateRefreshToken = async (refreshToken: string): Promise<{ token: string }> => {
//   await new Promise(resolve => setTimeout(resolve, 300));
//   return {
//     token: 'new_mock_jwt_token_' + Math.random().toString(36).substr(2, 20),
//   };
// };

// const simulateForgotPassword = async (email: string): Promise<{ message: string }> => {
//   await new Promise(resolve => setTimeout(resolve, 300));
//   return {
//     message: 'Password reset instructions have been sent to your email.',
//   };
// };

// const simulateResetPassword = async (token: string, newPassword: string): Promise<{ message: string }> => {
//   await new Promise(resolve => setTimeout(resolve, 300));
//   return {
//     message: 'Password has been reset successfully.',
//   };
// };

// // Helper function to decode JWT (for real implementation)
// const decodeJWT = (token: string): any => {
//   try {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split('')
//         .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//         .join('')
//     );
//     return JSON.parse(jsonPayload);
//   } catch (error) {
//     console.error('Error decoding JWT:', error);
//     return null;
//   }
// };

// Real API implementation template (uncomment when backend is ready)
export const authApi = {
  login: (data: LoginData) => 
    api.post<LoginResponse>(API_ENDPOINTS.LOGIN, data),
  
  logout: () => 
    api.post(API_ENDPOINTS.LOGOUT),
  
  getProfile: () => 
    api.get<User>(API_ENDPOINTS.PROFILE),
  
  refreshToken: (refreshToken: string) => 
    api.post<{ token: string }>(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken }),
  
  forgotPassword: (email: string) => 
    api.post<{ message: string }>(API_ENDPOINTS.FORGOT_PASSWORD, { email }),
  
  resetPassword: (token: string, newPassword: string) => 
    api.post<{ message: string }>(API_ENDPOINTS.RESET_PASSWORD, { token, newPassword }),
};
