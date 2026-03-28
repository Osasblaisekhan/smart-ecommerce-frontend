import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Lightbulb, Camera, Thermometer, Speaker, Radio, ArrowRight } from 'lucide-react';

const iconMap: Record<string, any> = {
  'smart-lighting': Lightbulb,
  'security-cameras': Camera,
  'climate-control': Thermometer,
  'entertainment': Speaker,
  'sensors-safety': Radio,
};

const colorMap: Record<string, string> = {
  'smart-lighting': 'from-yellow-400 to-orange-500',
  'security-cameras': 'from-blue-500 to-indigo-600',
  'climate-control': 'from-cyan-400 to-teal-500',
  'entertainment': 'from-purple-500 to-pink-500',
  'sensors-safety': 'from-green-400 to-emerald-600',
};

const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.getCategories();
        if (res.success && res.data && res.data.length > 0) {
          setCategories(
            res.data.map((c: string) => ({
              id: c,
              title: c,
              handle: c.toLowerCase().replace(/\s+/g, '-'),
              image_url: null,
            }))
          );
        } else {
          setCategories(defaultCategories);
        }
      } catch {
        setCategories(defaultCategories);
      }
    };
    fetch();
  }, []);

  const defaultCategories = [
    { id: 'Smart Lighting', title: 'Smart Lighting', handle: 'smart-lighting', image_url: null },
    { id: 'Security Cameras', title: 'Security Cameras', handle: 'security-cameras', image_url: null },
    { id: 'Climate Control', title: 'Climate Control', handle: 'climate-control', image_url: null },
    { id: 'Entertainment', title: 'Entertainment', handle: 'entertainment', image_url: null },
    { id: 'Sensors & Safety', title: 'Sensors & Safety', handle: 'sensors-safety', image_url: null },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-[#8BC34A] font-semibold text-sm uppercase tracking-wider">Browse by Category</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#333333] mt-2">Smart Solutions for Every Room</h2>
          <p className="text-[#666666] mt-3 max-w-2xl mx-auto">
            Explore our curated categories of smart home devices designed to enhance every aspect of your living space.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(col => {
            const Icon = iconMap[col.handle] || Radio;
            const gradient = colorMap[col.handle] || 'from-gray-400 to-gray-600';
            return (
              <Link
                key={col.id}
                to={`/collections/${col.handle}`}
                className="group relative overflow-hidden rounded-2xl aspect-[4/5] flex flex-col justify-end p-5 transition-transform duration-300 hover:-translate-y-1"
              >
                {col.image_url ? (
                  <img src={col.image_url} alt={col.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#8BC34A] transition-colors">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg">{col.title}</h3>
                  <div className="flex items-center gap-1 mt-1 text-white/70 text-sm group-hover:text-[#8BC34A] transition-colors">
                    <span>Shop Now</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
