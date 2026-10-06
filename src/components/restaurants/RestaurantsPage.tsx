import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Restaurant } from '../../types';
import { RestaurantCard } from '../home/RestaurantCard';
import { Search, SlidersHorizontal, X, RotateCcw } from 'lucide-react';

export const RestaurantsPage: React.FC = () => {
  const {
    city,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
  } = useApp();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters State
  const [selectedCuisine, setSelectedCuisine] = useState<string>(categoryFilter || 'All');
  const [pureVegOnly, setPureVegOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [maxDeliveryTime, setMaxDeliveryTime] = useState<number>(100);
  const [hasOfferOnly, setHasOfferOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'deliveryTime' | 'priceLow' | 'priceHigh'>('recommended');

  const cuisinesList = [
    'All',
    'Biryani',
    'North Indian',
    'South Indian',
    'Pizza',
    'Burgers',
    'Chinese',
    'Desserts',
    'Cafe',
    'Healthy Food',
    'Street Food',
  ];

  useEffect(() => {
    if (categoryFilter) {
      setSelectedCuisine(categoryFilter);
    }
  }, [categoryFilter]);

  useEffect(() => {
    async function loadRestaurants() {
      setIsLoading(true);
      const data = await api.getRestaurants({ city });
      setRestaurants(data);
      setIsLoading(false);
    }
    loadRestaurants();
  }, [city]);

  // Compute filtered & sorted list
  const filteredRestaurants = useMemo(() => {
    let list = [...restaurants];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.some((c) => c.toLowerCase().includes(q)) ||
          r.area.toLowerCase().includes(q)
      );
    }

    // Cuisine filter
    if (selectedCuisine !== 'All') {
      const c = selectedCuisine.toLowerCase();
      list = list.filter((r) =>
        r.cuisine.some((item) => item.toLowerCase().includes(c))
      );
    }

    // Pure veg
    if (pureVegOnly) {
      list = list.filter((r) => r.isPureVeg);
    }

    // Min rating
    if (minRating > 0) {
      list = list.filter((r) => r.rating >= minRating);
    }

    // Max delivery time
    if (maxDeliveryTime < 100) {
      list = list.filter((r) => r.deliveryTimeMin <= maxDeliveryTime);
    }

    // Has offer
    if (hasOfferOnly) {
      list = list.filter((r) => !!r.offer);
    }

    // Sorting
    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'deliveryTime') {
      list.sort((a, b) => a.deliveryTimeMin - b.deliveryTimeMin);
    } else if (sortBy === 'priceLow') {
      list.sort((a, b) => a.priceForTwo - b.priceForTwo);
    } else if (sortBy === 'priceHigh') {
      list.sort((a, b) => b.priceForTwo - a.priceForTwo);
    }

    return list;
  }, [
    restaurants,
    searchQuery,
    selectedCuisine,
    pureVegOnly,
    minRating,
    maxDeliveryTime,
    hasOfferOnly,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSelectedCuisine('All');
    setPureVegOnly(false);
    setMinRating(0);
    setMaxDeliveryTime(100);
    setHasOfferOnly(false);
    setSortBy('recommended');
    setSearchQuery('');
    setCategoryFilter(null);
  };

  const hasActiveFilters =
    selectedCuisine !== 'All' ||
    pureVegOnly ||
    minRating > 0 ||
    maxDeliveryTime < 100 ||
    hasOfferOnly ||
    searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
              Restaurants in {city}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Showing {filteredRestaurants.length} verified dining spots near you
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search restaurants or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-8 space-y-3.5">
          {/* Cuisines Pills (Interactive buttons) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {cuisinesList.map((cuisine) => {
              const isActive = selectedCuisine === cuisine;
              return (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cuisine}
                </button>
              );
            })}
          </div>

          {/* Secondary Quick Filters & Sort Dropdown */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Pure Veg Toggle */}
              <button
                onClick={() => setPureVegOnly((v) => !v)}
                className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors ${
                  pureVegOnly
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-700'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${pureVegOnly ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                <span>Pure Veg</span>
              </button>

              {/* 4.5+ Rating */}
              <button
                onClick={() => setMinRating((r) => (r === 4.5 ? 0 : 4.5))}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                  minRating === 4.5
                    ? 'bg-amber-50 border-amber-500 text-amber-800'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                ★ 4.5+ Rating
              </button>

              {/* Fast Delivery (<= 25 min) */}
              <button
                onClick={() => setMaxDeliveryTime((t) => (t === 25 ? 100 : 25))}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                  maxDeliveryTime === 25
                    ? 'bg-orange-50 border-orange-500 text-orange-800'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Under 25 min
              </button>

              {/* Has Offers */}
              <button
                onClick={() => setHasOfferOnly((o) => !o)}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                  hasOfferOnly
                    ? 'bg-purple-50 border-purple-500 text-purple-800'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Special Offers %
              </button>

              {/* Reset button if active */}
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Rating: High to Low</option>
                <option value="deliveryTime">Delivery Time: Fastest</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
            </div>
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
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 max-w-lg mx-auto p-8 shadow-xs">
            <SlidersHorizontal className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No restaurants match your filters</h3>
            <p className="text-xs text-slate-500 mb-4">
              Try adjusting your cuisine or filter selection to see more places.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredRestaurants.map((rest) => (
              <RestaurantCard key={rest.id} restaurant={rest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
