"use client";

import React from 'react';
import { Search, Filter, Plus, Calendar as CalendarIcon, User, Hotel } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const allBookings = [
  { id: 'BK-7832', guest: 'David Smith', room: '102', checkIn: 'Oct 25, 2026', checkOut: 'Oct 28, 2026', amount: '$850.00', status: 'Confirmed' },
  { id: 'BK-7831', guest: 'Amanda Johnson', room: '204', checkIn: 'Oct 25, 2026', checkOut: 'Oct 27, 2026', amount: '$600.00', status: 'Confirmed' },
  { id: 'BK-7830', guest: 'Robert Taylor', room: '305', checkIn: 'Oct 24, 2026', checkOut: 'Oct 29, 2026', amount: '$1,250.00', status: 'Checked In' },
  { id: 'BK-7829', guest: 'Michael Chen', room: '302', checkIn: 'Oct 24, 2026', checkOut: 'Oct 26, 2026', amount: '$450.00', status: 'Confirmed' },
  { id: 'BK-7828', guest: 'Sarah Wilson', room: '105', checkIn: 'Oct 23, 2026', checkOut: 'Oct 25, 2026', amount: '$320.00', status: 'Checked In' },
  { id: 'BK-7827', guest: 'Emma Thompson', room: '401', checkIn: 'Oct 23, 2026', checkOut: 'Oct 30, 2026', amount: '$850.00', status: 'Confirmed' },
  { id: 'BK-7826', guest: 'James Rodriguez', room: '208', checkIn: 'Oct 22, 2026', checkOut: 'Oct 24, 2026', amount: '$290.00', status: 'Checked Out' },
  { id: 'BK-7825', guest: 'Olivia Davis', room: '503', checkIn: 'Oct 22, 2026', checkOut: 'Oct 23, 2026', amount: '$600.00', status: 'Cancelled' },
];

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Bookings</h1>
          <p className="text-zinc-400 mt-1">Manage customer reservations and check-ins.</p>
        </div>
        <Button className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          New Booking
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <Input 
            placeholder="Search by guest name or ID..." 
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <Button variant="outline" className="shrink-0">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button variant="outline" className="shrink-0">
          <CalendarIcon className="w-4 h-4 mr-2" />
          Date Range
        </Button>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-950/50 border-b border-zinc-800/50">
              <tr>
                <th className="px-6 py-4 font-medium">Booking ID</th>
                <th className="px-6 py-4 font-medium">Guest</th>
                <th className="px-6 py-4 font-medium">Room</th>
                <th className="px-6 py-4 font-medium">Check In - Out</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {allBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-300">{booking.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                        <User className="w-4 h-4 text-zinc-400" />
                      </div>
                      <span className="text-white font-medium">{booking.guest}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Hotel className="w-4 h-4 text-zinc-500" />
                      {booking.room}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    <div className="flex flex-col">
                      <span>{booking.checkIn}</span>
                      <span className="text-xs text-zinc-500">{booking.checkOut}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-300">{booking.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      booking.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      booking.status === 'Checked In' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      booking.status === 'Checked Out' ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-zinc-400 hover:text-white font-medium text-sm transition-colors">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-zinc-800/50 flex items-center justify-between">
          <span className="text-sm text-zinc-500">Showing 1 to 8 of 142 bookings</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
