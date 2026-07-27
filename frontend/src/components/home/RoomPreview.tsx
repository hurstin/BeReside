import Link from "next/link";
import { Room } from "@/types";

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  // Map background gradient to visualUrl or a default pattern based on id
  const getGradientClass = (id: string) => {
    switch(id) {
      case '1': return 'bg-gradient-to-br from-[#1e2a14] to-[#3a4a28]';
      case '2': return 'bg-gradient-to-br from-[#2a3020] to-[#1a2215]';
      case '3': return 'bg-gradient-to-br from-[#252d1c] to-[#3a4822]';
      default: return 'bg-gradient-to-br from-[#1c2418] to-[#2e3c22]';
    }
  };

  return (
    <Link href="/rooms" className="relative overflow-hidden cursor-pointer min-h-[420px] bg-forest group block">
      <div className={`absolute inset-0 transition-transform duration-600 ease-out group-hover:scale-105 ${getGradientClass(room.id)}`}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#12180a]/90 via-[#12180a]/20 to-transparent"></div>
      <div className="absolute top-7 right-7 w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white/50 text-[16px] transition-all duration-300 group-hover:border-gold group-hover:text-gold">
        →
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-9">
        {room.isPopular && (
          <div className="inline-block bg-teal text-white text-[10px] tracking-[0.12em] px-3 py-1 rounded-full mb-3 uppercase">
            POPULAR
          </div>
        )}
        <div className="font-display text-[28px] font-medium text-cream mb-1.5">
          {room.name}
        </div>
        <div className="text-[13px] text-gold tracking-[0.04em]">
          {room.pricePerNight}$ / Night
        </div>
      </div>
    </Link>
  );
}

export function RoomPreview() {
  const previewRooms: Room[] = [
    {
      id: '1',
      name: 'Family Room',
      pricePerNight: 450,
      description: '...',
      amenities: [],
      maxOccupancy: 4,
      type: 'family',
      isPopular: true
    },
    {
      id: '2',
      name: 'Double Room',
      pricePerNight: 350,
      description: '...',
      amenities: [],
      maxOccupancy: 2,
      type: 'double'
    }
  ];

  return (
    <section>
      <div className="px-6 md:px-16 pt-16 md:pt-24 pb-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <p className="text-[10px] tracking-[0.22em] text-amber font-medium mb-4 uppercase">
              Accommodations
            </p>
            <h2 className="font-display text-[clamp(32px,4vw,52px)] font-normal text-forest leading-[1.1] m-0">
              Rooms &amp; <em className="italic text-amber">Suites</em>
            </h2>
          </div>
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2.5 bg-amber text-white border-none py-3.5 px-8 rounded-[40px] text-[13px] tracking-[0.06em] cursor-pointer font-body font-normal transition-all duration-200 hover:bg-gold hover:-translate-y-[1px] no-underline mb-2"
          >
            View all rooms
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 bg-forest/5">
        {previewRooms.map(room => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </section>
  );
}
