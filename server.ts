import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  RESTAURANTS,
  MENU_ITEMS,
  CATEGORIES,
  COUPONS,
  INITIAL_USER,
  REVIEWS_POOL,
} from './src/data/seedData';
import {
  Restaurant,
  MenuItem,
  SavedAddress,
  Order,
  OrderStatus,
  RestaurantReview,
} from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-Memory Database store with seed data
let restaurantsDb: Restaurant[] = [...RESTAURANTS];
let menuItemsDb: MenuItem[] = [...MENU_ITEMS];
const categoriesDb = [...CATEGORIES];
let couponsDb = [...COUPONS];
let addressesDb: SavedAddress[] = [...INITIAL_USER.savedAddresses];
let userFavoritesDb: { restaurantIds: string[]; itemIds: string[] } = {
  restaurantIds: ['rest-1', 'rest-5', 'rest-9', 'rest-10'],
  itemIds: ['dish-1', 'dish-18', 'dish-21'],
};
let reviewsDb: Record<string, RestaurantReview[]> = {
  'rest-1': [...REVIEWS_POOL],
  'rest-2': [...REVIEWS_POOL.slice(0, 2)],
  'rest-5': [...REVIEWS_POOL.slice(1, 3)],
  'rest-9': [...REVIEWS_POOL.slice(0, 3)],
};
let ordersDb: Order[] = [
  {
    id: 'ord-initial-01',
    orderNumber: 'FOD-82914',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    restaurantId: 'rest-1',
    restaurantName: 'Spice Route',
    restaurantImage: '/src/assets/images/foodora_biryani_pot_1791223420440.jpg',
    items: [
      {
        id: 'cart-init-1',
        menuItem: MENU_ITEMS[0],
        restaurantId: 'rest-1',
        restaurantName: 'Spice Route',
        quantity: 1,
        customization: { spiceLevel: 'Medium' },
        itemTotalPrice: 340,
      },
      {
        id: 'cart-init-2',
        menuItem: MENU_ITEMS[3],
        restaurantId: 'rest-1',
        restaurantName: 'Spice Route',
        quantity: 2,
        itemTotalPrice: 130,
      },
    ],
    subtotal: 470,
    deliveryFee: 40,
    deliveryOption: 'standard',
    tax: 24,
    discount: 50,
    couponCode: 'FOODORA20',
    total: 484,
    status: 'DELIVERED',
    deliveryAddress: addressesDb[0],
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    estimatedArrivalMinutes: 0,
    deliveryPartner: {
      name: 'Vignesh Kumar',
      phone: '+91 94441 55678',
      vehicleNumber: 'TN 11 AB 4452',
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
  },
];

// --- REST API ENDPOINTS ---

// 1. Restaurants
app.get('/api/restaurants', (req: Request, res: Response) => {
  const { city, cuisine, veg, search, sort } = req.query;
  let results = [...restaurantsDb];

  if (city) {
    results = results.filter(
      (r) => r.city.toLowerCase() === (city as string).toLowerCase()
    );
  }

  if (cuisine) {
    const cuisineLower = (cuisine as string).toLowerCase();
    results = results.filter((r) =>
      r.cuisine.some((c) => c.toLowerCase().includes(cuisineLower))
    );
  }

  if (veg === 'true') {
    results = results.filter((r) => r.isPureVeg);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    results = results.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine.some((c) => c.toLowerCase().includes(q)) ||
        r.area.toLowerCase().includes(q)
    );
  }

  if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'deliveryTime') {
    results.sort((a, b) => a.deliveryTimeMin - b.deliveryTimeMin);
  } else if (sort === 'priceLow') {
    results.sort((a, b) => a.priceForTwo - b.priceForTwo);
  } else if (sort === 'priceHigh') {
    results.sort((a, b) => b.priceForTwo - a.priceForTwo);
  }

  res.json({ success: true, count: results.length, data: results });
});

app.get('/api/restaurants/:id', (req: Request, res: Response) => {
  const restaurant = restaurantsDb.find((r) => r.id === req.params.id);
  if (!restaurant) {
    return res.status(404).json({ success: false, error: 'Restaurant not found' });
  }
  res.json({ success: true, data: restaurant });
});

app.get('/api/restaurants/:id/menu', (req: Request, res: Response) => {
  const items = menuItemsDb.filter((item) => item.restaurantId === req.params.id);
  res.json({ success: true, count: items.length, data: items });
});

// 2. Menu Items
app.get('/api/menu-items', (req: Request, res: Response) => {
  const { category, isVeg, search } = req.query;
  let items = [...menuItemsDb];

  if (category) {
    items = items.filter(
      (i) => i.category.toLowerCase() === (category as string).toLowerCase()
    );
  }
  if (isVeg === 'true') {
    items = items.filter((i) => i.isVeg);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    items = items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: items.length, data: items });
});

app.get('/api/menu-items/:id', (req: Request, res: Response) => {
  const item = menuItemsDb.find((i) => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Menu item not found' });
  }
  res.json({ success: true, data: item });
});

// 3. Categories
app.get('/api/categories', (_req: Request, res: Response) => {
  res.json({ success: true, data: categoriesDb });
});

// 4. Search
app.get('/api/search', (req: Request, res: Response) => {
  const q = ((req.query.q as string) || '').toLowerCase().trim();
  if (!q) {
    return res.json({ success: true, restaurants: [], dishes: [] });
  }

  const matchedRestaurants = restaurantsDb.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.cuisine.some((c) => c.toLowerCase().includes(q)) ||
      r.area.toLowerCase().includes(q)
  );

  const matchedDishes = menuItemsDb.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q)
  );

  res.json({
    success: true,
    query: q,
    restaurants: matchedRestaurants,
    dishes: matchedDishes,
  });
});

// 5. Favorites
app.get('/api/favorites', (_req: Request, res: Response) => {
  const favoriteRestaurants = restaurantsDb.filter((r) =>
    userFavoritesDb.restaurantIds.includes(r.id)
  );
  const favoriteDishes = menuItemsDb.filter((i) =>
    userFavoritesDb.itemIds.includes(i.id)
  );
  res.json({
    success: true,
    data: {
      restaurants: favoriteRestaurants,
      dishes: favoriteDishes,
      restaurantIds: userFavoritesDb.restaurantIds,
      itemIds: userFavoritesDb.itemIds,
    },
  });
});

app.post('/api/favorites', (req: Request, res: Response) => {
  const { type, id } = req.body;
  if (type === 'restaurant') {
    if (!userFavoritesDb.restaurantIds.includes(id)) {
      userFavoritesDb.restaurantIds.push(id);
    }
  } else if (type === 'dish') {
    if (!userFavoritesDb.itemIds.includes(id)) {
      userFavoritesDb.itemIds.push(id);
    }
  }
  res.json({ success: true, data: userFavoritesDb });
});

app.delete('/api/favorites/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { type } = req.query;

  if (type === 'restaurant') {
    userFavoritesDb.restaurantIds = userFavoritesDb.restaurantIds.filter(
      (itemId) => itemId !== id
    );
  } else {
    userFavoritesDb.itemIds = userFavoritesDb.itemIds.filter((itemId) => itemId !== id);
  }
  res.json({ success: true, data: userFavoritesDb });
});

// 6. Addresses
app.get('/api/addresses', (_req: Request, res: Response) => {
  res.json({ success: true, data: addressesDb });
});

app.post('/api/addresses', (req: Request, res: Response) => {
  const newAddr: SavedAddress = {
    id: `addr-${Date.now()}`,
    ...req.body,
  };
  if (newAddr.isDefault) {
    addressesDb.forEach((a) => (a.isDefault = false));
  }
  addressesDb.push(newAddr);
  res.json({ success: true, data: newAddr });
});

app.put('/api/addresses/:id', (req: Request, res: Response) => {
  const idx = addressesDb.findIndex((a) => a.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Address not found' });
  }
  if (req.body.isDefault) {
    addressesDb.forEach((a) => (a.isDefault = false));
  }
  addressesDb[idx] = { ...addressesDb[idx], ...req.body };
  res.json({ success: true, data: addressesDb[idx] });
});

app.delete('/api/addresses/:id', (req: Request, res: Response) => {
  addressesDb = addressesDb.filter((a) => a.id !== req.params.id);
  res.json({ success: true, data: addressesDb });
});

// 7. Coupons
app.get('/api/coupons', (_req: Request, res: Response) => {
  res.json({ success: true, data: couponsDb });
});

app.post('/api/coupons/apply', (req: Request, res: Response) => {
  const { code, cartSubtotal } = req.body;
  const coupon = couponsDb.find(
    (c) => c.code.toUpperCase() === (code || '').toUpperCase()
  );

  if (!coupon) {
    return res.status(400).json({ success: false, error: 'Invalid coupon code' });
  }

  if (cartSubtotal < coupon.minOrderValue) {
    return res.status(400).json({
      success: false,
      error: `Minimum order value of ₹${coupon.minOrderValue} required for ${coupon.code}`,
    });
  }

  let discount = 0;
  if (coupon.discountType === 'flat') {
    discount = coupon.discountValue;
  } else {
    discount = Math.round((cartSubtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  }

  res.json({ success: true, coupon, discount });
});

// 8. Orders
app.get('/api/orders', (_req: Request, res: Response) => {
  res.json({ success: true, data: ordersDb });
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = ordersDb.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const {
    restaurantId,
    restaurantName,
    restaurantImage,
    items,
    subtotal,
    deliveryFee,
    deliveryOption,
    tax,
    discount,
    couponCode,
    total,
    deliveryAddress,
    paymentMethod,
  } = req.body;

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: `FOD-${Math.floor(10000 + Math.random() * 90000)}`,
    createdAt: new Date().toISOString(),
    restaurantId,
    restaurantName,
    restaurantImage: restaurantImage || '/src/assets/images/foodora_biryani_pot_1791223420440.jpg',
    items,
    subtotal,
    deliveryFee,
    deliveryOption: deliveryOption || 'standard',
    tax,
    discount: discount || 0,
    couponCode,
    total,
    status: 'ACCEPTED',
    deliveryAddress,
    paymentMethod: paymentMethod || 'UPI',
    paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
    estimatedArrivalMinutes: deliveryOption === 'priority' ? 22 : 32,
    deliveryPartner: {
      name: 'Muthu Vel',
      phone: '+91 98412 87654',
      vehicleNumber: 'TN 14 K 3920',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
  };

  ordersDb.unshift(newOrder);
  res.status(201).json({ success: true, data: newOrder });
});

app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  const { status } = req.body as { status: OrderStatus };
  const order = ordersDb.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  order.status = status;
  res.json({ success: true, data: order });
});

// 9. Reviews
app.get('/api/restaurants/:id/reviews', (req: Request, res: Response) => {
  const reviews = reviewsDb[req.params.id] || [...REVIEWS_POOL];
  res.json({ success: true, data: reviews });
});

app.post('/api/restaurants/:id/reviews', (req: Request, res: Response) => {
  const { userName, rating, comment } = req.body;
  const newReview: RestaurantReview = {
    id: `rev-${Date.now()}`,
    userName: userName || 'Food Lover',
    rating: Number(rating) || 5,
    date: 'Just now',
    comment: comment || 'Delicious and fresh food delivery!',
  };

  if (!reviewsDb[req.params.id]) {
    reviewsDb[req.params.id] = [];
  }
  reviewsDb[req.params.id].unshift(newReview);
  res.json({ success: true, data: newReview });
});

// 10. Admin Endpoints
app.post('/api/admin/restaurants', (req: Request, res: Response) => {
  const newRest: Restaurant = {
    id: `rest-${Date.now()}`,
    ...req.body,
  };
  restaurantsDb.unshift(newRest);
  res.status(201).json({ success: true, data: newRest });
});

app.put('/api/admin/restaurants/:id', (req: Request, res: Response) => {
  const idx = restaurantsDb.findIndex((r) => r.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Restaurant not found' });
  }
  restaurantsDb[idx] = { ...restaurantsDb[idx], ...req.body };
  res.json({ success: true, data: restaurantsDb[idx] });
});

app.delete('/api/admin/restaurants/:id', (req: Request, res: Response) => {
  restaurantsDb = restaurantsDb.filter((r) => r.id !== req.params.id);
  res.json({ success: true, data: { deleted: true } });
});

app.post('/api/admin/menu-items', (req: Request, res: Response) => {
  const newItem: MenuItem = {
    id: `dish-${Date.now()}`,
    ...req.body,
  };
  menuItemsDb.unshift(newItem);
  res.status(201).json({ success: true, data: newItem });
});

app.put('/api/admin/menu-items/:id', (req: Request, res: Response) => {
  const idx = menuItemsDb.findIndex((i) => i.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Item not found' });
  }
  menuItemsDb[idx] = { ...menuItemsDb[idx], ...req.body };
  res.json({ success: true, data: menuItemsDb[idx] });
});

app.delete('/api/admin/menu-items/:id', (req: Request, res: Response) => {
  menuItemsDb = menuItemsDb.filter((i) => i.id !== req.params.id);
  res.json({ success: true, data: { deleted: true } });
});

// Mount Vite or static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Foodora server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
