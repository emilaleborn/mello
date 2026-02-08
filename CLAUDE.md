# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Mello is a Swedish PWA for friends to vote on Melodifestivalen 2026 entries together in real-time. Built with Next.js 16 (App Router), Firebase (Auth + Firestore), Zustand, Framer Motion, and Tailwind CSS v4.

The UI language is **Swedish**. All user-facing text should be in Swedish.

## Commands

```bash
npm run dev              # Next.js dev server
npm run dev:emulators    # Firebase emulators only (Auth :9099, Firestore :8080, UI :4000)
npm run dev:all          # Both emulators + dev server concurrently
npm run seed             # Seed emulators with test data (3 users, 1 party, sample votes)
npm run build            # Production build (standalone output)
npm run lint             # ESLint
npx tsc --noEmit         # Type-check without emitting
```

## Architecture

### Data flow

Static data (`MELLO_EVENTS`, `ENTRIES_BY_EVENT`) lives in `src/constants/`. Firestore stores dynamic data: users, parties, and votes. Real-time subscriptions (`onSnapshot`) push updates to components. Voting uses Firestore transactions for atomicity — each vote updates both the user's vote doc and a pre-aggregated summary doc.

### Key abstractions

- **`useCurrentEvent()`** — Determines which event is active based on wall-clock time, re-evaluates every 30s. Returns `EventState` with status: `UPCOMING | TODAY_COUNTDOWN | VOTING_OPEN | VOTING_CLOSED | RESULTS | SEASON_COMPLETE`.
- **`useVoting(partyId, eventId)`** — Manages incremental per-song voting with 500ms debounce, real-time aggregate subscriptions, and draft/saving state.
- **Zustand stores** (`authStore`, `votingStore`, `partyStore`) hold global UI state. Firestore subscriptions feed into these stores and into local component state.

### Firestore schema

```
/users/{userId}
/parties/{partyId}
/parties/{partyId}/votes/{eventId}              ← aggregated { aggregates, voterIds }
/parties/{partyId}/votes/{eventId}/userVotes/{userId}  ← individual ratings + favorite
```

### Event timing

Feb 28 has two events (DT5 at 20:00, Finalkval at 21:30). `getCurrentEvent()` in `src/lib/utils/eventLogic.ts` handles this by iterating same-day events in reverse to find the active one. Voting closes at 23:59 on event day.

### Path alias

`@/*` maps to `src/*` (configured in tsconfig.json).

## Design system

Dark theme with warm stage-lit accents. Key CSS variables defined in `src/app/globals.css`:

- `--mello-gold` / `--mello-magenta` / `--mello-purple` — accent colors
- `--background` / `--background-elevated` / `--background-surface` — layered backgrounds
- `--foreground` / `--foreground-muted` — text colors

Display font is **Outfit** (700–900 weight) for headings. Components use `rounded-2xl bg-[var(--background-elevated)]` as the standard card pattern. Animations use framer-motion stagger (typically `delay: i * 0.05`). Icons come from **lucide-react** (no emojis).

## Deployment

Firebase App Hosting in `europe-west4`. Config in `apphosting.yaml`. Next.js outputs standalone mode. Environment variables are all `NEXT_PUBLIC_FIREBASE_*` plus `NEXT_PUBLIC_USE_EMULATORS`.

## Conventions

- All pages wrap content in `<AuthGuard>` for protected routes
- Firebase operations live in `src/lib/firebase/` (parties.ts, votes.ts)
- Real-time subscriptions follow the pattern: `subscribe*()` returns an unsubscribe function, used in `useEffect` cleanup
- Bottom nav highlights use `pathname.startsWith()` matching
