# React Frontend (Vite + Tailwind)

This folder contains the new React frontend that is replacing the legacy vanilla frontend.

## 1. Stack

- React 19
- Vite 8
- React Router
- Tailwind CSS v4
- Axios

## 2. Scripts

- `npm run dev` -> start dev server
- `npm run build` -> production build
- `npm run preview` -> preview production build
- `npm run lint` -> run ESLint

## 3. Current Features Implemented

- App layout with shared `Navbar` and `Footer`
- Routes:
    - `/`
    - `/products`
    - `/products/:id`
    - `/checkout`
    - `/contact`
    - `/login`
    - `/register`
    - `/forgot-password`
    - fallback route for not found pages
- Providers:
    - `AuthContext`
    - `CartContext`
    - `FavoritesContext`
- Product service with API fetch + local fallback data

## 4. Tailwind Usage Rules

- Use Tailwind utilities for new components and page updates.
- Keep `src/index.css` limited to base global styles.
- Do not create new legacy-style CSS modules unless there is a strong technical reason.

## 5. Migration Notes

- This app is in a hybrid migration stage.
- Some legacy behavior parity checks are still in progress.
- Backend integration to PHP endpoints is not fully complete yet.
- See root-level migration plan for phase status and next tasks:
    - `../migration.md`

## 6. Recommended Next Steps

- Complete per-page visual parity checks (desktop and mobile).
- Finalize auth and cart API contracts.
- Remove dependency on legacy CSS for migrated React pages.
