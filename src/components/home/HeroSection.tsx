import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HERO_IMAGE } from '../../data/seedData';
import { Search, Sparkles, ArrowRight, ShieldCheck, Clock, Award } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setActiveTab, setSearchQuery, area, city } = useApp();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      setActiveTab('restaurants');
    }
  };

  const handleQuickSearch = (keyword: string) => {
    setSearchQuery(keyword);
    setActiveTab('restaurants');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/60 via-amber-50/30 to-white pt-8 pb-12 lg:pt-12 lg:pb-16 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Hero Content & Search */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Live Location Pill indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-orange-200 text-orange-800 text-xs font-semibold shadow-xs mb-4 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Delivering now to {area}, {city}</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] mb-4 text-balance">
              Good food. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
                Great mood.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-normal mb-8 max-w-xl leading-relaxed text-balance">
              Discover the finest handcrafted dining spots, royal dum biryanis, crispy dosas, and quick delivery right to your doorstep.
            </p>

            {/* Main Interactive Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl mb-4">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search for restaurants, dishes or cuisines (e.g. Biryani, Pizza)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-orange-500/5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-600/20 transition-all active:scale-95"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Popular Quick Keyword Suggestions */}
            <div className="flex flex-wrap items-center gap-2 mb-8 text-xs text-slate-500">
              <span className="font-semibold text-slate-400">Popular:</span>
              {['Biryani', 'Pizza', 'North Indian', 'South Indian', 'Desserts'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleQuickSearch(term)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-orange-50 hover:text-orange-700 border border-slate-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Primary & Secondary CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('restaurants')}
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-slate-900/10 active:scale-95 transition-all"
              >
                <span>Explore Restaurants</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('offers')}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-orange-50/50 text-slate-800 hover:text-orange-700 font-bold text-sm border border-slate-200 hover:border-orange-300 flex items-center gap-2 shadow-xs transition-all"
              >
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span>View Offers</span>
              </button>
            </div>

            {/* Trust Markers */}
            <div className="grid grid-cols-3 gap-4 pt-8 mt-8 border-t border-slate-200/60 max-w-lg">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-900">25–35 Min</span>
                  <span className="text-[11px] text-slate-500">Average Delivery</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-900">4.5+ Rating</span>
                  <span className="text-[11px] text-slate-500">Handpicked Spots</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-900">100% Safe</span>
                  <span className="text-[11px] text-slate-500">Hygiene Checked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Feast Collage / Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-3xl blur-2xl -z-10" />

              {/* Main Image Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-slate-900">
                <img
                  src={HERO_IMAGE}
                  alt="Foodora Royal Culinary Feast"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Floating promo badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-white/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block">
                      Featured Today
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">
                      Dum Biryani & Tandoori Nights
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Flat ₹150 OFF
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
