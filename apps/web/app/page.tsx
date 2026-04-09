import InteractiveHero from '../components/InteractiveHero';
import StickyNav from '../components/StickyNav';
import SectionDivider from '../components/SectionDivider';
import {
  BoldStatement,
  TrustStats,
  HowItWorks,
  VerificationDemo,
  BrowseListingsDemo,
  ConnectionDemo,
  AntiScam,
  CrossPlatform,
  Testimonials,
  FinalCTA,
  Footer,
} from '../components/LandingSections';

export default async function LandingPage() {
  return (
    <main>
      <StickyNav />
      <InteractiveHero />
      <SectionDivider variant="dots" />
      <BoldStatement />
      <TrustStats />
      <SectionDivider variant="diamonds" />
      <HowItWorks />
      <SectionDivider variant="tarsier" />
      <VerificationDemo />
      <BrowseListingsDemo />
      <SectionDivider variant="dots" />
      <ConnectionDemo />
      <AntiScam />
      <SectionDivider variant="zigzag" />
      <CrossPlatform />
      <Testimonials />
      <SectionDivider variant="dots" />
      <FinalCTA />
      <Footer />
    </main>
  );
}
