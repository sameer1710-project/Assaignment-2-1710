import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Restaurant, MenuItem, RestaurantReview } from '../../types';
import { VegBadge } from '../common/VegBadge';
import {
  Star,
  Clock,
  MapPin,
  Heart,
  Share2,
  Search,
  Sparkles,
  Plus,
  Minus,
  ArrowLeft,
  MessageSquare,
  Send,
} from 'lucide-react';

export const RestaurantDetailPage: React.FC = () => {
  const {
    selectedRestaurantId,
    setActiveTab,
    cart,
    addToCart,
    updateQuantity,
    openDishCustomizer,
    toggleFavorite,
    isFavorite,
    showToast,
    user,
  } = useApp();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<RestaurantReview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Menu filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [menuSearch, setMenuSearch] = useState<string>('');
  const [vegOnly, setVegOnly] = useState<boolean>(false);

  // Active view tab inside restaurant
  const [viewTab, setViewTab] = useState<'menu' | 'reviews'>('menu');

  // New review form
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      if (!selectedRestaurantId) return;
      setIsLoading(true);
      const [restData, menuData, revData] = await Promise.all([
        api.getRestaurantById(selectedRestaurantId),
        api.getRestaurantMenu(selectedRestaurantId),
        api.getReviews(selectedRestaurantId),
      ]);
      if (restData) setRestaurant(restData);
      setMenuItems(menuData);
      setReviews(revData);
      setIsLoading(false);
    }
    loadData();
  }, [selectedRestaurantId]);

  const favorite = restaurant ? isFavorite('restaurant', restaurant.id) : false;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Restaurant link copied to clipboard!');
    } else {
      showToast('Link ready to share');
    }
  };

  // Group menu categories
  const categoriesList = useMemo(() => {
    if (!restaurant) return ['All'];
    const cats = new Set<string>();
    cats.add('All');
    restaurant.categories.forEach((c) => cats.add(c));
    menuItems.forEach((item) => cats.add(item.category));
    return Array.from(cats);
  }, [restaurant, menuItems]);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    let list = [...menuItems];
    if (selectedCategory !== 'All') {
      list = list.filter((i) => i.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (vegOnly) {
      list = list.filter((i) => i.isVeg);
    }
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase().trim();
      list = list.filter(
        (i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [menuItems, selectedCategory, vegOnly, menuSearch]);

  const handleItemAdd = (item: MenuItem) => {
    if (!restaurant) return;
    if (item.addons && item.addons.length > 0) {
      openDishCustomizer(item, restaurant);
    } else {
      addToCart(item, restaurant, 1);
    }
  };

  const handleAddReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestaurantId || !reviewComment.trim()) return;
    setIsSubmittingReview(true);
    const newRev = await api.addReview(selectedRestaurantId, {
      userName: user.name || 'Sameer',
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
    setReviews((prev) => [newRev, ...prev]);
    setReviewComment('');
    setIsSubmittingReview(false);
    showToast('Thank you! Review posted successfully.');
  };

  if (isLoading || !restaurant) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-28">
      {/* Back button bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <button
          onClick={() => setActiveTab('restaurants')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to restaurants</span>
        </button>
      </div>

      {/* Hero Cover & Info Card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden mb-8">
          {/* Cover Photo */}
          <div className="relative h-56 sm:h-72 w-full bg-slate-900 overflow-hidden">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Pure Veg Badge */}
            {restaurant.isPureVeg && (
              <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-md">
                PURE VEG RESTAURANT
              </div>
            )}

            {/* Action Buttons: Favorite & Share */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => toggleFavorite('restaurant', restaurant.id)}
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg backdrop-blur-xs transition-transform active:scale-90"
                title="Favorite"
              >
                <Heart
                  className={`w-5 h-5 ${
                    favorite ? 'fill-rose-500 text-rose-500' : 'text-slate-700'
                  }`}
                />
              </button>
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg backdrop-blur-xs transition-transform active:scale-90"
                title="Share"
              >
                <Share2 className="w-5 h-5 text-slate-700" />
              </button>
            </div>

            {/* Restaurant Headline inside cover */}
            <div className="absolute bottom-5 left-6 right-6 text-white">
              <h1 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight drop-shadow-sm">
                {restaurant.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 drop-shadow-xs">
                {restaurant.tagline}
              </p>
            </div>
          </div>

          {/* Metadata Row */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              {/* Rating & Cuisine */}
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="flex items-center gap-1 bg-emerald-700 text-white px-2 py-0.5 rounded-lg text-sm font-bold">
                    <span>{restaurant.rating}</span>
                    <Star className="w-3.5 h-3.5 fill-white" />
                  </div>
                  <span className="text-xs text-slate-500">
                    {restaurant.reviewCount.toLocaleString()} ratings
                  </span>
                </div>
                <div className="text-sm font-medium text-slate-600">
                  {restaurant.cuisine.join(' · ')}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {restaurant.area}, {restaurant.city}
                </div>
              </div>

              {/* Delivery stats & Price for Two */}
              <div className="flex items-center gap-6 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 text-sm">
                      {restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} min
                    </span>
                    <span className="text-slate-400">Delivery time</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 text-sm">
                      {restaurant.distanceKm} km
                    </span>
                    <span className="text-slate-400">Distance</span>
                  </div>
                </div>

                <div className="border-l border-slate-200 pl-6">
                  <span className="block font-bold text-slate-900 text-sm tabular-nums">
                    ₹{restaurant.priceForTwo}
                  </span>
                  <span className="text-slate-400">For two persons</span>
                </div>
              </div>
            </div>

            {/* Offer Callout */}
            {restaurant.offer && (
              <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-orange-50/60 border border-orange-200/80 text-orange-900 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Special Offer: {restaurant.offer}</span>
              </div>
            )}
          </div>
        </div>

        {/* View Switcher: Menu vs Reviews */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
          <button
            onClick={() => setViewTab('menu')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
              viewTab === 'menu'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Menu Items ({menuItems.length})
          </button>
          <button
            onClick={() => setViewTab('reviews')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              viewTab === 'reviews'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Customer Reviews ({reviews.length})</span>
          </button>
        </div>

        {/* VIEW 1: MENU VIEW */}
        {viewTab === 'menu' && (
          <div className="space-y-6">
            {/* Menu Search & Category Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80">
              {/* Category buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {categoriesList.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        isActive
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* Veg Only Toggle & Search inside menu */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setVegOnly((v) => !v)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    vegOnly
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <VegBadge isVeg={true} size="sm" />
                  <span>Veg Only</span>
                </button>

                <div className="relative w-40 sm:w-48">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search in menu..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Menu Items Grid / List */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6">
                <p className="text-sm font-semibold text-slate-600">No dishes found in this category</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setVegOnly(false);
                    setMenuSearch('');
                  }}
                  className="mt-2 text-xs font-bold text-orange-600 hover:underline"
                >
                  Show all menu items
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item) => {
                  // Find current item quantity in cart
                  const inCartItems = cart.filter((ci) => ci.menuItem.id === item.id);
                  const totalInCart = inCartItems.reduce((acc, ci) => acc + ci.quantity, 0);

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-orange-200 shadow-xs flex justify-between gap-4 group"
                    >
                      {/* Left: Dish info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <VegBadge isVeg={item.isVeg} size="sm" />
                            {item.isBestseller && (
                              <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                                BESTSELLER
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-orange-600 transition-colors">
                            {item.name}
                          </h3>

                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="font-bold text-sm text-slate-900 tabular-nums">
                              ₹{item.price}
                            </span>
                            {item.originalPrice && (
                              <span className="text-xs text-slate-400 line-through tabular-nums">
                                ₹{item.originalPrice}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 mt-1">
                            <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                            <span>{item.rating}</span>
                            <span className="text-slate-400 font-normal">({item.ratingCount})</span>
                          </div>

                          <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {item.addons && item.addons.length > 0 && (
                          <span className="text-[10px] font-medium text-slate-400 mt-2">
                            Customizable
                          </span>
                        )}
                      </div>

                      {/* Right: Dish Image & Add/Quantity button */}
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex flex-col items-center">
                        <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>

                        {/* Add Button or Stepper pinned below image */}
                        <div className="absolute -bottom-2">
                          {totalInCart > 0 ? (
                            <div className="flex items-center gap-2 bg-white text-orange-600 px-2 py-1 rounded-xl shadow-md border border-orange-200 font-bold text-xs">
                              <button
                                onClick={() => {
                                  const firstCi = inCartItems[0];
                                  if (firstCi) updateQuantity(firstCi.id, -1);
                                }}
                                className="w-5 h-5 rounded hover:bg-orange-50 flex items-center justify-center"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="tabular-nums min-w-[12px] text-center">
                                {totalInCart}
                              </span>
                              <button
                                onClick={() => handleItemAdd(item)}
                                className="w-5 h-5 rounded hover:bg-orange-50 flex items-center justify-center"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleItemAdd(item)}
                              className="px-4 py-1.5 rounded-xl bg-white hover:bg-orange-50 text-orange-600 font-bold text-xs shadow-md border border-orange-200 hover:border-orange-400 active:scale-95 transition-all flex items-center gap-1"
                            >
                              <span>ADD</span>
                              <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: REVIEWS TAB */}
        {viewTab === 'reviews' && (
          <div className="space-y-6">
            {/* Add Review Form */}
            <form
              onSubmit={handleAddReviewSubmit}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4"
            >
              <h3 className="text-base font-bold text-slate-900">Write a Review</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Your Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {reviewRating} out of 5 stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Your Experience
                </label>
                <textarea
                  rows={3}
                  placeholder="Share details of your favorite dishes, delivery experience, and taste..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview || !reviewComment.trim()}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-600/20 disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Post Review</span>
              </button>
            </form>

            {/* Existing Reviews List */}
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center">
                        {rev.userName[0]}
                      </div>
                      <div>
                        <span className="block font-bold text-slate-900 text-xs sm:text-sm">
                          {rev.userName}
                        </span>
                        <span className="text-[11px] text-slate-400">{rev.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md text-xs font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
