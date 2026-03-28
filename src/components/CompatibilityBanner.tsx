import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Mic, Wifi, Home, ArrowRight } from 'lucide-react';

const platforms = [
  { name: 'Amazon Alexa', icon: Mic, color: 'bg-blue-500', desc: 'Voice control with Alexa' },
  { name: 'Google Home', icon: Home, color: 'bg-red-500', desc: 'Works with Google Assistant' },
  { name: 'Apple HomeKit', icon: Smartphone, color: 'bg-gray-800', desc: 'Siri & Apple ecosystem' },
  { name: 'SmartThings', icon: Wifi, color: 'bg-teal-500', desc: 'Samsung SmartThings hub' },
];

const CompatibilityBanner: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-[#333333] to-[#1a1a2e] text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#8BC34A] rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#607D8B] rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="text-[#8BC34A] font-semibold text-sm uppercase tracking-wider">Universal Compatibility</span>
          <h2 className="text-3xl lg:text-4xl font-bold mt-2">Works With Your Ecosystem</h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            All NexaHome devices integrate seamlessly with the most popular smart home platforms.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map(({ name, icon: Icon, color, desc }) => (
            <div
              key={name}
              className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-[#8BC34A]/30 transition-all duration-300 text-center"
            >
              <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-1">{name}</h3>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#8BC34A]/25"
          >
            Explore Compatible Devices <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CompatibilityBanner;
