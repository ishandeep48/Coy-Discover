# Coy Discover - Project Guide for AI Agents ⚡️

## Quick Summary
**Coy Discover** is a React.js recreation of the offline [Coy](https://app.getcoy.com/) anonymous crush detection app. Currently in **DEMO MODE** with all interactive buttons disabled but UI fully styled.

---

## Tech Stack
- **React 18.3.1** (UI framework)
- **Vite 5.4.21** (build tool & dev server)
- **Vanilla CSS** (~9.7KB, exact color match to original)
- **No frameworks** beyond React/Vite

---

## Project Structure
```
coy-assignment/
├── .gitignore                    # Ignores: node_modules/, Original/, dist/
├── README.md                     # User documentation
├── AGENT_HELP.md                 # This file - AI agent guide
└── Frontend/
    ├── src/
    │   ├── App.jsx               # Main component (21KB)
    │   ├── index.css             # Complete styling (9.7KB)
    │   └── main.jsx              # React entry point
    ├── public/
    │   └── favicon.svg           # Heart emoji logo
    ├── index.html                # HTML template
    ├── package.json              # Dependencies
    ├── vite.config.js            # Build config
    ├── README.md                 # Frontend docs
    └── START_HERE.md             # Quick start guide
```

---

## Current Status: DEMO MODE ⚠️
**All interactive buttons disabled** for demonstration purposes. No backend/database integration.

### Active Sections (Visible & Functional):
1. **Header** - Coy logo + settings button
2. **Status Section** - "No one has added you yet" + Invite friends link
3. **Your crushes list** - Empty with 1/3 counter, disabled add button
4. **Toast notifications** - Shows demo messages on button clicks

### Disabled/Removed Sections:
- ❌ Email Nudge (add email section)
- ❌ More Slots upgrade link
- ❌ Refer section (referral code)
- ⏸️ All buttons clickable but disabled with gray styling

---

## Color System (Exact Match)
```css
:root {
  --bg: #fff;
  --soft: #f6f4fa;
  --line: #ece9f2;
  --text: #15121d;
  --muted: #6d6979;
  --pink: #ff3d81;        /* Primary accent */
  --pink-strong: #d81e63;
  --yellow: #ffe45c;
  --lilac: #e7e0ff;
  --mint: #cbf4e0;
  --sky: #d7ecff;
}
```

**Typography:** "Bricolage Grotesque", system-ui stack (mobile-first, responsive)

---

## Key Components (in App.jsx)

### 1. CoyWordmark - Logo Component
- Inline flex with pink dot after "coy" text
- Styled to match original app logo

### 2. SettingsIcon - SVG Icon
- Settings gear icon for header button
- Positioned right of logo

### 3. Toast System
- State-based visibility: `const [toast, setToast] = useState({ show: false, message: '' })`
- Shows at bottom center with dark background
- Auto-dismisses after 3 seconds
- Used for all demo mode notifications

### 4. CopyToClipboard Function
- Handles clipboard API
- Falls back to textarea method for older browsers
- Shows toast on success/failure

---

## File Responsibilities

| File | Purpose | Size | Notes |
|------|---------|------|-------|
| `App.jsx` | Main React component | ~15KB | All JSX + inline styles |
| `index.css` | Complete styling | ~9.7KB | No external CSS, everything in one file |
| `main.jsx` | Entry point | ~200B | Minimal, just renders App |
| `index.html` | HTML template | ~580B | Root HTML for Vite |

---

## Development Commands

```bash
cd Frontend
npm install      # Install dependencies
npm run dev      # Start dev server (port 5173)
npm run build    # Production build
npm run preview  # Preview production build
```

---

## API & Features (None - Demo Only)
- **No REST endpoints** - Pure UI demo
- **No WebSocket** - No real-time features
- **No backend** - No database, no authentication
- **Clipboard API only** - For referral code copying
- **Toast notifications** - User feedback system

---

## External Resources
- [Original Coy App](https://app.getcoy.com/) - Source of design inspiration
- [React Docs](https://react.dev/) - Framework documentation
- [Vite Docs](https://vitejs.dev/) - Build tool docs

---

## For AI Agents: Key Facts to Know

✅ **Frontend-only React app** - No server-side code  
✅ **Vite-based** - Uses esbuild for fast HMR  
✅ **Inline styles only** - No CSS files in JSX (all in index.css)  
✅ **State management**: `useState` hooks for toast notifications  
✅ **Demo mode**: All buttons disabled, shows informative toasts  
✅ **No external API calls** - Static content only  
✅ **Responsive mobile-first design** - Works on all screen sizes  

---

## Git Repository
- **URL:** https://github.com/ishandeep48/Coy-Discover.git
- **Branches:** `main` (current)
- **Commit messages follow semantic versioning**

---

## Common Operations

### Add new feature:
1. Edit `App.jsx` - Add component/section
2. Edit `index.css` - Add styles or use CSS custom properties
3. Test in dev mode

### Deploy to production:
```bash
cd Frontend
npm run build      # Creates dist/ folder
# Upload dist/ to hosting (Netlify/Vercel/etc)
```

---

## Token-Efficient Queries for Agents

**Instead of asking:** "What does the app do and how is it built?"

**Ask:** "Coy Discover - React demo app with disabled buttons. Shows crush detection UI. Files: App.jsx + index.css in Frontend/."

**Instead of asking:** "How do I add a feature?"

**Ask:** "Add new section to App.jsx, style with CSS variables from :root, test with npm run dev"

---

## Version Info
- **Created:** Nov 2024
- **Last Updated:** Current session (all button disablements)
- **Status:** Demo mode - ready for backend integration later

---

**TL;DR:** React + Vite demo app recreating Coy UI. All buttons disabled. Pure frontend, no backend. 1:1 color/design match to offline saved webpages.
