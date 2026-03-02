// src/components/layout/DashboardLayout.tsx
import { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuthStore } from '@/store/auth.store';

export default function DashboardLayout() {
  // const { user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  // Scroll main content area to top on every route change
  useEffect(() => {
    mainContentRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block relative">
          <Sidebar 
            isCollapsed={isSidebarCollapsed} 
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
          />
        </div>

        {/* Main Content */}
        <div ref={mainContentRef} className="flex-1 h-screen overflow-y-auto">
          {/* Header */}
          <Header
            onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            isMobileMenuOpen={isMobileMenuOpen}
          />

          {/* Page Content */}
          <main className="p-2 md:p-4">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Drawer & Overlay */}
      <div className={`lg:hidden fixed inset-0 z-50 ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sidebar Drawer with slide transition */}
        <div
          className={`fixed inset-y-0 left-0 w-56 bg-white shadow-xl transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
           <Sidebar 
             isCollapsed={false} 
             onToggle={() => setIsMobileMenuOpen(false)} 
           />
        </div>
      </div>
    </div>
  );
}