'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Activity, 
  Users, 
  Calendar, 
  FileText, 
  Image as ImageIcon, 
  MessageSquare, 
  Settings, 
  PlusCircle,
  Search,
  Edit,
  Trash,
  Eye
} from 'lucide-react';

// Sample data for packages
const packages = [
  {
    id: 1,
    title: "Romantic Bali Honeymoon",
    category: "honeymoon",
    price: 899,
    duration: "7 days",
    status: "active",
    featured: true,
    lastUpdated: "2025-05-20",
  },
  {
    id: 2,
    title: "Bali Adventure Package",
    category: "adventure",
    price: 749,
    duration: "5 days",
    status: "active",
    featured: true,
    lastUpdated: "2025-05-18",
  },
  {
    id: 3,
    title: "Luxury Bali Retreat",
    category: "luxury",
    price: 1299,
    duration: "6 days",
    status: "active",
    featured: true,
    lastUpdated: "2025-05-15",
  },
  {
    id: 4,
    title: "Family Fun in Bali",
    category: "family",
    price: 849,
    duration: "6 days",
    status: "active",
    featured: true,
    lastUpdated: "2025-05-10",
  },
  {
    id: 5,
    title: "Budget Bali Explorer",
    category: "budget",
    price: 599,
    duration: "5 days",
    status: "draft",
    featured: false,
    lastUpdated: "2025-05-05",
  },
];

// Sample data for activities
const activities = [
  {
    id: 1,
    title: "Mount Batur Sunrise Trek",
    category: "adventure",
    price: 65,
    duration: "6 hours",
    status: "active",
    featured: true,
    lastUpdated: "2025-05-19",
  },
  {
    id: 2,
    title: "Ubud Cultural Tour",
    category: "cultural",
    price: 45,
    duration: "8 hours",
    status: "active",
    featured: true,
    lastUpdated: "2025-05-17",
  },
  {
    id: 3,
    title: "Bali Swing Experience",
    category: "adventure",
    price: 35,
    duration: "3 hours",
    status: "active",
    featured: true,
    lastUpdated: "2025-05-12",
  },
];

// Sample data for bookings
const bookings = [
  {
    id: "BK-2025-001",
    customer: "John & Sarah Smith",
    package: "Romantic Bali Honeymoon",
    date: "2025-06-15",
    amount: 899,
    status: "confirmed",
    paymentStatus: "paid",
  },
  {
    id: "BK-2025-002",
    customer: "Michael Johnson",
    package: "Bali Adventure Package",
    date: "2025-07-10",
    amount: 749,
    status: "pending",
    paymentStatus: "partial",
  },
  {
    id: "BK-2025-003",
    customer: "The Patel Family",
    package: "Family Fun in Bali",
    date: "2025-08-05",
    amount: 849,
    status: "confirmed",
    paymentStatus: "paid",
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('packages');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="pt-24 pb-16 bg-dark-900 min-h-screen">
      <div className="container-custom">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-white/70">Manage your website content, packages, and bookings</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/" className="btn-secondary">
              View Website
            </Link>
          </div>
        </div>

        {/* Admin Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="md:col-span-1">
            <div className="bento-card p-0 overflow-hidden">
              <nav>
                <ul>
                  <li>
                    <button
                      className={`flex items-center w-full px-6 py-4 text-left hover:bg-dark-700 transition-colors ${
                        activeTab === 'packages' ? 'bg-dark-700 border-l-4 border-primary-500' : ''
                      }`}
                      onClick={() => setActiveTab('packages')}
                    >
                      <Package size={18} className={`mr-3 ${activeTab === 'packages' ? 'text-primary-500' : 'text-white/70'}`} />
                      <span>Packages</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center w-full px-6 py-4 text-left hover:bg-dark-700 transition-colors ${
                        activeTab === 'activities' ? 'bg-dark-700 border-l-4 border-primary-500' : ''
                      }`}
                      onClick={() => setActiveTab('activities')}
                    >
                      <Activity size={18} className={`mr-3 ${activeTab === 'activities' ? 'text-primary-500' : 'text-white/70'}`} />
                      <span>Activities</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center w-full px-6 py-4 text-left hover:bg-dark-700 transition-colors ${
                        activeTab === 'bookings' ? 'bg-dark-700 border-l-4 border-primary-500' : ''
                      }`}
                      onClick={() => setActiveTab('bookings')}
                    >
                      <Calendar size={18} className={`mr-3 ${activeTab === 'bookings' ? 'text-primary-500' : 'text-white/70'}`} />
                      <span>Bookings</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center w-full px-6 py-4 text-left hover:bg-dark-700 transition-colors ${
                        activeTab === 'users' ? 'bg-dark-700 border-l-4 border-primary-500' : ''
                      }`}
                      onClick={() => setActiveTab('users')}
                    >
                      <Users size={18} className={`mr-3 ${activeTab === 'users' ? 'text-primary-500' : 'text-white/70'}`} />
                      <span>Users</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center w-full px-6 py-4 text-left hover:bg-dark-700 transition-colors ${
                        activeTab === 'blog' ? 'bg-dark-700 border-l-4 border-primary-500' : ''
                      }`}
                      onClick={() => setActiveTab('blog')}
                    >
                      <FileText size={18} className={`mr-3 ${activeTab === 'blog' ? 'text-primary-500' : 'text-white/70'}`} />
                      <span>Blog</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center w-full px-6 py-4 text-left hover:bg-dark-700 transition-colors ${
                        activeTab === 'media' ? 'bg-dark-700 border-l-4 border-primary-500' : ''
                      }`}
                      onClick={() => setActiveTab('media')}
                    >
                      <ImageIcon size={18} className={`mr-3 ${activeTab === 'media' ? 'text-primary-500' : 'text-white/70'}`} />
                      <span>Media</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center w-full px-6 py-4 text-left hover:bg-dark-700 transition-colors ${
                        activeTab === 'reviews' ? 'bg-dark-700 border-l-4 border-primary-500' : ''
                      }`}
                      onClick={() => setActiveTab('reviews')}
                    >
                      <MessageSquare size={18} className={`mr-3 ${activeTab === 'reviews' ? 'text-primary-500' : 'text-white/70'}`} />
                      <span>Reviews</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center w-full px-6 py-4 text-left hover:bg-dark-700 transition-colors ${
                        activeTab === 'settings' ? 'bg-dark-700 border-l-4 border-primary-500' : ''
                      }`}
                      onClick={() => setActiveTab('settings')}
                    >
                      <Settings size={18} className={`mr-3 ${activeTab === 'settings' ? 'text-primary-500' : 'text-white/70'}`} />
                      <span>Settings</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <div className="md:col-span-4">
            {/* Packages Tab */}
            {activeTab === 'packages' && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <h2 className="text-xl font-semibold mb-4 md:mb-0">Manage Packages</h2>
                  <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0 md:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Search packages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-dark-800 border border-dark-700 text-white rounded-lg pl-10 pr-4 py-2 w-full focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <Link href="/admin/packages/new" className="btn-primary flex items-center justify-center">
                      <PlusCircle size={16} className="mr-2" />
                      Add Package
                    </Link>
                  </div>
                </div>

                <div className="bento-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-dark-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                            Duration
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                            Featured
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-white/70 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-700">
                        {packages.map((pkg) => (
                          <tr key={pkg.id} className="hover:bg-dark-700/50">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="font-medium">{pkg.title}</div>
                              <div className="text-xs text-white/50">Last updated: {pkg.lastUpdated}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-full bg-primary-900/30 text-primary-400">
                                {pkg.category}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              ${pkg.price}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {pkg.duration}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                pkg.status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                              }`}>
                                {pkg.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {pkg.featured ? (
                                <span className="text-green-400">Yes</span>
                              ) : (
                                <span className="text-white/50">No</span>
                              )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button className="p-1 text-white/70 hover:text-white" title="View">
                                  <Eye size={16} />
                                </button>
                                <button className="p-1 text-white/70 hover:text-white" title="Edit">
                                  <Edit size={16} />
                                </button>
                                <button className="p-1 text-white/70 hover:text-red-400" title="Delete">
                                  <Trash size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Activities Tab */}
            {activeTab === 'activities' && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <h2 className="text-xl font-semibold mb-4 md:mb-0">Manage Activities</h2>
                  <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0 md:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Search activities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-dark-800 border border-dark-700 text-white rounded-lg pl-10 pr-4 py-2 w-full focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <Link href="/admin/activities/new" className="btn-primary flex items-center justify-center">
                      <PlusCircle size={16} className="mr-2" />
                      Add Activity
                    </Link>
                  </div>
                </div>

                <div className="bento-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-dark-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                            Duration
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                            Featured
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-white/70 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-700">
                        {activities.map((activity) => (
                          <tr key={activity.id} className="hover:bg-dark-700/50">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="font-medium">{activity.title}</div>
                              <div className="text-xs text-white/50">Last updated: {activity.lastUpdated}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-full bg-primary-900/30 text-primary-400">
                                {activity.category}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              ${activity.price}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {activity.duration}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                activity.status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                              }`}>
                                {activity.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {activity.featured ? (
                                <span className="text-green-400">Yes</span>
                              ) : (
                                <span className="text-white/50">No</span>
                              )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button className="p-1 text-white/70 hover:text-white" title="View">
                                  <Eye size={16} />
                                </button>
                                <button className="p-1 text-white/70 hover:text-white" title="Edit">
                                  <Edit size={16} />
                                </button>
                                <button className="p-1 text-white/70 hover:text-red-400" title="Delete">
                                  <Trash size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <h2 className="text-xl font-semibold mb-4 md:mb-0">Manage Bookings</h2>
                  <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0 md:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Search bookings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-dark-800 border border-dark-700 text-white rounded-lg pl-10 pr-4 py-2 w-full focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <select 
                      className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                      aria-label="Filter bookings by status"
                    >
                      <option value="all">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="bento-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-dark-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                            Booking ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                            Package/Activity
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-white/70 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-700">
                        {bookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-dark-700/50">
                            <td className="px-4 py-4 whitespace-nowrap font-medium">
                              {booking.id}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {booking.customer}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {booking.package}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              ${booking.amount}
                              <div className="text-xs text-white/50">
                                {booking.paymentStatus === 'paid' ? 'Fully Paid' : booking.paymentStatus === 'partial' ? 'Partially Paid' : 'Unpaid'}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                booking.status === 'confirmed' ? 'bg-green-900/30 text-green-400' : 
                                booking.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                                'bg-red-900/30 text-red-400'
                              }`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button className="p-1 text-white/70 hover:text-white" title="View">
                                  <Eye size={16} />
                                </button>
                                <button className="p-1 text-white/70 hover:text-white" title="Edit">
                                  <Edit size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs would be implemented similarly */}
            {activeTab === 'users' && (
              <div className="bento-card p-6 text-center">
                <h2 className="text-xl font-semibold mb-4">User Management</h2>
                <p className="text-white/70">This section allows you to manage user accounts and permissions.</p>
                <p className="text-white/50 mt-4">This feature is under development.</p>
              </div>
            )}

            {activeTab === 'blog' && (
              <div className="bento-card p-6 text-center">
                <h2 className="text-xl font-semibold mb-4">Blog Management</h2>
                <p className="text-white/70">Create and manage blog posts about Bali travel experiences.</p>
                <p className="text-white/50 mt-4">This feature is under development.</p>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="bento-card p-6 text-center">
                <h2 className="text-xl font-semibold mb-4">Media Library</h2>
                <p className="text-white/70">Upload and manage images and videos for your website.</p>
                <p className="text-white/50 mt-4">This feature is under development.</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bento-card p-6 text-center">
                <h2 className="text-xl font-semibold mb-4">Review Management</h2>
                <p className="text-white/70">Moderate and showcase customer reviews and testimonials.</p>
                <p className="text-white/50 mt-4">This feature is under development.</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bento-card p-6 text-center">
                <h2 className="text-xl font-semibold mb-4">Website Settings</h2>
                <p className="text-white/70">Configure global settings for your travel agency website.</p>
                <p className="text-white/50 mt-4">This feature is under development.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
