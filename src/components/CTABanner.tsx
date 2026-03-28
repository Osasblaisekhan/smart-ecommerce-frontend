import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Wifi } from 'lucide-react';

const CTABanner: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#8BC34A] to-[#689F38] p-8 md:p-12 lg:p-16">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to Make Your Home Smarter?
              </h2>
              <p className="text-white/80 text-lg mb-6">
                Start with a single device or build a complete smart home ecosystem. 
                Free shipping on every order, plus expert setup support.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <Zap className="w-4 h-4" /> Easy 5-min setup
                </div>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <Shield className="w-4 h-4" /> 2-year warranty
                </div>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <Wifi className="w-4 h-4" /> Works with everything
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#8BC34A] font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
              >
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/collections/smart-lighting"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-colors border border-white/30"
              >
                Explore Lighting
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
