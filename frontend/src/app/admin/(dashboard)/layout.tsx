"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Hotel, LayoutDashboard, Users, Calendar, Settings, LogOut, Bell, User, Menu, X } from 'lucide-react';
import { apiFetch, clearToken } from '@/lib/api';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

const sidebarLinks = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/check-in', icon: Calendar, label: 'Check-In' },
  { href: '/admin/bookings', icon: Calendar, label: 'Bookings' },
  { href: '/admin/rooms', icon: Hotel, label: 'Rooms' },
  { href: '/admin/staff', icon: Users, label: 'Staff' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch<UserProfile>('/users/me');
        setProfile(data);
        if (data.role !== 'admin' && (pathname === '/admin/dashboard' || pathname === '/admin/staff')) {
          router.push('/admin/bookings');
        }
      } catch (err) {
        clearToken();
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [pathname, router]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const visibleLinks = sidebarLinks.filter(link => {
    if ((link.href === '/admin/dashboard' || link.href === '/admin/staff') && profile?.role !== 'admin') {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex relative">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-800/50 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/50">
          <Link href="/" className="flex items-center gap-2 group">
            <Hotel className="h-6 w-6 text-zinc-100 group-hover:text-zinc-300 transition-colors" />
            <span className="font-bold tracking-tight">BeReside<span className="text-zinc-500 font-normal">Staff</span></span>
          </Link>
          <button 
            className="md:hidden text-zinc-400 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                  isActive 
                    ? 'bg-zinc-800/80 text-white' 
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                }`}
              >
                <link.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800/50">
          <Link href="/admin/profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
              <User className="w-5 h-5 text-zinc-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile?.firstName} {profile?.lastName}</p>
              <p className="text-xs text-zinc-500 truncate capitalize">{profile?.role}</p>
            </div>
          </Link>
          <button 
            onClick={() => {
              clearToken();
              router.push('/admin/login');
            }}
            className="mt-2 flex w-full items-center px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-10">
          <div className="md:hidden flex items-center gap-4">
            <button 
              className="text-zinc-400 hover:text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center gap-2 group">
              <Hotel className="h-6 w-6 text-zinc-100" />
            </Link>
          </div>
          
          <div className="hidden md:block flex-1" />
          
          <div className="flex items-center gap-4 ml-auto">
            <button className="text-zinc-400 hover:text-white relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-zinc-950" />
            </button>
          </div>
        </header>
        
        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
