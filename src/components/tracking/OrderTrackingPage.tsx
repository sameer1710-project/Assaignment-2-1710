import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { api } from '../../services/api';
import { VegBadge } from '../common/VegBadge';
import {
  CheckCircle2,
  Clock,
  Phone,
  Navigation,
  ArrowLeft,
  ChefHat,
  PackageCheck,
  Bike,
  Home,
  AlertCircle,
} from 'lucide-react';

const STATUS_STEPS: { status: OrderStatus; label: string; icon: any; desc: string }[] = [
  {
    status: 'ACCEPTED',
    label: 'Order Confirmed',
    icon: CheckCircle2,
    desc: 'Restaurant has accepted your order',
  },
  {
    status: 'PREPARING',
    label: 'Food Being Prepared',
    icon: ChefHat,
    desc: 'Chef is cooking your fresh dishes with care',
  },
  {
    status: 'READY',
    label: 'Ready for Pickup',
    icon: PackageCheck,
    desc: 'Dishes packed in tamper-proof seal bags',
  },
  {
    status: 'OUT_FOR_DELIVERY',
    label: 'Out for Delivery',
    icon: Bike,
    desc: 'Delivery partner is heading to your address',
  },
  {
    status: 'DELIVERED',
    label: 'Delivered',
    icon: Home,
    desc: 'Order handed over. Enjoy your meal!',
  },
];

export const OrderTrackingPage: React.FC = () => {
  const { trackingOrderId, orders, setActiveTab, showToast } = useApp();
  const [order, setOrder] = useState<Order | null>(null);
  const [simulatedMinutes, setSimulatedMinutes] = useState(24);

  useEffect(() => {
    if (trackingOrderId) {
      const found = orders.find((o) => o.id === trackingOrderId);
      if (found) {
        setOrder(found);
        setSimulatedMinutes(found.estimatedArrivalMinutes || 24);
      }
    } else if (orders.length > 0) {
      setOrder(orders[0]);
    }
  }, [trackingOrderId, orders]);

  // Handle advancing status for demo testing
  const handleAdvanceStatus = async () => {
    if (!order) return;
    const currentIndex = STATUS_STEPS.findIndex((s) => s.status === order.status);
    if (currentIndex < STATUS_STEPS.length - 1) {
      const nextStatus = STATUS_STEPS[currentIndex + 1].status;
      const updated = await api.updateOrderStatus(order.id, nextStatus);
      if (updated) {
        setOrder({ ...order, status: nextStatus });
        showToast(`Status updated: ${STATUS_STEPS[currentIndex + 1].label}`);
      }
    }
  };

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mb-2" />
        <h2 className="text-xl font-bold text-slate-800">No active order to track</h2>
        <button
          onClick={() => setActiveTab('restaurants')}
          className="mt-4 px-5 py-2.5 bg-orange-600 text-white rounded-xl font-bold text-xs"
        >
          Discover Food
        </button>
      </div>
    );
  }

  const currentStepIndex = Math.max(
    0,
    STATUS_STEPS.findIndex((s) => s.status === order.status)
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-28 pt-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setActiveTab('account')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Account & Orders</span>
          </button>

          {/* Test Status Stepper for user demo */}
          {order.status !== 'DELIVERED' && (
            <button
              onClick={handleAdvanceStatus}
              className="px-3 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs font-bold transition-colors"
            >
              Advance Demo Status →
            </button>
          )}
        </div>

        {/* Live ETA Card Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 shadow-xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Live Order Tracking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
              {order.status === 'DELIVERED'
                ? 'Order Delivered 🎉'
                : `Arriving in ~${simulatedMinutes} mins`}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Order #{order.orderNumber} · {order.restaurantName}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-3">
            <Clock className="w-6 h-6 text-orange-400" />
            <div className="text-left">
              <span className="text-[10px] text-slate-300 block uppercase font-bold">Status</span>
              <span className="text-xs font-bold text-white">
                {STATUS_STEPS[currentStepIndex]?.label || order.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Progress Timeline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base mb-6">Delivery Progress</h3>

              {/* Timeline Steps */}
              <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const Icon = step.icon;

                  return (
                    <div key={step.status} className="relative flex items-start gap-4">
                      {/* Step Circle marker */}
                      <div
                        className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center -translate-x-1/2 transition-colors ${
                          isDone
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white border-2 border-slate-300 text-slate-400'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>

                      <div className="flex-1 -mt-1">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`font-bold text-sm ${
                              isDone ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </h4>
                          {isCurrent && (
                            <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                              In Progress
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Partner Card */}
            {order.deliveryPartner && (
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={order.deliveryPartner.avatar}
                    alt={order.deliveryPartner.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Delivery Partner
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {order.deliveryPartner.name}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {order.deliveryPartner.vehicleNumber} · ★ {order.deliveryPartner.rating}
                    </span>
                  </div>
                </div>

                <a
                  href={`tel:${order.deliveryPartner.phone}`}
                  onClick={(e) => {
                    e.preventDefault();
                    showToast(`Calling ${order.deliveryPartner?.name}...`);
                  }}
                  className="w-10 h-10 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 flex items-center justify-center transition-colors"
                  title="Call delivery partner"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            )}
          </div>

          {/* Right Column: Order Details & Address */}
          <div className="lg:col-span-5 space-y-4">
            {/* Delivery Address */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                <Navigation className="w-3.5 h-3.5 text-orange-600" />
                <span>Delivering To</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                {order.deliveryAddress.name} ({order.deliveryAddress.tag})
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                {order.deliveryAddress.houseFlat}, {order.deliveryAddress.street}
              </p>
              <p className="text-xs text-slate-400">
                {order.deliveryAddress.area}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
              </p>
              {order.deliveryAddress.deliveryInstructions && (
                <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-xl mt-2">
                  Instructions: {order.deliveryAddress.deliveryInstructions}
                </p>
              )}
            </div>

            {/* Ordered Items Summary */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Order Summary</h4>

              <div className="space-y-2 text-xs text-slate-600 border-b border-slate-100 pb-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <VegBadge isVeg={item.menuItem.isVeg} size="sm" />
                      <span>
                        {item.menuItem.name} × {item.quantity}
                      </span>
                    </div>
                    <span className="font-semibold text-slate-800 tabular-nums">
                      ₹{item.itemTotalPrice}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 text-xs text-slate-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-semibold text-slate-800">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery ({order.deliveryOption})</span>
                  <span className="tabular-nums font-semibold text-slate-800">₹{order.deliveryFee}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({order.couponCode})</span>
                    <span className="tabular-nums">-₹{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Paid ({order.paymentMethod})</span>
                  <span className="font-mono text-sm text-orange-600">₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
