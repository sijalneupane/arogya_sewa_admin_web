import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/api/auth.api';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { LoginData } from '@/features/auth/schemas/auth.schema';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (data: LoginData) => {
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login(data);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">ArogyaSewa</h1>
          <p className="text-gray-600 mt-2 text-lg">Hospital Management System</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Login Form */}
          <div>
            <LoginForm 
              onSubmit={handleLogin}
              loading={loading}
              error={error}
              showDemoCredentials={true}
            />
          </div>
          
          {/* Welcome Section */}
          <div className="bg-blue-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Streamline Your Hospital Management
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm">✓</span>
                </div>
                <span>Manage multiple hospitals from one dashboard</span>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm">✓</span>
                </div>
                <span>Track appointments and doctor schedules</span>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm">✓</span>
                </div>
                <span>Generate reports and analytics</span>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm">✓</span>
                </div>
                <span>Secure and role-based access control</span>
              </li>
            </ul>
            
            <div className="mt-8 p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> This is a demo system. Use the demo credentials 
                to explore different roles and features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}