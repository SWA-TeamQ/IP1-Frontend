# ShopLight Frontend Documentation

This document provides a comprehensive overview of the ShopLight React application, its architectural patterns, and its integration strategy with the upcoming PHP backend.

---

## 1. Tech Stack
*   **Core**: React 18+ (JavaScript)
*   **Build Tool**: Vite
*   **Routing**: React Router DOM v6
*   **Styling**: Tailwind CSS
*   **Icons/Images**: Unsplash (Dynamic URLs), Phosphor/Lucide (Icons via specific classes)
*   **Types**: JSDoc (Plain JavaScript with TypeScript-like documentation)

---

## 2. Directory Structure

| Folder | Purpose |
| :--- | :--- |
| `src/api` | Axios client configuration and base URL settings. |
| `src/components` | Reusable UI components (ProductCard, Navbar, etc.). |
| `src/context` | Global state providers (Auth, Cart, Favorites). |
| `src/data` | Local mock datasets (Products, etc.). |
| `src/pages` | Page components organized by domain (`auth`, `shop`, `public`, `user`). |
| `src/services` | Business logic and API abstraction layer. |
| `src/types` | JSDoc type definitions for the core domain entities. |
| `src/utils` | Pure helper functions (formatters, auth helpers, storage). |

---

## 3. State Management (Contexts)

### 3.1. AuthContext
Manages user sessions, registration, and login.
*   **State**: `{ user, login, register, logout }`
*   **Persistence**: Handled via `utils/auth.js` (SessionStorage/LocalStorage).

### 3.2. CartContext
Handles e-commerce cart operations.
*   **Optimization**: Cart items bundle `name`, `price`, and `image` to avoid extra backend queries during checkout.
*   **Persistence**: Synced with LocalStorage.

### 3.3. FavoritesContext
Manages the user's "wishlist" (currently client-side Set of IDs).

---

## 4. Component Highlights

### 4.1. `ProductAttributes` (`src/components/products/`)
A generic JSON-to-UI mapper. It iterates over the `attributes` field of a product to render specifications (e.g., Color, Material, Fit) without hardcoding labels.

### 4.2. `ProductCard`
Displays product summaries with price formatting and quick "Add to Cart" / "Favorite" toggles.

---

## 5. Backend Migration Strategy

The frontend has been "hardened" for the PHP backend transition:
1.  **Flattened Structure**: Nested `details` have been removed in favor of top-level properties (`category`, `rating`, `reviewCount`).
2.  **Slugs**: Navigation now supports both IDs and Slugs for SEO-friendly URLs.
3.  **Postgres Compatibility**: `id` fields are treated as strings (prepared for UUIDs), and attributes use a JSONB-friendly structure.
4.  **Price Cents**: While the UI shows formatted dollars, it is prepared to receive integers (cents) from the backend.

---

## 6. Development & Commands

*   **Start Dev Server**: `npm run dev`
*   **Build for Production**: `npm run build`
*   **Linting**: `npm run lint`

---
