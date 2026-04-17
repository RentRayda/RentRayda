import {
  Hero,
  TwoPathCTA,
  WhyWeExist,
  HowItWorks,
  Safety,
  BuiltForMigrants,
  FAQ,
  FinalCTA,
  Footer,
} from '../components/LandingSections';

export default async function LandingPage() {
  return (
    <main>
      <Hero />
      <TwoPathCTA />
      <WhyWeExist />
      <HowItWorks />
      <Safety />
      <BuiltForMigrants />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
