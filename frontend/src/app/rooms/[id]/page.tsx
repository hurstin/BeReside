"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

// This is the combined type we need for the UI
export interface UIRoom {
  id: string;
  name: string;
  pricePerNight: number;
  description: string;
  amenities: string[];
  maxOccupancy: number;
  type: string;
  isTopChoice?: boolean;
}

// Maps a raw backend room to the rich UI format
function mapBackendRoomToUI(backendRoom: any): UIRoom {
  const t = backendRoom.type.toLowerCase();
  
  let name = `Room ${backendRoom.roomNumber}`;
  let description = "Experience the perfect blend of luxury and comfort in our meticulously designed rooms.";
  let amenities = ['Free WiFi', 'Daily Housekeeping'];
  let maxOccupancy = 2;
  let isTopChoice = false;

  if (t === 'family') {
    name = `Family Room - ${backendRoom.roomNumber}`;
    description = 'Welcome to our charming family room, located in a picturesque area. Perfect for a family getaway.';
    amenities = ['2 Single beds', '1 Double bed', '32m²'];
    maxOccupancy = 4;
  } else if (t === 'double') {
    name = `Double Room - ${backendRoom.roomNumber}`;
    description = 'Elegant double room with garden views, featuring a plush king bed, marble bathroom, and curated amenities.';
    amenities = ['1 King bed', 'Garden view', '28m²'];
    maxOccupancy = 2;
    isTopChoice = true;
  } else if (t === 'apartment') {
    name = `Apartment - ${backendRoom.roomNumber}`;
    description = 'Our most spacious offering — a private studio apartment with full kitchen, living area, and panoramic views.';
    amenities = ['Full kitchen', 'Panoramic view', '58m²'];
    maxOccupancy = 4;
  }

  return {
    id: backendRoom.id,
    name,
    pricePerNight: Number(backendRoom.basePricePerNight),
    description,
    amenities,
    maxOccupancy,
    type: backendRoom.type,
    isTopChoice,
  };
}

export default function BookRoomPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [room, setRoom] = useState<UIRoom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await apiFetch<any>(`/rooms/${id}`);
        setRoom(mapBackendRoomToUI(data));
      } catch (err: any) {
        setError("Room not found");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchRoom();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-forest flex items-center justify-center pt-32">
        <div className="w-8 h-8 border-2 border-sand border-t-cream rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-forest flex items-center justify-center pt-32">
        <div className="text-center">
          <h1 className="font-display text-cream text-4xl mb-4">Room not found</h1>
          <Link href="/rooms" className="text-gold tracking-widest text-sm uppercase hover:text-cream transition-colors">Return to rooms</Link>
        </div>
      </div>
    );
  }

  // Calculate nights
  const getDays = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  };

  const nights = getDays();
  const total = nights * room.pricePerNight;
  const taxes = Math.round(total * 0.1);
  const grandTotal = total + taxes;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const queryParams = new URLSearchParams({
      roomId: room.id,
      checkIn,
      checkOut,
      guests
    });
    
    router.push(`/checkout?${queryParams.toString()}`);
  };

  const visualClass = 'from-[#1e2810] to-[#384822]';

  return (
    <main className="min-h-screen bg-linen pb-24">
      {/* Hero */}
      <div className="bg-forest pt-[120px] md:pt-[180px] pb-12 md:pb-16 px-6 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url('/pattern-page.svg')" }}></div>
        <div className="max-w-6xl mx-auto relative">
          <Link href="/rooms" className="text-gold text-xs font-medium uppercase tracking-[0.2em] mb-6 inline-block hover:text-cream transition-colors">
            ← Back to Rooms
          </Link>
          <h1 className="font-display text-[clamp(40px,5vw,64px)] font-normal text-cream leading-[1.05] mb-5">
            {room.name}
          </h1>
          <p className="text-[15px] text-cream/70 max-w-[600px] leading-[1.8]">
            {room.description}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-16 mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16">
        {/* Left Col: Details */}
        <div>
          <div className={`w-full aspect-[16/9] rounded-none overflow-hidden bg-gradient-to-br ${visualClass} relative mb-14 border border-sand`}>
            {room.isTopChoice && (
              <div className="absolute top-6 left-6">
                <span className="inline-block bg-teal text-white text-[10px] tracking-[0.12em] px-4 py-1.5 rounded-full uppercase shadow-sm">
                  TOP CHOICE
                </span>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
               <span className="font-display text-[120px] text-white select-none">BeReside</span>
            </div>
          </div>

          <h2 className="font-display text-[32px] text-forest mb-8 border-b border-sand pb-4">Room Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-14">
            {room.amenities.map(amenity => (
              <div key={amenity} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-sage"></span>
                <span className="text-stone text-[14px]">{amenity}</span>
              </div>
            ))}
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-sage"></span>
              <span className="text-stone text-[14px]">Max Guests: {room.maxOccupancy}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-sage"></span>
              <span className="text-stone text-[14px]">Free WiFi</span>
            </div>
          </div>
          
          <h3 className="font-display text-[32px] text-forest mb-6 border-b border-sand pb-4">About your stay</h3>
          <div className="prose prose-stone max-w-none text-[15px] leading-[1.8] text-driftwood">
            <p className="mb-4">
              Experience the perfect blend of luxury and comfort in our meticulously designed rooms.
              Whether you are travelling for business or leisure, our accommodations provide a tranquil
              retreat from the bustling world outside.
            </p>
            <p>
              Every room features premium bedding, artisanal toiletries, and thoughtful touches to make
              your stay unforgettable. We take pride in delivering an exceptional experience tailored to 
              your individual needs.
            </p>
          </div>
        </div>

        {/* Right Col: Booking Form */}
        <div>
          <div className="sticky top-32 bg-cream border border-sand p-8 shadow-sm rounded-sm">
            <div className="mb-8 flex items-end gap-2 border-b border-sand pb-6">
              <span className="font-display text-[44px] leading-none text-forest">${room.pricePerNight}</span>
              <span className="text-stone text-[12px] uppercase tracking-[0.1em] mb-1.5">/ Night</span>
            </div>

            <form onSubmit={handleBooking} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-medium text-stone uppercase tracking-[0.15em] mb-2">Check-in</label>
                  <input 
                    type="date" 
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    required
                    className="w-full bg-linen border border-sand rounded-none p-3.5 text-forest text-[14px] focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-colors font-body"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-medium text-stone uppercase tracking-[0.15em] mb-2">Check-out</label>
                  <input 
                    type="date" 
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    required
                    className="w-full bg-linen border border-sand rounded-none p-3.5 text-forest text-[14px] focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-colors font-body"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-stone uppercase tracking-[0.15em] mb-2">Guests</label>
                <select 
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-linen border border-sand rounded-none p-3.5 text-forest text-[14px] focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-colors appearance-none font-body"
                >
                  {Array.from({ length: room.maxOccupancy }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              {nights > 0 && (
                <div className="bg-linen p-5 border border-sand mt-8 space-y-3">
                  <div className="flex justify-between text-driftwood text-[14px]">
                    <span>${room.pricePerNight} x {nights} nights</span>
                    <span>${total}</span>
                  </div>
                  <div className="flex justify-between text-driftwood text-[14px]">
                    <span>Taxes & Fees (10%)</span>
                    <span>${taxes}</span>
                  </div>
                  <div className="border-t border-sand pt-4 mt-4 flex justify-between font-display text-[22px] text-forest">
                    <span>Total</span>
                    <span>${grandTotal}</span>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                className="w-full mt-8 bg-amber text-white py-4 rounded-full text-[13px] tracking-[0.1em] cursor-pointer font-body transition-all duration-300 hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-[1px]"
                disabled={!checkIn || !checkOut || isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Reserve Now"}
              </button>
              
              <p className="text-center text-[11px] text-stone mt-4 tracking-[0.02em]">
                You won&apos;t be charged yet
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
