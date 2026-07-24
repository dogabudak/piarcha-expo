# Piarcha Expo - Project Structure

## Overview
This is a React Native Expo app using Expo Router for navigation with TypeScript support. The project follows Expo's modern file-based routing system and includes dark/light theme support.

## Project Structure

### Root Files
- `package.json` - Dependencies and scripts
- `app.json` - Expo configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration
- `expo-env.d.ts` - TypeScript environment definitions

### Key Directories

#### `/app/` - File-based routing
- `_layout.tsx` - Root layout with theme provider and navigation stack
- `modal.tsx` - Modal screen
- `(tabs)/` - Tab-based navigation group
  - `_layout.tsx` - Tab layout with Home and Explore tabs
  - `index.tsx` - Home screen (currently has welcome content)

#### `/components/` - Reusable components
- `themed-text.tsx` - Text component with theme support
- `themed-view.tsx` - View component with theme support
- `parallax-scroll-view.tsx` - Parallax scrolling component
- `hello-wave.tsx` - Animated wave component
- `haptic-tab.tsx` - Tab with haptic feedback
- `external-link.tsx` - External link component
- `/ui/` - UI-specific components
  - `icon-symbol.tsx` - Icon component
  - `collapsible.tsx` - Collapsible component

#### `/constants/` - App constants
- `theme.ts` - Theme colors and styling constants

#### `/hooks/` - Custom React hooks
- `use-color-scheme.ts` - Color scheme detection
- `use-theme-color.ts` - Theme color utilities

#### `/assets/` - Static assets
- `/images/` - App icons, logos, and images

## Key Technologies
- **Expo SDK 54** - React Native framework
- **Expo Router 6** - File-based navigation
- **React Navigation 7** - Navigation library
- **TypeScript 5.9** - Type safety
- **React Native Reanimated 4** - Animations
- **Expo Symbols** - System icons

## Available Scripts
- `npm start` - Start development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS  
- `npm run web` - Run on web
- `npm run lint` - Run ESLint

## Navigation Structure
The app uses a stack navigator with:
1. Tab navigation as the main screen (Home, Explore tabs)
2. Modal screen for overlays

## Theme System
- Automatic light/dark mode detection
- Themed components that adapt to system preferences
- Color constants defined in `/constants/theme.ts`

## Current State
The app currently shows a welcome screen with setup instructions. The main entry point is `app/(tabs)/index.tsx`.

---

# Architecture

> System-level architecture for the whole Piarcha product (extracted from `MVP_PLAN.md`).
> The Expo app (`piarcha-expo`) documented above is the frontend of this system.

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend framework | Expo (`piarcha-expo`) | OTA updates, EAS Build, push notifications out of the box, simpler dev setup |
| AI tour generation | Extend `piarch-a-locations` with a `POST /generate-tour` endpoint calling a free/open-weight LLM via **OpenRouter** (OpenAI-compatible) | Tour schema and attraction data already live here; no separate service needed. Uses the `openai` SDK pointed at OpenRouter, so the provider is swappable (Groq, Ollama, etc.) via env vars. Falls back to a deterministic tour when no API key is configured. |
| Real-time chat | Firebase Firestore or Supabase | No need to build WebSocket infra for MVP |
| Offline maps | MapLibre + pre-cached tiles or Google Maps tile caching | Critical for travelers on spotty connections |
| State management | Zustand or Redux Toolkit | Current vanilla Redux is too verbose; RTK Query or Zustand simplifies data fetching |
| Deployment | Railway or Fly.io + MongoDB Atlas | Cheap, simple, production-ready |

## Backend Service Map (MVP Target)

```
Mobile App (Expo)
    │
    ├── piarch-a-token-rs        (Rust)   — Login, JWT generation
    ├── piarch-a-verification    (Node)   — Token validation
    ├── piarch-a-user            (Node)   — Profiles, location, search
    ├── piarch-a-locations       (Node)   — Cities, attractions, tours + AI tour generation (extended)
    └── Firebase Firestore                — NEW: Real-time messaging
```

```
Admin Panel (React)
    │
    ├── piarch-a-locations       — Manage cities and attractions
    └── piarch-a-user            — User management
```

## Services & Tech Stack

| Service | Stack | Responsibility |
|---------|-------|----------------|
| `piarcha-expo` | React Native / Expo Router / TypeScript | Mobile frontend (this repo) |
| `piarch-a-locations` | Express + MongoDB | Countries, cities, attractions, tours, AI tour generation (`/generate-tour`) |
| `piarch-a-user` | Fastify + MongoDB | User profiles, location tracking, search |
| `piarch-a-token-rs` | Rust / Rocket | Login, JWT generation |
| `piarch-a-verification` | Node | JWT / token validation |
| `piarch-a-admin-panel` | React (early stage) | Admin management of cities, attractions, users |
| `piarch-a-interfaces` | Shared TypeScript package | Common interfaces/types across services |
| Firebase Firestore | Managed (planned) | Real-time messaging (not yet built) |

### `piarch-a-locations` — key details
- Runs on port **3019**.
- Location schema embeds `tours[]` per city (`tourName`, `shortDescription`, `tourType`).
- AI-generated tours are cached in a separate `generated_tours` collection (keyed by `cityName` + `tourType` + `duration`), not in the embedded `tours[]`.
- `GET /coordinates/:city` returns attractions with descriptions; `GET /tours/:city` returns generated tours; `POST /generate-tour` accepts `{ city, preferences }` and returns an ordered tour with stops, descriptions, and estimated times.
- `TourType` enum: Bike, Hike, Trekking. `AttractionType` enum: Church, Column, Museum, Shop, Palace, Mosque, Cistern, House, Square, Park, Castle, Information.
- Env: `MONGODB`, `PORT`, `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `OPENROUTER_BASE_URL`.