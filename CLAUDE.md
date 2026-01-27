# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Check Me Out (出門點點名)** is a React Native/Expo cross-platform mobile checklist app designed to help users remember essential items before leaving home through daily reminders. Built with TypeScript, Zustand state management, and NativeWind (Tailwind CSS for React Native).

**Target Platforms**: iOS 13+ and Android 6.0+ (API 23+)
**Primary Language**: Traditional Chinese (zh-TW), with English and Simplified Chinese support
**Node Version**: >= 20.19.4

## Development Commands

### Running the App

```bash
npm install              # Install dependencies
npm start                # Start Expo dev server
npm run ios              # Run in iOS simulator
npm run android          # Run in Android emulator
npm start:tunnel         # Start with tunnel (for physical devices on different networks)
```

**Expo Go (Quick Development)**: Run `npm start` and scan QR code with Expo Go app. Note: Some native features (notifications) may have limitations in Expo Go.

### Development Tools

```bash
npm run lint             # Run ESLint
npx prettier --write .   # Format code
npx tsc --noEmit         # TypeScript type checking
npm test                 # Run Jest tests
npx expo start -c        # Clear cache and start
```

### iOS Native Development

```bash
cd ios && pod install && cd ..    # Install iOS dependencies (after adding native modules)
```

## Architecture Overview

### State Management Pattern

- **Zustand Store**: Single centralized store (`src/store/useAppStore.ts`) managing all application state
- **Persistence**: Every state mutation automatically triggers `saveToStorage()` to AsyncStorage
- **State Shape**: Monolithic store containing checklists, groups, settings, notifications, and permissions

### Data Flow

```
User Action (Component)
  → Store Action (useAppStore)
    → Zustand State Update
      → Automatic AsyncStorage Save
        → Component Re-render
```

### Key Architectural Patterns

1. **Group-Based Organization**: All checklists belong to groups (like "work", "travel"). Default group "上班" created on first launch.

2. **Permission System**: Free/Premium tier checks happen at action invocation:
   - Free: 1 checklist + 2 groups
   - Premium: Unlimited
   - Checks performed in store actions via `canCreateGroup()` and `canCreateChecklist()`

3. **Daily Auto-Reset**: App checks if date changed since last reset on foreground (configurable reset time in settings). Resets all `checked` states to false.

4. **Feature Flags**: `FEATURE_FLAGS` in `src/constants/config.ts` control rollout (e.g., `ENABLE_IAP: false` for app store review)

5. **Eager Persistence**: Every state mutation calls `saveToStorage()`. No debouncing currently implemented.

6. **Default Data**: On first launch, creates default "上班" group and checklist with sample items (皮包, 鑰匙, 員工證, 手機)

### Directory Structure

```
/src
├── /components       # Reusable UI components (11 files)
│   ├── ChecklistItemCard.tsx      # Item card with check/edit/delete/move
│   ├── GroupTabs.tsx              # Group selector with create/manage/delete
│   ├── AddItemInput.tsx           # Input for adding new items
│   ├── IconPicker.tsx             # MDI icon selector
│   ├── GroupTemplatePicker.tsx    # Import pre-made group templates
│   └── FlipClock.tsx              # Animated time picker display
├── /screens          # Full-page components (2 screens)
│   ├── HomeScreen.tsx             # Main checklist display and management
│   └── SettingsScreen.tsx         # Settings, notifications, premium
├── /store            # Zustand state management
│   └── useAppStore.ts             # Central store (725 lines, 40+ actions)
├── /utils            # Business logic utilities
│   ├── notification.ts            # Expo Notifications wrapper
│   ├── storage.ts                 # Type-safe AsyncStorage wrapper
│   ├── permission.ts              # Free/Premium tier logic
│   ├── reset.ts                   # Daily reset functionality
│   ├── helpers.ts                 # Time formatting, ID generation
│   ├── purchase.ts                # In-App Purchase (IAP) logic
│   └── weather.ts                 # Weather API integration (CWA)
├── /types            # TypeScript definitions
│   └── index.ts                   # All interfaces and enums
├── /constants        # Configuration
│   ├── config.ts                  # Storage keys, feature flags, limits
│   └── colors.ts                  # Color palette
├── /locales          # i18next internationalization
│   ├── index.ts                   # i18n configuration
│   ├── zh-TW.ts                   # Traditional Chinese (primary)
│   ├── zh-CN.ts                   # Simplified Chinese
│   └── en.ts                      # English
└── /hooks            # Custom React hooks
    └── useWeather.ts              # Weather fetching hook
```

## Key Technical Decisions

### Monolithic Store
Single Zustand store rather than multiple contexts/slices. This is intentional for this app's scope:
- Single source of truth
- Centralized persistence logic
- Easy to understand complete state shape

### Type-Safe Storage
Storage wrapper provides generic typing:
```typescript
const data = await getData<Checklist[]>(STORAGE_KEYS.CHECKLISTS);
await saveData(STORAGE_KEYS.CHECKLISTS, checklists);
```

### NativeWind Styling
Uses Tailwind CSS syntax via NativeWind v4:
```tsx
<View className="bg-white rounded-lg p-4 mb-3 flex-row">
```
For shadows/elevation (not yet supported in NativeWind), use inline `StyleSheet`.

### Hybrid List Rendering
HomeScreen dynamically loads `react-native-draggable-flatlist` with fallback to `FlatList` if unavailable:
```typescript
try {
  const draggableModule = require('react-native-draggable-flatlist');
  DraggableFlatList = draggableModule.default;
} catch (error) {
  isDraggableAvailable = false; // Falls back to FlatList
}
```

### Initialization Flow
`App.tsx` calls `useAppStore.initialize()` which:
1. Loads data from AsyncStorage (checklists, groups, settings)
2. Performs migrations (ensures groupId on all checklists)
3. Creates default group/checklist if none exists
4. Sets i18n language from settings
5. Schedules daily notifications
6. Checks if daily reset is needed
7. Hides splash screen after completion

### Notification Flow
- User configures time in SettingsScreen
- `updateNotificationSettings()` updates state and calls `scheduleDailyNotification()`
- Cancels all previous notifications and schedules new daily notification
- On foreground, app checks if reset is needed via `checkAndResetIfNeeded()`

## Code Patterns

### Adding a New Feature

1. **Define types** in `src/types/index.ts`
2. **Add store actions** in `src/store/useAppStore.ts`:
   ```typescript
   newAction: (param) => {
     set((state) => ({
       // ... state updates
     }));
     get().saveToStorage();
   }
   ```
3. **Create components** in `src/components/`
4. **Wire into screen** (HomeScreen or SettingsScreen)
5. **Add i18n keys** in `src/locales/zh-TW.ts` (primary), `en.ts`, `zh-CN.ts`

### Accessing Store

```typescript
import { useAppStore } from '@/store/useAppStore';

// In component
const { checklists, addItem, deleteItem } = useAppStore();

// Get state without subscription
const state = useAppStore.getState();
```

### Permission Checks

Permission checks happen at action level:
```typescript
createGroup: (name) => {
  const state = get();
  if (!canCreateGroup(state.groups.length, state.settings.userPermission)) {
    // Show alert to upgrade
    return;
  }
  // ... proceed with creation
}
```

### Localization

All user-facing strings use i18n:
```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
const text = t('home.addItem'); // Looks up key in locales
```

## Important Files

| File | Purpose | Lines |
|------|---------|-------|
| `src/store/useAppStore.ts` | Central state management | 725 |
| `src/types/index.ts` | All TypeScript definitions | 99 |
| `src/screens/HomeScreen.tsx` | Main checklist UI | ~500 |
| `src/constants/config.ts` | Feature flags, storage keys, limits | ~100 |
| `App.tsx` | Entry point, initialization | 116 |

## Testing & Debugging

### Testing State Changes
- Use SettingsScreen "Reset to Defaults" for clean slate
- Test notifications via `sendTestNotification()` in utils/notification.ts
- Check AsyncStorage via React Native Debugger

### Common Issues

1. **Notifications not working**: Check device notification permissions and notification channel creation (Android)
2. **Drag-and-drop issues**: Ensure `react-native-gesture-handler` is properly installed; iOS requires `pod install`
3. **NativeWind styles not applying**: Clear cache with `npx expo start -c`; verify `nativewind/babel` in `babel.config.js`
4. **State not persisting**: Check AsyncStorage permissions and `saveToStorage()` calls in store actions

## Current Status

**Working Features**:
- Multi-group checklist organization
- Daily auto-reset with configurable time
- Local notifications with scheduling
- Drag-to-reorder items
- Multi-language support (EN, ZH-TW, ZH-CN)
- Permission system framework

**Partially Complete**:
- In-App Purchase (code present, `ENABLE_IAP: false`)
- Weather integration (code present, awaits API config)
- Premium features UI (visible but gated by permissions)

**Not Implemented**:
- Cloud sync/backup
- Widget support
- Apple Watch/Wear OS
- Deep linking

## Best Practices for This Codebase

- **Always read files before modifying**: Understand existing patterns before suggesting changes
- **Maintain i18n**: Add translations for all three locales when adding user-facing text
- **Preserve group structure**: Every checklist must have a valid `groupId`
- **Use store actions**: Don't directly mutate state; always use store actions that call `saveToStorage()`
- **Follow NativeWind patterns**: Use `className` prop with Tailwind syntax for styling
- **Respect permission limits**: Check permissions before allowing create actions
- **Keep it simple**: This is a focused, minimal app - avoid over-engineering or adding unnecessary abstractions
