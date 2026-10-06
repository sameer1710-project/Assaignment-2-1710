export type City =
  | 'Chennai'
  | 'Bengaluru'
  | 'Hyderabad'
  | 'Mumbai'
  | 'Delhi'
  | 'Pune'
  | 'Kolkata'
  | 'Coimbatore';

export interface LocationInfo {
  city: City;
  area: string;
  fullAddress: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  icon: string;
  image: string;
  dishCount: number;
}

export interface AddonOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isVeg: boolean;
  rating: number;
  ratingCount: number;
  isBestseller?: boolean;
  isAvailable: boolean;
  spiceLevels?: ('Mild' | 'Medium' | 'Spicy')[];
  addons?: AddonOption[];
}

export interface RestaurantReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  distanceKm: number;
  priceForTwo: number;
  offer?: string;
  isPureVeg: boolean;
  isOpen: boolean;
  city: City;
  area: string;
  image: string;
  featured?: boolean;
  categories: string[];
}

export interface CartCustomization {
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy';
  selectedAddons?: AddonOption[];
  specialInstructions?: string;
}

export interface CartItem {
  id: string; // unique cart entry ID
  menuItem: MenuItem;
  restaurantId: string;
  restaurantName: string;
  quantity: number;
  customization?: CartCustomization;
  itemTotalPrice: number;
}

export interface SavedAddress {
  id: string;
  tag: 'Home' | 'Work' | 'College' | 'Other';
  name: string;
  phone: string;
  houseFlat: string;
  street: string;
  area: string;
  city: City;
  state: string;
  pincode: string;
  deliveryInstructions?: string;
  isDefault?: boolean;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresOn: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  deliveryOption: 'standard' | 'priority';
  tax: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  deliveryAddress: SavedAddress;
  paymentMethod: 'COD' | 'UPI' | 'CARD';
  paymentStatus: 'PAID' | 'PENDING';
  estimatedArrivalMinutes: number;
  deliveryPartner?: {
    name: string;
    phone: string;
    vehicleNumber: string;
    rating: number;
    avatar: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  membership: 'Foodora Gold' | 'Standard';
  savedAddresses: SavedAddress[];
}
