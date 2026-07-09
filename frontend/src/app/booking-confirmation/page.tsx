"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Calendar, MapPin } from "lucide-react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const [bookingRef, setBookingRef] = useState<string>('');

  useEffect(() => {
    // Generate a mock booking reference if not provided in URL
    const ref = searchParams.get('bookingRef') || `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRef(ref);
  }, [searchParams]);

  return (
    <div className="bg-cream border border-sand p-10 md:p-16 max-w-2xl mx-auto shadow-sm relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-full -z-0"></div>

      <div className="relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-olive/10 text-olive mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        
        <h1 className="font-display text-[40px] text-forest leading-none mb-4">Booking Confirmed!</h1>
        <p className="text-stone text-[15px] mb-8">
          Thank you for choosing BeReside. We have sent your booking details to your email address.
        </p>

        <div className="bg-linen p-6 border border-sand text-left mb-10">
          <p className="text-[10px] font-medium text-stone uppercase tracking-[0.15em] mb-2">Booking Reference</p>
          <p className="font-display text-[24px] text-forest mb-6">{bookingRef}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-medium text-forest mb-1">Check-in Info</p>
                <p className="text-[12px] text-stone leading-relaxed">
                  Rooms are available from 3:00 PM on your day of arrival.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-medium text-forest mb-1">Getting Here</p>
                <p className="text-[12px] text-stone leading-relaxed">
                  Detailed directions and parking information have been emailed to you.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Link 
          href="/"
          className="inline-block bg-forest text-white px-10 py-4 rounded-none text-[13px] uppercase tracking-[0.15em] font-medium hover:bg-olive transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <main className="min-h-screen bg-linen flex items-center justify-center py-24 px-4">
      <Suspense fallback={<div className="text-forest">Loading your confirmation...</div>}>
        <ConfirmationContent />
      </Suspense>
    </main>
  );
}
