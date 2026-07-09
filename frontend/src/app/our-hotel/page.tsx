"use client";

export default function OurHotelPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-forest pt-[224px] pb-20 px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url('/pattern-page.svg')" }}></div>
        <p className="text-[10px] tracking-[0.22em] text-gold uppercase mb-4 relative">
          About Us
        </p>
        <h1 className="font-display text-[clamp(44px,6vw,72px)] font-normal text-cream leading-[1.05] mb-5 relative">
          Welcome to our<br /><em className="italic text-gold">luxury</em> hotel
        </h1>
        <p className="text-[15px] text-cream/55 leading-[1.8] max-w-[500px] relative">
          Mattis aliquam egestas vestibulum tellus tortor pulvinar. Velit sapien
          id fermentum aenean arcu eget. Viverra enim ac ut.
        </p>
      </div>

      {/* Grid 2 */}
      <div className="grid grid-cols-2 gap-0.5">
        <div className="relative overflow-hidden min-h-[520px] bg-forest">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a2212] to-[#3a4c28] flex items-center justify-center">
            <span className="font-display text-[180px] text-white/5 font-semibold">B</span>
          </div>
        </div>
        <div className="p-[72px] bg-linen">
          <p className="text-[10px] tracking-[0.22em] text-amber font-medium mb-4 uppercase">
            Our Story
          </p>
          <h2 className="font-display text-[clamp(32px,4vw,52px)] font-normal text-forest leading-[1.1] mb-6">
            Welcome to our charming <em className="italic text-amber">Bed &amp; Breakfast</em>
          </h2>
          <p className="text-[15px] text-driftwood leading-[1.8] max-w-[480px]">
            Located in a picturesque area away from the hustle and bustle of the city. Venenatis sodales faucibus per justo ante. Lacinia placerat proin in pulvinar viverra. Hendrerit nisl a diam consectetuer at cultum.
          </p>
          <p className="text-[15px] text-driftwood leading-[1.8] max-w-[480px] mt-4">
            Mi facilisi aliquet consectetuer tellus at natoque nibh est in conubia. At nullam dignissim accumsan fermentum. Porta dui nascetur eget sed leo tempor ullamcorper. Pellentesque etiam vehicula risus facilisis facilisis. Odio placerat nisi libero nunc cras pellentesque.
          </p>
          <p className="text-[15px] text-driftwood leading-[1.8] max-w-[480px] mt-4">
            Ante per lorem neque congue condimentum. Parturient adipiscing vehicula pede dui at ipsum sem iaculis sed tincidunt. Ipsum pharetra placerat nisl eros.
          </p>
          <div className="font-display text-[28px] italic text-forest mt-7 font-medium">Justin Bremer</div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-forest p-16 grid grid-cols-3 gap-0">
        <div className="text-center px-8 border-r border-white/10">
          <div className="font-display text-[56px] font-normal text-cream leading-none mb-2">250</div>
          <div className="text-[12px] text-stone tracking-[0.1em] leading-relaxed uppercase">Rooms available</div>
        </div>
        <div className="text-center px-8 border-r border-white/10">
          <div className="font-display text-[56px] font-normal text-cream leading-none mb-2">120<span className="text-[24px] text-gold">k</span></div>
          <div className="text-[12px] text-stone tracking-[0.1em] leading-relaxed uppercase">Happy guests</div>
        </div>
        <div className="text-center px-8">
          <div className="font-display text-[56px] font-normal text-cream leading-none mb-2">98<span className="text-[24px] text-gold">%</span></div>
          <div className="text-[12px] text-stone tracking-[0.1em] leading-relaxed uppercase">Satisfaction rate</div>
        </div>
      </div>

      {/* Large Image Section */}
      <div className="relative h-[480px] overflow-hidden bg-forest">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2212] via-[#2D3720] to-[#4a5c28] flex items-center justify-center">
          <div className="text-center">
            <span className="font-display text-[36px] italic text-cream/15">Our rooms are your own personal sanctuary</span>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-forest/85 to-transparent flex items-center p-16">
          <div>
            <h2 className="font-display text-[44px] text-cream font-normal max-w-[380px] leading-[1.2]">
              Our rooms are your own <em className="italic text-gold">personal</em> sanctuary
            </h2>
            <a href="/rooms" className="mt-7 inline-flex items-center gap-2.5 bg-amber text-white border-none py-3.5 px-8 rounded-[40px] text-[13px] tracking-[0.06em] cursor-pointer font-body font-normal transition-all duration-200 hover:bg-gold hover:-translate-y-[1px] no-underline">
              View all rooms &nbsp;→
            </a>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <section className="px-16 pt-24 pb-12">
        <p className="text-[10px] tracking-[0.22em] text-amber font-medium mb-4 uppercase">The Team</p>
        <h2 className="font-display text-[clamp(32px,4vw,52px)] font-normal text-forest leading-[1.1] mb-6">
          Meet our <em className="italic text-amber">people</em>
        </h2>
      </section>

      <div className="grid grid-cols-2 gap-0.5 mb-0.5">
        <div className="p-14 bg-linen flex gap-7 items-start transition-colors duration-200 hover:bg-sand">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c97d1a] to-[#2D3720] shrink-0 flex items-center justify-center font-display text-[24px] text-white italic">
            E
          </div>
          <div>
            <div className="font-display text-[24px] font-medium text-forest mb-1.5">Evelyn Smith</div>
            <div className="text-[13px] text-driftwood leading-[1.9]">
              +61(0) 383 766 284<br />
              <a href="#" className="text-amber no-underline">noreply@envato.com</a>
            </div>
            <div className="text-[13px] text-stone leading-[1.7] mt-3">
              Consectetuer egestas massa commodo et blandit. Convallis per sit nostra bibendum aliquam velit.
            </div>
          </div>
        </div>
        <div className="p-14 bg-linen flex gap-7 items-start transition-colors duration-200 hover:bg-sand">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2e8b70] to-[#2D3720] shrink-0 flex items-center justify-center font-display text-[24px] text-white italic">
            J
          </div>
          <div>
            <div className="font-display text-[24px] font-medium text-forest mb-1.5">Josephine Albertino</div>
            <div className="text-[13px] text-driftwood leading-[1.9]">
              +61(0) 383 766 284<br />
              <a href="#" className="text-amber no-underline">noreply@envato.com</a>
            </div>
            <div className="text-[13px] text-stone leading-[1.7] mt-3">
              Eu lacinia sollicitudin efficitur vehicula nisl adipiscing. Hendrerit nam nascetur risus facilisis.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
