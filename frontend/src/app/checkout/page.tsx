"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, CreditCard, ChevronLeft, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { UIRoom } from "../rooms/[id]/page";

// We'll reuse the mapping logic by copying it for simplicity
function mapBackendRoomToUI(backendRoom: any): UIRoom {
  const t = backendRoom.type.toLowerCase();
  let name = `Room ${backendRoom.roomNumber}`;
  let pricePerNight = Number(backendRoom.basePricePerNight);
  if (t === 'family') name = `Family Room - ${backendRoom.roomNumber}`;
  else if (t === 'double') name = `Double Room - ${backendRoom.roomNumber}`;
  else if (t === 'apartment') name = `Apartment - ${backendRoom.roomNumber}`;
  return { ...backendRoom, name, pricePerNight };
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const roomId = searchParams.get('roomId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');

  const [room, setRoom] = useState<UIRoom | null>(null);
  const [isLoadingRoom, setIsLoadingRoom] = useState(true);

  const [guestFirstName, setGuestFirstName] = useState('');
  const [guestLastName, setGuestLastName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState<string>('');

  useEffect(() => {
    setIdempotencyKey(crypto.randomUUID());
  }, []);

  useEffect(() => {
    if (!roomId) return;
    const fetchRoom = async () => {
      try {
        const data = await apiFetch<any>(`/rooms/${roomId}`);
        setRoom(mapBackendRoomToUI(data));
      } catch (err) {
        console.error("Failed to load room for checkout");
      } finally {
        setIsLoadingRoom(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  if (!roomId || !checkIn || !checkOut || !guests) {
    return (
      <div className="min-h-screen bg-linen flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="font-display text-[40px] text-forest mb-4">Missing Booking Details</h1>
          <p className="text-stone mb-8">Please return to the rooms page to select your dates.</p>
          <Link href="/rooms" className="text-forest underline underline-offset-4 font-medium uppercase tracking-[0.1em] text-[13px]">
            View Rooms
          </Link>
        </div>
      </div>
    );
  }

  if (isLoadingRoom) return <div className="min-h-screen bg-linen flex items-center justify-center p-6"><div className="text-forest uppercase tracking-widest text-sm animate-pulse">Loading Checkout...</div></div>;
  if (!room) return <div className="min-h-screen bg-linen flex items-center justify-center p-6"><div className="text-forest">Room not found</div></div>;

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
  
  const subtotal = nights * room.pricePerNight;
  const taxes = Math.round(subtotal * 0.1);
  const grandTotal = subtotal + taxes;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await apiFetch<{ booking: { id: string }, url: string | null }>('/public/bookings', {
        method: 'POST',
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          roomId: room.id,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          guestEmail,
          guestFirstName,
          guestLastName,
          guestPhone
        }),
      });

      if (response.url) {
        // Redirect to Stripe checkout session
        window.location.href = response.url;
      } else {
        // Fallback if no stripe session (e.g. 0 amount)
        router.push(`/booking-confirmation?bookingRef=${response.booking.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process booking');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-16 mt-24 md:mt-32 mb-16 md:mb-24 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 md:gap-16">
      {/* Left Column: Form */}
      <div>
        <Link href={`/rooms/${roomId}`} className="inline-flex items-center text-gold text-xs font-medium uppercase tracking-[0.2em] mb-8 hover:text-forest transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Room
        </Link>
        
        <h1 className="font-display text-[40px] text-forest leading-none mb-10">Complete your booking</h1>

        <form onSubmit={handlePayment} className="space-y-12">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-none flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Guest Details */}
          <section>
            <h2 className="font-display text-[24px] text-forest mb-6 border-b border-sand pb-4">Guest Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-medium text-stone uppercase tracking-[0.15em] mb-2">First Name</label>
                <input 
                  required 
                  value={guestFirstName}
                  onChange={(e) => setGuestFirstName(e.target.value)}
                  className="w-full bg-cream border border-sand rounded-none p-3.5 text-forest focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-colors font-body" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-stone uppercase tracking-[0.15em] mb-2">Last Name</label>
                <input 
                  required 
                  value={guestLastName}
                  onChange={(e) => setGuestLastName(e.target.value)}
                  className="w-full bg-cream border border-sand rounded-none p-3.5 text-forest focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-colors font-body" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-medium text-stone uppercase tracking-[0.15em] mb-2">Email Address</label>
                <input 
                  required 
                  type="email" 
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full bg-cream border border-sand rounded-none p-3.5 text-forest focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-colors font-body" 
                />
                <p className="text-[11px] text-stone mt-2">Your booking confirmation will be sent here.</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-medium text-stone uppercase tracking-[0.15em] mb-2">Phone Number</label>
                <input 
                  required 
                  type="tel" 
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full bg-cream border border-sand rounded-none p-3.5 text-forest focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-colors font-body" 
                />
              </div>
            </div>
          </section>

          {/* Payment Details (Stripe Mock) */}
          <section>
            <h2 className="font-display text-[24px] text-forest mb-6 border-b border-sand pb-4 flex items-center justify-between">
              Payment Method
              <Lock className="w-4 h-4 text-stone" />
            </h2>
            <div className="bg-cream border border-sand p-6 text-sm text-stone">
              <p>You will be securely redirected to Stripe to complete your payment.</p>
            </div>
          </section>

          <button 
            type="submit"
            disabled={isProcessing}
            className="w-full bg-forest text-white py-5 rounded-none text-[13px] uppercase tracking-[0.15em] font-medium hover:bg-olive transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting to Secure Payment...
              </span>
            ) : (
              `Proceed to Payment ($${grandTotal})`
            )}
          </button>
        </form>
      </div>

      {/* Right Column: Order Summary */}
      <div>
        <div className="sticky top-24 md:top-32 bg-forest text-cream p-6 md:p-8 rounded-none">
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
