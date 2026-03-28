import React from 'react';
import { Shield, Truck, Headphones, RefreshCw, Wifi, Award } from 'lucide-react';

const features = [
  { icon: Shield, title: 'Secure & Encrypted', desc: 'All devices use military-grade encryption to keep your home safe and private.' },
  { icon: Truck, title: 'Free Shipping', desc: 'Enjoy free shipping on every order, no minimum purchase required.' },
  { icon: Headphones, title: '24/7 Support', desc: 'Our expert team is available around the clock to help with setup and troubleshooting.' },
  { icon: RefreshCw, title: '30-Day Returns', desc: 'Not satisfied? Return any product within 30 days for a full refund.' },
  { icon: Wifi, title: 'Easy Setup', desc: 'Connect your devices in minutes with our intuitive app and step-by-step guides.' },
  { icon: Award, title: '2-Year Warranty', desc: 'Every product comes with a comprehensive 2-year manufacturer warranty.' },
];

const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-[#8BC34A] font-semibold text-sm uppercase tracking-wider">Why NexaHome</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#333333] mt-2">Built for Smart Living</h2>
          <p className="text-[#666666] mt-3 max-w-2xl mx-auto">
            We're committed to providing the best smart home experience from purchase to installation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-[#8BC34A]/30 hover:shadow-lg hover:shadow-[#8BC34A]/5 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#8BC34A]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#8BC34A] transition-colors">
                <Icon className="w-6 h-6 text-[#8BC34A] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-[#333333] mb-2">{title}</h3>
              <p className="text-sm text-[#666666] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
