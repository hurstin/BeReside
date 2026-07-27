"use client";

import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { KeyRound, Search, CheckCircle2, AlertCircle } from 'lucide-react';

interface Booking {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  bookingStatus: string;
  user: {
    firstName: string;
    lastName: string;
  };
  room: {
    roomNumber: string;
    type: string;
  };
}

interface VerifyResponse {
  booking: Booking;
  isTooEarly: boolean;
  message?: string;
}

export default function CheckInPage() {
  const [referenceId, setReferenceId] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [success, setSuccess] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setWarning('');
    setBooking(null);
    setSuccess('');

    try {
      const data = await apiFetch<VerifyResponse>('/bookings/verify-checkin', {
        method: 'POST',
        body: JSON.stringify({ referenceId, pin }),
      });
      setBooking(data.booking);
      if (data.isTooEarly) {
        setWarning(data.message || 'It is too early to check in.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify PIN');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCheckIn = async () => {
    if (!booking) return;
    setLoading(true);
    setError('');

    try {
      await apiFetch<Booking>(`/bookings/${booking.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'checked-in' }),
      });
      setSuccess('Guest has been successfully checked in!');
      setBooking({ ...booking, bookingStatus: 'checked-in' });
    } catch (err: any) {
      setError(err.message || 'Failed to check in guest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Guest Check-In</h1>
        <p className="text-zinc-400">Verify guest reservations using their Reference ID and secure PIN.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-8">
        <div className="p-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Reference ID</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    value={referenceId}
                    onChange={(e) => setReferenceId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-c-gold focus:ring-1 focus:ring-c-gold transition-colors"
                    placeholder="e.g. 8f2a4b"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Check-In PIN</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-c-gold focus:ring-1 focus:ring-c-gold transition-colors"
                    placeholder="6-digit PIN"
                    maxLength={6}
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !referenceId || !pin}
              className="w-full py-2.5 bg-[#c79635] hover:bg-[#c79635]/90 text-zinc-950 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && !booking ? 'Verifying...' : 'Verify Reservation'}
            </button>
          </form>
        </div>
      </div>

      {booking && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-white">Reservation Found</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Guest Name</p>
                <p className="text-white font-medium">{booking.user?.firstName} {booking.user?.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500 mb-1">Room Details</p>
                <p className="text-white font-medium">{booking.room?.type} - No. {booking.room?.roomNumber}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500 mb-1">Check-in Date</p>
                <p className="text-white font-medium">{new Date(booking.checkInDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500 mb-1">Check-out Date</p>
                <p className="text-white font-medium">{new Date(booking.checkOutDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500 mb-1">Current Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                  booking.bookingStatus === 'checked-in' ? 'bg-blue-500/10 text-blue-400' :
                  booking.bookingStatus === 'confirmed' ? 'bg-green-500/10 text-green-400' :
                  'bg-zinc-800 text-zinc-400'
                }`}>
                  {booking.bookingStatus}
                </span>
              </div>
            </div>

            {warning && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-3 text-amber-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{warning}</p>
              </div>
            )}

            {success ? (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-400">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{success}</p>
              </div>
            ) : (
              <button
                onClick={handleConfirmCheckIn}
                disabled={loading || booking.bookingStatus === 'checked-in' || !!warning}
                className="w-full py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                {loading ? 'Checking in...' : 'Confirm Check-In'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
