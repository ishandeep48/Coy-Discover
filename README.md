# Coy Discover Feature — Full-Stack Application ⚡️

A complete, production-grade Discover and anonymous crush matching experience for **Coy**, built with **React 18 / Vite** on the frontend and an atomic **Node.js / Express** data layer powered by local JSON file persistence (no database or ORM).

---

## 🚀 Detailed First-Time Setup & How to Run

Whether you have Docker installed or want to run natively with Node.js, follow the detailed instructions below.

### Demo Video

Please Refer to this Video for Demo and setup guide


https://github.com/user-attachments/assets/028b69cd-2197-4073-ad98-0b4f9e6e3337



---

### Method 1: Using Docker (Recommended — Single Command)

> **💡 Note for First-Time Users:**  
> When using Docker, you **DO NOT** need to download or install `node_modules` on your local machine!  
> The Docker build automatically downloads all dependencies, compiles the React frontend, and packages the Express backend inside an isolated container.

#### Prerequisites:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows, Mac, or Linux) installed and running.

#### Step 1: Run with Docker Compose
Open your terminal in the project root directory and run:

```bash
docker compose up --build
```

#### What happens behind the scenes:
1. Docker reads `Dockerfile` and creates a multi-stage container.
2. It installs all dependencies inside the container for both Frontend and Backend (`npm ci`).
3. It compiles the React application into optimized static assets.
4. It initializes the backend data layer and mounts `./Backend/data` as a volume on your host machine so your swipes and matches persist.
5. It binds to port **5000**.

#### Step 2: Open the Application
Visit **`http://localhost:5000`** in your browser. Both the Discover UI and the REST API endpoints are live and fully connected!

#### To stop the container:
Press `Ctrl + C` in the terminal, or run:
```bash
docker compose down
```

---

### Method 2: Local Native Setup (From Scratch / Fresh Clone)

Follow this method if you do not have Docker or prefer running with local Node.js.

#### Prerequisites:
- **Node.js 18+** installed (`node -v` to verify).
- **npm** installed (`npm -v` to verify).

---

#### Step 1: Install Dependencies (When no `node_modules` exist)

You can install all dependencies in one command from the project root:

```bash
npm run setup
```

*Or manually install each folder:*

```bash
# 1. Install Backend dependencies
cd Backend
npm install

# 2. Install Frontend dependencies
cd ../Frontend
npm install

# 3. Return to root
cd ..
```

---

#### Step 2: Start the Application

You will need **two terminal windows**:

#### Terminal 1 — Start the Backend (Port 5000)
```bash
cd Backend
node src/server.js
```
*(Or run `npm start` inside `Backend`)*

You will see:
```
[DAL] No runtime.json found. Initializing from seed: .../seed/profiles.json
[DAL] Successfully initialized runtime.json with 32 profiles.
🚀 Coy Discover Backend running on http://localhost:5000
👤 Assumed logged-in user: current_user
```

#### Terminal 2 — Start the Frontend (Port 5173)
```bash
cd Frontend
npm run dev
```

You will see:
```
  VITE v5.4.21 ready in 250 ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

#### Step 3: Open in Browser
Open **`http://localhost:5173`** in your browser.

- The application automatically opens to the **Discover** tab.
- The Vite dev server includes a configured proxy that routes all API requests (`/feed`, `/swipe`, `/matches`) directly to the backend on `http://localhost:5000`.

---

## 🧪 Running Automated Tests

Both backend and frontend have dedicated automated test runners covering 100% of business rules.

### Option A: Run All Tests with One Command (From Root)
```bash
npm test
```

### Option B: Run Tests Individually
```bash
# Run 12 Backend Test Suites (feed, swipe validations, mutual match, concurrency, persistence)
cd Backend && npm test

# Run Frontend Contract Tests (models, payloads, user config)
cd ../Frontend && npm test
```

---

## 🌟 Features Overview

- **Single-Command Docker Execution:** One command builds the React frontend, sets up the Express backend, serves all static assets and REST API endpoints, and starts the container on port 5000.
- **Mobile-First Card Swiping:** Touch and drag card physics powered by Framer Motion with rotation, drag velocity thresholds, and live `LIKE` (green) / `NOPE` (pink) stamp badges.
- **Desktop Action Controls:** Dedicated circular action buttons for Pass (✕) and Like (💖).
- **Strict Privacy & Secret Crushes:** Incoming likes are never exposed in `/feed` or UI components. A user only discovers who likes them if they like them back.
- **Match Celebration:** When a mutual like occurs, an instant celebration overlay displays dual profile photos, confetti animation, and celebratory messaging.
- **Matches View:** Browse all confirmed mutual matches with full profile details.
- **Zero Race Conditions:** The data layer processes write operations through an asynchronous Promise queue and atomic file swaps (`.tmp` → atomic rename) to eliminate data corruption.
- **State Persistence Across Restarts:** Swipes and matches persist across browser reloads and container restarts.
- **Development Reset:** Reset button in the UI and `POST /dev/reset` API endpoint to restore initial seed profiles during testing.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18.3.1, Vite 5.4.21, Framer Motion (gesture physics), Canvas Confetti, Vanilla CSS |
| **Backend** | Node.js (ES Modules), Express 4.19.2, CORS |
| **Persistence** | Local JSON (`seed/profiles.json` for immutable seed, `Backend/data/runtime.json` for mutable runtime) |
| **DevOps** | Multi-stage Dockerfile (Node 20 Alpine), Docker Compose v2 |
| **Testing** | Automated test runner covering 12 backend test suites + frontend contract tests |

---

## 📐 Architecture & Data Flow

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

## 📁 Folder Structure

```
coy-assignment/
├── Dockerfile                   # Multi-stage production container definition
├── docker-compose.yml           # One-command orchestration configuration
├── .dockerignore                # Build context exclusion rules
├── seed/
│   └── profiles.json            # Immutable master seed (32 predefined profiles)
├── Backend/
│   ├── seed/
│   │   └── profiles.json        # Backend seed copy
│   ├── data/
│   │   └── runtime.json         # Mutable runtime JSON (persisted via Docker volume)
│   ├── src/
│   │   ├── config.js            # Centralized config (current_user, ports, paths)
│   │   ├── dal/
│   │   │   ├── fileStorage.js   # Atomic temporary writes & serialized transactions
│   │   │   └── dataAccess.js    # Data Access Layer & privacy/match business rules
│   │   ├── routes/
│   │   │   ├── feed.js          # GET /feed handler
│   │   │   ├── swipe.js         # POST /swipe handler
│   │   │   └── matches.js       # GET /matches handler
│   │   └── server.js            # Express app, static frontend serving, health/stats
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
├── package.json                 # Monorepo setup scripts ("npm run setup", "npm test")
└── README.md                    # This documentation file
```

---

## 💾 JSON Persistence Strategy

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

## 📋 Data Models

### Profile
```typescript
interface Profile {
  id: string;             // Unique identifier (e.g., "profile_1")
  name: string;           // Full display name (e.g., "Rhea Sen")
  age: number;            // Age (e.g., 22)
  photo: string;          // Direct URL to profile image
  bio: string;            // Short personal biography
  cityOrCollege: string;  // College or city name
  interests: string[];    // Array of interest tags
}
```

### Swipe
```typescript
interface Swipe {
  swiperId: string;        // ID of user performing swipe ("current_user")
  targetProfileId: string; // ID of profile being swiped on
  action: 'LIKE' | 'PASS'; // Action taken
  createdAt: string;       // ISO 8601 timestamp
}
```

### Match
```typescript
interface Match {
  id: string;              // UUID of the match
  user1Id: string;         // First user ID
  user2Id: string;         // Second user ID
  createdAt: string;       // ISO 8601 timestamp
}
```

---

## 🌐 API Reference & Response Structures

### 1. `GET /feed` (or `GET /api/feed`)
Retrieves all profiles that the logged-in user has not yet interacted with.

- **Method:** `GET`
- **URL:** `/feed`
- **Headers:**
  - `x-user-id` *(optional)*: Override logged-in user ID (defaults to `current_user`).

#### Response: `200 OK`
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
      "interests": [
        "Film Photography",
        "Matcha",
        "Cinema",
        "Thrifting"
      ]
    }
  ]
}
```

---

### 2. `POST /swipe` (or `POST /api/swipe`)
Submits a `LIKE` or `PASS` swipe on a target profile.

- **Method:** `POST`
- **URL:** `/swipe`
- **Headers:**
  - `Content-Type`: `application/json`
  - `x-user-id` *(optional)*: Override logged-in user ID.
- **Request Body:**
```json
{
  "targetProfileId": "profile_3",
  "action": "LIKE"
}
```

| Field | Type | Required | Values / Description |
| :--- | :--- | :--- | :--- |
| `targetProfileId` | `string` | Yes | Existing profile identifier to swipe on |
| `action` | `string` | Yes | Must be strictly `"LIKE"` or `"PASS"` |

#### Response: `201 Created` (Mutual Match Formed)
*Occurs when the target user had previously liked the logged-in user.*
```json
{
  "success": true,
  "matched": true,
  "isMatch": true,
  "message": "It's a mutual match!",
  "match": {
    "id": "7a3b4c9e-5612-4211-9f23-88c91a34b9d0",
    "profile": {
      "id": "profile_3",
      "name": "Meera Nair",
      "photo": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "age": 21,
      "bio": "Looking for someone to attend standup comedy shows and rate local croissants with.",
      "cityOrCollege": "St. Xavier's College, Mumbai",
      "interests": ["Stand-up Comedy", "Bakery", "Jazz", "Psychology"]
    }
  },
  "matchedProfile": {
    "id": "profile_3",
    "name": "Meera Nair",
    "age": 21,
    "photo": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    "bio": "Looking for someone to attend standup comedy shows and rate local croissants with.",
    "cityOrCollege": "St. Xavier's College, Mumbai",
    "interests": ["Stand-up Comedy", "Bakery", "Jazz", "Psychology"]
  },
  "swipe": {
    "swiperId": "current_user",
    "targetProfileId": "profile_3",
    "action": "LIKE",
    "createdAt": "2026-11-18T00:30:00.000Z"
  }
}
```

#### Response: `201 Created` (Single Like or Pass — No Match)
```json
{
  "success": true,
  "matched": false,
  "isMatch": false,
  "message": "Swipe recorded successfully",
  "swipe": {
    "swiperId": "current_user",
    "targetProfileId": "profile_1",
    "action": "PASS",
    "createdAt": "2026-11-18T00:30:15.000Z"
  }
}
```

#### Error Responses:
- **`400 Bad Request`**: Validation error (missing field, invalid action, or swiping on oneself).
  ```json
  {
    "success": false,
    "error": "Invalid action \"MAYBE\". Action must be either \"LIKE\" or \"PASS\"."
  }
  ```
- **`404 Not Found`**: Target profile does not exist.
  ```json
  {
    "success": false,
    "error": "Profile with id \"non_existent_id\" not found."
  }
  ```
- **`409 Conflict`**: Single-swipe violation.
  ```json
  {
    "success": false,
    "error": "User \"current_user\" has already swiped on profile \"profile_1\"."
  }
  ```

---

### 3. `GET /matches` (or `GET /api/matches`)
Retrieves all confirmed mutual matches for the logged-in user.

- **Method:** `GET`
- **URL:** `/matches`

#### Response: `200 OK`
```json
{
  "success": true,
  "count": 1,
  "matches": [
    {
      "id": "7a3b4c9e-5612-4211-9f23-88c91a34b9d0",
      "matchedUserId": "profile_3",
      "createdAt": "2026-11-18T00:30:00.000Z",
      "profile": {
        "id": "profile_3",
        "name": "Meera Nair",
        "photo": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        "age": 21,
        "bio": "Looking for someone to attend standup comedy shows and rate local croissants with.",
        "cityOrCollege": "St. Xavier's College, Mumbai",
        "interests": [
          "Stand-up Comedy",
          "Bakery",
          "Jazz",
          "Psychology"
        ]
      }
    }
  ]
}
```

---

### 4. `POST /dev/reset` (or `POST /api/dev/reset`)
Restores `data/runtime.json` to the original seed state at any time.

- **Method:** `POST`
- **URL:** `/dev/reset`

#### Response: `200 OK`
```json
{
  "success": true,
  "message": "Runtime state successfully reset to initial seed data."
}
```

---

### 5. `GET /health`
Diagnostic health check endpoint.

#### Response: `200 OK`
```json
{
  "status": "ok",
  "service": "coy-backend",
  "user": "current_user",
  "timestamp": "2026-11-18T00:30:00.000Z"
}
```

---

## 🔄 How to Reset Demo State

To restart the evaluation flow from scratch:
1. **In the UI:** When the feed is exhausted, click **"🔄 Reset Demo Data (Start Over)"**.
2. **Via cURL:**
   ```bash
   curl -X POST http://localhost:5000/dev/reset
   ```
3. **Via Filesystem:** Delete `Backend/data/runtime.json` and restart the app.

---

## ⚠️ Notes & Assumptions

- **Demonstration Scope:** Built strictly for single-user demonstration (`current_user`) using local JSON file persistence (`data/runtime.json`).
- **Simulated Incoming Likes:** Three profiles (`profile_3`, `profile_7`, `profile_12`) hold pre-seeded secret incoming likes on `current_user` to demonstrate mutual matching.
- **Home Placeholder:** The Home tab is preserved as a clean blank placeholder in accordance with the specifications.
