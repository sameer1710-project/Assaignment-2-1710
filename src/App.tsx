import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { MobileNav } from './components/common/MobileNav';
import { ToastContainer } from './components/common/ToastContainer';
import { LocationModal } from './components/common/LocationModal';
import { DishCustomizerModal } from './components/common/DishCustomizerModal';
import { HackathonDocsModal } from './components/hackathon/HackathonDocsModal';

import { HomePage } from './components/home/HomePage';
import { RestaurantsPage } from './components/restaurants/RestaurantsPage';
import { RestaurantDetailPage } from './components/restaurant-detail/RestaurantDetailPage';
import { OffersPage } from './components/offers/OffersPage';
import { CartDrawerOrPage } from './components/cart/CartDrawerOrPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderTrackingPage } from './components/tracking/OrderTrackingPage';
import { AccountPage } from './components/account/AccountPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Heart, ShieldCheck, MapPin } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, setDeliveryLocation, city } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-900 selection:bg-orange-500 selection:text-white">
      {/* Desktop & Mobile Top Bar Header */}
      <Header />

      {/* Main Routed Content Frame */}
      <main className="flex-1">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'restaurants' && <RestaurantsPage />}
        {activeTab === 'restaurant-detail' && <RestaurantDetailPage />}
        {activeTab === 'offers' && <OffersPage />}
        {activeTab === 'cart' && <CartDrawerOrPage />}
        {activeTab === 'checkout' && <CheckoutPage />}
        {activeTab === 'tracking' && <OrderTrackingPage />}
        {activeTab === 'account' && <AccountPage />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer (Rendered on main views) */}
      {activeTab !== 'tracking' && activeTab !== 'admin' && (
        <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-24 lg:pb-12 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
              {/* Brand Col */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-base">
                    F
                  </div>
                  <span className="font-display font-extrabold text-xl text-white tracking-tight">
                    FOODORA
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed text-xs">
                  Discover, order, and enjoy authentic food from handpicked culinary kitchens delivered hot and fresh.
                </p>
                <div className="flex items-center gap-2 text-slate-300 font-semibold pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>FSSAI Hygiene Verified</span>
                </div>
              </div>

              {/* Major Cities Covered */}
              <div>
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                  Cities We Deliver To
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Chennai', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi', 'Pune', 'Kolkata', 'Coimbatore'].map((cityName) => (
                    <button
                      key={cityName}
                      onClick={() => setDeliveryLocation(cityName as any, cityName === 'Chennai' ? 'Kelambakkam' : 'Central')}
                      className={`text-left hover:text-orange-400 transition-colors ${
                        city === cityName ? 'text-orange-400 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {cityName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                  Explore Foodora
                </h4>
                <ul className="space-y-2 text-xs">
                  <li>
                    <button onClick={() => setActiveTab('restaurants')} className="hover:text-white transition-colors">
                      All Partner Restaurants
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setActiveTab('offers')} className="hover:text-white transition-colors">
                      Today's Coupons & Deals
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setActiveTab('account')} className="hover:text-white transition-colors">
                      Order History & Tracking
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setActiveTab('admin')} className="hover:text-white transition-colors">
                      Partner Restaurant Admin
                    </button>
                  </li>
                </ul>
              </div>

              {/* Service Assurance */}
              <div>
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                  Customer Promise
                </h4>
                <div className="space-y-2 text-xs text-slate-400">
                  <p>✓ 100% On-time delivery guarantee</p>
                  <p>✓ Contactless drop-off available</p>
                  <p>✓ No surge price lock policy</p>
                  <p>✓ Live order tracking on every delivery</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
              <p>© 2026 Foodora India Technologies. Discover. Order. Enjoy.</p>
              <div className="flex items-center gap-4">
                <span>Privacy Policy</span>
                <span>·</span>
                <span>Terms of Service</span>
                <span>·</span>
                <span>Security</span>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Modals & Floating Overlays */}
      <LocationModal />
      <DishCustomizerModal />
      <HackathonDocsModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
