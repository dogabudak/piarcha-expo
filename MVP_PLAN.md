# Piarcha MVP Plan

## Vision

A semi-social mobile app for solo travelers. Download AI-generated tours for the city you're visiting, follow them on an interactive map, and meet fellow travelers along the way.

---

## Current State

### What Works
- Auth flow (login, register, token persistence)
- Basic map with markers and geolocation tracking
- Locations service (countries, cities, attractions) on Express + MongoDB
- User service (Fastify + MongoDB) with location tracking and search
- Token generation (Rust/Rocket) + JWT verification service
- Admin panel (React, early stage)
- Shared TypeScript interfaces package

### What's Broken or Missing
- All page source files deleted from disk (staged deletions in git)
- Hardcoded localhost URLs, empty Google Maps API key
- Tour detail screen is a stub
- Friends and Inbox screens show dummy data only
- No messaging infrastructure
- No AI integration
- No offline support
- No environment configuration (.env)

---

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend framework | Expo (`piarcha-expo`) | OTA updates, EAS Build, push notifications out of the box, simpler dev setup |
| AI tour generation | Extend `piarch-a-locations` with `/generate-tour` endpoint calling Claude API | Tour schema and attraction data already live here; no need for a separate service |
| Real-time chat | Firebase Firestore or Supabase | No need to build WebSocket infra for MVP |
| Offline maps | MapLibre + pre-cached tiles or Google Maps tile caching | Critical for travelers on spotty connections |
| State management | Zustand or Redux Toolkit | Current vanilla Redux is too verbose; RTK Query or Zustand simplifies data fetching |
| Deployment | Railway or Fly.io + MongoDB Atlas | Cheap, simple, production-ready |

---

## Phase 0 — Foundation Cleanup

**Goal:** Get the app bootable, buildable, and deployable.
**Duration:** 1-2 weeks

### Tasks

- [ ] Decide: recover deleted screens from git or rewrite from scratch in Expo project
- [ ] Set up environment configuration (`.env` files for all services)
- [ ] Replace all hardcoded localhost URLs with environment variables
- [ ] Configure valid Google Maps API key
- [ ] Fix TypeScript issues — remove `@ts-ignore` comments, replace `any` types
- [ ] Set up CI/CD pipeline (lint + type-check + build)
- [ ] Dockerize backend services (Docker Compose for local dev)
- [ ] Deploy backend to staging (Railway/Fly.io + MongoDB Atlas)
- [ ] Verify end-to-end auth flow works on a real device

### Deliverable
App launches, user can register, log in, and see a map with their location.

---

## Phase 1 — Core Solo Traveler Experience

**Goal:** A traveler arrives in a city and explores it with AI-generated tours.
**Duration:** 3-4 weeks

### 1.1 City Discovery

- [ ] City discovery screen — browse featured cities, search by name
- [ ] City detail screen — photo, description, attraction count, available tours
- [ ] Connect to existing `/countryList`, `/cityList`, `/coordinates` endpoints
- [ ] Add city images and metadata to the locations database

### 1.2 AI Tour Generation

> **Existing infrastructure (`piarch-a-locations` on port 3019):**
> - Location schema already has `tours[]` embedded per city (`tourName`, `shortDescription`, `tourType`)
> - GET `/tours/:city` endpoint exists but is **not implemented** (TODO)
> - GET `/coordinates/:city` already returns attractions with descriptions
> - Seeded data: Istanbul (5 attractions, 3 tours), Barcelona (5, 3), Havana (5, 0), Doha (5, 0)
> - `TourType` enum: Bike, Hike, Trekking
> - `AttractionType` enum: Church, Column, Museum, Shop, Palace, Mosque, Cistern, House, Square, Park, Castle, Information

- [ ] **Implement GET `/tours/:city`** in `piarch-a-locations` — return existing manual tours
- [ ] **Extend tour schema** to support AI-generated tours:
  - Add `stops[]` array to tour (ordered list of coordinates with sequence number)
  - Add `estimatedDuration`, `distanceKm`, `generatedBy` (manual | ai) fields
  - Add `preferences` field (interests, pace, accessibility)
- [ ] **Add POST `/generate-tour`** endpoint to `piarch-a-locations`:
  - Accepts: city, preferences (walking/biking, duration, interests)
  - Fetches city's existing coordinates/attractions from DB
  - Calls Claude API with attractions + preferences as context
  - Returns ordered tour with stops, descriptions, and estimated times
  - Caches generated tour in the same `tours[]` array for reuse
- [ ] Tour generation UI — select preferences, generate, preview
- [ ] Tour detail screen — ordered stop list, total distance, estimated duration

### 1.3 Interactive Map (Upgrade)

- [ ] Display tour route on map with numbered stop markers
- [ ] Draw walking/biking route between stops (directions API)
- [ ] Current stop detection via proximity (< 50m triggers "arrived" state)
- [ ] Stop detail bottom sheet — description, photo, "mark as visited"
- [ ] Tour progress indicator (3/8 stops visited)

### 1.4 Offline Support (Basic)

- [ ] "Download tour" button — saves tour data locally (AsyncStorage or SQLite)
- [ ] Cache map tiles for the tour area
- [ ] Offline indicator in UI
- [ ] Downloaded tours accessible without network

### Deliverable
User selects a city, generates or picks a tour, downloads it, and follows it on the map while walking through the city.

---

## Phase 2 — Social Layer for Solo Travelers

**Goal:** Travelers in the same city can discover and message each other.
**Duration:** 3-4 weeks

### 2.1 Traveler Presence

- [ ] "I'm in [City]" opt-in toggle — makes user visible to others
- [ ] Backend: query users currently in the same city (extend `/user/search/closestUsers`)
- [ ] "Travelers nearby" list on city screen — show name, photo, distance
- [ ] Show nearby travelers on map with distinct marker style
- [ ] Privacy controls: visible to all / friends only / invisible

### 2.2 Traveler Profiles

- [ ] Complete profile screen: photo, bio, languages, travel style, home country
- [ ] Public profile view (extend existing `/public-user/:username`)
- [ ] "Currently in [City]" badge on profile
- [ ] "Send message" button on public profiles

### 2.3 Messaging

- [ ] Set up Firebase Firestore (or Supabase) for real-time messaging
- [ ] 1:1 chat screen with text messages
- [ ] Chat list screen (replace dummy inbox)
- [ ] Unread message count badge
- [ ] Push notifications for new messages (Expo Notifications)
- [ ] Basic moderation: report and block users

### 2.4 Meetup Nudges

- [ ] "X travelers are near [Attraction]" passive notification
- [ ] "Want to do this tour together?" — share tour invite via message
- [ ] Shared tour view: see each other's progress on the map

### Deliverable
User can see other travelers in the same city, view profiles, send messages, and invite someone to join a tour.

---

## Phase 3 — Polish and Launch Prep

**Goal:** Make it feel like a real product ready for the app store.
**Duration:** 2-3 weeks

### 3.1 Onboarding

- [ ] 3-screen onboarding explaining the app's value
- [ ] "Pick your first city" prompt after signup
- [ ] Permission requests (location, notifications) with context

### 3.2 Notifications

- [ ] Push notifications: new message, nearby traveler, tour suggestion
- [ ] In-app notification center
- [ ] Notification preferences in settings

### 3.3 Quality and Safety

- [ ] Error boundaries on all screens
- [ ] Loading states and skeleton screens
- [ ] Empty states with helpful prompts
- [ ] Rate limiting on messaging endpoints
- [ ] Content moderation basics (report user, block user)
- [ ] GDPR: location consent, data export, account deletion

### 3.4 Analytics

- [ ] Event tracking (PostHog or Mixpanel)
- [ ] Key events: tour generated, tour started, tour completed, message sent, traveler discovered
- [ ] Crash reporting (Sentry)

### 3.5 App Store

- [ ] Store screenshots and description
- [ ] TestFlight / Play Store internal testing track
- [ ] Privacy policy and terms of service

### Deliverable
App is on TestFlight and Play Store internal track, ready for beta testers.

---

## MVP Success Criteria

A solo traveler can:

1. **Download an AI-generated tour** for the city they're visiting
2. **Follow the tour on a map** with turn-by-turn stops
3. **Use the tour offline** after downloading it
4. **See other travelers** in the same city
5. **Message another traveler** to meet up

---

## Post-MVP Backlog (Deferred)

- Audio guides for tour stops
- Group tours and tour sharing
- Payment and monetization
- Multi-day itinerary planning
- Reviews and ratings for stops and tours
- Travel journal and photo diary
- Gamification (badges, visited cities counter)
- Internationalization (beyond English and Turkish)
- Accessibility audit and improvements

---

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

---

## Timeline Summary

| Phase | Duration | Milestone |
|-------|----------|-----------|
| Phase 0 — Foundation | 1-2 weeks | App boots, auth works, backend deployed |
| Phase 1 — Tours | 3-4 weeks | AI tours, interactive map, offline mode |
| Phase 2 — Social | 3-4 weeks | Traveler presence, profiles, messaging |
| Phase 3 — Polish | 2-3 weeks | Onboarding, notifications, app store submission |
| **Total** | **9-13 weeks** | **MVP in app stores** |
