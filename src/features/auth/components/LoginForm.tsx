import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginData } from '../schemas/auth.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginFormProps {
  onSubmit: (data: LoginData) => Promise<void> | void;
  loading?: boolean;
  error?: string;
  showDemoCredentials?: boolean;
}

export function LoginForm({ 
  onSubmit, 
  loading = false, 
  error,
  showDemoCredentials = true 
}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              {...register('email')}
              disabled={loading}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          
          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              disabled={loading}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          
          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
            
            variant={'default'}
            // loading={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
          
          {/* Demo Credentials */}
          {showDemoCredentials && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</p>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Super Admin:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">super@admin.com</code>
                </div>
                <div className="flex justify-between">
                  <span>Hospital Admin:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">hospital@admin.com</code>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Password can be anything for demo
                </p>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}