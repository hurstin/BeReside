"use client";

import React, { useState, useEffect } from 'react';
import { Camera, User, Mail, Shield, Save, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { apiFetch } from '@/lib/api';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch<UserProfile>('/users/me');
        setProfile(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setIsSuccess(false);
    setError(null);

    try {
      // Update basic info
      await apiFetch('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ firstName, lastName }),
      });

      // Update password if provided
      if (newPassword || currentPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error('New passwords do not match');
        }
        if (!currentPassword) {
          throw new Error('Current password is required to set a new password');
        }
        await apiFetch('/users/me/password', {
          method: 'PATCH',
          body: JSON.stringify({ oldPassword: currentPassword, newPassword }),
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-8 h-8 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Profile Settings</h1>
        <p className="text-zinc-400 mt-2">Manage your personal information and staff preferences.</p>
      </div>

      {error && (
        <div className="mb-8 bg-red-500/10 border border-red-500/50 p-4 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

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
            <h3 className="text-xl font-semibold text-white">{profile?.firstName} {profile?.lastName}</h3>
            <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              {profile?.role}
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
                    <Input 
                      id="firstName" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profile?.email || ''}
                      disabled
                      className="opacity-50 cursor-not-allowed"
                      icon={<Mail className="w-4 h-4" />}
                    />
                    <p className="text-xs text-zinc-500 mt-1">Email cannot be changed.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-800/50">
                <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword" 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmNewPassword" 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
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
              <Button type="submit" isLoading={isSaving} className="min-w-[140px]">
                {!isSaving && <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
