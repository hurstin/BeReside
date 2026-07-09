"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Calendar, MapPin, XCircle, AlertTriangle } from "lucide-react";

// Mock data
const mockBooking = {
  ref: "BK-8932",
  guest: "Jane Doe",
  email: "jane.doe@example.com",
  room: "Double Room",
  checkIn: "2026-10-25",
  checkOut: "2026-10-28",
  guests: 2,
  total: "$1,155.00",
  status: "Confirmed"
};

function ManageBookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(mockBooking.status);

  useEffect(() => {
    // If no token, redirect to find-booking
    if (!token) {
      router.push('/find-booking');
      return;
    }

    // Simulate verifying token and fetching booking
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [token, router]);

  const handleCancel = () => {
    setIsCancelling(true);
    // Simulate API call to cancel
    setTimeout(() => {
      setIsCancelling(false);
      setShowCancelConfirm(false);
      setBookingStatus("Cancelled");
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linen pt-[120px] pb-24 flex items-center justify-center">
        <div className="flex flex-col items-center text-forest">
          <div className="w-8 h-8 border-2 border-forest/30 border-t-forest rounded-full animate-spin mb-4" />
          <p className="text-[13px] uppercase tracking-[0.15em] font-medium">Verifying Secure Link...</p>
        </div>
      </div>
    );
  }

  const start = new Date(mockBooking.checkIn);
  const end = new Date(mockBooking.checkOut);

  return (
    <main className="min-h-screen bg-linen pt-[120px] pb-24 px-8 md:px-16 flex justify-center">
      <div className="max-w-3xl w-full">
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-[40px] text-forest leading-none">Manage Reservation</h1>
          <div className="flex items-center gap-2 text-stone text-[12px] uppercase tracking-[0.1em]">
            <Lock className="w-3.5 h-3.5" />
            Secure Session
          </div>
        </div>

        {bookingStatus === "Cancelled" && (
          <div className="bg-red-50 border border-red-200 p-6 mb-8 flex items-start gap-4">
            <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900 text-[15px] mb-1">Reservation Cancelled</h3>
              <p className="text-red-700 text-[14px]">
                Your reservation has been successfully cancelled. A confirmation email has been sent to {mockBooking.email}. Any applicable refunds will be processed within 5-7 business days according to our cancellation policy.
              </p>
            </div>
          </div>
        )}

        <div className="bg-cream border border-sand p-8 md:p-12 shadow-sm">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-sand pb-8 mb-8 gap-6">
            <div>
              <p className="text-[10px] font-medium text-stone uppercase tracking-[0.15em] mb-2">Booking Reference</p>
              <p className="font-display text-[32px] text-forest leading-none">{mockBooking.ref}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.15em] font-medium border ${
                bookingStatus === 'Confirmed' ? 'bg-olive/10 text-olive border-olive/20' : 'bg-red-500/10 text-red-600 border-red-500/20'
              }`}>
                {bookingStatus}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-12">
            <div>
              <p className="text-[10px] font-medium text-stone uppercase tracking-[0.15em] mb-2">Guest Information</p>
              <p className="text-[15px] text-forest font-medium">{mockBooking.guest}</p>
              <p className="text-[14px] text-stone">{mockBooking.email}</p>
              <p className="text-[14px] text-stone mt-2">{mockBooking.guests} Guest{mockBooking.guests > 1 ? 's' : ''}</p>
            </div>
            
            <div>
              <p className="text-[10px] font-medium text-stone uppercase tracking-[0.15em] mb-2">Room Details</p>
              <p className="text-[15px] text-forest font-medium">{mockBooking.room}</p>
              <p className="text-[14px] text-stone">Total: {mockBooking.total}</p>
            </div>

            <div className="col-span-1 md:col-span-2 bg-linen p-6 border border-sand">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <Calendar className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-stone mb-1">Check-in</p>
                    <p className="text-[15px] text-forest font-medium">{start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-[13px] text-stone mt-1">From 3:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Calendar className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-stone mb-1">Check-out</p>
                    <p className="text-[15px] text-forest font-medium">{end.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-[13px] text-stone mt-1">Until 11:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {bookingStatus === "Confirmed" && (
            <div className="border-t border-sand pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-[12px] text-stone">
                Need to make changes? Please <Link href="/contact" className="text-forest underline hover:text-olive">contact us</Link> directly.
              </div>
              
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="w-full sm:w-auto px-8 py-3 bg-white border border-red-200 text-red-600 text-[12px] uppercase tracking-[0.15em] font-medium hover:bg-red-50 hover:border-red-300 transition-colors shrink-0"
              >
                Cancel Reservation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/40 backdrop-blur-sm">
          <div className="bg-cream border border-sand p-8 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-display text-[24px] leading-none">Cancel Reservation?</h3>
            </div>
            <p className="text-stone text-[14px] leading-relaxed mb-8">
              Are you sure you want to cancel booking <strong>{mockBooking.ref}</strong>? This action cannot be undone. Please review our cancellation policy for details on refunds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="flex-1 bg-red-600 text-white py-3 px-4 text-[12px] uppercase tracking-[0.15em] font-medium hover:bg-red-700 transition-colors disabled:opacity-70 flex justify-center items-center"
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                disabled={isCancelling}
                className="flex-1 bg-white border border-sand text-forest py-3 px-4 text-[12px] uppercase tracking-[0.15em] font-medium hover:bg-linen transition-colors disabled:opacity-70"
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ManageBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-linen pt-[120px] pb-24 flex items-center justify-center text-forest">Loading session...</div>}>
      <ManageBookingContent />
    </Suspense>
  );
}
