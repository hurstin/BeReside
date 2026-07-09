"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, CreditCard, ChevronLeft } from "lucide-react";
import { Room } from "@/types";

// Mock data (we would normally fetch this based on roomId)
const mockRooms: Room[] = [
  { id: '1', name: 'Family Room', pricePerNight: 450, type: 'family', maxOccupancy: 4, description: '', amenities: [] },
  { id: '2', name: 'Double Room', pricePerNight: 350, type: 'double', maxOccupancy: 2, description: '', amenities: [] },
  { id: '3', name: 'Queen Room', pricePerNight: 320, type: 'double', maxOccupancy: 2, description: '', amenities: [] },
  { id: '4', name: 'Apartment', pricePerNight: 500, type: 'apartment', maxOccupancy: 4, description: '', amenities: [] }
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const roomId = searchParams.get('roomId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');

  const [isProcessing, setIsProcessing] = useState(false);
  
  const room = mockRooms.find(r => r.id === roomId);

  useEffect(() => {
    // If invalid params, redirect back to home
    if (!roomId || !checkIn || !checkOut || !room) {
      router.push('/');
    }
  }, [roomId, checkIn, checkOut, room, router]);

  if (!room || !checkIn || !checkOut) return null;

  // Calculate pricing
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
  
  const subtotal = nights * room.pricePerNight;
  const taxes = Math.round(subtotal * 0.1);
  const grandTotal = subtotal + taxes;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate Stripe payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Redirect to confirmation
      router.push(`/booking-confirmation?bookingRef=BK-${Math.floor(1000 + Math.random() * 9000)}`);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-8 md:px-16 mt-32 mb-24 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16">
      {/* Left Column: Form */}
      <div>
        <Link href={`/rooms/${roomId}`} className="inline-flex items-center text-gold text-xs font-medium uppercase tracking-[0.2em] mb-8 hover:text-forest transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Room
        </Link>
        
        <h1 className="font-display text-[40px] text-forest leading-none mb-10">Complete your booking</h1>

        <form onSubmit={handlePayment} className="space-y-12">
          {/* Guest Details */}
          <section>
            <h2 className="font-display text-[24px] text-forest mb-6 border-b border-sand pb-4">Guest Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-medium text-stone uppercase tracking-[0.15em] mb-2">First Name</label>
                <input required className="w-full bg-cream border border-sand rounded-none p-3.5 text-forest focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-colors font-body" />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-stone uppercase tracking-[0.15em] mb-2">Last Name</label>
                <input required className="w-full bg-cream border border-sand rounded-none p-3.5 text-forest focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-colors font-body" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-medium text-stone uppercase tracking-[0.15em] mb-2">Email Address</label>
                <input required type="email" className="w-full bg-cream border border-sand rounded-none p-3.5 text-forest focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-colors font-body" />
                <p className="text-[11px] text-stone mt-2">Your booking confirmation will be sent here.</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-medium text-stone uppercase tracking-[0.15em] mb-2">Phone Number</label>
                <input required type="tel" className="w-full bg-cream border border-sand rounded-none p-3.5 text-forest focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-colors font-body" />
              </div>
            </div>
          </section>

          {/* Payment Details (Stripe Mock) */}
          <section>
            <h2 className="font-display text-[24px] text-forest mb-6 border-b border-sand pb-4 flex items-center justify-between">
              Payment Method
              <Lock className="w-4 h-4 text-stone" />
            </h2>
            <div className="bg-cream border border-sand p-6">
              <div className="flex items-center gap-3 mb-6">
                <input type="radio" id="card" name="payment" defaultChecked className="text-olive focus:ring-olive accent-olive" />
                <label htmlFor="card" className="text-sm font-medium text-forest flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-stone" />
                  Credit or Debit Card
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-medium text-stone uppercase tracking-[0.15em] mb-2">Card Number</label>
                  <div className="relative">
                    <input required type="text" placeholder="0000 0000 0000 0000" maxLength={19} className="w-full bg-white border border-sand rounded-none p-3.5 text-forest focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-colors font-body font-mono text-sm tracking-widest" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-stone uppercase tracking-[0.15em] mb-2">Expiration</label>
                    <input required type="text" placeholder="MM/YY" maxLength={5} className="w-full bg-white border border-sand rounded-none p-3.5 text-forest focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-colors font-body font-mono text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-stone uppercase tracking-[0.15em] mb-2">CVC</label>
                    <input required type="text" placeholder="123" maxLength={4} className="w-full bg-white border border-sand rounded-none p-3.5 text-forest focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-colors font-body font-mono text-sm" />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-stone mt-4 flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              Payments are securely processed by Stripe. Your card details are never stored on our servers.
            </p>
          </section>

          <button 
            type="submit"
            disabled={isProcessing}
            className="w-full bg-forest text-white py-5 rounded-none text-[13px] uppercase tracking-[0.15em] font-medium hover:bg-olive transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing Payment...
              </span>
            ) : (
              `Pay $${grandTotal}`
            )}
          </button>
        </form>
      </div>

      {/* Right Column: Order Summary */}
      <div>
        <div className="sticky top-32 bg-forest text-cream p-8 rounded-none">
          <h3 className="font-display text-[24px] mb-8 border-b border-white/10 pb-4">Reservation Summary</h3>
          
          <div className="mb-8">
            <h4 className="text-[18px] font-display mb-1">{room.name}</h4>
            <p className="text-[13px] text-cream/70">{guests} Guest{parseInt(guests || '1') > 1 ? 's' : ''}</p>
          </div>

          <div className="space-y-6 border-b border-white/10 pb-8 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-cream/50 mb-1">Check-in</p>
                <p className="text-[14px]">{start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                <p className="text-[12px] text-cream/50 mt-1">From 3:00 PM</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.15em] text-cream/50 mb-1">Check-out</p>
                <p className="text-[14px]">{end.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                <p className="text-[12px] text-cream/50 mt-1">Until 11:00 AM</p>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-[12px] text-gold">{nights} Night{nights > 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-[14px]">
              <span className="text-cream/70">${room.pricePerNight} x {nights} nights</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-cream/70">Taxes & Fees</span>
              <span>${taxes}</span>
            </div>
            <div className="border-t border-white/10 pt-6 mt-6 flex justify-between items-end">
              <span className="text-[12px] uppercase tracking-[0.15em]">Total (USD)</span>
              <span className="font-display text-[32px] leading-none">${grandTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-linen">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-forest">Loading...</div>}>
        <CheckoutContent />
      </Suspense>
    </main>
  );
}
