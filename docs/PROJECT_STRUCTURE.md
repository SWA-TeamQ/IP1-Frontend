# Project Structure

## Top level

- `index.html`:
    - Vite HTML entry
- `src/`:
    - React application source
- `public/`:
    - Static public assets
- `docs/`:
    - Project documentation
- `migration.md`:
    - Migration roadmap and status
- `vite.config.js`:
    - Vite configuration
- `tailwind.config.js`:
    - Tailwind configuration
- `package.json`:
    - Scripts and dependencies

## `src/` layout

- `main.jsx`:
    - React entrypoint and provider composition
- `App.jsx`:
    - Route map and app shell
- `index.css`:
    - Global styles + Tailwind import
- `components/`:
    - Reusable UI components
- `pages/`:
    - Route-level pages
- `context/`:
    - State providers and hooks
- `services/`:
    - API client and domain services
- `data/`:
    - Local fallback data
- `utils/`:
    - Shared helper functions
- `assets/`:
    - App-scoped assets

## Main route pages

- `src/pages/Home.jsx`
- `src/pages/Products.jsx`
- `src/pages/ProductDetail.jsx`
- `src/pages/Checkout.jsx`
- `src/pages/Contact.jsx`
- `src/pages/About.jsx`
- `src/pages/Services.jsx`
- `src/pages/Profile.jsx`
- `src/pages/Login.jsx`
- `src/pages/Register.jsx`
- `src/pages/ForgotPassword.jsx`
- `src/pages/NotFound.jsx`

## Where to change things

- Add a new route page:
    - Create `src/pages/<PageName>.jsx`
    - Register route in `src/App.jsx`
- Add reusable UI:
    - Create component in `src/components/`
- Add API/data logic:
    - Extend `src/services/`
    - Add fallback fixtures in `src/data/` if required
- Add global state:
    - Add provider/hook in `src/context/`
    - Wire provider in `src/main.jsx`
- Add shared helpers:
    - Add utilities in `src/utils/`

## Migration note

- The repository may still contain legacy vanilla artifacts from the pre-React implementation.
- All active frontend runtime work should target the React/Vite structure above.
