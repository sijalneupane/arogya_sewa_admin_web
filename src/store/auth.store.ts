import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from '../types/auth.types';

interface AuthStore extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (user, token) => {
        localStorage.setItem('token', token);
        set({ 
          user, 
          token, 
          isAuthenticated: true 
        });
      },
      
      logout: () => {
        localStorage.removeItem('token');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      },
      
      setUser: (user) => set({ user }),
      
      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);