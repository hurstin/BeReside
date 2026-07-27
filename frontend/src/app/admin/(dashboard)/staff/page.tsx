"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Shield, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { apiFetch } from '@/lib/api';

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('staff');
  const [password, setPassword] = useState('');

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch<any[]>('/users?includeDeleted=true');
      // Filter out 'guest' users, only show admin and staff
      setStaff(data.filter(u => u.role === 'admin' || u.role === 'staff'));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          role,
          password
        })
      });
      setIsAddModalOpen(false);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      fetchStaff();
    } catch (err: any) {
      alert(err.message || 'Failed to add staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this user?')) return;
    try {
      await apiFetch(`/users/${id}`, { method: 'DELETE' });
      fetchStaff();
    } catch (err: any) {
      alert(err.message || 'Failed to revoke user');
    }
  };

  const handleRestore = async (id: string) => {
    if (!confirm('Are you sure you want to grant access to this user?')) return;
    try {
      await apiFetch(`/users/${id}/restore`, { method: 'PATCH' });
      fetchStaff();
    } catch (err: any) {
      alert(err.message || 'Failed to restore user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Staff Management</h1>
          <p className="text-zinc-400 mt-1">Manage admin and staff accounts and their roles.</p>
        </div>
        <Button className="shrink-0" onClick={() => setIsAddModalOpen(true)}>
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
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-400">Loading staff...</td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-400">No staff found.</td>
                </tr>
              ) : staff.map((member) => (
                <tr key={member.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                        <User className="w-5 h-5 text-zinc-400" />
                      </div>
                      <span className="text-white font-medium">{member.firstName} {member.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{member.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
                        member.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-zinc-800/50 text-zinc-300 border-zinc-700'
                      }`}>
                        {member.role === 'admin' && <Shield className="w-3 h-3" />}
                        {member.role}
                      </div>
                      {member.deletedAt && (
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-red-500/10 text-red-400 border-red-500/20">
                          Revoked
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {member.deletedAt ? (
                      <button onClick={() => handleRestore(member.id)} className="text-emerald-400 hover:text-emerald-300 font-medium text-sm transition-colors">
                        Grant Access
                      </button>
                    ) : (
                      <button onClick={() => handleRevoke(member.id)} className="text-red-400 hover:text-red-300 font-medium text-sm transition-colors">
                        Revoke Access
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
              <h3 className="text-lg font-semibold text-white">Add Staff Member</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">First Name</label>
                  <Input required value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Last Name</label>
                  <Input required value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email</label>
                <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Password</label>
                <Input required type="password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Role</label>
                <select 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-500"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Member'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
