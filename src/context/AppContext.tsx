import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import {
  City,
  Restaurant,
  MenuItem,
  CartItem,
  CartCustomization,
  Coupon,
  SavedAddress,
  Order,
  UserProfile,
} from '../types';
import { INITIAL_USER } from '../data/seedData';
import { api } from '../services/api';

export type AppTab =
  | 'home'
  | 'restaurants'
  | 'offers'
  | 'account'
  | 'restaurant-detail'
  | 'cart'
  | 'checkout'
  | 'tracking'
  | 'admin';

interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  // Navigation
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  selectedRestaurantId: string | null;
  setSelectedRestaurantId: (id: string | null) => void;
  openRestaurantDetail: (restaurantId: string) => void;
  trackingOrderId: string | null;
  openOrderTracking: (orderId: string) => void;

  // Location
  city: City;
  area: string;
  setDeliveryLocation: (city: City, area: string) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string | null;
  setCategoryFilter: (cat: string | null) => void;
  vegOnlyFilter: boolean;
  setVegOnlyFilter: (veg: boolean) => void;

  // Cart
  cart: CartItem[];
  cartRestaurant: { id: string; name: string; image: string } | null;
  addToCart: (
    item: MenuItem,
    restaurant: { id: string; name: string; image: string },
    quantity?: number,
    customization?: CartCustomization
  ) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;

  // Bill Calculations
  subtotal: number;
  deliveryOption: 'standard' | 'priority';
  setDeliveryOption: (opt: 'standard' | 'priority') => void;
  deliveryFee: number;
  tax: number;
  packagingFee: number;
  couponDiscount: number;
  appliedCoupon: Coupon | null;
  grandTotal: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Address
  savedAddresses: SavedAddress[];
  selectedAddress: SavedAddress | null;
  setSelectedAddress: (addr: SavedAddress | null) => void;
  saveNewAddress: (addr: Omit<SavedAddress, 'id'> & { id?: string }) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;

  // Orders
  orders: Order[];
  createOrder: (paymentMethod: 'COD' | 'UPI' | 'CARD') => Promise<Order>;
  refreshOrders: () => Promise<void>;

  // Favorites
  favorites: { restaurantIds: string[]; itemIds: string[] };
  toggleFavorite: (type: 'restaurant' | 'dish', id: string) => Promise<void>;
  isFavorite: (type: 'restaurant' | 'dish', id: string) => boolean;

  // Dish Customizer Modal
  isDishModalOpen: boolean;
  dishToCustomize: { dish: MenuItem; restaurant: Restaurant } | null;
  openDishCustomizer: (dish: MenuItem, restaurant: Restaurant) => void;
  closeDishCustomizer: () => void;

  // User Profile
  user: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Toast
  toasts: ToastData[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Hackathon Docs Modal
  isDocsModalOpen: boolean;
  setIsDocsModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<AppTab>('home');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  // Delivery Location
  const [city, setCity] = useState<City>('Chennai');
  const [area, setArea] = useState<string>('Kelambakkam');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [vegOnlyFilter, setVegOnlyFilter] = useState<boolean>(false);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartRestaurant, setCartRestaurant] = useState<{
    id: string;
    name: string;
    image: string;
  } | null>(null);
  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'priority'>('standard');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Address
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(
    INITIAL_USER.savedAddresses
  );
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(
    INITIAL_USER.savedAddresses[0] || null
  );

  // User & Orders
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<{
    restaurantIds: string[];
    itemIds: string[];
  }>({
    restaurantIds: ['rest-1', 'rest-5', 'rest-9', 'rest-10'],
    itemIds: ['dish-1', 'dish-18', 'dish-21'],
  });

  // Modal states
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [dishToCustomize, setDishToCustomize] = useState<{
    dish: MenuItem;
    restaurant: Restaurant;
  } | null>(null);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Load initial orders, favorites, addresses from API
  useEffect(() => {
    async function loadInitial() {
      try {
        const [ordersData, favData, addrData] = await Promise.all([
          api.getOrders(),
          api.getFavorites(),
          api.getAddresses(),
        ]);
        if (ordersData?.length) setOrders(ordersData);
        if (favData) setFavorites(favData);
        if (addrData?.length) {
          setSavedAddresses(addrData);
          const def = addrData.find((a) => a.isDefault) || addrData[0];
          setSelectedAddress(def);
        }
      } catch (e) {
        console.error('Failed to load initial data:', e);
      }
    }
    loadInitial();
  }, []);

  const setActiveTab = (tab: AppTab) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openRestaurantDetail = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    setActiveTab('restaurant-detail');
  };

  const openOrderTracking = (orderId: string) => {
    setTrackingOrderId(orderId);
    setActiveTab('tracking');
  };

  const setDeliveryLocation = (newCity: City, newArea: string) => {
    setCity(newCity);
    setArea(newArea);
    setIsLocationModalOpen(false);
    showToast(`Delivering to ${newArea}, ${newCity}`);
  };

  // Cart operations
  const addToCart = (
    item: MenuItem,
    restaurant: { id: string; name: string; image: string },
    quantity = 1,
    customization?: CartCustomization
  ) => {
    // If cart has items from another restaurant, confirm reset
    if (cartRestaurant && cartRestaurant.id !== restaurant.id && cart.length > 0) {
      if (
        !window.confirm(
          `Your cart contains items from "${cartRestaurant.name}". Reset cart to add items from "${restaurant.name}"?`
        )
      ) {
        return;
      }
      setCart([]);
      setAppliedCoupon(null);
      setCouponDiscount(0);
    }

    setCartRestaurant(restaurant);

    // Calculate item single unit price with addons
    const addonsTotal = (customization?.selectedAddons || []).reduce(
      (sum, a) => sum + a.price,
      0
    );
    const unitPrice = item.price + addonsTotal;

    // Check if duplicate customization exists
    const existingIndex = cart.findIndex(
      (ci) =>
        ci.menuItem.id === item.id &&
        ci.customization?.spiceLevel === customization?.spiceLevel &&
        JSON.stringify(ci.customization?.selectedAddons) ===
          JSON.stringify(customization?.selectedAddons)
    );

    if (existingIndex !== -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      updated[existingIndex].itemTotalPrice =
        updated[existingIndex].quantity * unitPrice;
      setCart(updated);
    } else {
      const newCartItem: CartItem = {
        id: `ci-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        menuItem: item,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        quantity,
        customization,
        itemTotalPrice: unitPrice * quantity,
      };
      setCart((prev) => [...prev, newCartItem]);
    }

    showToast(`Added ${item.name} to cart`);
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      const updated = prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const addonsTotal = (item.customization?.selectedAddons || []).reduce(
              (sum, a) => sum + a.price,
              0
            );
            const unitPrice = item.menuItem.price + addonsTotal;
            return {
              ...item,
              quantity: newQty,
              itemTotalPrice: unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      if (updated.length === 0) {
        setCartRestaurant(null);
        setAppliedCoupon(null);
        setCouponDiscount(0);
      }
      return updated;
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => {
      const filtered = prev.filter((item) => item.id !== cartItemId);
      if (filtered.length === 0) {
        setCartRestaurant(null);
        setAppliedCoupon(null);
        setCouponDiscount(0);
      }
      return filtered;
    });
  };

  const clearCart = () => {
    setCart([]);
    setCartRestaurant(null);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Bill Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.itemTotalPrice, 0);
  }, [cart]);

  const deliveryFee = useMemo(() => {
    if (cart.length === 0) return 0;
    if (appliedCoupon?.code === 'FREEDEL') return 0;
    if (subtotal >= 499) {
      return deliveryOption === 'priority' ? 30 : 0;
    }
    return deliveryOption === 'priority' ? 70 : 40;
  }, [subtotal, deliveryOption, appliedCoupon, cart.length]);

  const tax = useMemo(() => {
    if (subtotal === 0) return 0;
    return Math.round(subtotal * 0.05); // 5% GST
  }, [subtotal]);

  const packagingFee = useMemo(() => {
    return cart.length > 0 ? 20 : 0;
  }, [cart.length]);

  const grandTotal = useMemo(() => {
    if (cart.length === 0) return 0;
    const calc = subtotal + deliveryFee + tax + packagingFee - couponDiscount;
    return Math.max(0, calc);
  }, [subtotal, deliveryFee, tax, packagingFee, couponDiscount, cart.length]);

  const applyCoupon = async (code: string) => {
    if (subtotal === 0) {
      return { success: false, message: 'Your cart is empty' };
    }
    const res = await api.applyCoupon(code, subtotal);
    if (res.success && res.coupon && res.discount !== undefined) {
      setAppliedCoupon(res.coupon);
      setCouponDiscount(res.discount);
      showToast(`Coupon ${res.coupon.code} applied! Saved ₹${res.discount}`);
      return { success: true, message: `Saved ₹${res.discount} with ${res.coupon.code}` };
    } else {
      return { success: false, message: res.error || 'Failed to apply coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    showToast('Coupon removed', 'info');
  };

  // Favorites
  const toggleFavorite = async (type: 'restaurant' | 'dish', id: string) => {
    const isNowFav = await api.toggleFavorite(type, id);
    setFavorites((prev) => {
      const list = type === 'restaurant' ? [...prev.restaurantIds] : [...prev.itemIds];
      if (isNowFav) {
        list.push(id);
      } else {
        const idx = list.indexOf(id);
        if (idx !== -1) list.splice(idx, 1);
      }
      return type === 'restaurant'
        ? { ...prev, restaurantIds: list }
        : { ...prev, itemIds: list };
    });
    showToast(isNowFav ? 'Added to favorites' : 'Removed from favorites');
  };

  const isFavorite = (type: 'restaurant' | 'dish', id: string) => {
    return type === 'restaurant'
      ? favorites.restaurantIds.includes(id)
      : favorites.itemIds.includes(id);
  };

  // Dish Customizer
  const openDishCustomizer = (dish: MenuItem, restaurant: Restaurant) => {
    setDishToCustomize({ dish, restaurant });
    setIsDishModalOpen(true);
  };

  const closeDishCustomizer = () => {
    setIsDishModalOpen(false);
    setDishToCustomize(null);
  };

  // Addresses
  const saveNewAddress = async (addr: Omit<SavedAddress, 'id'> & { id?: string }) => {
    const saved = await api.saveAddress(addr);
    setSavedAddresses((prev) => {
      const existing = prev.findIndex((a) => a.id === saved.id);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = saved;
        return updated;
      }
      return [...prev, saved];
    });
    if (saved.isDefault || !selectedAddress) {
      setSelectedAddress(saved);
    }
    showToast('Address saved successfully');
  };

  const deleteAddress = async (id: string) => {
    await api.deleteAddress(id);
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedAddress?.id === id) {
      setSelectedAddress(savedAddresses.find((a) => a.id !== id) || null);
    }
    showToast('Address deleted', 'info');
  };

  // Orders
  const createOrder = async (paymentMethod: 'COD' | 'UPI' | 'CARD') => {
    if (!cartRestaurant || cart.length === 0) {
      throw new Error('No items in cart');
    }
    if (!selectedAddress) {
      throw new Error('Please select a delivery address');
    }

    const newOrder = await api.placeOrder({
      restaurantId: cartRestaurant.id,
      restaurantName: cartRestaurant.name,
      restaurantImage: cartRestaurant.image,
      items: [...cart],
      subtotal,
      deliveryFee,
      deliveryOption,
      tax,
      discount: couponDiscount,
      couponCode: appliedCoupon?.code,
      total: grandTotal,
      deliveryAddress: selectedAddress,
      paymentMethod,
    });

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const refreshOrders = async () => {
    const list = await api.getOrders();
    setOrders(list);
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...profile }));
    showToast('Profile updated');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedRestaurantId,
        setSelectedRestaurantId,
        openRestaurantDetail,
        trackingOrderId,
        openOrderTracking,
        city,
        area,
        setDeliveryLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        vegOnlyFilter,
        setVegOnlyFilter,
        cart,
        cartRestaurant,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        deliveryOption,
        setDeliveryOption,
        deliveryFee,
        tax,
        packagingFee,
        couponDiscount,
        appliedCoupon,
        grandTotal,
        applyCoupon,
        removeCoupon,
        savedAddresses,
        selectedAddress,
        setSelectedAddress,
        saveNewAddress,
        deleteAddress,
        orders,
        createOrder,
        refreshOrders,
        favorites,
        toggleFavorite,
        isFavorite,
        isDishModalOpen,
        dishToCustomize,
        openDishCustomizer,
        closeDishCustomizer,
        user,
        updateUserProfile,
        toasts,
        showToast,
        isDocsModalOpen,
        setIsDocsModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
