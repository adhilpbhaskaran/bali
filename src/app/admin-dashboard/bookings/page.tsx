'use client';

import { useState } from 'react';
import { ArrowLeft, Calendar, Users, Clock, MapPin, Phone, Mail, Filter } from 'lucide-react';
import Link from 'next/link';

export default function BookingsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Mock bookings data
  const bookings = [
    {
      id: '1',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah@email.com',
        phone: '+1 234 567 8900'
      },
      package: 'Romantic Bali Honeymoon',
      startDate: '2024-02-15',
      endDate: '2024-02-22',
      guests: 2,
      status: 'confirmed',
      amount: 1299,
      bookingDate: '2024-01-15'
    },
    {
      id: '2',
      customer: {
        name: 'Michael Chen',
        email: 'michael@email.com',
        phone: '+1 234 567 8901'
      },
      package: 'Ubud Cultural Experience',
      startDate: '2024-02-20',
      endDate: '2024-02-25',
      guests: 4,
      status: 'pending',
      amount: 899,
      bookingDate: '2024-01-14'
    },
    {
      id: '3',
      customer: {
        name: 'Emily Davis',
        email: 'emily@email.com',
        phone: '+1 234 567 8902'
      },
      package: 'Beach Paradise Getaway',
      startDate: '2024-03-01',
      endDate: '2024-03-08',
      guests: 2,
      status: 'confirmed',
      amount: 1599,
      bookingDate: '2024-01-13'
    }
  ];

  const filteredBookings = bookings.filter(booking => {
    if (statusFilter !== 'all' && booking.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin-dashboard" className="text-white/60 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold">Active Bookings</h1>
        </div>
        
        <div className="flex gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Booking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-blue-500">+5.2%</span>
          </div>
          <p className="text-sm text-white/60">Total Bookings</p>
          <p className="text-3xl font-bold mt-1">{bookings.length}</p>
        </div>
        
        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-green-500">+12</span>
          </div>
          <p className="text-sm text-white/60">Confirmed</p>
          <p className="text-3xl font-bold mt-1">{bookings.filter(b => b.status === 'confirmed').length}</p>
        </div>
        
        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-yellow-500">+3</span>
          </div>
          <p className="text-sm text-white/60">Pending</p>
          <p className="text-3xl font-bold mt-1">{bookings.filter(b => b.status === 'pending').length}</p>
        </div>
        
        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-red-500">-1</span>
          </div>
          <p className="text-sm text-white/60">Cancelled</p>
          <p className="text-3xl font-bold mt-1">{bookings.filter(b => b.status === 'cancelled').length}</p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bento-card p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-600">
                <th className="text-left py-3 px-4 font-medium text-white/60">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-white/60">Package</th>
                <th className="text-left py-3 px-4 font-medium text-white/60">Dates</th>
                <th className="text-left py-3 px-4 font-medium text-white/60">Guests</th>
                <th className="text-left py-3 px-4 font-medium text-white/60">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-white/60">Status</th>
                <th className="text-left py-3 px-4 font-medium text-white/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-dark-700/50 hover:bg-dark-700/30">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium">{booking.customer.name}</p>
                      <p className="text-sm text-white/60">{booking.customer.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium">{booking.package}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm">{booking.startDate} to {booking.endDate}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p>{booking.guests} guests</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium">${booking.amount}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                      booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}