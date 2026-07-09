"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  if (isSent) {
    return (
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-emerald-500/20 p-3 rounded-full border border-emerald-500/30">
            <Send className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Check your email</h2>
        <p className="text-sm text-zinc-400 mt-2 mb-8">
          We have sent a password reset link to your email address.
        </p>
        <Link href="/admin/login">
          <Button variant="outline" className="w-full">
            Back to login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Forgot password?</h2>
        <p className="text-sm text-zinc-400 mt-2">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
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

        <Button type="submit" className="w-full" isLoading={isLoading}>
          {isLoading ? 'Sending link...' : 'Send reset link'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/admin/login" className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to login
        </Link>
      </div>
    </div>
  );
}
