'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  PackageOpen, 
  Palmtree, 
  Image as ImageIcon, 
  Users, 
  Settings, 
  Menu, 
  X, 
  ExternalLink,
  Star,
  Calendar,
  BarChart
} from 'lucide-react';
// NextAuth authentication removed for deployment testing

const navigation = [
  { name: 'Dashboard', href: '/admin-dashboard', icon: LayoutDashboard },
  { name: 'Packages', href: '/admin-dashboard/packages', icon: PackageOpen },
  { name: 'Activities', href: '/admin-dashboard/activities', icon: Palmtree },
  { name: 'Testimonials', href: '/admin-dashboard/testimonials', icon: Star },
  { name: 'Bookings', href: '/admin-dashboard/bookings', icon: Calendar },
  { name: 'Media Library', href: '/admin-dashboard/media', icon: ImageIcon },
  { name: 'Analytics', href: '/admin-dashboard/analytics', icon: BarChart },
  { name: 'Users', href: '/admin-dashboard/users', icon: Users },
  { name: 'Settings', href: '/admin-dashboard/settings', icon: Settings },
];

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication removed for deployment testing
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Authentication check removed for deployment testing
  useEffect(() => {
    // Authentication logic removed
  }, [router]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Loading state removed for deployment testing

  const isActive = (path: string) => {
    if (path === '/admin-dashboard' && pathname === '/admin-dashboard') return true;
    if (path !== '/admin-dashboard' && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex h-screen bg-dark-900 text-white">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          className="p-2 rounded-full bg-primary-600 text-white"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-dark-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Visit Website Button */}
          <div className="flex flex-col items-center justify-center h-20 border-b border-dark-700 space-y-2">
            <Link href="/admin-dashboard" className="text-2xl font-bold text-primary-500">
              Bali Malayali Admin
            </Link>
            <Link 
              href="/"
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              <span>Visit Website</span>
              <ExternalLink size={14} />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-600/20 text-primary-500'
                    : 'text-white/70 hover:bg-dark-700 hover:text-white'
                }`}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-dark-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-600/30 flex items-center justify-center">
                A
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-white/60">admin@balimalayali.com</p>
              </div>
            </div>
            {/* Sign out button removed for deployment testing */}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <main className="min-h-screen p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayoutContent>{children}</AdminLayoutContent>
  );
}
