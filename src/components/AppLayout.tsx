import React from 'react';
import Header from './Header';
import Footer from './Footer';
import HeroSection from './HeroSection';
import CategoryGrid from './CategoryGrid';
import FeaturedProducts from './FeaturedProducts';
import BestsellersSection from './BestsellersSection';
import WhyChooseUs from './WhyChooseUs';
import CompatibilityBanner from './CompatibilityBanner';
import CTABanner from './CTABanner';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      <main className="pt-[88px]">
        <HeroSection />
        <CategoryGrid />
        <FeaturedProducts />
        <CompatibilityBanner />
        <BestsellersSection />
        <WhyChooseUs />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
