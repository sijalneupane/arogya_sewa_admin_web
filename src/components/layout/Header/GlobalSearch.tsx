import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  Hospital,
  Plus,
  UserCircle,
  Settings,
  Stethoscope,
  CalendarDays,
  UserPlus,
  Users,
  Building2,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@/types/auth.types';

interface NavItem {
  label: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRole[]; // empty = all roles
  keywords: string[];
}

const ALL_ROLES = [UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN];

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    description: 'Overview and statistics',
    path: '/dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />,
    roles: ALL_ROLES,
    keywords: ['dashboard', 'home', 'overview', 'stats', 'statistics'],
  },
  {
    label: 'Hospitals',
    description: 'Manage all hospitals',
    path: '/hospitals',
    icon: <Hospital className="h-4 w-4" />,
    roles: [UserRole.SUPER_ADMIN],
    keywords: ['hospitals', 'hospital', 'list', 'manage'],
  },
  {
    label: 'Users',
    description: 'View and manage all users',
    path: '/users',
    icon: <Users className="h-4 w-4" />,
    roles: [UserRole.SUPER_ADMIN],
    keywords: ['users', 'user', 'list', 'manage', 'people'],
  },
  {
    label: 'Add Hospital',
    description: 'Register a new hospital',
    path: '/hospitals/create',
    icon: <Plus className="h-4 w-4" />,
    roles: [UserRole.SUPER_ADMIN],
    keywords: ['add hospital', 'create hospital', 'new hospital', 'register hospital'],
  },
  {
    label: 'Doctors',
    description: 'Manage doctors in your hospital',
    path: '/doctors',
    icon: <Stethoscope className="h-4 w-4" />,
    roles: [UserRole.HOSPITAL_ADMIN],
    keywords: ['doctors', 'doctor', 'staff', 'physician'],
  },
  {
    label: 'Add Doctor',
    description: 'Register a new doctor',
    path: '/doctors/create',
    icon: <UserPlus className="h-4 w-4" />,
    roles: [UserRole.HOSPITAL_ADMIN],
    keywords: ['add doctor', 'create doctor', 'new doctor', 'register doctor'],
  },
  {
    label: 'Appointments',
    description: 'View and manage appointments',
    path: '/appointments',
    icon: <CalendarDays className="h-4 w-4" />,
    roles: [UserRole.HOSPITAL_ADMIN],
    keywords: ['appointments', 'appointment', 'schedule', 'booking', 'calendar'],
  },
  {
    label: 'Departments',
    description: 'Manage departments in your hospital',
    path: '/departments',
    icon: <Building2 className="h-4 w-4" />,
    roles: [UserRole.HOSPITAL_ADMIN],
    keywords: ['departments', 'department', 'dept', 'specialty', 'specialization'],
  },
  {
    label: 'Profile',
    description: 'View and edit your profile',
    path: '/profile',
    icon: <UserCircle className="h-4 w-4" />,
    roles: ALL_ROLES,
    keywords: ['profile', 'account', 'me', 'user', 'personal'],
  },
  {
    label: 'Settings',
    description: 'Application settings',
    path: '/settings',
    icon: <Settings className="h-4 w-4" />,
    roles: ALL_ROLES,
    keywords: ['settings', 'preferences', 'config', 'configuration'],
  },
];

export default function GlobalSearch() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const role = user?.role?.role ?? '';

  const filtered =
    query.trim() === ''
      ? []
      : NAV_ITEMS.filter((item) => {
          if (!item.roles.includes(role)) return false;
          const q = query.toLowerCase();
          return (
            item.label.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.keywords.some((k) => k.includes(q))
          );
        });

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (path: string) => {
    navigate(path);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || filtered.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(filtered[activeIndex].path);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search pages..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-4 py-2 w-64 lg:w-80 border border-gray-300 focus:border-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>

      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg border shadow-lg z-50 overflow-hidden">
          {filtered.map((item, index) => (
            <button
              key={item.path}
              onMouseDown={() => handleSelect(item.path)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                index === activeIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <span
                className={`shrink-0 ${
                  index === activeIndex ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className={`text-sm font-medium ${index === activeIndex ? 'text-blue-700' : 'text-gray-800'}`}>
                  {item.label}
                </p>
                <p className="text-xs text-gray-500 truncate">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {open && query.trim() !== '' && filtered.length === 0 && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg border shadow-lg z-50 px-4 py-3">
          <p className="text-sm text-gray-500">No pages found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
