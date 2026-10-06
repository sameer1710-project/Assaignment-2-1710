import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, Copy, Check } from 'lucide-react';

export const SpecialOffersSection: React.FC = () => {
  const { setActiveTab, applyCoupon } = useApp();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const deals = [
    {
      code: 'FOODORA20',
      badge: '20% OFF',
      title: 'Mega Feast Deal',
      sub: 'On orders above ₹499',
      bgColor: 'from-orange-500/10 to-amber-500/10',
      borderColor: 'border-orange-200',
      accentColor: 'text-orange-700',
    },
    {
      code: 'FREEDEL',
      badge: 'FREE DELIVERY',
      title: 'Zero Delivery Fee',
      sub: 'On orders above ₹349',
      bgColor: 'from-emerald-500/10 to-teal-500/10',
      borderColor: 'border-emerald-200',
      accentColor: 'text-emerald-700',
    },
    {
      code: 'FIRST100',
      badge: '₹100 OFF',
      title: 'Welcome Discount',
      sub: 'On your first order above ₹299',
      bgColor: 'from-blue-500/10 to-indigo-500/10',
      borderColor: 'border-blue-200',
      accentColor: 'text-blue-700',
    },
    {
      code: 'WEEKEND150',
      badge: 'FLAT ₹150 OFF',
      title: 'Weekend Special',
      sub: 'Family feasts on orders > ₹549',
      bgColor: 'from-purple-500/10 to-rose-500/10',
      borderColor: 'border-purple-200',
      accentColor: 'text-purple-700',
    },
  ];

  const handleApply = async (code: string) => {
    setCopiedCode(code);
    await applyCoupon(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section className="py-12 bg-slate-50/70 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-orange-600" />
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
                Delicious deals, just for you
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Save big with verified food coupons and limited-time discounts
            </p>
          </div>

          <button
            onClick={() => setActiveTab('offers')}
            className="flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 group w-fit"
          >
            <span>View All Offers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Promo Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {deals.map((deal) => (
            <div
              key={deal.code}
              className={`p-5 rounded-2xl bg-gradient-to-br ${deal.bgColor} border ${deal.borderColor} bg-white flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow`}
            >
              <div>
                <span className={`inline-block font-display font-black text-xl ${deal.accentColor} tracking-tight mb-1`}>
                  {deal.badge}
                </span>
                <h4 className="font-bold text-slate-900 text-sm">{deal.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{deal.sub}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-white border border-slate-200 text-slate-700">
                  {deal.code}
                </span>

                <button
                  onClick={() => handleApply(deal.code)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 active:scale-95 transition-all"
                >
                  {copiedCode === deal.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Applied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Apply</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
