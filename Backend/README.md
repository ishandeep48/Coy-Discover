# Coy Discover Backend - Data Layer & REST APIs ⚡️

A lightweight, robust backend service providing the Discover feature's data layer with local JSON file persistence. Built without any database or ORM, featuring atomic file replacement, serialized writes for concurrency protection, and full error recovery.

---

## 📁 Architecture & Folder Structure

```
Backend/
├── seed/
│   └── profiles.json       # Immutable seed data (32 predefined mock profiles)
├── data/
│   └── runtime.json        # Mutable runtime state (profiles, swipes, matches)
├── src/
│   ├── config.js           # Server configuration, paths, and default user ID
│   ├── dal/
│   │   ├── fileStorage.js  # Atomic file writer with serialized transaction queue
│   │   └── dataAccess.js   # Reusable Data Access Layer (DAL) & business rules
│   ├── routes/
│   │   ├── feed.js         # GET /feed endpoint handler
│   │   ├── swipe.js        # POST /swipe endpoint handler
│   │   └── matches.js      # GET /matches endpoint handler
│   └── server.js           # Express app bootstrap, error handling & routing
├── test/
│   └── test-api.js         # Automated end-to-end test suite
└── package.json
```

---

## 💾 Persistence Strategy

### 1. Seed vs. Runtime Separation
- **`seed/profiles.json`**: An immutable snapshot containing 32 rich mock profiles. This file is strictly read-only and never modified during execution.
- **`data/runtime.json`**: Stores the dynamic runtime state (`profiles`, `swipes`, `matches`).
  - **First Startup**: If `data/runtime.json` does not exist, the DAL reads `seed/profiles.json` and writes the initial runtime snapshot.
  - **Subsequent Startups**: Automatically detects and loads existing `runtime.json` without resetting user swipes or matches.

### 2. Atomic Writes via Temporary Files
To guarantee that a power outage, crash, or concurrent operation never leaves a partially written or corrupted JSON file:
1. Data is first serialized and written to a hidden temporary file in the same directory: `data/.runtime.json.<timestamp>.<random>.tmp`.
2. The temporary file is atomically renamed (`fs.rename`) over the target `runtime.json`.
3. If an error occurs, the temporary file is unlinked immediately.
4. Includes retry logic for Windows filesystem transient locks (`EPERM` / `EBUSY`).

### 3. Concurrency Protection & Serialized Transactions
To prevent race conditions where concurrent requests overwrite each other's changes:
- All write operations pass through `FileStorage.transaction(updateFn)`.
- Write requests are serialized through an asynchronous Promise queue.
- Within each transaction:
  1. The freshest state is read from disk.
  2. The update function validates rules (e.g., single-swipe constraint).
  3. The modified state is atomically persisted.
  4. Only after completion does the next queued transaction execute.

---

## 🔒 Data Models & Business Rules

### 1. Profile
- `id` (string), `name` (string), `age` (number), `photo` (string URL), `bio` (string), `cityOrCollege` (string), `interests` (array of strings).

### 2. Swipe
- `swiperId` (string), `targetProfileId` (string), `action` ("LIKE" | "PASS"), `createdAt` (ISO 8601 string).
- **Single-Swipe Rule:** A user can only swipe once per profile. Attempting a duplicate swipe returns `409 Conflict`.

### 3. Match
- `id` (UUID), `user1Id` (string), `user2Id` (string), `createdAt` (ISO 8601 string).
- **Mutual Match Only:** Matches are created **strictly** when both users have liked each other.
- **Incoming Like Secrecy:** Unmatched incoming likes are never exposed in the feed or profile data until mutual liking occurs.

### 4. Assumed Logged-in User
- Default user ID: `"user_me"` (configurable via `CURRENT_USER_ID` environment variable or `x-user-id` request header).

---

## 🌐 API Endpoints

### 1. `GET /feed`
Returns all profiles that the logged-in user has not yet swiped on.
- Excludes the logged-in user themselves.
- Excludes any profile already swiped (`LIKE` or `PASS`).
- Never exposes incoming likes.

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
      "photo": "https://images.unsplash.com/photo-...",
      "bio": "Film photography, matcha lattes...",
      "cityOrCollege": "St. Stephen's College, Delhi",
      "interests": ["Film Photography", "Matcha", "Cinema", "Thrifting"]
    }
  ]
}
```

---

### 2. `POST /swipe`
Records a `LIKE` or `PASS` action and determines whether a mutual match was formed.

**Request Body:**
```json
{
  "targetProfileId": "profile_3",
  "action": "LIKE"
}
```

**Response `201 Created` (Mutual Match):**
```json
{
  "success": true,
  "message": "It's a mutual match!",
  "isMatch": true,
  "match": {
    "id": "e4f8d2...",
    "user1Id": "user_me",
    "user2Id": "profile_3",
    "createdAt": "2026-11-18T..."
  },
  "matchedProfile": {
    "id": "profile_3",
    "name": "Meera Nair",
    "age": 21,
    ...
  },
  "swipe": {
    "swiperId": "user_me",
    "targetProfileId": "profile_3",
    "action": "LIKE",
    "createdAt": "2026-11-18T..."
  }
}
```

**Response `201 Created` (Single Like or Pass):**
```json
{
  "success": true,
  "message": "Recorded LIKE successfully.",
  "isMatch": false,
  "swipe": { ... }
}
```

**Error Responses:**
- `400 Bad Request`: Missing fields, invalid action (not `LIKE` or `PASS`), or swiping on self.
- `404 Not Found`: Target profile does not exist.
- `409 Conflict`: User has already swiped on this profile.

---

### 3. `GET /matches`
Returns all mutual matches for the logged-in user, augmented with the matched user's profile information.

**Response `200 OK`:**
```json
{
  "success": true,
  "count": 1,
  "matches": [
    {
      "id": "e4f8d2...",
      "matchedUserId": "profile_3",
      "createdAt": "2026-11-18T...",
      "profile": {
        "id": "profile_3",
        "name": "Meera Nair",
        "age": 21,
        "photo": "...",
        "bio": "...",
        "cityOrCollege": "St. Xavier's College, Mumbai",
        "interests": ["Stand-up Comedy", "Bakery", "Jazz", "Psychology"]
      }
    }
  ]
}
```

---

## 🚀 How to Run & Test

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Run Automated Test Suite
Executes all 11 test suites verifying initialization, feed filtering, validation, single-swipe rules, mutual matches, persistence across restart, concurrent write serialization, and seed immutability:
```bash
npm test
```

### 3. Start Development Server
```bash
npm run dev
# or: node src/server.js
```
The server starts on `http://localhost:5000`.

### 4. Example cURL / HTTP Requests

**Get Feed:**
```bash
curl http://localhost:5000/feed
```

**Swipe LIKE (Mutual Match with pre-seeded Meera Nair):**
```bash
curl -X POST http://localhost:5000/swipe \
  -H "Content-Type: application/json" \
  -d '{"targetProfileId": "profile_3", "action": "LIKE"}'
```

**Swipe PASS:**
```bash
curl -X POST http://localhost:5000/swipe \
  -H "Content-Type: application/json" \
  -d '{"targetProfileId": "profile_1", "action": "PASS"}'
```

**Get Matches:**
```bash
curl http://localhost:5000/matches
```
