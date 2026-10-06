import React from 'react';
import { Restaurant } from '../../types';
import { useApp } from '../../context/AppContext';
import { Star, Clock, MapPin, Heart, Sparkles } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { openRestaurantDetail, toggleFavorite, isFavorite } = useApp();
  const favorite = isFavorite('restaurant', restaurant.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite('restaurant', restaurant.id);
  };

  return (
    <div
      onClick={() => openRestaurantDetail(restaurant.id)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-orange-200/90 shadow-xs hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Image Container with Offer Tag & Favorite Button */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {/* Subtle Bottom Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 flex items-center justify-center shadow-md backdrop-blur-xs transition-transform active:scale-90"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              favorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
            }`}
          />
        </button>

        {/* Pure Veg Tag */}
        {restaurant.isPureVeg && (
          <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>PURE VEG</span>
          </div>
        )}

        {/* Offer Tag on bottom left of image */}
        {restaurant.offer && (
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-1 text-white text-xs font-bold drop-shadow-sm truncate">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate">{restaurant.offer}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Restaurant Name & Rating */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-orange-600 transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-1 bg-emerald-700 text-white px-1.5 py-0.5 rounded-md text-xs font-bold shrink-0">
            <span>{restaurant.rating}</span>
            <Star className="w-3 h-3 fill-white" />
          </div>
        </div>

        {/* Cuisine List - Clean unboxed text with typographic separators */}
        <div className="text-xs text-slate-500 line-clamp-1 mb-2.5">
          {restaurant.cuisine.join(' · ')}
        </div>

        {/* Distance, Delivery Time & Price for Two */}
        <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-700">
              <Clock className="w-3.5 h-3.5 text-orange-600" />
              <span>
                {restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} min
              </span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 text-slate-500">
              <MapPin className="w-3.5 h-3.5" />
              <span>{restaurant.distanceKm} km</span>
            </span>
          </div>
          <span className="font-semibold text-slate-800 tabular-nums">
            ₹{restaurant.priceForTwo} for two
          </span>
        </div>
      </div>
    </div>
  );
};
