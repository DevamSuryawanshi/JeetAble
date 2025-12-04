'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const adminMenuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: '🏠'
    },
    {
      name: 'Emergency Help Management',
      href: '/admin/emergency',
      icon: '🚨'
    },
    {
      name: 'Learning Hub Management',
      href: '/admin/learning',
      icon: '📚'
    },
    {
      name: 'Government Schemes Management',
      href: '/admin/schemes',
      icon: '🏛️'
    },
    {
      name: 'Job Portal Management',
      href: '/admin/jobs',
      icon: '💼'
    },
    {
      name: 'Admin Profile',
      href: '/admin/profile',
      icon: '👤'
    }
  ];

  return (
    <div className="w-64 bg-slate-800 text-white min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-center">Admin Panel</h2>
      </div>
      
      <nav className="space-y-2">
        {adminMenuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              pathname === item.href
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}