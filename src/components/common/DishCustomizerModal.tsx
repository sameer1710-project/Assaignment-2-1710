import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AddonOption } from '../../types';
import { VegBadge } from './VegBadge';
import { X, Plus, Minus, Star } from 'lucide-react';

export const DishCustomizerModal: React.FC = () => {
  const {
    isDishModalOpen,
    dishToCustomize,
    closeDishCustomizer,
    addToCart,
  } = useApp();

  const [spiceLevel, setSpiceLevel] = useState<'Mild' | 'Medium' | 'Spicy'>('Medium');
  const [selectedAddons, setSelectedAddons] = useState<AddonOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (dishToCustomize) {
      setSpiceLevel(dishToCustomize.dish.spiceLevels?.[0] || 'Medium');
      setSelectedAddons([]);
      setSpecialInstructions('');
      setQuantity(1);
    }
  }, [dishToCustomize]);

  if (!isDishModalOpen || !dishToCustomize) return null;

  const { dish, restaurant } = dishToCustomize;

  const addonsList: AddonOption[] = dish.addons || [
    { id: 'def-1', name: 'Extra Ghee Roast Toss', price: 30 },
    { id: 'def-2', name: 'Extra Mint Chutney & Dip', price: 20 },
    { id: 'def-3', name: 'Extra Portion (+50%)', price: 60 },
  ];

  const handleToggleAddon = (addon: AddonOption) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const singlePrice = dish.price + addonsTotal;
  const totalPrice = singlePrice * quantity;

  const handleConfirmAdd = () => {
    addToCart(
      dish,
      restaurant,
      quantity,
      {
        spiceLevel,
        selectedAddons,
        specialInstructions: specialInstructions.trim() || undefined,
      }
    );
    closeDishCustomizer();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Dish Image Header */}
        <div className="relative h-52 w-full bg-slate-900 shrink-0 overflow-hidden">
          <img
            src={dish.image}
            alt={dish.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={closeDishCustomizer}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Dish Title Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <VegBadge isVeg={dish.isVeg} size="sm" />
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/20 backdrop-blur-md">
                {restaurant.name}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-300 ml-auto">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                <span>{dish.rating}</span>
                <span className="text-white/70 font-normal">({dish.ratingCount})</span>
              </div>
            </div>
            <h3 className="text-xl font-bold leading-tight drop-shadow-sm">{dish.name}</h3>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          <p className="text-xs text-slate-600 leading-relaxed">{dish.description}</p>

          {/* Spice Level Option */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Choose your spice level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Mild', 'Medium', 'Spicy'] as const).map((level) => {
                const isSelected = spiceLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSpiceLevel(level)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span>{level}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Add-ons & Extras
            </label>
            <div className="space-y-2">
              {addonsList.map((addon) => {
                const isChecked = selectedAddons.some((a) => a.id === addon.id);
                return (
                  <label
                    key={addon.id}
                    onClick={() => handleToggleAddon(addon)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      isChecked
                        ? 'border-amber-500 bg-amber-50/40 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 pointer-events-none"
                      />
                      <span className="text-xs font-medium">{addon.name}</span>
                    </div>
                    <span className="text-xs font-bold tabular-nums text-slate-900">
                      +₹{addon.price}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Special Cooking Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Less oil, extra green chillies, no onion"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              maxLength={120}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Footer with Quantity Stepper & Add Button */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-7 h-7 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 flex items-center justify-center transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-sm tabular-nums text-slate-900 min-w-[16px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-7 h-7 rounded-lg text-amber-600 hover:bg-amber-50 flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleConfirmAdd}
            className="flex-1 py-3 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center justify-between shadow-lg shadow-amber-600/20 active:scale-[0.98] transition-all"
          >
            <span>Add to Cart</span>
            <span className="tabular-nums font-mono">₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
