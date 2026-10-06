import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, UtensilsCrossed, Tag, ShoppingBag, User } from 'lucide-react';

interface NavItem {
  id: 'home' | 'restaurants' | 'offers' | 'cart' | 'account';
  label: string;
  icon: any;
  badge?: number;
}

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, cartCount } = useApp();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed },
    { id: 'offers', label: 'Offers', icon: Tag },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, badge: cartCount },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 pb-safe">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'restaurants' && activeTab === 'restaurant-detail') ||
            (item.id === 'account' && activeTab === 'tracking');

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 transition-colors relative min-h-[44px] min-w-[44px] ${
                isActive ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2.5 bg-orange-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
