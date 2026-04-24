import {
  Hero,
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
