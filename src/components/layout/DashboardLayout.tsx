// src/components/layout/DashboardLayout.tsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuthStore } from '@/store/auth.store';

export default function DashboardLayout() {
  // const { user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar - Hidden on mobile when menu is closed */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          {/* Header */}
          <Header 
            onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            isMobileMenuOpen={isMobileMenuOpen}
          />
          
          {/* Page Content */}
          <main className="p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
      
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}