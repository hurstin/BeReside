"use client";

import React, { useEffect, useState } from 'react';
import { DollarSign, CalendarDays, Bed, Users, ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface DashboardStats {
  totalUsers: number;
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
  totalRevenue: number;
  pendingBookings: number;
  confirmedBookings: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await apiFetch<DashboardStats>('/admin/dashboard-stats');
        setData(stats);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-8 h-8 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
        <div>
          <h3 className="text-lg font-medium text-red-400">Error Loading Dashboard</h3>
          <p className="text-red-400/80 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const stats = [
    { name: 'Total Revenue (Paid)', value: formatCurrency(data?.totalRevenue || 0), change: 'Total collected', trend: 'neutral', icon: DollarSign },
    { name: 'Confirmed Bookings', value: data?.confirmedBookings.toString() || '0', change: `${data?.pendingBookings || 0} Pending`, trend: data?.pendingBookings && data.pendingBookings > 0 ? 'up' : 'neutral', icon: CalendarDays },
    { name: 'Total Rooms', value: data?.totalRooms.toString() || '0', change: `Occupancy: ${data?.occupancyRate || 0}%`, trend: data?.occupancyRate && data.occupancyRate > 50 ? 'up' : 'neutral', icon: Bed },
    { name: 'Total Users', value: data?.totalUsers.toString() || '0', change: 'Registered', trend: 'neutral', icon: Users },
  ];

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

      {/* Recent Activity */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800/50">
          <h2 className="text-lg font-medium text-white">Recent Activity</h2>
          <p className="text-sm text-zinc-400 mt-1">Latest bookings from customers.</p>
        </div>
        <div className="p-6">
          <p className="text-zinc-500 text-sm">For full details, please visit the <a href="/admin/bookings" className="text-indigo-400 hover:underline">Bookings tab</a>.</p>
        </div>
      </div>
    </div>
  );
}
