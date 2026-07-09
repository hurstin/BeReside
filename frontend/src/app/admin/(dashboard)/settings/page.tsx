"use client";

import React from 'react';
import { Settings as SettingsIcon, Globe, CreditCard, Mail } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';

export default function SettingsPage() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Settings saved! (This is a placeholder)");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-zinc-400" />
          Global Settings
        </h1>
        <p className="text-zinc-400 mt-2">Manage hotel-wide configurations, branding, and integrations.</p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* General */}
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-zinc-400" />
              General Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="hotelName">Hotel Name</Label>
                <Input id="hotelName" defaultValue="BeReside Hotel & Spa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Primary Currency</Label>
                <select 
                  id="currency" 
                  className="w-full h-11 rounded-md border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-zinc-500 appearance-none"
                  defaultValue="USD"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Billing */}
          <section className="space-y-4 pt-6 border-t border-zinc-800/50">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-zinc-400" />
              Billing & Taxes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Standard Tax Rate (%)</Label>
                <Input id="taxRate" type="number" defaultValue="10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stripeKey">Stripe Public Key</Label>
                <Input id="stripeKey" type="password" defaultValue="pk_test_123456789" />
              </div>
            </div>
          </section>

          <div className="pt-6 border-t border-zinc-800/50 flex justify-end">
            <Button type="submit">Save Configuration</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
