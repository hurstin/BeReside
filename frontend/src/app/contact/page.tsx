"use client";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-forest pt-[140px] md:pt-[224px] pb-12 md:pb-20 px-6 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url('/pattern-page.svg')" }}></div>
        <p className="text-[10px] tracking-[0.22em] text-gold uppercase mb-4 relative">
          Contact Us
        </p>
        <h1 className="font-display text-[clamp(44px,6vw,72px)] font-normal text-cream leading-[1.05] mb-5 relative">
          Get in <em className="italic text-gold">touch</em>
        </h1>
        <p className="text-[15px] text-cream/55 leading-[1.8] max-w-[500px] relative">
          Mattis aliquam egestas vestibulum tellus tortor pulvinar. Velit sapien
          id fermentum aenean arcu eget. Viverra enim ac ut.
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-cream px-6 md:px-16 py-16 md:py-24 max-w-[1000px] mx-auto">
        <h2 className="font-display text-[52px] font-normal text-forest mb-14">
          Send a <em className="italic text-amber">message</em>
        </h2>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.12em] text-stone uppercase">Your Name</label>
              <input type="text" className="bg-transparent border-b border-sand py-3 text-[15px] text-charcoal font-body font-light outline-none transition-colors duration-200 focus:border-amber placeholder:text-sand" placeholder="John Doe" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.12em] text-stone uppercase">Email Address</label>
              <input type="email" className="bg-transparent border-b border-sand py-3 text-[15px] text-charcoal font-body font-light outline-none transition-colors duration-200 focus:border-amber placeholder:text-sand" placeholder="john@example.com" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.12em] text-stone uppercase">Phone Number</label>
              <input type="text" className="bg-transparent border-b border-sand py-3 text-[15px] text-charcoal font-body font-light outline-none transition-colors duration-200 focus:border-amber placeholder:text-sand" placeholder="+1 234 567 890" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.12em] text-stone uppercase">Subject</label>
              <input type="text" className="bg-transparent border-b border-sand py-3 text-[15px] text-charcoal font-body font-light outline-none transition-colors duration-200 focus:border-amber placeholder:text-sand" placeholder="Booking inquiry" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-8">
            <label className="text-[11px] tracking-[0.12em] text-stone uppercase">Your Message</label>
            <textarea className="bg-transparent border-b border-sand py-3 text-[15px] text-charcoal font-body font-light outline-none transition-colors duration-200 focus:border-amber placeholder:text-sand resize-y min-h-[100px]" placeholder="Hello..."></textarea>
          </div>

          <div className="flex justify-end mt-10 pt-6 border-t border-sand">
            <button type="button" className="bg-transparent border-none text-[12px] tracking-[0.15em] text-forest cursor-pointer font-body font-medium uppercase flex items-center gap-3 transition-colors duration-200 hover:text-amber group">
              SEND MESSAGE
              <div className="w-10 h-10 border border-forest rounded-full flex items-center justify-center text-[16px] transition-all duration-200 group-hover:bg-amber group-hover:border-amber group-hover:text-white">
                →
              </div>
            </button>
          </div>
        </form>
      </div>

    </main>
  );
}
