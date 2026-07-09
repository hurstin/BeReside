import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="bg-cream border-t border-sand p-16 grid grid-cols-[1fr_auto_1fr] items-start gap-10">
        <div className="text-[13px] text-stone leading-loose">
          <strong className="text-driftwood font-normal">Our address</strong>
          <br />
          <br />
          Envato
          <br />
          Level 13, 2 Elizabeth
          <br />
          Victoria 3000
          <br />
          Australia
        </div>

        <div className="text-center">
          <div className="font-display text-[22px] tracking-[0.18em] text-forest font-semibold">
            BEHOTEL
          </div>
          <span className="text-[9px] tracking-[0.22em] text-stone block mt-1 mb-4">
            SINCE 1989
          </span>
          <div className="w-[60px] h-[1px] bg-sand mx-auto my-4"></div>
          <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="w-8 h-8 border border-sand rounded-full flex items-center justify-center text-stone text-[12px] cursor-pointer transition-all duration-200 hover:border-amber hover:text-amber no-underline">f</a>
            <a href="#" className="w-8 h-8 border border-sand rounded-full flex items-center justify-center text-stone text-[12px] cursor-pointer transition-all duration-200 hover:border-amber hover:text-amber no-underline">t</a>
            <a href="#" className="w-8 h-8 border border-sand rounded-full flex items-center justify-center text-stone text-[12px] cursor-pointer transition-all duration-200 hover:border-amber hover:text-amber no-underline">d</a>
            <a href="#" className="w-8 h-8 border border-sand rounded-full flex items-center justify-center text-stone text-[12px] cursor-pointer transition-all duration-200 hover:border-amber hover:text-amber no-underline">in</a>
          </div>
        </div>

        <div className="text-right">
          <h4 className="text-[11px] tracking-[0.14em] text-stone mb-3.5 font-medium">
            Links
          </h4>
          <ul className="list-none flex flex-col gap-2">
            <li>
              <Link href="/find-booking" className="text-[13px] text-driftwood no-underline cursor-pointer transition-colors duration-200 hover:text-amber">
                Find My Booking
              </Link>
            </li>
            <li>
              <Link href="#" className="text-[13px] text-driftwood no-underline cursor-pointer transition-colors duration-200 hover:text-amber">
                Try our app
              </Link>
            </li>
            <li>
              <Link href="#" className="text-[13px] text-driftwood no-underline cursor-pointer transition-colors duration-200 hover:text-amber">
                Terms of use
              </Link>
            </li>
            <li>
              <Link href="#" className="text-[13px] text-driftwood no-underline cursor-pointer transition-colors duration-200 hover:text-amber">
                Cookies
              </Link>
            </li>
          </ul>
        </div>
      </footer>
      <div className="bg-cream border-t border-sand py-5 px-16 text-center text-[11px] text-stone tracking-[0.04em]">
        © 2026 Betheme by Muffin group · All Rights Reserved
      </div>
    </>
  );
}
