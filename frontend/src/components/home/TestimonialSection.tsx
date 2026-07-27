export default function TestimonialSection() {
  return (
    <div className="bg-linen text-center px-6 md:px-16 py-16 md:py-24">
      <div className="text-amber text-[14px]">★★★★★</div>
      <p className="font-display text-[clamp(20px,3vw,32px)] font-normal text-forest leading-[1.5] max-w-[720px] mx-auto mt-5 mb-8 italic">
        &quot;Consectetuer nisl sociosqu vivamus purus et hendrerit a netus
        consequat. Interdum dignissim est pede fermentum cubilia tristique.
        Convallis sollicitudin porttitor lorem at consectetuer sem.&quot;
      </p>
      <p className="text-[13px] text-driftwood tracking-[0.08em]">
        Dorothy Diaz
      </p>
      <div className="flex items-center justify-center gap-2 mt-4 text-[12px] text-stone">
        <span className="text-amber">★</span> Trustpilot &nbsp;·&nbsp; from 200+
        reviews
      </div>
    </div>
  );
}
