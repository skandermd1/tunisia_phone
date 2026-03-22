# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tunisia Phone** — A Tunisian phone store e-commerce frontend for selling phones and phone accessories (AirPods, chargers, cases, cables, etc.). Frontend-only project (no backend). The GitHub repo is `khaledbaccour/tunisia_phone`.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Package Manager**: npm

## Commands

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run lint` — Run ESLint

## Design Specification

The design replicates a specific e-commerce layout (reference image provided at project start). Key design rules:

### Color Scheme
- **Primary accent**: White (replaces the yellow/gold from the reference)
- **Dark green** (`#1a4d2e` or similar): Used for top bar, navigation backgrounds, and primary buttons ("Shop Now")
- **Light cream/beige** (`#f5f0e8` or similar): Hero section background, category section background
- **Dark/black**: Discount badges, text
- **White**: Primary accent color, button fills, card backgrounds

### Layout Structure (from reference image)
1. **Top utility bar** (dark green): Phone number left | Promo text center ("Get 50% off for selected items") | Country/Currency/Language selectors right
2. **Main header**: Logo left | Search bar center (with green "Search" button) | Return, Order, Order Tracking links right
3. **Navigation bar**: "All Categories" hamburger left | Nav links (Home, About us, Product, Blog, Others) | Wishlist, Compare, My Cart, Login/Register right
4. **Hero section** (cream/beige bg): Left side has heading + description + price (sale price + strikethrough original) + two buttons ("Shop Now" green filled, "Explore More" outlined) | Right side has product images | Discount badge circle (e.g., "30% Off") top-right | Dot pagination at bottom
5. **Category section**: "Choose By Category" heading + "Browse All" link | Circular category icons in a row (categories: Phones, Accessories, Chargers, AirPods, Cases, Cables, Tablets)
6. Additional sections follow the same e-commerce pattern from the reference

### Typography & Style
- Clean, modern sans-serif font
- No default template fonts or card designs — must match the reference image precisely
- Buttons: Green filled primary, outlined secondary with dark green border
- Search bar: Input with green "Search" button attached
- Category icons: Circular with subtle background

### Content Adaptation
- All product content is adapted for phones and phone accessories (not cosmetics/powders from the reference)
- Categories reflect phone store: Phones, Accessories, Chargers, AirPods, Cases, Cables, Tablets
- Store name: "Tunisia Phone" (replaces "Cox-hut" from reference)
- Currency: Tunisian Dinar (TND) or as configured

## Image Assets

Hero images and promotional banners need to be AI-generated specifically for this phone store. Placeholder images should use descriptive alt text until real assets are provided.

## Architecture

Standard Next.js App Router structure:
- `app/` — Pages and layouts
- `components/` — Reusable UI components (Header, Hero, CategorySection, etc.)
- `public/` — Static assets and images
- `lib/` — Utility functions and constants
