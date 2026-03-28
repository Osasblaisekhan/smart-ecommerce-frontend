import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Wifi, Zap, Cpu } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://d64gsuwffb70l.cloudfront.net/69c69fbacd39486e3b7ae564_1774624937465_ead18769.jpg"
          alt="Smart Home"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#333333]/90 via-[#333333]/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8BC34A]/20 border border-[#8BC34A]/30 rounded-full mb-6">
            <Zap className="w-4 h-4 text-[#8BC34A]" />
            <span className="text-sm font-medium text-[#8BC34A]">Smart Home Automation</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Automate Your Life,{' '}
            <span className="text-[#8BC34A]">Elevate</span> Your Home
          </h1>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-xl">
            Discover premium smart home devices that seamlessly integrate into your lifestyle. 
            From intelligent lighting to advanced security — control everything from one place.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-[#8BC34A]/25 hover:shadow-xl hover:shadow-[#8BC34A]/30"
            >
              Shop All Devices
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/collections/security-cameras"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              <Shield className="w-5 h-5" />
              Security Solutions
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10">
            {[
              { icon: Cpu, label: 'Smart Devices', value: '50+' },
              { icon: Wifi, label: 'Connected Homes', value: '10K+' },
              { icon: Shield, label: 'Secure & Encrypted', value: '100%' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#8BC34A]/20 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#8BC34A]" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{value}</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
