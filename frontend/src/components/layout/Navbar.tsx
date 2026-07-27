"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname() || "";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Pages with a dark hero section where white text is visible at the top
  const isDarkHero = 
    pathname === "/" || 
    pathname === "/rooms" || 
    pathname === "/restaurant" || 
    pathname.startsWith("/rooms/");
    
  const isScrolled = scrolled || !isDarkHero;

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-5 transition-all duration-400 ${
        isScrolled ? "bg-cream/95 shadow-[0_1px_0_var(--sand)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <Link href="/" className="flex flex-col items-start gap-0 no-underline cursor-pointer">
        <span className={`font-display text-[22px] font-semibold tracking-[0.18em] leading-none transition-colors duration-400 ${isScrolled ? 'text-forest' : 'text-cream'}`}>
          BERESIDE
        </span>
        <span className={`text-[9px] tracking-[0.22em] font-normal mt-[2px] transition-colors duration-400 ${isScrolled ? 'text-stone' : 'text-cream/60'}`}>
          SINCE 2026
        </span>
      </Link>

      <ul className="hidden lg:flex gap-9 list-none">
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
                isScrolled ? 'text-driftwood hover:text-forest' : 'text-cream/80 hover:text-cream'
              }`}
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-amber transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
        ))}
      </ul>

      <div className={`hidden md:block text-[13px] tracking-[0.04em] transition-colors duration-400 ${isScrolled ? 'text-driftwood' : 'text-cream/80'}`}>
        +234 9068233270
      </div>
      
      {/* Mobile Menu Toggle */}
      <button 
        className={`lg:hidden p-2 -mr-2 transition-colors duration-400 ${isScrolled ? 'text-forest' : 'text-cream'}`}
        onClick={() => setMobileMenuOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>
    </nav>

    {/* Mobile Menu Overlay */}
    {mobileMenuOpen && (
      <div className="fixed inset-0 z-[200] bg-cream flex flex-col px-6 py-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-12">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-start gap-0 no-underline cursor-pointer">
            <span className="font-display text-[22px] font-semibold tracking-[0.18em] leading-none text-forest">
              BERESIDE
            </span>
            <span className="text-[9px] tracking-[0.22em] font-normal mt-[2px] text-stone">
              SINCE 2026
            </span>
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2 text-forest">
            <X className="w-7 h-7" />
          </button>
        </div>

        <ul className="flex flex-col gap-6 list-none mb-12">
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
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-display text-forest no-underline cursor-pointer"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8 border-t border-sand text-driftwood text-sm text-center">
          +234 9068233270
        </div>
      </div>
    )}
    </>
  );
}
