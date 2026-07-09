export default function StatsBar() {
  return (
    <div className="bg-forest p-16 grid grid-cols-3 gap-0">
      <div className="text-center px-8 border-r border-white/10">
        <div className="font-display text-[56px] font-normal text-cream leading-none mb-2">
          250
        </div>
        <div className="text-[12px] text-stone tracking-[0.1em] leading-relaxed uppercase">
          Rooms &amp; suites<br />available
        </div>
      </div>
      <div className="text-center px-8 border-r border-white/10">
        <div className="font-display text-[56px] font-normal text-cream leading-none mb-2">
          120<span className="text-[24px] text-gold">k</span>
        </div>
        <div className="text-[12px] text-stone tracking-[0.1em] leading-relaxed uppercase">
          Happy guests have<br />trusted our hotel
        </div>
      </div>
      <div className="text-center px-8 border-none">
        <div className="font-display text-[56px] font-normal text-cream leading-none mb-2">
          98<span className="text-[24px] text-gold">%</span>
        </div>
        <div className="text-[12px] text-stone tracking-[0.1em] leading-relaxed uppercase">
          Satisfaction rate<br />from our guests
        </div>
      </div>
    </div>
  );
}
