# FOODORA — Discover. Order. Enjoy.

> A modern, premium full-stack food discovery and delivery web application inspired by contemporary Indian culinary commerce, crafted with clean design architecture and original branding.

---

## 📌 Project Overview & Hackathon Topic

- **Project Category**: Food Discovery & Delivery E-Commerce Platform
- **Brand**: FOODORA
- **Tagline**: *Discover. Order. Enjoy.*
- **Lead Developer & Coordinator**: Sameer Ahamed (`sameerahamedsyed777@gmail.com`)
- **Default Delivery Location**: Kelambakkam, Chennai, Tamil Nadu

---

## 🔎 Topic Research & UI Pattern Analysis

### 1. What the UI Pattern Is
The Food Discovery and Real-time Delivery pattern combines high-density visual search, multi-tiered categorization (cuisines, dietary preferences, delivery speeds), dynamic meal customization (spice levels, add-on toppings, special cooking instructions), live bill calculation, multi-step checkout, and live order status tracking with timeline progression.

### 2. Where It Is Commonly Used
Modern on-demand food platforms globally and across South Asia (e.g., Zomato, Swiggy, DoorDash, Deliveroo, Uber Eats).

### 3. Why It Is Relevant to Modern Web Interfaces
Consumers require rapid visual feedback, zero page reloads during cart interactions, transparent pricing without hidden fees, instant coupon validation, and complete delivery visibility from kitchen preparation to doorstep handoff.

### 4. Observed Design & Interaction Patterns
- Sticky, non-intrusive top navigation with delivery location selector
- Horizontal category reels with touch-friendly snap scrolling
- Visual dish cards highlighting veg/non-veg tags and bestselling dishes
- Multi-step checkout (Address → Delivery Speed → Payment → Confirmation)
- Real-time status progression (Order Placed → Accepted → Preparing → Ready → Out for Delivery → Delivered)

### 5. What FOODORA Does Differently (Our Added Value)
1. **Anti-AI Slop & Zero-Pill Discipline**: Clean, unboxed text metadata with typographic separators (`·`) instead of colored capsule clutter.
2. **Warm Spice Identity**: Warm saffron amber (`#EA580C`) and slate typography with authentic Indian culinary imagery.
3. **Full-Stack REST Architecture**: Real Node.js + Express backend serving API endpoints (`/api/restaurants`, `/api/orders`, `/api/coupons`, `/api/addresses`, etc.).
4. **Interactive Status Progression**: Live simulation tools for testing order states and kitchen updates.
5. **Interactive Location Engine**: Support for 8 major Indian metropolitan cities (Chennai, Bengaluru, Hyderabad, Mumbai, Delhi, Pune, Kolkata, Coimbatore) with neighborhood filtering.
6. **Partner Admin Portal**: Dedicated operational dashboard for menu availability, order status orchestration, and partner restaurant analytics.

---

## 🔀 GitHub Collaboration Workflow

The project follows the standard Git collaboration lifecycle:

```
Fork → Clone → Branch → Develop → Commit → Push → Pull Request → Review → Merge
```

- `main`: Production-ready release branch
- `feature/*`: Dedicated feature branches for UI components, API routes, and state logic
- Every Pull Request requires automated TypeScript build verification (`npm run lint` & `npm run build`) before merging.

---

## 📦 Implemented Pages & Features

| Page / Feature | Capabilities |
|---|---|
| **Top Navigation** | Brand wordmark, delivery location selector, search shortcut, cart counter with live total, favorites counter, user profile, Admin toggle. |
| **Home Page** | Location header, hero section with search, 12 food categories with horizontal scrolling, popular restaurants grid, trending dishes with quick-add, special deal banners. |
| **Restaurants Page** | 30+ curated dining spots, multi-filter by cuisine, pure veg toggle, 4.5+ rating, delivery time, special offers, sorting (rating, delivery time, price low/high). |
| **Restaurant Menu** | Cover banner, cuisine tags, menu categories, veg/non-veg indicators, spice level & add-ons customizer modal, customer review ratings. |
| **Cart & Dynamic Bill** | Itemized breakdown, quantity steppers, special instructions, coupon code apply/remove with instant validation, delivery speed option, GST calculation. |
| **Checkout Flow** | Multi-step wizard: 1. Address (Select/Add/Delete), 2. Delivery Speed (Standard vs Priority), 3. Payment (UPI with QR & VPA, Card test, COD), 4. Confetti Confirmation. |
| **Live Order Tracking** | Status timeline (Order Placed → Accepted → Preparing → Ready → Out for Delivery → Delivered), live ETA countdown, delivery partner card with simulated call. |
| **Offers & Coupons** | Promo banners, coupon cards (SAVE150, FOODORA20, FREEDEL, FIRST100, WEEKEND150, etc.) with one-click apply and copy. |
| **Account Dashboard** | User greeting ("Hello, Sameer 👋"), My Orders (Active, Past, Cancelled with reorder & track), Saved Favorites, Address book management, Payment preferences, 24/7 Live Support Chat simulation, Settings. |
| **Admin Dashboard** | Operations portal: Revenue metrics, listed restaurants management (Add, Delete, Toggle Open/Close), live order status orchestration. |

---

## 💻 Technical Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Canvas Confetti, Motion
- **Backend**: Node.js, Express, TypeScript (`tsx`)
- **API Architecture**: Clean REST API (`/api/*`)
- **State Management**: React Context (`AppContext`) with optimistic updates and local persistence fallback

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Full-Stack Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000` with Express backend API routes and Vite frontend middlewares mounted simultaneously.

### 3. Build for Production
```bash
npm run build
```

### 4. Start Production Server
```bash
npm run start
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
# GEMINI_API_KEY for optional AI extensions
GEMINI_API_KEY="YOUR_KEY"

# APP_URL for host binding
APP_URL="http://localhost:3000"
```

---

© 2026 FOODORA Technologies. Discover. Order. Enjoy.
