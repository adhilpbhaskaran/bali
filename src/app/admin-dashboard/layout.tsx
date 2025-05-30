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
  BarChart,
  LogOut,
  User,
  Bell
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import AdminDashboardProviders from './providers';

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
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  // Authentication check
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session && pathname !== '/admin-dashboard/login') {
      router.push('/admin-dashboard/login');
    } else if (session && pathname === '/admin-dashboard/login') {
      router.push('/admin-dashboard');
    } else {
      setLoading(false);
    }
  }, [session, status, router, pathname]);

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

  // Show loading state
  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-dark-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-white">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const isActive = (path: string) => {
    if (path === '/admin-dashboard' && pathname === '/admin-dashboard') return true;
    if (path !== '/admin-dashboard' && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex h-screen bg-dark-900 text-white">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-3 left-3 z-50 lg:hidden">
        <button
          className="p-1.5 rounded-full bg-primary-600 text-white"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-56 bg-dark-900 border-r border-dark-800 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-3 border-b border-dark-800">
            <Link href="/" className="flex items-center space-x-1">
              <span className="text-lg font-bold bg-gradient-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent">Bali</span>
              <span className="text-sm font-medium">Admin</span>
            </Link>
            <button
              className="lg:hidden text-white/80 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-2 px-2">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${pathname === item.href ? 'bg-primary-600/20 text-primary-500' : 'text-white/70 hover:bg-dark-800 hover:text-white'}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User */}
          <div className="p-3 border-t border-dark-800">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Admin User</p>
                <p className="text-xs text-white/60">admin@example.com</p>
              </div>
              <button
                className="text-white/80 hover:text-white"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-56 min-h-screen bg-dark-900">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-dark-900/80 backdrop-blur-sm border-b border-dark-800">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center">
              <button
                className="lg:hidden text-white/80 hover:text-white mr-3"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </button>
              <h1 className="text-base font-semibold">
                {pathname === '/admin-dashboard' ? 'Dashboard' : 
                 pathname.startsWith('/admin-dashboard/bookings') ? 'Bookings' :
                 pathname.startsWith('/admin-dashboard/packages') ? 'Packages' :
                 pathname.startsWith('/admin-dashboard/activities') ? 'Activities' :
                 pathname.startsWith('/admin-dashboard/customers') ? 'Customers' :
                 pathname.startsWith('/admin-dashboard/settings') ? 'Settings' :
                 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="text-white/80 hover:text-white">
                <Bell className="h-4 w-4" />
              </button>
              <button className="text-white/80 hover:text-white">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminDashboardProviders>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminDashboardProviders>
  );
}
