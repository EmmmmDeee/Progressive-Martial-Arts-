import { Hero } from "@/components/site/hero";
import { Marquee } from "@/components/site/marquee";
import { About } from "@/components/site/about";
import { Philosophy } from "@/components/site/philosophy";
import { Arts } from "@/components/site/arts";
import { DisciplineSelector } from "@/components/site/discipline-selector";
import { ComparisonTable } from "@/components/site/comparison-table";
import { Programs } from "@/components/site/programs";
import { BeltProgression } from "@/components/site/belt-progression";
import { LineageStrip } from "@/components/site/lineage-strip";
import { Shop } from "@/components/site/shop";
import { Timetable } from "@/components/site/timetable";
import { ClassExperience } from "@/components/site/class-experience";
import { Instructors } from "@/components/site/instructors";
import { Seminars } from "@/components/site/seminars";
import { Testimonials } from "@/components/site/testimonials";
import { CommunityWall } from "@/components/site/community-wall";
import { TrainingTips } from "@/components/site/training-tips";
import { StatsBand } from "@/components/site/stats-band";
import { Pricing } from "@/components/site/pricing";
import { MembershipBenefits } from "@/components/site/membership-benefits";
import { FaqSection } from "@/components/site/faq-section";
import { ConversionBand } from "@/components/site/conversion-band";
import { Contact } from "@/components/site/contact";
import { FirstVisit } from "@/components/site/first-visit";
import { SafetyCulture } from "@/components/site/safety-culture";
import { Location } from "@/components/site/location";
import { BlogSection } from "@/components/site/blog-section";

export function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <StatsBand />
      <About />
      <Philosophy />
      <Arts />
      <ComparisonTable />
      <DisciplineSelector />
      <Programs />
      <BeltProgression />
      <LineageStrip />
      <Shop />
      <Timetable />
      <ClassExperience />
      <Instructors />
      <Seminars />
      <Testimonials />
      <CommunityWall />
      <TrainingTips />
      <FirstVisit />
      <SafetyCulture />
      <Pricing />
      <MembershipBenefits />
      <FaqSection />
      <BlogSection />
      <Location />
      <ConversionBand />
      <Contact />
    </>
  );
}
