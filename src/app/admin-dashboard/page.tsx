'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Users, 
  Calendar,
  Plus,
  Palmtree,
  ChevronUp,
  ChevronDown,
  DollarSign,
  TrendingUp,
  Clock,
  Filter,
  ArrowUpDown
} from 'lucide-react';

interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

interface Package {
  id: string;
  name: string;
  price: number;
  startDate: string;
  bookings: number;
  status: 'available' | 'almost_full' | 'full';
}

interface SalesData {
  id: string;
  package: string;
  customer: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export default function DashboardPage() {
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [salesDateFilter, setSalesDateFilter] = useState('all');
  const [salesSort, setSalesSort] = useState('date-desc');

  // Sample activities data
  const activities: Activity[] = [
    {
      id: '1',
      user: 'Sarah Johnson',
      action: 'booked',
      target: 'Romantic Bali Honeymoon',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      user: 'Michael Chen',
      action: 'registered',
      target: '',
      timestamp: '5 hours ago'
    },
    {
      id: '3',
      user: 'Emily Davis',
      action: 'booked',
      target: 'Ubud Cultural Tour',
      timestamp: '1 day ago'
    },
    {
      id: '4',
      user: 'John Smith',
      action: 'cancelled',
      target: 'Beach Sunset Dinner',
      timestamp: '2 days ago'
    },
    {
      id: '5',
      user: 'Lisa Wong',
      action: 'reviewed',
      target: 'Mount Batur Sunrise Trek',
      timestamp: '3 days ago'
    }
  ];

  // Sample upcoming packages data
  const upcomingPackages: Package[] = [
    {
      id: '1',
      name: 'Romantic Bali Honeymoon',
      price: 1299,
      startDate: '2024-03-15',
      bookings: 8,
      status: 'almost_full'
    },
    {
      id: '2',
      name: 'Ubud Cultural Experience',
      price: 899,
      startDate: '2024-03-20',
      bookings: 12,
      status: 'available'
    },
    {
      id: '3',
      name: 'Beach Paradise Package',
      price: 1099,
      startDate: '2024-03-25',
      bookings: 15,
      status: 'full'
    }
  ];

  // Sample sales data
  const salesData: SalesData[] = [
    {
      id: '1',
      package: 'Romantic Bali Honeymoon',
      customer: 'Sarah Johnson',
      amount: 1299,
      date: '2024-02-20',
      status: 'completed'
    },
    {
      id: '2',
      package: 'Ubud Cultural Experience',
      customer: 'Michael Chen',
      amount: 899,
      date: '2024-02-19',
      status: 'completed'
    },
    {
      id: '3',
      package: 'Beach Paradise Package',
      customer: 'Emily Davis',
      amount: 1099,
      date: '2024-02-18',
      status: 'pending'
    }
  ];

  // Stats data
  const stats = [
    {
      title: 'Total Sales',
      value: '$45,299',
      icon: DollarSign,
      color: 'from-emerald-500 to-green-500',
      trend: '+12.5%'
    },
    {
      title: 'Active Bookings',
      value: '24',
      icon: Calendar,
      color: 'from-blue-500 to-indigo-500',
      trend: '+5.2%'
    },
    {
      title: 'Upcoming Tours',
      value: '8',
      icon: Palmtree,
      color: 'from-amber-500 to-orange-500',
      trend: '0%'
    },
    {
      title: 'Total Customers',
      value: '156',
      icon: Users,
      color: 'from-pink-500 to-rose-500',
      trend: '+8.1%'
    }
  ];

  // Quick actions
  const quickActions = [
    {
      title: 'Add Package',
      icon: Package,
      href: '/admin-dashboard/packages/new',
      color: 'from-violet-500 to-purple-500'
    },
    {
      title: 'Add Activity',
      icon: Palmtree,
      href: '/admin-dashboard/activities/new',
      color: 'from-amber-500 to-orange-500'
    }
  ];

  // Filter and sort sales data
  const filteredSalesData = salesData.filter(sale => {
    if (salesDateFilter === 'all') return true;
    const saleDate = new Date(sale.date);
    const today = new Date();
    switch (salesDateFilter) {
      case 'today':
        return saleDate.toDateString() === today.toDateString();
      case 'week':
        const weekAgo = new Date(today.setDate(today.getDate() - 7));
        return saleDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
        return saleDate >= monthAgo;
      default:
        return true;
    }
  }).sort((a, b) => {
    switch (salesSort) {
      case 'amount-asc':
        return a.amount - b.amount;
      case 'amount-desc':
        return b.amount - a.amount;
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'date-desc':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const displayedActivities = showAllActivities ? activities : activities.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/admin-dashboard/reports" className="btn-primary">
            <TrendingUp size={16} className="mr-2" />
            View Full Reports
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link 
            href={`/admin-dashboard/${
              stat.title === 'Total Sales' ? 'sales' :
              stat.title === 'Active Bookings' ? 'bookings' :
              stat.title === 'Upcoming Tours' ? 'tours' :
              'customers'
            }`}
            key={index}
            className="bento-card p-6 transition-transform hover:scale-[1.02] hover:shadow-lg cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span className={`text-sm font-medium ${
                stat.trend.startsWith('+') ? 'text-green-500' : 
                stat.trend.startsWith('-') ? 'text-red-500' : 
                'text-white/60'
              }`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-sm text-white/60">{stat.title}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Report */}
        <div className="lg:col-span-2">
          <div className="bento-card flex flex-col" style={{ height: '500px' }}>
            <div className="p-6 border-b border-dark-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Sales Report</h2>
                <div className="flex gap-2">
                  <select 
                    value={salesDateFilter}
                    onChange={(e) => setSalesDateFilter(e.target.value)}
                    className="bg-dark-700 border-none rounded-lg text-sm px-3 py-2"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                  <select
                    value={salesSort}
                    onChange={(e) => setSalesSort(e.target.value)}
                    className="bg-dark-700 border-none rounded-lg text-sm px-3 py-2"
                  >
                    <option value="date-desc">Latest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="amount-desc">Highest Amount</option>
                    <option value="amount-asc">Lowest Amount</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full">
                <thead className="bg-dark-800">
                  <tr>
                    <th className="text-left text-xs font-medium text-white/60 uppercase p-4">Package</th>
                    <th className="text-left text-xs font-medium text-white/60 uppercase p-4">Customer</th>
                    <th className="text-left text-xs font-medium text-white/60 uppercase p-4">Amount</th>
                    <th className="text-left text-xs font-medium text-white/60 uppercase p-4">Date</th>
                    <th className="text-left text-xs font-medium text-white/60 uppercase p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {filteredSalesData.map((sale) => (
                    <tr key={sale.id} className="hover:bg-dark-800/50">
                      <td className="p-4">
                        <span className="font-medium">{sale.package}</span>
                      </td>
                      <td className="p-4 text-white/80">{sale.customer}</td>
                      <td className="p-4 text-white/80">${sale.amount}</td>
                      <td className="p-4 text-white/60">{new Date(sale.date).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          sale.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                          sale.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-red-500/20 text-red-500'
                        }`}>
                          {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Upcoming Packages */}
        <div className="lg:col-span-1">
          <div className="bento-card flex flex-col" style={{ height: '500px' }}>
            <div className="p-6 border-b border-dark-700">
              <h2 className="text-lg font-semibold">Upcoming Packages</h2>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="divide-y divide-dark-700">
                {upcomingPackages.map((pkg) => (
                  <div key={pkg.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{pkg.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        pkg.status === 'available' ? 'bg-green-500/20 text-green-500' :
                        pkg.status === 'almost_full' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {pkg.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-white/60">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {new Date(pkg.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Users size={14} className="mr-1" />
                        {pkg.bookings} bookings
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-bold">${pkg.price}</span>
                      <Link 
                        href={`/admin-dashboard/packages/${pkg.id}`}
                        className="text-primary-500 hover:text-primary-400 text-sm font-medium"
                      >
                        View Details
            </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
