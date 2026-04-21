# JS Architecture

The application is now React + Vite and is in a migration stage from a legacy vanilla frontend.

## Runtime entrypoint

- `src/main.jsx` is the single JavaScript entrypoint.
- It mounts the React app and wraps it with:
    - `BrowserRouter`
    - `AuthProvider`
    - `FavoritesProvider`
    - `CartProvider`

## Routing and app shell

- `src/App.jsx` defines all routes with React Router.
- `Navbar` and `Footer` are rendered once in the app shell.
- Routes currently include:
    - `/`
    - `/products`
    - `/products/:id`
    - `/checkout`
    - `/contact`
    - `/about`
    - `/services`
    - `/profile`
    - `/login`
    - `/register`
    - `/forgot-password`
    - `*` fallback for not found pages

## Code organization

- `src/pages/`:
    - Route-level page components
- `src/components/`:
    - Reusable UI blocks (`Navbar`, `Footer`, `ProductCard`, `ProductList`)
- `src/context/`:
    - App-level state providers (`AuthContext`, `CartContext`, `FavoritesContext`)
- `src/services/`:
    - API client + service abstractions
- `src/utils/`:
    - Shared utility helpers (`auth`, `storage`, `formatters`, `receipt`)

## Data flow

- UI pages/components call service-layer functions from `src/services/`.
- `src/services/` communicates directly with the backend API.
- Global state (auth/cart/favorites) flows through context providers and hooks.

## Migration note

- Legacy vanilla files still exist in the repository under `src/` (outside Vite runtime usage), but current application runtime is fully driven by React/Vite files.
