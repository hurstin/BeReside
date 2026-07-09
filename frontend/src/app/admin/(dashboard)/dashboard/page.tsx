"use client";

import React from 'react';
import { DollarSign, CalendarDays, Bed, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const stats = [
  { name: 'Total Revenue', value: '$45,231.89', change: '+20.1%', trend: 'up', icon: DollarSign },
  { name: 'Active Bookings', value: '+573', change: '+12.5%', trend: 'up', icon: CalendarDays },
  { name: 'Available Rooms', value: '12', change: '-2.4%', trend: 'down', icon: Bed },
  { name: 'Active Staff', value: '24', change: '+0.0%', trend: 'neutral', icon: Users },
];

const recentBookings = [
  { id: 'BK-7829', guest: 'Michael Chen', room: '302', date: 'Oct 24, 2026', amount: '$450.00', status: 'Confirmed' },
  { id: 'BK-7828', guest: 'Sarah Wilson', room: '105', date: 'Oct 23, 2026', amount: '$320.00', status: 'Checked In' },
  { id: 'BK-7827', guest: 'Emma Thompson', room: '401', date: 'Oct 23, 2026', amount: '$850.00', status: 'Confirmed' },
  { id: 'BK-7826', guest: 'James Rodriguez', room: '208', date: 'Oct 22, 2026', amount: '$290.00', status: 'Checked Out' },
  { id: 'BK-7825', guest: 'Olivia Davis', room: '503', date: 'Oct 22, 2026', amount: '$600.00', status: 'Cancelled' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-zinc-400 mt-2">Welcome back. Here is what&apos;s happening at BeReside today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-400">{stat.name}</p>
              <div className="p-2 bg-zinc-800 rounded-lg">
                <stat.icon className="w-5 h-5 text-zinc-300" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <span className={`flex items-center text-sm font-medium ${
                stat.trend === 'up' ? 'text-emerald-400' : stat.trend === 'down' ? 'text-red-400' : 'text-zinc-500'
              }`}>
                {stat.trend === 'up' && <ArrowUpRight className="w-4 h-4 mr-1" />}
                {stat.trend === 'down' && <ArrowDownRight className="w-4 h-4 mr-1" />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-800/50 flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">Recent Activity</h3>
          <button className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-950/50 border-b border-zinc-800/50">
              <tr>
                <th className="px-6 py-4 font-medium">Booking ID</th>
                <th className="px-6 py-4 font-medium">Guest</th>
                <th className="px-6 py-4 font-medium">Room</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-300">{booking.id}</td>
                  <td className="px-6 py-4 text-white">{booking.guest}</td>
                  <td className="px-6 py-4 text-zinc-400">{booking.room}</td>
                  <td className="px-6 py-4 text-zinc-400">{booking.date}</td>
                  <td className="px-6 py-4 text-zinc-300">{booking.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      booking.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      booking.status === 'Checked In' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      booking.status === 'Checked Out' ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {booking.status}
                    </span>
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
