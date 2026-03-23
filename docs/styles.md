# Styling Documentation

## 1. Current Styling Landscape
This repository currently has two styling systems during migration:
- Legacy CSS in `src/styles/*` for the vanilla frontend.
- Tailwind CSS v4 in the repository root React frontend.

This is intentional while migration is in progress.

## 2. Legacy CSS Structure (Vanilla Frontend)

### 2.1 Base
- `src/styles/base/reset.css`
- `src/styles/base/variables.css`
- `src/styles/base/global.css`
- `src/styles/base/base.css`

### 2.2 Components
- `src/styles/components/header.css`
- `src/styles/components/footer.css`
- `src/styles/components/hero.css`
- `src/styles/components/products.css`
- `src/styles/components/product-card.css`
- `src/styles/components/skeleton.css`
- `src/styles/components/buttons.css`

### 2.3 Pages
- `src/styles/pages/home.css`
- `src/styles/pages/product-detail.css`
- `src/styles/pages/checkout.css`
- `src/styles/pages/auth.css`

### 2.4 Utilities
- `src/styles/utilities/animations.css`

## 3. React + Tailwind Styling Setup

### 3.1 What Is Already Configured
- Tailwind v4 plugin is enabled in `vite.config.js`.
- Tailwind is imported in `src/index.css` via `@import "tailwindcss";`.
- React components already use utility classes for layout and typography.

### 3.2 Styling Rules for React Code
- Use Tailwind utilities as default for new React components and pages.
- Keep `src/index.css` for global base styles only.
- Avoid adding new page-level CSS files for React features unless there is a hard technical reason.

## 4. Tailwind Migration Policy

### 4.1 During Hybrid Migration
Allowed:
- React component classes with Tailwind utilities.
- Minimal global CSS in `src/index.css`.

Not allowed:
- Adding new feature styles in legacy `src/styles/pages/*` for React pages.
- Duplicating utility-like declarations that Tailwind already provides.

### 4.2 Component Migration Checklist
A component/page is considered migrated when:
- Styling is defined primarily with Tailwind utilities.
- It does not require legacy vanilla page CSS to render correctly.
- Responsive behavior and interaction states (hover/focus/disabled/loading) are verified.

## 5. Token Alignment Plan
- Extract key legacy design tokens from `src/styles/base/variables.css`:
  - color palette
  - spacing scale
  - radii
  - shadows
- Represent equivalent values consistently in Tailwind usage patterns.
- If repeated utility combinations appear, introduce reusable React UI primitives instead of re-adding custom CSS.

## 6. Cleanup Targets
After full React migration:
- Retire unused legacy page/component CSS.
- Keep only essential global CSS that cannot be cleanly represented with utilities.
- Ensure no React route depends on legacy CSS file imports from `src/styles/*`.
