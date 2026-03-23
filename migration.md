# Migration Plan: Vanilla JS -> React + Vite + Tailwind CSS + PHP API

## 1. Scope and Goals

- Migrate the legacy multi-page vanilla frontend to the React SPA now running at repository root (`src/`, `main.jsx`, `App.jsx`).
- Replace imperative DOM manipulation and `window.*` globals with React components, hooks, and context providers.
- Move product, auth, cart, favorites, and order workflows to PHP API endpoints.
- Migrate styling to Tailwind CSS incrementally while preserving current visual behavior.

## 2. Current Build Status (Already Implemented)

### 2.1 React Foundation

Status: Done

- Vite React app is initialized at repository root.
- Router is in place with `BrowserRouter` and route definitions.
- Global providers are wired in `src/main.jsx`.

### 2.2 App Shell and Routes

Status: Mostly done

- `Navbar` and `Footer` are integrated in `src/App.jsx`.
- Routes currently available:
    - `/`
    - `/products`
    - `/products/:id`
    - `/checkout`
    - `/contact`
    - `/login`
    - `/register`
    - `/forgot-password`
    - fallback `*` -> Not Found page

### 2.3 State and Feature Contexts

Status: In progress

- Context providers exist for:
    - `AuthContext`
    - `CartContext`
    - `FavoritesContext`
- Wiring is present; behavior parity vs legacy still needs verification flow-by-flow.

### 2.4 Data Layer

Status: In progress

- `services/products.js` exists with:
    - API client usage
    - response normalization
    - local data fallback
    - search/filter/sort helpers
- Product service is usable, but backend contract locking and error conventions are pending.

### 2.5 Tailwind Setup

Status: Done (setup), In progress (migration)

- Tailwind v4 is installed and active via:
    - `@tailwindcss/vite` plugin in `vite.config.js`
    - `@import "tailwindcss";` in `src/index.css`
- Tailwind utility classes are already used in layout-level UI.
- Full component/page conversion from legacy CSS is not complete.

## 3. Target Architecture

### 3.1 Frontend Stack

- React + Vite
- React Router
- Context + hooks for app state
- Tailwind CSS v4 for component-level styling
- Minimal retained legacy CSS for base reset and rare edge cases

### 3.2 Backend API Targets (PHP)

- Products
    - `GET /api/products`
    - `GET /api/products/{id}`
- Auth
    - `POST /api/auth/login`
    - `POST /api/auth/register`
    - `POST /api/auth/reset`
    - `POST /api/auth/logout`
- Favorites
    - `GET /api/favorites`
    - `POST /api/favorites/toggle`
- Cart
    - `GET /api/cart`
    - `POST /api/cart/items`
    - `PATCH /api/cart/items/{id}`
    - `DELETE /api/cart/items/{id}`
- Orders
    - `POST /api/orders`

### 3.3 Normalized Product Shape

```ts
type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    salePrice?: number | null;
    images: string[];
    details: {
        category?: string;
        rating?: number;
        badge?: string | null;
        color?: string;
        reviewCount?: number;
        [key: string]: unknown;
    };
    features?: string[];
    highlights?: string[];
    reviews?: { id: string; user?: string; rating: number; comment: string }[];
};
```

## 4. Tailwind Migration Strategy (New)

### 4.1 Migration Principles

- Prefer Tailwind utilities for all new and refactored React components.
- Keep legacy CSS only where:
    - third-party markup constraints exist,
    - complex legacy animation is still being ported,
    - migration cost is high and low-value.
- Do not introduce new style rules in legacy `src/styles/*` for React pages.

### 4.2 Hybrid Period Rules

- Allowed during migration:
    - Tailwind for layout, spacing, typography, states.
    - Small global CSS in `src/index.css` for app-wide defaults.
- Not allowed during migration:
    - Adding duplicated utility-style classes to legacy CSS files.
    - Recreating old component CSS blocks when Tailwind utilities can express the same result.

### 4.3 Token and Style Mapping Plan

- Map legacy design tokens to Tailwind theme values (colors, radius, spacing, shadows).
- Create a shared design reference in docs before mass conversion.
- Convert by feature slice, not by random component order.

### 4.4 Tailwind Definition of Done

A page is considered migrated when:

- It renders correctly with Tailwind classes in React.
- It does not depend on a legacy page-specific CSS file from `src/styles/pages/*`.
- Interactive states (hover, focus, disabled, loading) match expected UX.
- Mobile and desktop layouts pass visual smoke checks.

## 5. Updated Migration Phases

### Phase 1 - Foundation

Status: Done

- React app scaffolded.
- Router and providers wired.
- Tailwind installed and active.

### Phase 2 - Shared Layout and Navigation

Status: In progress

- `Navbar` and `Footer` integrated.
- Validate responsive behavior and cart/favorites indicators.

### Phase 3 - Products Data and Utilities

Status: In progress

- Product service and helpers exist.
- Next: finalize API error/empty-state contract.

### Phase 4 - Home + Products UI Parity

Status: In progress

- Existing pages implemented in React.
- Next: complete Tailwind parity for filters, cards, loading skeletons.

### Phase 5 - Product Detail

Status: In progress

- Route exists and component exists.
- Next: complete gallery/reviews/suggestions parity and styling consistency.

### Phase 6 - Cart + Checkout

Status: In progress

- Checkout route exists.
- Next: verify totals, persistence behavior, and order submit flow.

### Phase 7 - Auth

Status: In progress

- Login/register/forgot routes exist.
- Next: replace simulation with PHP API integration and session strategy.

### Phase 8 - Tailwind Convergence and CSS Retirement

Status: Pending

- Remove dependency on old page-level CSS.
- Keep only base/global CSS with clear ownership.

### Phase 9 - Validation and Cleanup

Status: Pending

- Remove obsolete vanilla scripts and globals from migration surface.
- Verify SPA route fallback behavior in deployment.
- Finalize tests and docs.

## 6. Route Mapping and Status

| Legacy Page     | React Route        | Status      |
| --------------- | ------------------ | ----------- |
| Home            | `/`                | Implemented |
| Products        | `/products`        | Implemented |
| Product Detail  | `/products/:id`    | Implemented |
| Checkout        | `/checkout`        | Implemented |
| Login           | `/login`           | Implemented |
| Register        | `/register`        | Implemented |
| Forgot Password | `/forgot-password` | Implemented |
| Contact (new)   | `/contact`         | Implemented |
| Not Found (new) | `*`                | Implemented |

## 7. Testing Plan

- Unit tests:
    - product normalization/filter/search/sort helpers
    - context reducer/actions where applicable
- Integration tests:
    - service layer API + fallback behavior
    - context-provider interactions
- E2E tests:
    - browse -> detail -> cart -> checkout
    - login/register/forgot password flows
    - route fallback to Not Found page

## 8. Risks and Mitigations

- API schema mismatch:
    - Mitigation: normalize all payloads at service boundary.
- Styling drift during hybrid period:
    - Mitigation: strict Tailwind-first rule for React files.
- Auth/session mismatch:
    - Mitigation: define token/cookie policy before auth endpoint integration.
- Behavioral regressions:
    - Mitigation: parity checklist per page + E2E smoke tests.

## 9. Deliverables

- React SPA with functional parity and stable routing.
- Tailwind-based component styling for migrated pages.
- PHP API integration across products, auth, cart, favorites, and orders.
- Reduced legacy CSS footprint and no `window` global dependencies in React app.
- Updated migration and styling documentation.
