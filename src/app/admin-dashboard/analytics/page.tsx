'use client';

import { useState } from 'react';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Package, 
  Palmtree,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download
} from 'lucide-react';
import { useAnalyticsStore } from '@/lib/store/analytics';

// Chart component (placeholder for actual chart library)
const Chart = ({ 
  type, 
  data, 
  height = 300 
}: { 
  type: 'line' | 'bar' | 'pie', 
  data: any, 
  height?: number 
}) => {
  return (
    <div 
      className="w-full rounded-lg bg-dark-800/50 border border-dark-700" 
      style={{ height: `${height}px` }}
    >
      <div className="flex items-center justify-center h-full">
        {type === 'line' && <LineChart className="w-12 h-12 text-white/30" />}
        {type === 'bar' && <BarChart className="w-12 h-12 text-white/30" />}
        {type === 'pie' && <PieChart className="w-12 h-12 text-white/30" />}
        <span className="ml-2 text-white/60">
          {type.charAt(0).toUpperCase() + type.slice(1)} Chart
        </span>
      </div>
    </div>
  );
};

// Stat card component
const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType 
}: { 
  title: string, 
  value: string | number, 
  icon: React.ReactNode, 
  change: number, 
  changeType: 'positive' | 'negative' | 'neutral' 
}) => {
  return (
    <div className="bento-card p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white/60 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          
          <div className="flex items-center mt-2">
            <span 
              className={`text-xs flex items-center ${
                changeType === 'positive' 
                  ? 'text-green-500' 
                  : changeType === 'negative' 
                    ? 'text-red-500' 
                    : 'text-white/60'
              }`}
            >
              {changeType === 'positive' && <ArrowUpRight size={14} className="mr-1" />}
              {changeType === 'negative' && <ArrowDownRight size={14} className="mr-1" />}
              {change}% from last month
            </span>
          </div>
        </div>
        
        <div className="p-3 rounded-full bg-primary-600/20">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const analytics = useAnalyticsStore((state) => state.analytics);
  const [dateRange, setDateRange] = useState('30d');
  
  // Calculate changes from previous period (mock data)
  const bookingsChange = 12.5;
  const revenueChange = 8.3;
  const customersChange = 15.2;
  const conversionChange = -2.1;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Calculate total revenue for the selected period
  const periodRevenue = analytics.dailyStats.reduce((sum, day) => sum + day.revenue, 0);
  
  // Calculate total bookings for the selected period
  const periodBookings = analytics.dailyStats.reduce((sum, day) => sum + day.bookings, 0);
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-dark-800 border border-dark-700 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Calendar size={16} className="text-white/60" />
            </div>
          </div>
          
          <button className="flex items-center gap-2 bg-dark-800 border border-dark-700 rounded-lg py-2 px-4 hover:bg-dark-700">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Bookings" 
          value={periodBookings}
          icon={<Package className="h-6 w-6 text-primary-500" />}
          change={bookingsChange}
          changeType="positive"
        />
        
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(periodRevenue)}
          icon={<DollarSign className="h-6 w-6 text-primary-500" />}
          change={revenueChange}
          changeType="positive"
        />
        
        <StatCard 
          title="Total Customers" 
          value={analytics.totalCustomers}
          icon={<Users className="h-6 w-6 text-primary-500" />}
          change={customersChange}
          changeType="positive"
        />
        
        <StatCard 
          title="Conversion Rate" 
          value={`${analytics.conversionRate.toFixed(1)}%`}
          icon={<TrendingUp className="h-6 w-6 text-primary-500" />}
          change={conversionChange}
          changeType="negative"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="bento-card p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Revenue Trend</h2>
            <button className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700">
              <Filter size={16} />
            </button>
          </div>
          
          <Chart 
            type="line" 
            data={analytics.dailyStats.map(day => ({ 
              date: day.date, 
              revenue: day.revenue 
            }))} 
          />
          
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-white/60 text-xs">Avg. Daily Revenue</p>
              <p className="text-lg font-semibold mt-1">
                {formatCurrency(periodRevenue / analytics.dailyStats.length)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/60 text-xs">Highest Day</p>
              <p className="text-lg font-semibold mt-1">
                {formatCurrency(Math.max(...analytics.dailyStats.map(day => day.revenue)))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/60 text-xs">Lowest Day</p>
              <p className="text-lg font-semibold mt-1">
                {formatCurrency(Math.min(...analytics.dailyStats.map(day => day.revenue)))}
              </p>
            </div>
          </div>
        </div>
        
        {/* Booking Sources */}
        <div className="bento-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Booking Sources</h2>
            <button className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700">
              <Filter size={16} />
            </button>
          </div>
          
          <Chart 
            type="pie" 
            data={analytics.customerSources.map(source => ({ 
              name: source.source, 
              value: source.bookings 
            }))}
            height={220}
          />
          
          <div className="mt-4 space-y-3">
            {analytics.customerSources.slice(0, 3).map((source, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full bg-primary-${(index + 5) * 100}`} />
                  <span className="ml-2">{source.source}</span>
                </div>
                <span className="font-semibold">{source.bookings} bookings</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Popular Items & Visitor Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Items */}
        <div className="bento-card p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Popular Items</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs rounded-full bg-primary-600/20 text-primary-500">
                By Revenue
              </button>
              <button className="px-3 py-1 text-xs rounded-full bg-dark-800">
                By Bookings
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-3 px-4 font-medium text-white/60">Item</th>
                  <th className="text-center py-3 px-4 font-medium text-white/60">Type</th>
                  <th className="text-center py-3 px-4 font-medium text-white/60">Views</th>
                  <th className="text-center py-3 px-4 font-medium text-white/60">Bookings</th>
                  <th className="text-right py-3 px-4 font-medium text-white/60">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analytics.popularItems.map((item, index) => (
                  <tr key={index} className="border-b border-dark-700/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full bg-${item.type === 'package' ? 'purple' : 'green'}-600/20 flex items-center justify-center mr-3`}>
                          {item.type === 'package' ? (
                            <Package size={16} className="text-purple-500" />
                          ) : (
                            <Palmtree size={16} className="text-green-500" />
                          )}
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.type === 'package' 
                          ? 'bg-purple-600/20 text-purple-500' 
                          : 'bg-green-600/20 text-green-500'
                      }`}>
                        {item.type === 'package' ? 'Package' : 'Activity'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">{item.views}</td>
                    <td className="py-3 px-4 text-center">{item.bookings}</td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {formatCurrency(item.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Visitor Stats */}
        <div className="bento-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Visitor Stats</h2>
            <button className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700">
              <Filter size={16} />
            </button>
          </div>
          
          <Chart 
            type="bar" 
            data={analytics.dailyStats.map(day => ({ 
              date: day.date, 
              visitors: day.visitors 
            }))}
            height={220}
          />
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/60 text-xs">Total Visitors</p>
              <p className="text-lg font-semibold mt-1">
                {analytics.dailyStats.reduce((sum, day) => sum + day.visitors, 0)}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-xs">Total Page Views</p>
              <p className="text-lg font-semibold mt-1">
                {analytics.dailyStats.reduce((sum, day) => sum + day.pageViews, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Reviews */}
      <div className="bento-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Recent Reviews</h2>
          <button className="px-4 py-2 text-sm bg-dark-800 rounded-lg hover:bg-dark-700">
            View All Reviews
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((index) => (
            <div key={index} className="p-4 bg-dark-800 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-600/20 flex items-center justify-center mr-3">
                  <Star className="h-5 w-5 text-primary-500" />
                </div>
                <div>
                  <p className="font-medium">Review #{index}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={12} 
                        className={i < 5 ? 'text-yellow-500 fill-yellow-500' : 'text-white/20'} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/80 line-clamp-3">
                "Great experience! The service was excellent and the activities were amazing. Would definitely recommend to friends and family."
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
