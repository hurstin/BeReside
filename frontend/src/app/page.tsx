import HeroCanvas from "@/components/home/HeroCanvas";
import AboutStrip from "@/components/home/AboutStrip";
import StatsBar from "@/components/home/StatsBar";
import { RoomPreview } from "@/components/home/RoomPreview";
import TestimonialSection from "@/components/home/TestimonialSection";

export default function Home() {
  return (
    <main>
      <HeroCanvas />
      <AboutStrip />
      <StatsBar />
      <RoomPreview />
      <TestimonialSection />
    </main>
  );
}
