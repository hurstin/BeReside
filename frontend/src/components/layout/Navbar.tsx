"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-12 py-5 transition-all duration-400 ${
        scrolled ? "bg-cream/95 shadow-[0_1px_0_var(--sand)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <Link href="/" className="flex flex-col items-start gap-0 no-underline cursor-pointer">
        <span className={`font-display text-[22px] font-semibold tracking-[0.18em] leading-none transition-colors duration-400 ${scrolled ? 'text-forest' : 'text-cream'}`}>
          BEHOTEL
        </span>
        <span className={`text-[9px] tracking-[0.22em] font-normal mt-[2px] transition-colors duration-400 ${scrolled ? 'text-stone' : 'text-cream/60'}`}>
          SINCE 1989
        </span>
      </Link>

      <ul className="flex gap-9 list-none">
        {[
          { name: 'Home', path: '/' },
          { name: 'Our Hotel', path: '/our-hotel' },
          { name: 'Rooms', path: '/rooms' },
          { name: 'Restaurant', path: '/restaurant' },
          { name: 'Contact', path: '/contact' },
          { name: 'Find Booking', path: '/find-booking' },
        ].map((link) => (
          <li key={link.name}>
            <Link
              href={link.path}
              className={`text-[13px] tracking-[0.06em] no-underline cursor-pointer relative pb-[3px] transition-colors duration-200 group ${
                scrolled ? 'text-driftwood hover:text-forest' : 'text-cream/80 hover:text-cream'
              }`}
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-amber transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
        ))}
      </ul>

      <div className={`text-[13px] tracking-[0.04em] transition-colors duration-400 ${scrolled ? 'text-driftwood' : 'text-cream/80'}`}>
        +61 (0) 3 8376 6284
      </div>
    </nav>
  );
}
