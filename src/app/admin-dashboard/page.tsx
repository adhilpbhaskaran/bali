'use client'

import React, { useState } from 'react';
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
  ArrowUpDown,
  Download,
  RefreshCw
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

  // Sample activities data (matching main website activities)
  const activities: Activity[] = [
    {
      id: '1',
      user: 'Sarah & Michael',
      action: 'booked',
      target: 'Romantic Bali Honeymoon',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      user: 'The Patel Family',
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
      user: 'David Thompson',
      action: 'cancelled',
      target: 'Traditional Balinese Spa',
      timestamp: '2 days ago'
    },
    {
      id: '5',
      user: 'John & Lisa Wong',
      action: 'reviewed',
      target: 'Mount Batur Sunrise Trek',
      timestamp: '3 days ago'
    },
    {
      id: '6',
      user: 'Maria Rodriguez',
      action: 'booked',
      target: 'Bali Swing Experience',
      timestamp: '3 days ago'
    },
    {
      id: '7',
      user: 'James Wilson',
      action: 'completed',
      target: 'Uluwatu Temple & Kecak Dance',
      timestamp: '4 days ago'
    },
    {
      id: '8',
      user: 'Anna Schmidt',
      action: 'booked',
      target: 'Nusa Penida Island Tour',
      timestamp: '5 days ago'
    }
  ];

  // Sample upcoming packages data (matching main website)
  const upcomingPackages: Package[] = [
    {
      id: '1',
      name: 'Romantic Bali Honeymoon',
      price: 899,
      startDate: '2024-03-15',
      bookings: 8,
      status: 'almost_full'
    },
    {
      id: '2',
      name: 'Bali Adventure Package',
      price: 749,
      startDate: '2024-03-20',
      bookings: 12,
      status: 'available'
    },
    {
      id: '3',
      name: 'Luxury Bali Retreat',
      price: 1299,
      startDate: '2024-03-25',
      bookings: 6,
      status: 'available'
    },
    {
      id: '4',
      name: 'Family Fun in Bali',
      price: 849,
      startDate: '2024-03-28',
      bookings: 15,
      status: 'full'
    }
  ];

  // Sample sales data (matching main website packages)
  const salesData: SalesData[] = [
    {
      id: '1',
      package: 'Romantic Bali Honeymoon',
      customer: 'Sarah & Michael',
      amount: 899,
      date: '2024-02-20',
      status: 'completed'
    },
    {
      id: '2',
      package: 'Bali Adventure Package',
      customer: 'The Patel Family',
      amount: 749,
      date: '2024-02-19',
      status: 'completed'
    },
    {
      id: '3',
      package: 'Luxury Bali Retreat',
      customer: 'Emily Davis',
      amount: 1299,
      date: '2024-02-18',
      status: 'pending'
    },
    {
      id: '4',
      package: 'Family Fun in Bali',
      customer: 'John & Lisa Wong',
      amount: 849,
      date: '2024-02-17',
      status: 'completed'
    },
    {
      id: '5',
      package: 'Romantic Bali Honeymoon',
      customer: 'David Thompson',
      amount: 899,
      date: '2024-02-16',
      status: 'cancelled'
    }
  ];

  // Stats data (updated to reflect current demo data)
  const stats = [
    {
      title: 'Total Sales',
      value: '$4,596',
      icon: DollarSign,
      color: 'from-emerald-500 to-green-500',
      trend: '+15.2%'
    },
    {
      title: 'Active Bookings',
      value: '41',
      icon: Calendar,
      color: 'from-blue-500 to-indigo-500',
      trend: '+8.7%'
    },
    {
      title: 'Upcoming Tours',
      value: '4',
      icon: Palmtree,
      color: 'from-amber-500 to-orange-500',
      trend: '+25%'
    },
    {
      title: 'Total Customers',
      value: '127',
      icon: Users,
      color: 'from-pink-500 to-rose-500',
      trend: '+12.3%'
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
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 mb-4">
        <div>
          <h1 className="text-xl font-bold">Dashboard Overview</h1>
          <p className="text-white/60 mt-0.5 text-xs">Welcome back! Here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="btn-secondary text-xs py-1 px-2">
            <Download className="h-3 w-3 mr-1" />
            Export
          </button>
          <button className="btn-primary text-xs py-1 px-2">
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-dark-800 rounded-xl p-3 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-white/60 text-xs">{stat.title}</p>
                <h3 className="text-lg font-bold mt-0.5">{stat.value}</h3>
              </div>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-${stat.color.split('-')[1]}-500/20`}>
                <stat.icon className="h-4 w-4 text-${stat.color.split('-')[1]}-500" />
              </div>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center text-xs font-medium text-green-500">
                {stat.trend}
                <TrendingUp className="h-3 w-3 ml-0.5" />
              </span>
              <span className="text-white/60 text-xs ml-1">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Sales Report */}
        <div className="lg:col-span-2">
          <div className="bg-dark-800 rounded-xl overflow-hidden h-[450px] flex flex-col">
            <div className="p-3 border-b border-dark-700 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <h3 className="text-base font-semibold">Sales Report</h3>
                <p className="text-xs text-white/60">Overview of recent sales</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <select 
                    className="appearance-none bg-dark-700 border border-dark-600 text-white rounded-lg py-1 px-2 pr-6 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-xs"
                    value={salesDateFilter}
                    onChange={(e) => setSalesDateFilter(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-white">
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </div>
                <div className="relative">
                  <select 
                    className="appearance-none bg-dark-700 border border-dark-600 text-white rounded-lg py-1 px-2 pr-6 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-xs"
                    value={salesSort}
                    onChange={(e) => setSalesSort(e.target.value)}
                  >
                    <option value="date-desc">Latest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="amount-desc">Highest Amount</option>
                    <option value="amount-asc">Lowest Amount</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-white">
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full">
                <thead className="bg-dark-800">
                  <tr>
                    <th className="text-left text-xs font-medium text-white/60 uppercase p-2">Package</th>
                    <th className="text-left text-xs font-medium text-white/60 uppercase p-2">Customer</th>
                    <th className="text-left text-xs font-medium text-white/60 uppercase p-2">Amount</th>
                    <th className="text-left text-xs font-medium text-white/60 uppercase p-2">Date</th>
                    <th className="text-left text-xs font-medium text-white/60 uppercase p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {filteredSalesData.map((sale) => (
                    <tr key={sale.id} className="hover:bg-dark-800/50">
                      <td className="p-2">
                        <span className="font-medium text-xs">{sale.package}</span>
                      </td>
                      <td className="p-2 text-white/80 text-xs">{sale.customer}</td>
                      <td className="p-2 text-white/80 text-xs">${sale.amount}</td>
                      <td className="p-2 text-white/60 text-xs">{new Date(sale.date).toLocaleDateString()}</td>
                      <td className="p-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
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
          <div className="bg-dark-800 rounded-xl overflow-hidden h-[450px] flex flex-col">
            <div className="p-3 border-b border-dark-700">
              <h3 className="text-base font-semibold">Upcoming Packages</h3>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
              <div className="space-y-3">
                {upcomingPackages.map((pkg) => (
                  <div key={pkg.id} className="flex items-center justify-between bg-dark-700/50 p-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-xs">{pkg.name}</h4>
                        <p className="text-xs text-white/60">{new Date(pkg.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3 text-white/60" />
                        <span className="text-xs">{pkg.bookings} bookings</span>
                      </div>
                      <p className="text-xs font-medium text-primary-500">${pkg.price}</p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        pkg.status === 'available' ? 'bg-green-500/20 text-green-500' : 
                        pkg.status === 'almost_full' ? 'bg-yellow-500/20 text-yellow-500' : 
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {pkg.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
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
