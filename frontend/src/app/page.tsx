import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { StatsSection } from '@/components/home/stats-section';
import { FeaturedPackages } from '@/components/home/featured-packages';
import { WhyChooseUs } from '@/components/home/why-choose-us';
import { Newsletter } from '@/components/home/newsletter';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturedPackages />
      <WhyChooseUs />
      <Newsletter />
      <Footer />
    </>
  );
}
