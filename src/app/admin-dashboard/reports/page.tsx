'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Download,
  Filter,
  Calendar,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Eye
} from 'lucide-react';

interface ReportData {
  period: string;
  totalSales: number;
  totalBookings: number;
  totalCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
  topPackages: Array<{
    name: string;
    bookings: number;
    revenue: number;
  }>;
  salesByMonth: Array<{
    month: string;
    sales: number;
    bookings: number;
  }>;
  customerSources: Array<{
    source: string;
    percentage: number;
    customers: number;
  }>;
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('last-30-days');
  const [reportType, setReportType] = useState('overview');

  // Sample report data
  const reportData: ReportData = {
    period: 'Last 30 Days',
    totalSales: 45299,
    totalBookings: 156,
    totalCustomers: 134,
    averageOrderValue: 290.38,
    conversionRate: 3.2,
    topPackages: [
      { name: 'Romantic Bali Honeymoon', bookings: 24, revenue: 31176 },
      { name: 'Ubud Cultural Experience', bookings: 18, revenue: 16182 },
      { name: 'Beach Paradise Package', bookings: 15, revenue: 16485 },
      { name: 'Mount Batur Sunrise Trek', bookings: 12, revenue: 7188 },
      { name: 'Nusa Penida Day Trip', bookings: 10, revenue: 5990 }
    ],
    salesByMonth: [
      { month: 'Jan', sales: 38500, bookings: 125 },
      { month: 'Feb', sales: 45299, bookings: 156 },
      { month: 'Mar', sales: 52100, bookings: 178 },
      { month: 'Apr', sales: 48900, bookings: 165 },
      { month: 'May', sales: 55200, bookings: 189 },
      { month: 'Jun', sales: 61800, bookings: 205 }
    ],
    customerSources: [
      { source: 'Direct Website', percentage: 45, customers: 60 },
      { source: 'Social Media', percentage: 28, customers: 38 },
      { source: 'Google Ads', percentage: 15, customers: 20 },
      { source: 'Referrals', percentage: 8, customers: 11 },
      { source: 'Email Marketing', percentage: 4, customers: 5 }
    ]
  };

  const periods = [
    { value: 'last-7-days', label: 'Last 7 Days' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-90-days', label: 'Last 90 Days' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const reportTypes = [
    { value: 'overview', label: 'Overview', icon: BarChart3 },
    { value: 'sales', label: 'Sales Analytics', icon: DollarSign },
    { value: 'customers', label: 'Customer Analytics', icon: Users },
    { value: 'packages', label: 'Package Performance', icon: Package }
  ];

  const exportReport = () => {
    // Implement export functionality
    console.log('Exporting report...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin-dashboard" 
            className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Full Reports</h1>
            <p className="text-white/60">Comprehensive analytics and insights</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportReport}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bento-card p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Report Type</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setReportType(type.value)}
                    className={`p-3 rounded-lg border transition-colors flex items-center gap-2 text-sm ${
                      reportType === type.value
                        ? 'border-primary-500 bg-primary-500/10 text-primary-500'
                        : 'border-dark-700 hover:border-dark-600'
                    }`}
                  >
                    <Icon size={16} />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="lg:w-64">
            <label className="block text-sm font-medium mb-2">Time Period</label>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full p-3 bg-dark-800 border border-dark-700 rounded-lg focus:border-primary-500 focus:outline-none"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <DollarSign size={20} className="text-emerald-500" />
            </div>
            <span className="text-emerald-500 text-sm font-medium flex items-center gap-1">
              <TrendingUp size={14} />
              +12.5%
            </span>
          </div>
          <div>
            <p className="text-white/60 text-sm">Total Sales</p>
            <p className="text-2xl font-bold">${reportData.totalSales.toLocaleString()}</p>
          </div>
        </div>

        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calendar size={20} className="text-blue-500" />
            </div>
            <span className="text-blue-500 text-sm font-medium flex items-center gap-1">
              <TrendingUp size={14} />
              +8.3%
            </span>
          </div>
          <div>
            <p className="text-white/60 text-sm">Total Bookings</p>
            <p className="text-2xl font-bold">{reportData.totalBookings}</p>
          </div>
        </div>

        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users size={20} className="text-purple-500" />
            </div>
            <span className="text-purple-500 text-sm font-medium flex items-center gap-1">
              <TrendingUp size={14} />
              +15.2%
            </span>
          </div>
          <div>
            <p className="text-white/60 text-sm">Total Customers</p>
            <p className="text-2xl font-bold">{reportData.totalCustomers}</p>
          </div>
        </div>

        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <TrendingUp size={20} className="text-amber-500" />
            </div>
            <span className="text-red-500 text-sm font-medium flex items-center gap-1">
              <TrendingDown size={14} />
              -2.1%
            </span>
          </div>
          <div>
            <p className="text-white/60 text-sm">Avg. Order Value</p>
            <p className="text-2xl font-bold">${reportData.averageOrderValue.toFixed(2)}</p>
          </div>
        </div>

        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-pink-500/20 rounded-lg">
              <Eye size={20} className="text-pink-500" />
            </div>
            <span className="text-pink-500 text-sm font-medium flex items-center gap-1">
              <TrendingUp size={14} />
              +0.3%
            </span>
          </div>
          <div>
            <p className="text-white/60 text-sm">Conversion Rate</p>
            <p className="text-2xl font-bold">{reportData.conversionRate}%</p>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Sales Trend</h3>
            <LineChart size={20} className="text-white/60" />
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {reportData.salesByMonth.map((month, index) => (
              <div key={month.month} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg mb-2 transition-all hover:opacity-80"
                  style={{ height: `${(month.sales / 62000) * 200}px` }}
                  title={`${month.month}: $${month.sales.toLocaleString()}`}
                ></div>
                <span className="text-xs text-white/60">{month.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Sources */}
        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Customer Sources</h3>
            <PieChart size={20} className="text-white/60" />
          </div>
          <div className="space-y-4">
            {reportData.customerSources.map((source, index) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ 
                      backgroundColor: [
                        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'
                      ][index] 
                    }}
                  ></div>
                  <span className="text-sm">{source.source}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{source.percentage}%</div>
                  <div className="text-xs text-white/60">{source.customers} customers</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Packages */}
      <div className="bento-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Top Performing Packages</h3>
          <Package size={20} className="text-white/60" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left text-sm font-medium text-white/60 pb-3">Package Name</th>
                <th className="text-left text-sm font-medium text-white/60 pb-3">Bookings</th>
                <th className="text-left text-sm font-medium text-white/60 pb-3">Revenue</th>
                <th className="text-left text-sm font-medium text-white/60 pb-3">Avg. Value</th>
                <th className="text-left text-sm font-medium text-white/60 pb-3">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {reportData.topPackages.map((pkg, index) => (
                <tr key={pkg.name} className="hover:bg-dark-800/50">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">{pkg.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-white/80">{pkg.bookings}</td>
                  <td className="py-4 text-white/80">${pkg.revenue.toLocaleString()}</td>
                  <td className="py-4 text-white/80">${(pkg.revenue / pkg.bookings).toFixed(2)}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-dark-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                          style={{ width: `${(pkg.revenue / 31176) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-white/60">
                        {Math.round((pkg.revenue / 31176) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin-dashboard/sales" className="bento-card p-6 hover:bg-dark-800/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <DollarSign size={24} className="text-emerald-500" />
            </div>
            <div>
              <h4 className="font-semibold">Sales Analytics</h4>
              <p className="text-sm text-white/60">Detailed sales reports and trends</p>
            </div>
          </div>
        </Link>

        <Link href="/admin-dashboard/customers" className="bento-card p-6 hover:bg-dark-800/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Users size={24} className="text-purple-500" />
            </div>
            <div>
              <h4 className="font-semibold">Customer Insights</h4>
              <p className="text-sm text-white/60">Customer behavior and demographics</p>
            </div>
          </div>
        </Link>

        <Link href="/admin-dashboard/analytics" className="bento-card p-6 hover:bg-dark-800/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <BarChart3 size={24} className="text-blue-500" />
            </div>
            <div>
              <h4 className="font-semibold">Advanced Analytics</h4>
              <p className="text-sm text-white/60">Deep dive into performance metrics</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}