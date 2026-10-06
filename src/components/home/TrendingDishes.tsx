import React from 'react';
import { TRENDING_DISHES, RESTAURANTS, MENU_ITEMS } from '../../data/seedData';
import { useApp } from '../../context/AppContext';
import { VegBadge } from '../common/VegBadge';
import { Star, Plus, Flame } from 'lucide-react';

export const TrendingDishes: React.FC = () => {
  const { openDishCustomizer, addToCart } = useApp();

  const handleAddDish = (trendingItem: (typeof TRENDING_DISHES)[0]) => {
    // Find restaurant and dish object
    const rest = RESTAURANTS.find((r) => r.id === trendingItem.restaurantId) || RESTAURANTS[0];
    const dish = MENU_ITEMS.find((d) => d.id === trendingItem.id) || {
      id: trendingItem.id,
      restaurantId: rest.id,
      name: trendingItem.name,
      description: trendingItem.tagline,
      price: trendingItem.price,
      image: trendingItem.image,
      category: 'Main Course',
      isVeg: trendingItem.isVeg,
      rating: trendingItem.rating,
      ratingCount: 500,
      isAvailable: true,
    };

    // If item has addons or customizations, open modal; otherwise quick add
    if (dish.addons && dish.addons.length > 0) {
      openDishCustomizer(dish, rest);
    } else {
      addToCart(dish, rest, 1);
    }
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Flame className="w-5 h-5 fill-orange-500" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
              Trending dishes
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Most loved flavors ordered right now
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {TRENDING_DISHES.map((dish) => (
          <div
            key={dish.id}
            className="group bg-white rounded-2xl p-3 border border-slate-200/80 hover:border-orange-300 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            {/* Dish Photo */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-3">
              <img
                src={dish.image}
                alt={dish.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs p-1 rounded-md shadow-xs">
                <VegBadge isVeg={dish.isVeg} size="sm" />
              </div>
              <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{dish.rating}</span>
              </div>
            </div>

            {/* Dish Details */}
            <div className="flex-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-orange-600 truncate mb-0.5">
                {dish.restaurant}
              </div>
              <h3 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1">
                {dish.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1 mb-3">
                {dish.tagline}
              </p>
            </div>

            {/* Price & Add Button */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-sm text-slate-900 tabular-nums">
                  ₹{dish.price}
                </span>
                {dish.originalPrice && (
                  <span className="text-xs text-slate-400 line-through tabular-nums">
                    ₹{dish.originalPrice}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleAddDish(dish)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
              >
                <span>Add</span>
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
