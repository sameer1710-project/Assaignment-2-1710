import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Restaurant, MenuItem, Order, OrderStatus } from '../../types';
import {
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  Store,
  DollarSign,
  Plus,
  Trash2,
  Power,
  ArrowLeft,
  CheckCircle,
  Clock,
  Filter,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { setActiveTab, showToast } = useApp();
  const [adminTab, setAdminTab] = useState<'analytics' | 'restaurants' | 'orders' | 'menu'>('analytics');

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // New Restaurant Modal State
  const [isAddingRest, setIsAddingRest] = useState(false);
  const [newRestName, setNewRestName] = useState('');
  const [newRestTagline, setNewRestTagline] = useState('');
  const [newRestCuisine, setNewRestCuisine] = useState('Indian, Biryani');
  const [newRestPrice, setNewRestPrice] = useState(500);
  const [newRestCity, setNewRestCity] = useState<'Chennai' | 'Bengaluru' | 'Hyderabad'>('Chennai');
  const [newRestArea, setNewRestArea] = useState('Kelambakkam');
  const [newRestIsVeg, setNewRestIsVeg] = useState(false);

  useEffect(() => {
    async function loadAdminData() {
      setIsLoading(true);
      const [restList, orderList, menuList] = await Promise.all([
        api.getRestaurants(),
        api.getOrders(),
        api.getRestaurantMenu('rest-1'),
      ]);
      setRestaurants(restList);
      setOrders(orderList);
      setMenuItems(menuList);
      setIsLoading(false);
    }
    loadAdminData();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 142850);
  const activeOrdersCount = orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length;

  const handleToggleRestStatus = async (id: string) => {
    const updatedStatus = await api.adminToggleRestaurantStatus(id);
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isOpen: updatedStatus } : r))
    );
    showToast(updatedStatus ? 'Restaurant set to OPEN' : 'Restaurant set to CLOSED');
  };

  const handleDeleteRest = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this restaurant?')) {
      await api.adminDeleteRestaurant(id);
      setRestaurants((prev) => prev.filter((r) => r.id !== id));
      showToast('Restaurant removed');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const updated = await api.updateOrderStatus(orderId, newStatus);
    if (updated) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      showToast(`Order status updated to ${newStatus}`);
    }
  };

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestName.trim()) return;

    const created = await api.adminAddRestaurant({
      name: newRestName.trim(),
      tagline: newRestTagline.trim() || 'Delicious Handcrafted Food',
      cuisine: newRestCuisine.split(',').map((c) => c.trim()),
      priceForTwo: Number(newRestPrice) || 500,
      city: newRestCity,
      area: newRestArea,
      isPureVeg: newRestIsVeg,
      rating: 4.5,
      deliveryTimeMin: 25,
      deliveryTimeMax: 30,
      distanceKm: 2.0,
      reviewCount: 1,
      image: '/src/assets/images/foodora_biryani_pot_1791223420440.jpg',
      categories: ['Recommended', 'Main Course', 'Starters'],
    });

    setRestaurants((prev) => [created, ...prev]);
    setIsAddingRest(false);
    setNewRestName('');
    setNewRestTagline('');
    showToast('New restaurant added to Foodora catalog!');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-5 rounded-3xl shadow-xl mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              title="Return to Customer Storefront"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h1 className="text-xl font-display font-bold">Foodora Admin Operations</h1>
              </div>
              <p className="text-xs text-slate-400">
                Live catalog management, order orchestration, and performance metrics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'analytics', label: 'Analytics' },
              { id: 'restaurants', label: `Restaurants (${restaurants.length})` },
              { id: 'orders', label: `Live Orders (${orders.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  adminTab === tab.id
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. ANALYTICS & STATS VIEW */}
        {adminTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">Total GMV</span>
                  <span className="text-2xl font-display font-extrabold text-slate-900 tabular-nums font-mono">
                    ₹{totalRevenue.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 block mt-0.5">
                    +18.4% vs last week
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">Active Orders</span>
                  <span className="text-2xl font-display font-extrabold text-slate-900 tabular-nums">
                    {activeOrdersCount}
                  </span>
                  <span className="text-[11px] font-bold text-orange-600 block mt-0.5">
                    Real-time in kitchen
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">Listed Restaurants</span>
                  <span className="text-2xl font-display font-extrabold text-slate-900 tabular-nums">
                    {restaurants.length}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 block mt-0.5">
                    Across 8 Indian metros
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Store className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">Delivery SLA</span>
                  <span className="text-2xl font-display font-extrabold text-slate-900 tabular-nums">
                    28.2 min
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 block mt-0.5">
                    98.2% on-time rate
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Kitchen Control Summary */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base mb-4">
                Operational Overview & Kitchen Telemetry
              </h3>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed mb-6">
                All food vendors adhere to Foodora hygiene standards and automated dispatch timelines. Orders placed via the app interface are synced in real-time with delivery partner routing algorithms.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800 block mb-1">Chennai Hub (OMR Zone)</span>
                  <span className="text-slate-500">18 active riders · 4.8 average customer rating</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800 block mb-1">Automated Surge Pricing</span>
                  <span className="text-slate-500">Disabled (Fair pricing locked at ₹40 standard delivery)</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800 block mb-1">Coupon Acceptance</span>
                  <span className="text-slate-500">7 active promo campaigns running smoothly</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. RESTAURANTS MANAGEMENT */}
        {adminTab === 'restaurants' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Partner Restaurants</h2>
                <p className="text-xs text-slate-500">Manage opening hours, pricing and catalog status</p>
              </div>

              <button
                onClick={() => setIsAddingRest(true)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Restaurant</span>
              </button>
            </div>

            {/* Add Restaurant Form Modal */}
            {isAddingRest && (
              <form
                onSubmit={handleCreateRestaurant}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-lg space-y-4 animate-in fade-in"
              >
                <h3 className="font-bold text-slate-900 text-sm">Add New Restaurant</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Restaurant Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Curry Court"
                      value={newRestName}
                      onChange={(e) => setNewRestName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g. Authentic Dum Biryanis & Kebabs"
                      value={newRestTagline}
                      onChange={(e) => setNewRestTagline(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Cuisines (Comma separated)</label>
                    <input
                      type="text"
                      value={newRestCuisine}
                      onChange={(e) => setNewRestCuisine(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Price for Two (₹)</label>
                    <input
                      type="number"
                      value={newRestPrice}
                      onChange={(e) => setNewRestPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRestIsVeg}
                      onChange={(e) => setNewRestIsVeg(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="font-semibold text-slate-700">Pure Veg Restaurant</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingRest(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold"
                  >
                    Save Restaurant
                  </button>
                </div>
              </form>
            )}

            {/* Restaurants Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Restaurant</th>
                      <th className="p-4">Cuisines</th>
                      <th className="p-4">City / Area</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {restaurants.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={r.image}
                              alt={r.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-xl object-cover shrink-0"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">{r.name}</span>
                              <span className="text-[11px] text-slate-400">₹{r.priceForTwo} for two</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-slate-600">{r.cuisine.join(', ')}</td>

                        <td className="p-4">
                          <span className="font-semibold text-slate-800">{r.area}</span>
                          <span className="text-slate-400 block">{r.city}</span>
                        </td>

                        <td className="p-4 font-bold text-slate-800">★ {r.rating}</td>

                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              r.isOpen
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {r.isOpen ? 'OPEN' : 'CLOSED'}
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleRestStatus(r.id)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                r.isOpen
                                  ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                                  : 'border-emerald-300 text-emerald-700 bg-emerald-50'
                              }`}
                              title={r.isOpen ? 'Turn OFF' : 'Turn ON'}
                            >
                              <Power className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRest(r.id)}
                              className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. ORDERS ORCHESTRATION */}
        {adminTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Live Customer Orders</h2>
              <p className="text-xs text-slate-500">Track and advance real-time status across restaurant kitchens</p>
            </div>

            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-orange-600">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {ord.restaurantName}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 space-y-0.5">
                      <div>
                        Customer: <strong className="text-slate-700">{ord.deliveryAddress.name}</strong> ({ord.deliveryAddress.phone})
                      </div>
                      <div>
                        Destination: {ord.deliveryAddress.houseFlat}, {ord.deliveryAddress.area}, {ord.deliveryAddress.city}
                      </div>
                      <div>
                        Items: {ord.items.map((i) => `${i.menuItem.name} (${i.quantity})`).join(', ')}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                    <div className="text-right sm:text-left">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Bill</span>
                      <span className="font-mono font-bold text-base text-slate-900">₹{ord.total}</span>
                    </div>

                    {/* Order Status Selector */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-500">Status:</span>
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="ACCEPTED">ACCEPTED</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="READY">READY</option>
                        <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
