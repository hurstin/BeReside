"use client";

import Link from "next/link";

export default function HeroCanvas() {
  return (
    <div className="relative h-screen flex items-end px-6 md:px-16 pb-12 md:pb-20 overflow-hidden bg-forest">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2212] via-[#2D3720] to-[#3a4a28]"></div>
      <div className="absolute inset-0 opacity-[0.018]" style={{ backgroundImage: "url('/pattern-hero.svg')" }}></div>
      <div className="relative z-10 max-w-[700px]">
        <p className="text-[11px] tracking-[0.2em] text-gold mb-5 font-normal fade-up fade-up-1 uppercase">
          LUXURY HOSPITALITY SINCE 2026
        </p>
        <h1 className="font-display text-[clamp(52px,8vw,88px)] font-normal text-cream leading-[1.05] mb-7 fade-up fade-up-2">
          Welcome to our<br />
          <em className="italic text-gold">luxury</em> hotel
        </h1>
        <p className="text-[15px] text-cream/60 leading-[1.8] max-w-[420px] mb-11 fade-up fade-up-3">
          Mattis aliquam egestas vestibulum tellus tortor pulvinar. Velit sapien
          id fermentum aenean arcu eget. Viverra enim ac ut.
        </p>
        <div className="flex items-center gap-5 fade-up fade-up-4">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2.5 bg-amber text-white border-none py-3.5 px-8 rounded-[40px] text-[13px] tracking-[0.06em] cursor-pointer font-body font-normal transition-all duration-200 hover:bg-gold hover:-translate-y-[1px] no-underline"
          >
            View all rooms &nbsp;→
          </Link>
          <Link
            href="/our-hotel"
            className="inline-flex items-center gap-2.5 bg-transparent border border-cream/30 text-cream py-3.5 px-8 rounded-[40px] text-[13px] tracking-[0.06em] cursor-pointer font-body font-normal transition-all duration-200 hover:border-gold hover:text-gold no-underline"
          >
            Our story
          </Link>
        </div>
      </div>
      <div className="absolute right-16 bottom-20 flex flex-col items-center gap-2 text-cream/40 text-[10px] tracking-[0.18em]">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-cream/30 animate-scrollAnim"></div>
        <span>SCROLL</span>
      </div>
    </div>
  );
}
