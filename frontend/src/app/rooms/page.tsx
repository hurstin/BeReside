"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Room } from "@/types";
import { apiFetch } from "@/lib/api";

const enrichRoom = (apiRoom: any): Room => {
  let name = '';
  let description = '';
  let amenities: string[] = [];
  
  if (apiRoom.type === 'family') {
    name = `Family Room ${apiRoom.roomNumber}`;
    description = 'Welcome to our charming Bed & Breakfast, perfect for the whole family.';
    amenities = ['2 Single beds', '1 Double bed', '32m²', 'Wifi'];
  } else if (apiRoom.type === 'double') {
    name = `Double Room ${apiRoom.roomNumber}`;
    description = 'Elegant double room featuring a plush king bed and curated amenities.';
    amenities = ['1 King bed', 'Garden view', '28m²', 'Wifi', 'TV'];
  } else if (apiRoom.type === 'apartment') {
    name = `Apartment ${apiRoom.roomNumber}`;
    description = 'Our most spacious offering — a private studio apartment with full kitchen.';
    amenities = ['Full kitchen', 'Panoramic view', '58m²', 'Wifi', 'TV'];
  } else {
    name = `Standard Room ${apiRoom.roomNumber}`;
    description = 'A comfortable and beautifully designed room for your stay.';
    amenities = ['Wifi', 'TV', 'Air Conditioner'];
  }
  
  return {
    id: apiRoom.id,
    name,
    pricePerNight: Number(apiRoom.basePricePerNight),
    description,
    amenities,
    maxOccupancy: apiRoom.type === 'family' || apiRoom.type === 'apartment' ? 4 : 2,
    type: apiRoom.type,
    isTopChoice: apiRoom.roomNumber.endsWith('1'),
  };
};

export default function RoomsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await apiFetch<any[]>('/rooms');
        // Only show available rooms on the public page
        const availableRooms = data.filter(r => r.status === 'available');
        setRooms(availableRooms.map(enrichRoom));
      } catch (err) {
        console.error('Failed to fetch rooms', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, []);
  
  const filters = ["All", "Wifi", "Air Conditioner", "Phone", "TV", "Hanger", "Bell Ring"];

  const filteredRooms = activeFilter === "All" 
    ? rooms 
    : rooms.filter(room => room.amenities.includes(activeFilter));

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="bg-forest pt-[140px] md:pt-[224px] pb-12 md:pb-20 px-6 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url('/pattern-page.svg')" }}></div>
        <p className="text-[10px] tracking-[0.22em] text-gold uppercase mb-4 relative">
          Accommodations
        </p>
        <h1 className="font-display text-[clamp(44px,6vw,72px)] font-normal text-cream leading-[1.05] mb-5 relative">
          Perfectly <em className="italic text-gold">matched</em> rooms
        </h1>
        <p className="text-[15px] text-cream/55 leading-[1.8] max-w-[500px] relative">
          Mattis aliquam egestas vestibulum tellus tortor pulvinar. Velit sapien
          id fermentum aenean arcu eget. Viverra enim ac ut.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="py-6 px-6 md:py-8 md:px-16 bg-linen border-b border-sand flex gap-3 items-center flex-wrap">
        <span className="text-[12px] text-stone tracking-[0.08em] mr-2">AMENITIES</span>
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`border rounded-3xl py-[7px] px-[18px] text-[12px] cursor-pointer font-body transition-all duration-200 ${
              activeFilter === filter
                ? "bg-olive border-olive text-cream"
                : "bg-transparent border-sand text-driftwood hover:bg-olive hover:border-olive hover:text-cream"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Room List */}
      <div className="p-0">
        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-sand border-t-olive rounded-full animate-spin mb-4" />
            <p className="text-driftwood">Loading available rooms...</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-driftwood">No rooms available at the moment. Please check back later.</p>
          </div>
        ) : (
          filteredRooms.map((room, index) => {
            const num = (index + 1).toString().padStart(2, '0');
            const visualClass = [
              'from-[#2D3720] to-[#4a5c28]',
              'from-[#1e2810] to-[#384822]',
              'from-[#252c18] to-[#3a4824]',
              'from-[#1a2210] to-[#2e3c1e]'
            ][index % 4];

            return (
              <div key={room.id} className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-0 border-b border-sand min-h-[280px] transition-colors duration-200 hover:bg-linen group">
                <div className={`relative overflow-hidden bg-gradient-to-br ${visualClass} min-h-[200px] lg:min-h-full`}>
                  <div className="absolute bottom-6 left-6 font-display text-[72px] text-white/5 font-semibold leading-none">
                    {num}
                  </div>
                  {room.isTopChoice && (
                    <div className="absolute top-5 left-5">
                      <span className="inline-block bg-teal text-white text-[10px] tracking-[0.12em] px-3 py-1 rounded-full uppercase">
                        TOP CHOICE
                      </span>
                    </div>
                  )}
                </div>
                <div className="py-8 px-6 md:py-12 md:px-14 flex flex-col justify-between">
                  <div>
                    <h2 className="font-display text-[36px] text-forest font-normal mb-2">
                      {room.name}
                    </h2>
                    <div className="text-[14px] text-amber tracking-[0.04em] mb-5">
                      {room.pricePerNight}$ / Night
                    </div>
                    <div className="text-[14px] text-driftwood leading-[1.8] mb-7 flex-1">
                      {room.description}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0 mt-6 sm:mt-0">
                    <div className="flex flex-wrap gap-2.5">
                      {room.amenities.map(amenity => (
                        <span key={amenity} className="flex items-center gap-2 bg-linen border border-sand rounded-3xl py-2 px-4 text-[13px] text-driftwood">
                          <span className="w-1.5 h-1.5 rounded-full bg-sage"></span>
                          {amenity}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/rooms/${room.id}`}
                      className="inline-flex items-center gap-2.5 bg-amber text-white border-none py-3.5 px-8 rounded-[40px] text-[13px] tracking-[0.06em] cursor-pointer font-body font-normal transition-all duration-200 hover:bg-gold hover:-translate-y-[1px] no-underline whitespace-nowrap"
                    >
                      Book now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Benefits */}
      <div className="py-12 px-6 md:py-20 md:px-16 bg-linen">
        <p className="text-[10px] tracking-[0.22em] text-amber font-medium mb-4 uppercase">
          Included in every room
        </p>
        <h2 className="font-display text-[clamp(32px,4vw,52px)] font-normal text-forest leading-[1.1] m-0">
          Room <em className="italic text-amber">Benefits</em>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {[
            { icon: "📶", title: "High-Speed Wifi", desc: "Complimentary fibre internet throughout all rooms and common areas." },
            { icon: "❄️", title: "Climate Control", desc: "Individual air conditioning with precise temperature controls." },
            { icon: "📺", title: "Smart Television", desc: "55\" 4K smart TV with streaming services and hotel channel." },
            { icon: "☎️", title: "Direct Phone Line", desc: "24-hour concierge service available at a touch of a button." },
            { icon: "👕", title: "Wardrobe & Hangers", desc: "Full-length wardrobe with luxury hangers and complimentary safe." },
            { icon: "🛎️", title: "Bell Service", desc: "In-room bell ring connected to our attentive concierge team." },
          ].map((benefit, i) => (
            <div key={i} className="p-8 bg-cream border border-sand rounded shadow-sm">
              <div className="text-[22px] mb-3.5 text-olive">{benefit.icon}</div>
              <div className="font-display text-[20px] text-forest mb-2">{benefit.title}</div>
              <div className="text-[13px] text-stone leading-[1.7]">{benefit.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
