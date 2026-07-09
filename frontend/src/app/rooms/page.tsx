"use client";

import { useState } from "react";
import Link from "next/link";
import { Room } from "@/types";

const mockRooms: Room[] = [
  {
    id: '1',
    name: 'Family Room',
    pricePerNight: 450,
    description: 'Welcome to our charming Bed & Breakfast, located in a picturesque area away from the hustle and bustle of the city. Turpis et leo duis diam platea nulla habitant vivamus vel.',
    amenities: ['2 Single beds', '1 Double bed', '32m²'],
    maxOccupancy: 4,
    type: 'family',
  },
  {
    id: '2',
    name: 'Double Room',
    pricePerNight: 350,
    description: 'Elegant double room with garden views, featuring a plush king bed, marble bathroom, and curated amenities for the discerning traveller seeking comfort and refinement.',
    amenities: ['1 King bed', 'Garden view', '28m²'],
    maxOccupancy: 2,
    type: 'double',
    isTopChoice: true,
  },
  {
    id: '3',
    name: 'Queen Room',
    pricePerNight: 320,
    description: 'A spacious sanctuary with a queen bed and courtyard views. Thoughtfully appointed with organic textures and natural light for complete tranquillity.',
    amenities: ['1 Queen bed', 'Courtyard view', '36m²'],
    maxOccupancy: 2,
    type: 'double',
  },
  {
    id: '4',
    name: 'Apartment',
    pricePerNight: 500,
    description: 'Our most spacious offering — a private studio apartment with full kitchen, living area, and panoramic views. The ultimate retreat for extended stays.',
    amenities: ['Full kitchen', 'Panoramic view', '58m²'],
    maxOccupancy: 4,
    type: 'apartment',
  }
];

export default function RoomsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  
  const filters = ["All", "Wifi", "Air Conditioner", "Phone", "TV", "Hanger", "Bell Ring"];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="bg-forest pt-[224px] pb-20 px-16 relative overflow-hidden">
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
      <div className="py-8 px-16 bg-linen border-b border-sand flex gap-3 items-center flex-wrap">
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
        {mockRooms.map((room, index) => {
          const num = (index + 1).toString().padStart(2, '0');
          const visualClass = [
            'from-[#2D3720] to-[#4a5c28]',
            'from-[#1e2810] to-[#384822]',
            'from-[#252c18] to-[#3a4824]',
            'from-[#1a2210] to-[#2e3c1e]'
          ][index % 4];

          return (
            <div key={room.id} className="grid grid-cols-[380px_1fr] gap-0 border-b border-sand min-h-[280px] transition-colors duration-200 hover:bg-linen group">
              <div className={`relative overflow-hidden bg-gradient-to-br ${visualClass}`}>
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
              <div className="py-12 px-14 flex flex-col justify-between">
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
                <div className="flex justify-between items-center">
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
        })}
      </div>

      {/* Benefits */}
      <div className="py-20 px-16 bg-linen">
        <p className="text-[10px] tracking-[0.22em] text-amber font-medium mb-4 uppercase">
          Included in every room
        </p>
        <h2 className="font-display text-[clamp(32px,4vw,52px)] font-normal text-forest leading-[1.1] m-0">
          Room <em className="italic text-amber">Benefits</em>
        </h2>
        <div className="grid grid-cols-3 gap-6 mt-10">
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
