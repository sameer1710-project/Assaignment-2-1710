import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SavedAddress, City } from '../../types';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Clock,
  CreditCard,
  CheckCircle2,
  Plus,
  ArrowRight,
  ShieldCheck,
  Building,
  Home,
  GraduationCap,
  Sparkles,
  QrCode,
  DollarSign,
  Lock,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartRestaurant,
    subtotal,
    deliveryFee,
    deliveryOption,
    setDeliveryOption,
    tax,
    packagingFee,
    appliedCoupon,
    couponDiscount,
    grandTotal,
    savedAddresses,
    selectedAddress,
    setSelectedAddress,
    saveNewAddress,
    createOrder,
    openOrderTracking,
    setActiveTab,
    city: appCity,
    area: appArea,
    user,
  } = useApp();

  // Multi-step: 1 = Address, 2 = Delivery, 3 = Payment, 4 = Confirmation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'COD'>('UPI');
  const [upiId, setUpiId] = useState('sameer@oksbi');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 9812');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('•••');

  // Address modal state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrTag, setNewAddrTag] = useState<'Home' | 'College' | 'Work' | 'Other'>('Home');
  const [newAddrName, setNewAddrName] = useState(user.name);
  const [newAddrPhone, setNewAddrPhone] = useState(user.phone);
  const [newAddrHouse, setNewAddrHouse] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrArea, setNewAddrArea] = useState(appArea);
  const [newAddrCity, setNewAddrCity] = useState<City>(appCity);
  const [newAddrPincode, setNewAddrPincode] = useState('603103');
  const [newAddrInstructions, setNewAddrInstructions] = useState('');

  // Confirmed order data
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // If cart is empty, redirect
  if (cart.length === 0 && currentStep !== 4) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">No active order to checkout</h2>
        <button
          onClick={() => setActiveTab('restaurants')}
          className="px-5 py-2.5 bg-orange-600 text-white rounded-xl font-bold text-xs"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  const handleSaveNewAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrHouse || !newAddrStreet) return;
    await saveNewAddress({
      tag: newAddrTag,
      name: newAddrName,
      phone: newAddrPhone,
      houseFlat: newAddrHouse,
      street: newAddrStreet,
      area: newAddrArea,
      city: newAddrCity,
      state: 'Tamil Nadu',
      pincode: newAddrPincode,
      deliveryInstructions: newAddrInstructions,
      isDefault: true,
    });
    setIsAddingAddress(false);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const order = await createOrder(paymentMethod);
      setConfirmedOrderId(order.id);
      setCurrentStep(4);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ea580c', '#f59e0b', '#10b981', '#3b82f6'],
        });
      } catch {
        // Safe fallback
      }
    } catch (e: any) {
      alert(e.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-28 pt-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Step Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            {[
              { num: 1, label: 'Address' },
              { num: 2, label: 'Delivery' },
              { num: 3, label: 'Payment' },
              { num: 4, label: 'Confirmation' },
            ].map((step, idx) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;

              return (
                <React.Fragment key={step.num}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        isPast
                          ? 'bg-emerald-600 text-white'
                          : isActive
                          ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="w-5 h-5" /> : step.num}
                    </div>
                    <span
                      className={`text-[11px] font-bold mt-1 ${
                        isActive ? 'text-orange-600' : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {idx < 3 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 -mt-4 transition-colors ${
                        currentStep > idx + 1 ? 'bg-emerald-600' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* STEP 1: ADDRESS SELECTION */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
                  Select Delivery Address
                </h2>
                <p className="text-xs text-slate-500">
                  Choose where your food should be handed over
                </p>
              </div>

              <button
                onClick={() => setIsAddingAddress(true)}
                className="px-3.5 py-2 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>

            {/* Saved addresses grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedAddresses.map((addr) => {
                const isSelected = selectedAddress?.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white border-orange-500 shadow-md ring-1 ring-orange-500'
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {addr.tag === 'Home' && <Home className="w-4 h-4 text-orange-600" />}
                          {addr.tag === 'College' && <GraduationCap className="w-4 h-4 text-indigo-600" />}
                          {addr.tag === 'Work' && <Building className="w-4 h-4 text-blue-600" />}
                          <span className="font-bold text-sm text-slate-900">{addr.tag}</span>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-slate-700">
                        {addr.houseFlat}, {addr.street}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {addr.area}, {addr.city} - {addr.pincode}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Contact: {addr.phone}
                      </p>
                      {addr.deliveryInstructions && (
                        <p className="text-[11px] text-amber-700 bg-amber-50/80 px-2 py-0.5 rounded mt-2">
                          Note: {addr.deliveryInstructions}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Address Form Modal */}
            {isAddingAddress && (
              <form
                onSubmit={handleSaveNewAddressSubmit}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md space-y-4 animate-in fade-in"
              >
                <h3 className="font-bold text-slate-900 text-base">Add New Delivery Location</h3>

                <div className="flex gap-2">
                  {(['Home', 'Work', 'College', 'Other'] as const).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setNewAddrTag(tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        newAddrTag === tag
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">House / Flat / Block</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 301, Emerald Towers"
                      value={newAddrHouse}
                      onChange={(e) => setNewAddrHouse(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Street / Landmark</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Near Chettinad Hospital"
                      value={newAddrStreet}
                      onChange={(e) => setNewAddrStreet(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Area / Neighborhood</label>
                    <input
                      type="text"
                      value={newAddrArea}
                      onChange={(e) => setNewAddrArea(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={newAddrPincode}
                      onChange={(e) => setNewAddrPincode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Leave with security, ring bell twice"
                    value={newAddrInstructions}
                    onChange={(e) => setNewAddrInstructions(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20"
                  >
                    Save & Use Address
                  </button>
                </div>
              </form>
            )}

            {/* Next Button */}
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setActiveTab('cart')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                ← Back to Cart
              </button>
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!selectedAddress}
                className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-orange-600/20"
              >
                <span>Continue to Delivery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DELIVERY OPTIONS */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
                Choose Delivery Speed
              </h2>
              <p className="text-xs text-slate-500">
                Delivering from {cartRestaurant?.name} to {selectedAddress?.area}
              </p>
            </div>

            <div className="space-y-3">
              <div
                onClick={() => setDeliveryOption('standard')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  deliveryOption === 'standard'
                    ? 'bg-white border-orange-500 shadow-md ring-1 ring-orange-500'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Standard Delivery</h4>
                    <p className="text-xs text-slate-500">Estimated 30–40 min arrival</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-slate-900">
                    {subtotal >= 499 ? 'FREE' : '₹40'}
                  </span>
                </div>
              </div>

              <div
                onClick={() => setDeliveryOption('priority')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  deliveryOption === 'priority'
                    ? 'bg-white border-orange-500 shadow-md ring-1 ring-orange-500'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">Priority Direct Delivery</h4>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 rounded">
                        FASTEST
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Direct route with no batching (20–25 min)</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-slate-900">
                    {subtotal >= 499 ? '₹30' : '₹70'}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                ← Back to Address
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-orange-600/20"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
                Payment Method
              </h2>
              <p className="text-xs text-slate-500">
                Total payable amount: <strong className="text-slate-900 font-mono text-sm">₹{grandTotal}</strong>
              </p>
            </div>

            <div className="space-y-3">
              {/* Option 1: UPI */}
              <div
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'UPI'
                    ? 'bg-white border-orange-500 shadow-md ring-1 ring-orange-500'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <QrCode className="w-5 h-5 text-indigo-600" />
                    <span className="font-bold text-sm text-slate-900">UPI (Google Pay, PhonePe, Paytm)</span>
                  </div>
                  {paymentMethod === 'UPI' && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Instant & Zero Fee
                    </span>
                  )}
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4 text-xs">
                    {/* Simulated QR */}
                    <div className="w-24 h-24 bg-slate-900 p-2 rounded-xl flex items-center justify-center shrink-0">
                      <div className="w-full h-full bg-white rounded-lg flex items-center justify-center text-slate-900 font-bold text-[10px] text-center p-1">
                        SCAN TO PAY ₹{grandTotal}
                      </div>
                    </div>
                    <div className="flex-1 w-full space-y-1.5">
                      <label className="block text-slate-600 font-semibold">Or enter your UPI ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@okhdfcbank"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                      />
                      <p className="text-[11px] text-slate-400">
                        Secure instant test verification via NPCI protocol
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Option 2: Credit / Debit Card */}
              <div
                onClick={() => setPaymentMethod('CARD')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'CARD'
                    ? 'bg-white border-orange-500 shadow-md ring-1 ring-orange-500'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-sm text-slate-900">Credit / Debit Card</span>
                  </div>
                  {paymentMethod === 'CARD' && (
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>128-bit Encrypted</span>
                    </span>
                  )}
                </div>

                {paymentMethod === 'CARD' && (
                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-600 font-semibold mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Valid Thru</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Option 3: Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'bg-white border-orange-500 shadow-md ring-1 ring-orange-500'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="font-bold text-sm text-slate-900">Cash on Delivery</span>
                      <p className="text-xs text-slate-500">Pay via cash or UPI when your order arrives</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                ← Back to Delivery
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-600/20 active:scale-95 transition-all"
              >
                <span>{isProcessing ? 'Confirming...' : `Pay ₹${grandTotal} & Place Order`}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMATION */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-lg text-center max-w-lg mx-auto space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Order Placed Successfully 🎉
              </span>
              <h2 className="text-2xl font-display font-extrabold text-slate-900 mt-1">
                Your food is being prepared!
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Estimated arrival in <strong>{deliveryOption === 'priority' ? '22' : '32'} minutes</strong>
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl text-xs text-left space-y-1.5 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Restaurant:</span>
                <span className="font-bold text-slate-900">{cartRestaurant?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivering To:</span>
                <span className="font-bold text-slate-900 truncate max-w-[200px]">
                  {selectedAddress?.houseFlat}, {selectedAddress?.area}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-slate-900 font-mono">₹{grandTotal}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  if (confirmedOrderId) {
                    openOrderTracking(confirmedOrderId);
                  } else {
                    setActiveTab('account');
                  }
                }}
                className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 active:scale-95 transition-all"
              >
                Track Live Order →
              </button>

              <button
                onClick={() => setActiveTab('restaurants')}
                className="w-full py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Continue Exploring
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
