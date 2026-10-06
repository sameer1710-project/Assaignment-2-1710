import {
  Restaurant,
  MenuItem,
  FoodCategory,
  Coupon,
  SavedAddress,
  Order,
  OrderStatus,
  RestaurantReview,
} from '../types';
import {
  RESTAURANTS,
  MENU_ITEMS,
  CATEGORIES,
  COUPONS,
  INITIAL_USER,
  REVIEWS_POOL,
} from '../data/seedData';

// Fallback in-memory storage for frontend reactivity
const localState = {
  restaurants: [...RESTAURANTS],
  menuItems: [...MENU_ITEMS],
  categories: [...CATEGORIES],
  coupons: [...COUPONS],
  addresses: [...INITIAL_USER.savedAddresses],
  favorites: {
    restaurantIds: ['rest-1', 'rest-5', 'rest-9', 'rest-10'],
    itemIds: ['dish-1', 'dish-18', 'dish-21'],
  },
  orders: [] as Order[],
  reviews: {} as Record<string, RestaurantReview[]>,
};

export const api = {
  // Restaurants
  async getRestaurants(params?: {
    city?: string;
    cuisine?: string;
    veg?: boolean;
    search?: string;
    sort?: string;
  }): Promise<Restaurant[]> {
    try {
      const query = new URLSearchParams();
      if (params?.city) query.append('city', params.city);
      if (params?.cuisine) query.append('cuisine', params.cuisine);
      if (params?.veg) query.append('veg', 'true');
      if (params?.search) query.append('search', params.search);
      if (params?.sort) query.append('sort', params.sort);

      const res = await fetch(`/api/restaurants?${query.toString()}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }

    let list = [...localState.restaurants];
    if (params?.city) {
      list = list.filter((r) => r.city.toLowerCase() === params.city?.toLowerCase());
    }
    if (params?.cuisine) {
      const cLower = params.cuisine.toLowerCase();
      list = list.filter((r) => r.cuisine.some((c) => c.toLowerCase().includes(cLower)));
    }
    if (params?.veg) {
      list = list.filter((r) => r.isPureVeg);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.some((c) => c.toLowerCase().includes(q)) ||
          r.area.toLowerCase().includes(q)
      );
    }
    if (params?.sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (params?.sort === 'deliveryTime') {
      list.sort((a, b) => a.deliveryTimeMin - b.deliveryTimeMin);
    } else if (params?.sort === 'priceLow') {
      list.sort((a, b) => a.priceForTwo - b.priceForTwo);
    } else if (params?.sort === 'priceHigh') {
      list.sort((a, b) => b.priceForTwo - a.priceForTwo);
    }
    return list;
  },

  async getRestaurantById(id: string): Promise<Restaurant | undefined> {
    try {
      const res = await fetch(`/api/restaurants/${id}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return localState.restaurants.find((r) => r.id === id);
  },

  async getRestaurantMenu(restaurantId: string): Promise<MenuItem[]> {
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/menu`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return localState.menuItems.filter((i) => i.restaurantId === restaurantId);
  },

  // Categories
  async getCategories(): Promise<FoodCategory[]> {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return localState.categories;
  },

  // Search
  async search(query: string): Promise<{ restaurants: Restaurant[]; dishes: MenuItem[] }> {
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const json = await res.json();
        return { restaurants: json.restaurants, dishes: json.dishes };
      }
    } catch {
      // fallback
    }
    const q = query.toLowerCase().trim();
    const restaurants = localState.restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine.some((c) => c.toLowerCase().includes(q))
    );
    const dishes = localState.menuItems.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
    );
    return { restaurants, dishes };
  },

  // Favorites
  async getFavorites(): Promise<{ restaurantIds: string[]; itemIds: string[] }> {
    try {
      const res = await fetch('/api/favorites');
      if (res.ok) {
        const json = await res.json();
        return {
          restaurantIds: json.data.restaurantIds,
          itemIds: json.data.itemIds,
        };
      }
    } catch {
      // fallback
    }
    return localState.favorites;
  },

  async toggleFavorite(type: 'restaurant' | 'dish', id: string): Promise<boolean> {
    const list = type === 'restaurant' ? localState.favorites.restaurantIds : localState.favorites.itemIds;
    const exists = list.includes(id);

    try {
      if (exists) {
        await fetch(`/api/favorites/${id}?type=${type}`, { method: 'DELETE' });
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, id }),
        });
      }
    } catch {
      // fallback
    }

    if (exists) {
      const idx = list.indexOf(id);
      list.splice(idx, 1);
      return false;
    } else {
      list.push(id);
      return true;
    }
  },

  // Coupons
  async getCoupons(): Promise<Coupon[]> {
    try {
      const res = await fetch('/api/coupons');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return localState.coupons;
  },

  async applyCoupon(code: string, subtotal: number): Promise<{ success: boolean; coupon?: Coupon; discount?: number; error?: string }> {
    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartSubtotal: subtotal }),
      });
      const data = await res.json();
      return data;
    } catch {
      const coupon = localState.coupons.find(
        (c) => c.code.toUpperCase() === code.toUpperCase()
      );
      if (!coupon) return { success: false, error: 'Invalid coupon code' };
      if (subtotal < coupon.minOrderValue) {
        return { success: false, error: `Minimum order value ₹${coupon.minOrderValue} required` };
      }
      let discount =
        coupon.discountType === 'flat'
          ? coupon.discountValue
          : Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
      return { success: true, coupon, discount };
    }
  },

  // Addresses
  async getAddresses(): Promise<SavedAddress[]> {
    try {
      const res = await fetch('/api/addresses');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return localState.addresses;
  },

  async saveAddress(address: Omit<SavedAddress, 'id'> & { id?: string }): Promise<SavedAddress> {
    try {
      const method = address.id ? 'PUT' : 'POST';
      const url = address.id ? `/api/addresses/${address.id}` : '/api/addresses';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }

    if (address.id) {
      const idx = localState.addresses.findIndex((a) => a.id === address.id);
      if (idx !== -1) {
        localState.addresses[idx] = address as SavedAddress;
        return localState.addresses[idx];
      }
    }
    const newAddr: SavedAddress = {
      ...(address as SavedAddress),
      id: address.id || `addr-${Date.now()}`,
    };
    localState.addresses.push(newAddr);
    return newAddr;
  },

  async deleteAddress(id: string): Promise<void> {
    try {
      await fetch(`/api/addresses/${id}`, { method: 'DELETE' });
    } catch {
      // fallback
    }
    localState.addresses = localState.addresses.filter((a) => a.id !== id);
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return localState.orders;
  },

  async placeOrder(orderPayload: Partial<Order>): Promise<Order> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      if (res.ok) {
        const json = await res.json();
        localState.orders.unshift(json.data);
        return json.data;
      }
    } catch {
      // fallback
    }

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `FOD-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      restaurantId: orderPayload.restaurantId || 'rest-1',
      restaurantName: orderPayload.restaurantName || 'Spice Route',
      restaurantImage: orderPayload.restaurantImage || '/src/assets/images/foodora_biryani_pot_1791223420440.jpg',
      items: orderPayload.items || [],
      subtotal: orderPayload.subtotal || 0,
      deliveryFee: orderPayload.deliveryFee || 40,
      deliveryOption: orderPayload.deliveryOption || 'standard',
      tax: orderPayload.tax || 0,
      discount: orderPayload.discount || 0,
      couponCode: orderPayload.couponCode,
      total: orderPayload.total || 0,
      status: 'ACCEPTED',
      deliveryAddress: orderPayload.deliveryAddress || localState.addresses[0],
      paymentMethod: orderPayload.paymentMethod || 'UPI',
      paymentStatus: orderPayload.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      estimatedArrivalMinutes: orderPayload.deliveryOption === 'priority' ? 22 : 32,
      deliveryPartner: {
        name: 'Muthu Vel',
        phone: '+91 98412 87654',
        vehicleNumber: 'TN 14 K 3920',
        rating: 4.9,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      },
    };

    localState.orders.unshift(newOrder);
    return newOrder;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | undefined> {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    const ord = localState.orders.find((o) => o.id === orderId);
    if (ord) ord.status = status;
    return ord;
  },

  // Reviews
  async getReviews(restaurantId: string): Promise<RestaurantReview[]> {
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/reviews`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return localState.reviews[restaurantId] || [...REVIEWS_POOL];
  },

  async addReview(restaurantId: string, review: { userName: string; rating: number; comment: string }): Promise<RestaurantReview> {
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    const newRev: RestaurantReview = {
      id: `rev-${Date.now()}`,
      userName: review.userName,
      rating: review.rating,
      date: 'Just now',
      comment: review.comment,
    };
    if (!localState.reviews[restaurantId]) localState.reviews[restaurantId] = [];
    localState.reviews[restaurantId].unshift(newRev);
    return newRev;
  },

  // Admin APIs
  async adminAddRestaurant(restaurant: Partial<Restaurant>): Promise<Restaurant> {
    try {
      const res = await fetch('/api/admin/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restaurant),
      });
      if (res.ok) {
        const json = await res.json();
        localState.restaurants.unshift(json.data);
        return json.data;
      }
    } catch {
      // fallback
    }
    const newR: Restaurant = {
      id: `rest-${Date.now()}`,
      name: restaurant.name || 'New Gourmet Kitchen',
      tagline: restaurant.tagline || 'Fresh Handcrafted Specialties',
      cuisine: restaurant.cuisine || ['Indian'],
      rating: 4.5,
      reviewCount: 1,
      deliveryTimeMin: 25,
      deliveryTimeMax: 30,
      distanceKm: 2.5,
      priceForTwo: 500,
      isPureVeg: !!restaurant.isPureVeg,
      isOpen: true,
      city: restaurant.city || 'Chennai',
      area: restaurant.area || 'Kelambakkam',
      image: restaurant.image || '/src/assets/images/foodora_biryani_pot_1791223420440.jpg',
      categories: ['Recommended', 'Main Course', 'Starters'],
    };
    localState.restaurants.unshift(newR);
    return newR;
  },

  async adminDeleteRestaurant(id: string): Promise<void> {
    try {
      await fetch(`/api/admin/restaurants/${id}`, { method: 'DELETE' });
    } catch {
      // fallback
    }
    localState.restaurants = localState.restaurants.filter((r) => r.id !== id);
  },

  async adminToggleRestaurantStatus(id: string): Promise<boolean> {
    const r = localState.restaurants.find((item) => item.id === id);
    if (!r) return false;
    r.isOpen = !r.isOpen;
    try {
      await fetch(`/api/admin/restaurants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen: r.isOpen }),
      });
    } catch {
      // fallback
    }
    return r.isOpen;
  },
};
