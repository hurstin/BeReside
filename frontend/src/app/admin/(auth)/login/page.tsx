"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin/profile');
    }, 1500);
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
        <p className="text-sm text-zinc-400 mt-2">Enter your credentials to access the portal</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="staff@bereside.com" 
            required 
            icon={<Mail className="w-5 h-5" />}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <div className="text-sm">
              <Link href="/admin/forgot-password" className="font-medium text-zinc-300 hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>
          <Input 
            id="password" 
            type="password" 
            required 
            icon={<Lock className="w-5 h-5" />}
          />
        </div>

        <Button type="submit" className="w-full group" isLoading={isLoading}>
          {isLoading ? 'Signing in...' : (
            <>
              Sign in
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
