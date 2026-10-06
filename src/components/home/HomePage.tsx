import React, { useState, useEffect } from 'react';
import { HeroSection } from './HeroSection';
import { CategorySlider } from './CategorySlider';
import { TrendingDishes } from './TrendingDishes';
import { SpecialOffersSection } from './SpecialOffersSection';
import { RestaurantCard } from './RestaurantCard';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Restaurant } from '../../types';
import { ArrowRight, Flame } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { city, setActiveTab } = useApp();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'pureVeg' | 'fastest' | 'topRated'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await api.getRestaurants({ city });
      setRestaurants(data);
      setIsLoading(false);
    }
    loadData();
  }, [city]);

  const filteredRestaurants = restaurants.filter((r) => {
    if (filterType === 'pureVeg') return r.isPureVeg;
    if (filterType === 'fastest') return r.deliveryTimeMin <= 25;
    if (filterType === 'topRated') return r.rating >= 4.6;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Category Carousel */}
      <CategorySlider />

      {/* 3. Popular Near You */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
                Popular near you
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Top curated restaurants with high ratings and speedy delivery in {city}
            </p>
          </div>

          {/* Segmented Filter Controls (Interactive Buttons) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit self-start sm:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('topRated')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterType === 'topRated'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ★ 4.6+ Rated
            </button>
            <button
              onClick={() => setFilterType('fastest')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterType === 'fastest'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fastest (≤25 min)
            </button>
            <button
              onClick={() => setFilterType('pureVeg')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterType === 'pureVeg'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pure Veg
            </button>
          </div>
        </div>

        {/* Restaurant Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-72 border border-slate-100 animate-pulse p-4 flex flex-col justify-between"
              >
                <div className="w-full h-36 bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-8 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-base font-semibold text-slate-700">No restaurants match this filter in {city}</p>
            <button
              onClick={() => setFilterType('all')}
              className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredRestaurants.slice(0, 8).map((rest) => (
              <RestaurantCard key={rest.id} restaurant={rest} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setActiveTab('restaurants')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 hover:border-orange-500 bg-white hover:bg-orange-50/30 text-slate-800 hover:text-orange-700 font-bold text-sm shadow-xs transition-all"
          >
            <span>See All {restaurants.length} Restaurants in {city}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. Trending Dishes */}
      <TrendingDishes />

      {/* 5. Special Promotional Deals */}
      <SpecialOffersSection />
    </div>
  );
};
