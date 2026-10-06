import React, { useState } from 'react';
import { COUPONS } from '../../data/seedData';
import { useApp } from '../../context/AppContext';
import { Sparkles, Check, Copy, Tag, Percent, Gift } from 'lucide-react';

export const OffersPage: React.FC = () => {
  const { appliedCoupon, applyCoupon, subtotal, setActiveTab } = useApp();
  const [applyingCode, setApplyingCode] = useState<string | null>(null);

  const handleApply = async (code: string) => {
    setApplyingCode(code);
    await applyCoupon(code);
    setTimeout(() => setApplyingCode(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 pt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 fill-orange-600" />
            <span>Handpicked Foodie Discounts</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Today's Best Offers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Apply valid coupon codes to get instant discounts, cashback, and free delivery on your orders.
          </p>
        </div>

        {/* Featured Big Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1 */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xl overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="relative z-10">
              <span className="bg-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                FIRST ORDER SPECIAL
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold mt-2">
                Flat ₹150 OFF
              </h3>
              <p className="text-xs text-orange-100 mt-1">
                Valid on minimum cart value of ₹399. Welcome to Foodora!
              </p>
            </div>
            <div className="relative z-10 flex items-center justify-between mt-6">
              <span className="font-mono text-xs font-bold bg-white text-orange-800 px-3 py-1.5 rounded-xl shadow-xs">
                SAVE150
              </span>
              <button
                onClick={() => handleApply('SAVE150')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-transform active:scale-95 shadow-md"
              >
                {appliedCoupon?.code === 'SAVE150' ? 'Applied ✓' : 'Apply Now'}
              </button>
            </div>
            {/* Background pattern */}
            <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* Banner 2 */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="relative z-10">
              <span className="bg-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                ZERO DELIVERY CHARGE
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold mt-2">
                Free Delivery
              </h3>
              <p className="text-xs text-emerald-100 mt-1">
                Free standard delivery on all partner restaurants above ₹349.
              </p>
            </div>
            <div className="relative z-10 flex items-center justify-between mt-6">
              <span className="font-mono text-xs font-bold bg-white text-emerald-800 px-3 py-1.5 rounded-xl shadow-xs">
                FREEDEL
              </span>
              <button
                onClick={() => handleApply('FREEDEL')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-transform active:scale-95 shadow-md"
              >
                {appliedCoupon?.code === 'FREEDEL' ? 'Applied ✓' : 'Apply Now'}
              </button>
            </div>
            <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
          </div>
        </div>

        {/* Coupons List Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
              Available Coupons
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COUPONS.map((coupon) => {
              const isApplied = appliedCoupon?.code === coupon.code;
              const meetsMin = subtotal >= coupon.minOrderValue;

              return (
                <div
                  key={coupon.code}
                  className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                    isApplied
                      ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500'
                      : 'border-slate-200/80 hover:border-orange-300 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm tracking-wider px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-800">
                          {coupon.code}
                        </span>
                      </div>
                      {isApplied && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <Check className="w-3 h-3" />
                          <span>Applied</span>
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-900 text-base mt-2">
                      {coupon.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {coupon.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Min order: <strong className="text-slate-700">₹{coupon.minOrderValue}</strong>
                    </span>

                    <button
                      onClick={() => handleApply(coupon.code)}
                      disabled={isApplied || applyingCode === coupon.code}
                      className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${
                        isApplied
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-orange-600 hover:bg-orange-700 text-white active:scale-95 shadow-xs'
                      }`}
                    >
                      {isApplied ? 'Applied ✓' : applyingCode === coupon.code ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bank & Payment Partner Offers */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Percent className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">Payment & Bank Offers</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="font-bold text-slate-900 block mb-0.5">UPI Instant Cashback</span>
              <p className="text-slate-500">Get up to ₹50 cashback using Google Pay or PhonePe</p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="font-bold text-slate-900 block mb-0.5">HDFC / ICICI Cards</span>
              <p className="text-slate-500">Flat 10% instant discount on credit card transactions</p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="font-bold text-slate-900 block mb-0.5">Foodora Gold Perk</span>
              <p className="text-slate-500">Unlimited free delivery on all orders above ₹199</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
