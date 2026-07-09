"use client";

import React from 'react';
import { Search, Plus, User, Shield } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const allStaff = [
  { id: '1', name: 'Jane Doe', email: 'jane.doe@bereside.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Marcus Johnson', email: 'mjohnson@bereside.com', role: 'Staff', status: 'Active' },
  { id: '3', name: 'Elena Rodriguez', email: 'erodriguez@bereside.com', role: 'Staff', status: 'Active' },
  { id: '4', name: 'David Kim', email: 'dkim@bereside.com', role: 'Staff', status: 'Inactive' },
  { id: '5', name: 'Sarah Wilson', email: 'swilson@bereside.com', role: 'Admin', status: 'Active' },
];

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Staff Management</h1>
          <p className="text-zinc-400 mt-1">Manage admin and staff accounts and their roles.</p>
        </div>
        <Button className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <Input 
            placeholder="Search staff by name or email..." 
            icon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-950/50 border-b border-zinc-800/50">
              <tr>
                <th className="px-6 py-4 font-medium">Employee</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {allStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                        <User className="w-5 h-5 text-zinc-400" />
                      </div>
                      <span className="text-white font-medium">{staff.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{staff.email}</td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      staff.role === 'Admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-zinc-800/50 text-zinc-300 border-zinc-700'
                    }`}>
                      {staff.role === 'Admin' && <Shield className="w-3 h-3" />}
                      {staff.role}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      staff.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-zinc-400 hover:text-white font-medium text-sm transition-colors mr-4">
                      Edit
                    </button>
                    <button className="text-red-400 hover:text-red-300 font-medium text-sm transition-colors">
                      Revoke Access
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
