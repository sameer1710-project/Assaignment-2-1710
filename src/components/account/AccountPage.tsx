import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RESTAURANTS, MENU_ITEMS } from '../../data/seedData';
import { VegBadge } from '../common/VegBadge';
import {
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  User,
  Bell,
  HelpCircle,
  Settings,
  ChevronRight,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Send,
  MessageCircle,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const {
    user,
    orders,
    favorites,
    savedAddresses,
    deleteAddress,
    saveNewAddress,
    openOrderTracking,
    openRestaurantDetail,
    setActiveTab,
    showToast,
    updateUserProfile,
  } = useApp();

  const [activeSection, setActiveSection] = useState<
    'orders' | 'favorites' | 'addresses' | 'payments' | 'profile' | 'support' | 'settings'
  >('orders');

  // Support chat state
  const [supportMessages, setSupportMessages] = useState<
    { sender: 'bot' | 'user'; text: string; time: string }[]
  >([
    {
      sender: 'bot',
      text: 'Hello Sameer! Welcome to Foodora Support. How can we help you today with your orders or delivery?',
      time: '11:00 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Profile edit state
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);

  const favoriteRestaurants = RESTAURANTS.filter((r) =>
    favorites.restaurantIds.includes(r.id)
  );
  const favoriteDishes = MENU_ITEMS.filter((i) => favorites.itemIds.includes(i.id));

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setSupportMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: 'Just now' },
    ]);
    setChatInput('');

    setTimeout(() => {
      setSupportMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Thanks for reaching out, Sameer! We've registered your query: "${userMsg}". A dedicated Foodora care executive is monitoring this. Rest assured, your satisfaction is 100% guaranteed.`,
          time: 'Just now',
        },
      ]);
    }, 1000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name: editName, phone: editPhone });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-28 pt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Greeting */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-500 shadow-md"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-display font-extrabold text-slate-900">
                  Hello, {user.name} 👋
                </h1>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>{user.membership}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your orders, saved addresses and Foodora preferences
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {user.email} · {user.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Layout: Sidebar Nav + Main Content Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Sidebar Nav */}
          <div className="md:col-span-4 bg-white rounded-3xl p-3 border border-slate-200/80 shadow-xs space-y-1">
            {[
              { id: 'orders', label: 'My Orders', icon: ShoppingBag, count: orders.length },
              {
                id: 'favorites',
                label: 'Favorites',
                icon: Heart,
                count: favoriteRestaurants.length + favoriteDishes.length,
              },
              { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: savedAddresses.length },
              { id: 'payments', label: 'Payment Methods', icon: CreditCard },
              { id: 'profile', label: 'Profile Details', icon: User },
              { id: 'support', label: 'Help & Live Support', icon: HelpCircle },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {tab.count !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            {/* 1. ORDERS SECTION */}
            {activeSection === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-lg">My Orders</h3>
                  <span className="text-xs text-slate-500">{orders.length} total orders</span>
                </div>

                {orders.length === 0 ? (
                  <div className="py-12 text-center">
                    <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">No orders placed yet</p>
                    <button
                      onClick={() => setActiveTab('restaurants')}
                      className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold"
                    >
                      Explore Restaurants
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl border border-slate-200 hover:border-orange-200 transition-colors space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={ord.restaurantImage}
                              alt={ord.restaurantName}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">
                                {ord.restaurantName}
                              </h4>
                              <p className="text-[11px] text-slate-400">
                                Order #{ord.orderNumber} · {new Date(ord.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                              ord.status === 'DELIVERED'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-orange-50 text-orange-700 animate-pulse'
                            }`}
                          >
                            {ord.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {/* Items list */}
                        <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl">
                          {ord.items.map((i) => (
                            <div key={i.id} className="flex justify-between">
                              <span>
                                {i.menuItem.name} × {i.quantity}
                              </span>
                              <span className="tabular-nums font-semibold">₹{i.itemTotalPrice}</span>
                            </div>
                          ))}
                        </div>

                        {/* Order total & Track Button */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                          <div>
                            <span className="text-slate-500">Total Paid: </span>
                            <span className="font-bold text-slate-900 font-mono">₹{ord.total}</span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => openOrderTracking(ord.id)}
                              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors"
                            >
                              Track Order
                            </button>
                            <button
                              onClick={() => openRestaurantDetail(ord.restaurantId)}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                            >
                              Reorder
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. FAVORITES SECTION */}
            {activeSection === 'favorites' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">Saved Favorites</h3>
                  <p className="text-xs text-slate-500">Your bookmarked dining spots and cravings</p>
                </div>

                {favoriteRestaurants.length === 0 && favoriteDishes.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <Heart className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-semibold">No favorites saved yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {favoriteRestaurants.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                          Favorite Restaurants ({favoriteRestaurants.length})
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {favoriteRestaurants.map((r) => (
                            <div
                              key={r.id}
                              onClick={() => openRestaurantDetail(r.id)}
                              className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:border-orange-300 cursor-pointer transition-all"
                            >
                              <img
                                src={r.image}
                                alt={r.name}
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 rounded-xl object-cover shrink-0"
                              />
                              <div className="overflow-hidden">
                                <h5 className="font-bold text-slate-900 text-xs truncate">{r.name}</h5>
                                <p className="text-[11px] text-slate-500 truncate">{r.cuisine.join(', ')}</p>
                                <span className="text-[11px] font-bold text-emerald-600">★ {r.rating}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {favoriteDishes.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                          Favorite Dishes ({favoriteDishes.length})
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {favoriteDishes.map((dish) => (
                            <div
                              key={dish.id}
                              className="flex items-center justify-between p-3 rounded-2xl border border-slate-200"
                            >
                              <div className="flex items-center gap-2.5">
                                <VegBadge isVeg={dish.isVeg} size="sm" />
                                <div>
                                  <h5 className="font-bold text-slate-900 text-xs">{dish.name}</h5>
                                  <span className="text-xs font-semibold text-slate-600 tabular-nums">
                                    ₹{dish.price}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => openRestaurantDetail(dish.restaurantId)}
                                className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-bold hover:bg-orange-100"
                              >
                                View
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 3. ADDRESSES SECTION */}
            {activeSection === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Saved Delivery Addresses</h3>
                    <p className="text-xs text-slate-500">Manage multiple drop-off points</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 rounded-2xl border border-slate-200 flex items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{addr.tag}</span>
                            {addr.isDefault && (
                              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-700 mt-1">
                            {addr.houseFlat}, {addr.street}
                          </p>
                          <p className="text-xs text-slate-500">
                            {addr.area}, {addr.city} - {addr.pincode}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Phone: {addr.phone}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-slate-400 hover:text-rose-600 p-2 transition-colors"
                        title="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. PAYMENTS SECTION */}
            {activeSection === 'payments' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-lg">Saved Payment Options</h3>
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-indigo-600" />
                      <div>
                        <span className="font-bold text-slate-900 block">Google Pay UPI</span>
                        <span className="text-slate-500">sameer@oksbi</span>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600">Active</span>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <div>
                        <span className="font-bold text-slate-900 block">HDFC Millennia Credit Card</span>
                        <span className="text-slate-500">•••• •••• •••• 9812</span>
                      </div>
                    </div>
                    <span className="text-slate-400">Expires 08/29</span>
                  </div>
                </div>
              </div>
            )}

            {/* 5. PROFILE SECTION */}
            {activeSection === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <h3 className="font-bold text-slate-900 text-lg">Edit Profile</h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20"
                >
                  Save Profile
                </button>
              </form>
            )}

            {/* 6. HELP & LIVE SUPPORT */}
            {activeSection === 'support' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <MessageCircle className="w-5 h-5 text-orange-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Foodora 24/7 Live Support</h3>
                    <p className="text-[11px] text-slate-400">Immediate chat assistance for orders, refunds & delivery</p>
                  </div>
                </div>

                {/* Chat Messages Log */}
                <div className="h-64 overflow-y-auto p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 text-xs">
                  {supportMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`p-3 rounded-2xl max-w-sm ${
                          msg.sender === 'user'
                            ? 'bg-orange-600 text-white rounded-br-none'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1">{msg.time}</span>
                    </div>
                  ))}
                </div>

                {/* Chat input form */}
                <form onSubmit={handleSendChat} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your question or issue..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-orange-600/20"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Common FAQ chips */}
                <div className="pt-2 text-[11px] text-slate-500 space-y-1">
                  <span className="font-semibold text-slate-700">Quick topics:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {[
                      'Where is my food?',
                      'Apply for refund',
                      'Modify delivery address',
                      'Contact delivery executive',
                    ].map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => {
                          setChatInput(topic);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 7. SETTINGS */}
            {activeSection === 'settings' && (
              <div className="space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 text-lg">App Preferences</h3>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200">
                    <div>
                      <span className="font-bold text-slate-900 block">Push Notifications</span>
                      <span className="text-slate-500">Receive live order status alerts and rider arrival updates</span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-600 rounded" />
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200">
                    <div>
                      <span className="font-bold text-slate-900 block">Promotional WhatsApp Alerts</span>
                      <span className="text-slate-500">Weekend discount coupons and festival special offers</span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-600 rounded" />
                  </label>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">App Language</span>
                      <span className="text-slate-500">English (India) · Supported: Tamil, Hindi, Telugu, Kannada</span>
                    </div>
                    <span className="font-bold text-slate-700">English</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
