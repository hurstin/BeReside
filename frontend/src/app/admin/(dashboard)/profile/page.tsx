"use client";

import React, { useState } from 'react';
import { Camera, User, Mail, Shield, Save } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Profile Settings</h1>
        <p className="text-zinc-400 mt-2">Manage your personal information and staff preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Avatar & Role */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="relative group mb-4">
              <div className="w-32 h-32 rounded-full bg-zinc-800 flex items-center justify-center border-4 border-zinc-950 overflow-hidden relative">
                <User className="w-16 h-16 text-zinc-500" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-zinc-100 text-zinc-900 rounded-full shadow-lg hover:bg-white transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-xl font-semibold text-white">Jane Doe</h3>
            <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium">
              <Shield className="w-3.5 h-3.5" />
              Admin
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 md:p-8 space-y-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Jane" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      defaultValue="jane.doe@bereside.com"
                      icon={<Mail className="w-4 h-4" />}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-800/50">
                <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                      <Input id="confirmNewPassword" type="password" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800/50 flex items-center justify-end gap-4">
              {isSuccess && (
                <span className="text-emerald-400 text-sm font-medium animate-in fade-in slide-in-from-right-4">
                  Changes saved successfully
                </span>
              )}
              <Button type="submit" isLoading={isLoading} className="min-w-[140px]">
                {!isLoading && <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
