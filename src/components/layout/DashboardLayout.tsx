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
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 h-screen overflow-y-auto">
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
      
      {/* Mobile Drawer & Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden relative z-50">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar Drawer */}
          <div className="fixed inset-y-0 left-0 shadow-xl">
             <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}