"use client";

import React from 'react';
import { Search, Filter, Plus, Home } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const allRooms = [
  { id: '101', type: 'Deluxe Suite', price: '$250.00', capacity: 2, status: 'Occupied' },
  { id: '102', type: 'Standard Room', price: '$150.00', capacity: 2, status: 'Available' },
  { id: '105', type: 'Standard Room', price: '$150.00', capacity: 2, status: 'Available' },
  { id: '201', type: 'Family Suite', price: '$350.00', capacity: 4, status: 'Maintenance' },
  { id: '204', type: 'Standard Room', price: '$150.00', capacity: 2, status: 'Available' },
  { id: '208', type: 'Deluxe Suite', price: '$250.00', capacity: 2, status: 'Occupied' },
  { id: '302', type: 'Presidential', price: '$850.00', capacity: 4, status: 'Occupied' },
  { id: '305', type: 'Deluxe Suite', price: '$250.00', capacity: 2, status: 'Available' },
];

export default function RoomsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Rooms</h1>
          <p className="text-zinc-400 mt-1">Manage hotel rooms, pricing, and availability.</p>
        </div>
        <Button className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Room
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <Input 
            placeholder="Search by room number or type..." 
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <Button variant="outline" className="shrink-0">
          <Filter className="w-4 h-4 mr-2" />
          Status Filter
        </Button>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-950/50 border-b border-zinc-800/50">
              <tr>
                <th className="px-6 py-4 font-medium">Room No.</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Base Price</th>
                <th className="px-6 py-4 font-medium">Capacity</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {allRooms.map((room) => (
                <tr key={room.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700">
                        <Home className="w-4 h-4 text-zinc-400" />
                      </div>
                      <span className="text-white font-medium">{room.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-300 font-medium">{room.type}</td>
                  <td className="px-6 py-4 text-zinc-300">{room.price} <span className="text-xs text-zinc-500 font-normal">/night</span></td>
                  <td className="px-6 py-4 text-zinc-400">{room.capacity} Guests</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      room.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      room.status === 'Occupied' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }`}>
                      {room.status}
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
      </div>
    </div>
  );
}
