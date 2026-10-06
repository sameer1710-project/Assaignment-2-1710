import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VegBadge } from '../common/VegBadge';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';

export const CartDrawerOrPage: React.FC = () => {
  const {
    cart,
    cartRestaurant,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    deliveryOption,
    setDeliveryOption,
    tax,
    packagingFee,
    appliedCoupon,
    couponDiscount,
    grandTotal,
    applyCoupon,
    removeCoupon,
    setActiveTab,
  } = useApp();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setCouponError('');
    setIsApplying(true);
    const res = await applyCoupon(inputCoupon.trim());
    setIsApplying(false);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setInputCoupon('');
    }
  };

  if (cart.length === 0 || !cartRestaurant) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          Good food is always cooking! Add delicious dishes from our top rated restaurants.
        </p>
        <button
          onClick={() => setActiveTab('restaurants')}
          className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 active:scale-95 transition-all"
        >
          Explore Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-28 pt-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
              Your Order
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              From <strong className="text-slate-800">{cartRestaurant.name}</strong>
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                >
                  {/* Left: item info */}
                  <div className="flex items-start gap-3 flex-1">
                    <VegBadge isVeg={item.menuItem.isVeg} size="sm" />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-sm">
                        {item.menuItem.name}
                      </h4>
                      <span className="text-xs font-semibold text-slate-600 tabular-nums">
                        ₹{item.menuItem.price} each
                      </span>

                      {/* Customization details */}
                      {item.customization && (
                        <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                          {item.customization.spiceLevel && (
                            <div>Spice: {item.customization.spiceLevel}</div>
                          )}
                          {item.customization.selectedAddons && item.customization.selectedAddons.length > 0 && (
                            <div>
                              Add-ons: {item.customization.selectedAddons.map((a) => `${a.name} (+₹${a.price})`).join(', ')}
                            </div>
                          )}
                          {item.customization.specialInstructions && (
                            <div className="italic text-slate-400">
                              "{item.customization.specialInstructions}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Price */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-2 py-1 text-orange-700 font-bold text-xs">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-5 h-5 rounded hover:bg-orange-100 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="tabular-nums min-w-[12px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-5 h-5 rounded hover:bg-orange-100 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      ₹{item.itemTotalPrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Option Selector */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Choose Delivery Speed
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryOption('standard')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    deliveryOption === 'standard'
                      ? 'border-orange-600 bg-orange-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900">Standard Delivery</span>
                    <span className="text-xs font-semibold text-slate-600">
                      {subtotal >= 499 ? 'FREE' : '₹40'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-600" />
                    <span>30–40 min</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryOption('priority')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    deliveryOption === 'priority'
                      ? 'border-orange-600 bg-orange-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900">Priority Delivery</span>
                      <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                        FAST
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-600">
                      {subtotal >= 499 ? '₹30' : '₹70'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>20–25 min direct routing</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Coupon & Bill Summary */}
          <div className="lg:col-span-5 space-y-4">
            {/* Coupon Box */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Offers & Coupons
              </span>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-mono text-xs font-bold block">{appliedCoupon.code}</span>
                      <span className="text-[11px] text-emerald-700">
                        Saved ₹{couponDiscount} with this coupon
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code (e.g. SAVE150)"
                      value={inputCoupon}
                      onChange={(e) => {
                        setInputCoupon(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono uppercase focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <button
                      type="submit"
                      disabled={isApplying || !inputCoupon.trim()}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      {isApplying ? 'Checking...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-rose-600 font-medium">{couponError}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveTab('offers')}
                    className="text-xs text-orange-600 hover:underline font-semibold block"
                  >
                    View all available coupons →
                  </button>
                </form>
              )}
            </div>

            {/* Bill Summary */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-base">Bill Summary</h3>

              <div className="space-y-2 text-xs text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span className="font-semibold text-slate-800 tabular-nums">₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Govt Taxes & Charges (5% GST)</span>
                  <span className="font-semibold text-slate-800 tabular-nums">₹{tax}</span>
                </div>

                <div className="flex justify-between">
                  <span>Restaurant Packaging</span>
                  <span className="font-semibold text-slate-800 tabular-nums">₹{packagingFee}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span className="tabular-nums">-₹{couponDiscount}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                  <span className="font-extrabold text-sm sm:text-base">Grand Total</span>
                  <span className="font-extrabold text-lg sm:text-xl font-mono tabular-nums text-orange-600">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                onClick={() => setActiveTab('checkout')}
                className="w-full mt-4 py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-600/20 active:scale-[0.98] transition-all flex items-center justify-between"
              >
                <span>Proceed to Checkout</span>
                <span className="flex items-center gap-1.5 font-mono">
                  <span>₹{grandTotal}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Secure Checkout with Instant Live Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
