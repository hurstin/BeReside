import Link from "next/link";

export default function AboutStrip() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:min-h-[560px]">
      <div className="relative overflow-hidden bg-forest h-64 md:h-auto">
        <div className="w-full h-full min-h-full md:min-h-[480px] bg-gradient-to-br from-[#1a2212] via-[#2D3720] to-[#4a5c2a] flex items-center justify-center">
          <div className="text-center">
            <span className="font-display text-[120px] text-white/5 leading-none block">
              ❧
            </span>
          </div>
        </div>
      </div>
      <div className="py-12 px-6 md:py-20 md:px-[72px] flex flex-col justify-center bg-linen">
        <p className="text-[10px] tracking-[0.22em] text-amber font-medium mb-4 uppercase">
          Our Story
        </p>
        <h2 className="font-display text-[clamp(32px,4vw,52px)] font-normal text-forest leading-[1.1] mb-6">
          Welcome to our charming <em className="italic text-amber">Bed &amp; Breakfast</em>
        </h2>
        <p className="text-[15px] text-driftwood leading-[1.8] max-w-[480px]">
          Located in a picturesque area away from the hustle and bustle of the
          city. Venenatis sodales faucibus per justo ante. Lacinia placerat
          proin in pulvinar viverra. Hendrerit nisl a diam consectetuer at
          cultum.
        </p>
        <p className="text-[15px] text-driftwood leading-[1.8] max-w-[480px] mt-4">
          Mi facilisi aliquet consectetuer tellus at natoque nibh est in conubia.
          At nullam dignissim accumsan fermentum. Porta dui nascetur eget sed leo
          tempor.
        </p>
        <div className="font-display text-[28px] italic text-forest mt-8 font-medium">
          Justin Bremer
        </div>
        <div className="mt-7">
          <Link
            href="/our-hotel"
            className="inline-flex items-center gap-2.5 bg-amber text-white border-none py-3.5 px-8 rounded-[40px] text-[13px] tracking-[0.06em] cursor-pointer font-body font-normal transition-all duration-200 hover:bg-gold hover:-translate-y-[1px] no-underline"
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
}
