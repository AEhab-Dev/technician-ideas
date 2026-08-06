
  import HeroSlider from "@/components/home/HeroSlider";
  import WorkshopSection from "@/components/home/WorkshopSection";
  import JoinTeamForm from "@/components/home/JoinTeamForm";
  import { photographers } from "@/lib/photographers";

  export default function HomePage() {
    return (
      <>
        {/* Hero — full-screen image carousel */}
        <HeroSlider photographers={photographers} />

        {/* Workshops */}
        <WorkshopSection />

        {/* Join the Team */}
        <JoinTeamForm />
      </>
    );
  }