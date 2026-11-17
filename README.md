# Coy Discover Feature — Full-Stack Implementation ⚡️

A complete, production-grade Discover and anonymous crush matching experience for **Coy**, built with **React 18 / Vite** on the frontend and an atomic **Node.js / Express** data layer powered by local JSON file persistence (no external database or ORM).

---

## 🌟 1. Project Overview

**Coy** is an anonymous crush detection app based on a fundamental promise: *find out if someone likes you back; if they don't, nobody ever knows.*

This project implements the complete Discover feature:
- Modern mobile-first swipeable profile discovery deck.
- Touch/mouse drag gestures with rotation and `LIKE` / `NOPE` stamp badges.
- Secret one-way likes with strict privacy: incoming likes are never exposed until interest is mutual.
- Real-time mutual match celebration with confetti, dual avatars, and persistence.
- Dedicated Matches view listing confirmed mutual matches.
- Home screen blank placeholder with clean tab navigation.
- Atomic file-replacement JSON persistence and serialized transaction queue to prevent race conditions.
- Development-only reset mechanism to restore initial seed data.

> **Note on Architecture:** This is a demonstration implementation tailored for a single assumed user (`current_user`) using local JSON file persistence.

---

## 🚀 2. Features

- **Mobile-First Card Swiping:** Full touch/drag card physics powered by Framer Motion. Dragging right triggers `LIKE`, dragging left triggers `PASS`, with live stamp badge overlays.
- **Desktop Action Controls:** Dedicated circular action buttons for Pass (✕) and Like (💖).
- **Strict Privacy & Secret Crushes:** Incoming likes are never exposed in `/feed` or UI components. A user only discovers who likes them if they like them back.
- **Match Celebration:** When a mutual like occurs, an instant celebration overlay displays dual profile photos, confetti, and celebratory messaging.
- **Matches View:** Browse all confirmed mutual matches with full profile details.
- **Zero Race Conditions:** The data layer processes write operations through a Promise queue and atomic file swaps (`.tmp` → atomic rename) to eliminate data corruption.
- **State Persistence Across Restarts:** Swipes and matches persist across browser reloads and backend restarts.

---

## 🛠️ 3. Technology Stack

- **Frontend:**
  - React 18.3.1
  - Vite 5.4.21
  - Framer Motion (gesture physics & card transitions)
  - Canvas Confetti (celebration animations)
  - Vanilla CSS with CSS custom properties matching Coy design tokens
- **Backend:**
  - Node.js (ES Modules)
  - Express 4.19.2
  - CORS middleware
  - Native `fs/promises` & `crypto`
- **Persistence:**
  - Immutable JSON Seed: `seed/profiles.json` (32 profiles)
  - Mutable Runtime State: `Backend/data/runtime.json`
- **Testing:**
  - Automated Node.js test runners (`Backend/test/test-api.js` and `Frontend/test/test-frontend.js`)

---

## 📐 4. Architecture Overview & Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                 Frontend (React + Vite)                     │
│  - Discover Tab (Default): Card Stack, Gestures, Controls   │
│  - Home Tab: Clean Blank Placeholder                        │
│  - Matches View: Confirmed Mutual Matches Grid              │
│  - Match Modal: Mutual Match Celebration                    │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
       GET /feed                              POST /swipe { targetProfileId, action }
               ▼                                      ▼
┌──────────────────────────────┐       ┌──────────────────────────────┐
│       feedRouter (API)       │       │      swipeRouter (API)       │
└──────────────┬───────────────┘       └──────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Data Access Layer (DAL)                     │
│  - Single User: "current_user" (centralized in config)      │
│  - Single-Swipe Constraint: 409 Conflict on duplicate swipe │
│  - Privacy: Strip incoming likes from /feed                 │
│  - Mutual Matching Logic: Create match only if mutual       │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      Read Operation          │ │ Serialized Write Queue     │
│   (Loads latest state)       │ │ (Prevents race conditions) │
└──────────────┬───────────────┘ └─────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      FileStorage Layer                      │
│  1. Write payload to temp file: .runtime.json.<hash>.tmp   │
│  2. Atomically rename temp file over data/runtime.json      │
│  3. Retry on Windows transient file locks (EPERM/EBUSY)      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 5. Folder Structure

```
coy-assignment/
├── seed/
│   └── profiles.json            # Immutable master seed (32 predefined profiles)
├── Backend/
│   ├── seed/
│   │   └── profiles.json        # Backend seed copy
│   ├── data/
│   │   └── runtime.json         # Mutable runtime JSON (created on first startup)
│   ├── src/
│   │   ├── config.js            # Centralized config (current_user, ports, paths)
│   │   ├── dal/
│   │   │   ├── fileStorage.js   # Atomic temporary writes & serialized transactions
│   │   │   └── dataAccess.js    # Data Access Layer & privacy/match business rules
│   │   ├── routes/
│   │   │   ├── feed.js          # GET /feed handler
│   │   │   ├── swipe.js         # POST /swipe handler
│   │   │   └── matches.js       # GET /matches handler
│   │   └── server.js            # Express app, health/stats/reset routes
│   ├── test/
│   │   └── test-api.js          # 12 automated backend test suites
│   ├── package.json
│   └── README.md
├── Frontend/
│   ├── src/
│   │   ├── api.js               # API client & current_user profile data
│   │   ├── App.jsx              # Header, navigation tabs, toast system
│   │   ├── components/
│   │   │   ├── Discover.jsx     # Discover feed, progress tracker, action buttons
│   │   │   ├── ProfileCard.jsx  # Swipable card with Framer Motion drag physics
│   │   │   ├── MatchModal.jsx   # Match celebration modal with confetti & avatars
│   │   │   ├── MatchesView.jsx  # Mutual matches grid & empty state
│   │   │   └── Home.jsx         # Clean blank Home placeholder
│   │   ├── index.css            # Coy theme custom properties & base styles
│   │   └── main.jsx
│   ├── test/
│   │   └── test-frontend.js     # Frontend contract test runner
│   ├── vite.config.js           # Vite dev server + proxy to backend (port 5000)
│   └── package.json
├── package.json                 # Monorepo convenience scripts
└── README.md                    # This documentation file
```

---

## 💾 6. JSON Persistence Strategy

### Atomic Writes via Temporary Files
Data is never written directly to `data/runtime.json` to prevent partial writes during crashes:
1. State is serialized and written to a hidden temporary file in the same directory: `data/.runtime.json.<timestamp>.<random>.tmp`.
2. The file is atomically renamed (`fs.promises.rename`) over the target `runtime.json`.
3. If an error occurs, the temporary file is unlinked immediately.
4. Includes retry logic with exponential backoff for Windows filesystem locks (`EPERM` / `EBUSY`).

### Concurrency Protection & Serialized Transactions
All mutations pass through `FileStorage.transaction(updateFn)`. Each transaction waits in an asynchronous Promise queue, ensuring each read-modify-write cycle is completely serialized with zero race conditions.

### First Boot vs. Subsequent Boot
- **First Boot:** Detects missing `runtime.json`. Loads `seed/profiles.json` and creates `data/runtime.json` with 3 pre-seeded secret incoming likes (from Meera Nair, Ananya Sharma, Aditya Varma) for instant mutual match verification.
- **Subsequent Boot:** Detects existing `runtime.json` and loads state as-is, preserving all user activity.
- **Seed Immutability:** `seed/profiles.json` is strictly read-only and never modified.

---

## 📋 7. Data Models

### Profile
```typescript
interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  cityOrCollege: string;
  interests: string[];
}
```

### Swipe
```typescript
interface Swipe {
  swiperId: string;
  targetProfileId: string;
  action: 'LIKE' | 'PASS';
  createdAt: string; // ISO 8601
}
```

### Match
```typescript
interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: string; // ISO 8601
}
```

---

## 🌐 8. API Documentation & Examples

### 8.1 `GET /feed`
Returns unswiped profiles for `current_user`.
- Filters out already swiped profiles (`LIKE` or `PASS`).
- Excludes `current_user`.
- Never reveals incoming like status.

**Response `200 OK`:**
```json
{
  "success": true,
  "count": 32,
  "profiles": [
    {
      "id": "profile_1",
      "name": "Rhea Sen",
      "age": 22,
      "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "bio": "Film photography, matcha lattes, and talking about movies we'll probably never watch.",
      "cityOrCollege": "St. Stephen's College, Delhi",
      "interests": ["Film Photography", "Matcha", "Cinema", "Thrifting"]
    }
  ]
}
```

---

### 8.2 `POST /swipe`
Submits a `LIKE` or `PASS` swipe.

**Request:**
```json
{
  "targetProfileId": "profile_3",
  "action": "LIKE"
}
```

**Response `201 Created` (Mutual Match with Meera Nair):**
```json
{
  "success": true,
  "matched": true,
  "isMatch": true,
  "message": "It's a mutual match!",
  "match": {
    "id": "c1f7b8a2-...",
    "profile": {
      "id": "profile_3",
      "name": "Meera Nair",
      "photo": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
    }
  },
  "matchedProfile": { ... },
  "swipe": {
    "swiperId": "current_user",
    "targetProfileId": "profile_3",
    "action": "LIKE",
    "createdAt": "2026-11-18T..."
  }
}
```

**Response `201 Created` (No Match / Pass):**
```json
{
  "success": true,
  "matched": false,
  "isMatch": false,
  "message": "Swipe recorded successfully",
  "swipe": { ... }
}
```

**Error Codes:**
- `400 Bad Request`: Missing field, invalid action, or swiping on self.
- `404 Not Found`: Profile ID does not exist.
- `409 Conflict`: User has already swiped on this profile.

---

### 8.3 `GET /matches`
Returns all confirmed mutual matches.

**Response `200 OK`:**
```json
{
  "success": true,
  "count": 1,
  "matches": [
    {
      "id": "c1f7b8a2-...",
      "matchedUserId": "profile_3",
      "createdAt": "2026-11-18T...",
      "profile": {
        "id": "profile_3",
        "name": "Meera Nair",
        "age": 21,
        "photo": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        "bio": "Looking for someone to attend standup comedy shows and rate local croissants with.",
        "cityOrCollege": "St. Xavier's College, Mumbai",
        "interests": ["Stand-up Comedy", "Bakery", "Jazz", "Psychology"]
      }
    }
  ]
}
```

---

### 8.4 `POST /dev/reset`
Development-only endpoint that resets `data/runtime.json` to the original seed state. Disabled in `NODE_ENV=production`.

---

## ⚡️ 9. Installation & Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm

### 1. Install Dependencies
```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

### 2. Run the Application
Open two terminal windows:

**Terminal 1 — Backend (Port 5000):**
```bash
cd Backend
node src/server.js
```

**Terminal 2 — Frontend (Port 5173):**
```bash
cd Frontend
npm run dev
```

Visit **http://localhost:5173/** in your browser. The app will open directly to the **Discover** tab.

---

## 🧪 10. Running Tests

Both backend and frontend have dedicated automated test suites.

### Backend Test Suite (12 Tests)
Verifies first-boot seed copy, feed sanitization, swipe validations, single-swipe rule, mutual match detection, persistence across restart, concurrency serialization, dev reset, and seed immutability:
```bash
cd Backend
npm test
```

### Frontend Contract Test Suite
Verifies centralized user configuration, profile contract, and match modal payload integrity:
```bash
cd Frontend
npm test
```

### Run All Tests Together
From the repository root:
```bash
node Backend/test/test-api.js
node Frontend/test/test-frontend.js
```

---

## 🔄 11. Resetting Demo Data

To reset the application to its fresh demo state (e.g., during evaluation or an interview):
1. **Via UI:** When all profiles have been swiped, click the **"🔄 Reset Demo Data (Start Over)"** button in the empty state.
2. **Via API:**
   ```bash
   curl -X POST http://localhost:5000/dev/reset
   ```
3. **Via Filesystem:** Stop the server and delete `Backend/data/runtime.json`. It will automatically re-initialize on the next startup.

---

## ⚠️ 12. Known Limitations

- **Single-User Scope:** Designed strictly as a single-user demo application with a hardcoded user ID (`current_user`). Not intended for multi-tenant production authentication.
- **Local JSON Persistence:** Relies on local filesystem storage (`data/runtime.json`). Not distributed across multi-node clusters.
- **Simulated Incoming Likes:** Three profiles (`profile_3`, `profile_7`, `profile_12`) are pre-seeded with incoming secret likes so evaluators can experience immediate mutual matches upon swiping right.
