import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Search,
  Heart,
  ShoppingBag,
  ChevronDown,
  User,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    city,
    area,
    setIsLocationModalOpen,
    cartCount,
    grandTotal,
    favorites,
    user,
    setIsDocsModalOpen,
  } = useApp();

  const totalFavs = favorites.restaurantIds.length + favorites.itemIds.length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Zone 1: Brand Wordmark + Location Selector */}
          <div className="flex items-center gap-6 shrink-0">
            {/* Original Text-based Brand Logo */}
            <button
              onClick={() => setActiveTab('home')}
              className="group flex items-center gap-2 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <span className="font-display font-extrabold text-lg tracking-tight">F</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-2xl tracking-tight text-slate-900 leading-none">
                  FOODORA
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-orange-600 uppercase mt-0.5">
                  Discover · Order · Enjoy
                </span>
              </div>
            </button>

            {/* Location Selector Trigger */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/90 hover:border-orange-300 hover:bg-orange-50/40 text-left transition-colors max-w-[220px]"
              title="Change Delivery Location"
            >
              <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
              <div className="flex flex-col overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">
                  Delivering to
                </span>
                <span className="text-xs font-bold text-slate-800 truncate mt-0.5">
                  {area}, {city}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-auto" />
            </button>
          </div>

          {/* Zone 2: 4 Primary Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'home'
                  ? 'bg-orange-50 text-orange-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setActiveTab('restaurants')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'restaurants' || activeTab === 'restaurant-detail'
                  ? 'bg-orange-50 text-orange-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Restaurants
            </button>

            <button
              onClick={() => setActiveTab('offers')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'offers'
                  ? 'bg-orange-50 text-orange-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Offers
            </button>

            <button
              onClick={() => setActiveTab('account')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'account' || activeTab === 'tracking'
                  ? 'bg-orange-50 text-orange-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Account
            </button>

            {/* Hackathon Docs & Architecture */}
            <button
              onClick={() => setIsDocsModalOpen(true)}
              className="px-3 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              title="UI Hackathon Spec & Docs"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>UI Docs</span>
            </button>
          </nav>

          {/* Zone 3: Actions (Search shortcut, Wishlist, Cart, User Profile, Admin) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Location Quick Button */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-orange-50 text-orange-800 text-xs font-bold max-w-[130px] truncate"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span className="truncate">{area}</span>
            </button>

            {/* Search Button */}
            <button
              onClick={() => setActiveTab('restaurants')}
              className="w-10 h-10 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors"
              title="Search restaurants & dishes"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist / Favorites */}
            <button
              onClick={() => setActiveTab('account')}
              className="relative w-10 h-10 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
              title="Saved Favorites"
              aria-label="Wishlist"
            >
              <Heart
                className={`w-5 h-5 ${
                  totalFavs > 0 ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
              {totalFavs > 0 && (
                <span className="absolute 1 top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {totalFavs}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setActiveTab('cart')}
              className="flex items-center gap-2 py-2 px-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 active:scale-[0.98] transition-all whitespace-nowrap"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-white text-orange-700 text-xs font-extrabold px-1.5 py-0.5 rounded-md tabular-nums ml-0.5">
                  {cartCount}
                </span>
              )}
              {cartCount > 0 && grandTotal > 0 && (
                <span className="hidden md:inline font-mono tabular-nums text-xs border-l border-orange-400 pl-2">
                  ₹{grandTotal}
                </span>
              )}
            </button>

            {/* User Profile Avatar / Hello Sameer */}
            <button
              onClick={() => setActiveTab('account')}
              className="hidden sm:flex items-center gap-2 p-1 pl-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              title="User Account"
            >
              <span className="text-xs font-bold text-slate-800">
                Hi, {user.name}
              </span>
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </button>

            {/* Admin Switcher */}
            <button
              onClick={() => setActiveTab('admin')}
              className={`p-2 rounded-xl transition-colors ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="Restaurant Admin Portal"
            >
              <ShieldCheck className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
