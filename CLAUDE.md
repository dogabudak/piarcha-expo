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
  - `explore.tsx` - Explore screen

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