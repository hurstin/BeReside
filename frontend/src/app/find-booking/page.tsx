"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Send, ArrowRight, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function FindBookingPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoToken, setDemoToken] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const data = await apiFetch<{ token: string; message: string }>('/public/bookings/magic-link', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      
      setIsSent(true);
      if (data.token) {
        setDemoToken(data.token);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to request magic link');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-linen pt-[120px] pb-16 px-6 sm:px-8 md:px-16 flex flex-col items-center justify-center">
      
      <div className="max-w-xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-[48px] text-forest leading-none mb-4">Find My Booking</h1>
          <p className="text-[15px] text-stone leading-relaxed">
            Enter the email address you used to make your reservation. We will send you a secure link to view and manage your booking.
          </p>
        </div>

        {isSent ? (
          <div className="bg-cream border border-sand p-6 sm:p-10 md:p-12 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-olive/10 text-olive mb-6">
              <Send className="w-8 h-8 ml-1" />
            </div>
            <h2 className="font-display text-[32px] text-forest mb-4">Check your email</h2>
            <p className="text-stone text-[14px] leading-relaxed mb-8">
              We have sent a secure link to <strong className="text-forest font-medium">{email}</strong>. 
              Please click the link in that email to view or manage your reservation.
            </p>
            
            {/* For DEMO purposes only - removing this in a real app */}
            {demoToken && (
              <div className="bg-amber/10 border border-amber/30 p-4 rounded-sm text-left mb-8">
                <p className="text-[11px] text-amber-700 font-medium uppercase tracking-[0.1em] mb-2">Demo Mode Shortcut</p>
                <Link 
                  href={`/manage-booking?token=${demoToken}`}
                  className="text-[13px] text-forest underline hover:text-olive transition-colors"
                >
                  Click here to simulate opening the link from your email →
                </Link>
              </div>
            )}

            <button 
              onClick={() => {
                setIsSent(false);
                setEmail("");
                setDemoToken("");
              }}
              className="text-[12px] uppercase tracking-[0.15em] font-medium text-stone hover:text-forest transition-colors underline underline-offset-4"
            >
              Try another email
            </button>
          </div>
        ) : (
          <div className="bg-cream border border-sand p-6 sm:p-10 md:p-12 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-none flex items-start gap-3 mb-6">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-[10px] font-medium text-stone uppercase tracking-[0.15em] mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    required
                    className="w-full bg-white border border-sand rounded-none py-4 pl-12 pr-4 text-forest focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-colors font-body text-[15px]"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full bg-forest text-white py-4 rounded-none text-[13px] uppercase tracking-[0.15em] font-medium hover:bg-olive transition-colors disabled:opacity-70 disabled:cursor-not-allowed group flex justify-center items-center"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Searching...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Find Booking
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
