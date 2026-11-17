# Coy Discover - Work In Progress ⚠️

> **Status: REACTUALIZING OFFLINE SAVED WEBPAGE**

This repository contains a React.js recreation of the [Coy](https://app.getcoy.com/) anonymous crush detection app.

## ✅ Demo Version - All Interactive Features Disabled

> **Status: DEMO MODE** - This is a demonstration version of the Coy app with all interactive buttons disabled.

---

## 📁 Project Structure

```
coy-assignment/
├── .gitignore                   # Git ignore rules
├── Frontend/                    # React.js application
│   ├── src/
│   │   ├── App.jsx             # Main application component
│   │   ├── index.css           # Complete styling (exact color scheme)
│   │   └── main.jsx            # React entry point
│   ├── public/
│   │   └── favicon.svg         # Heart emoji logo (💜)
│   ├── index.html              # HTML entry point
│   ├── package.json            # Dependencies & scripts
│   ├── vite.config.js          # Vite build configuration
│   ├── README.md               # Project documentation
│   └── START_HERE.md           # Quick start guide
├── Original/                    # Offline saved webpage (NOT tracked in git)
└── README.md                   # This file

```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install
```

### Development Mode

```bash
npm run dev
```

Open your browser and visit: **http://localhost:5173/**

The development server will open automatically in your default browser.

---

## 🎨 Features Implemented (Demo Mode)

| Feature | Status | Description |
|---------|--------|-------------|
| **Header** | ✅ Active | Logo with settings button |
| **Status Indicator** | ✅ Active | "No one has added you yet" message |
| **Invite Friends** | ⏸️ Disabled | Button present but not clickable (demo) |
| **Add Crush Tile** | ⏸️ Disabled | Button present but not clickable (demo) |
| **More Slots** | ⏸️ Disabled | Link present but not clickable (demo) |
| **Crushes List** | ✅ Active | Empty list with 1/3 counter shown |
| **Toast Notifications** | ✅ Active | Shows demo messages when clicking buttons |

> ℹ️ All buttons are disabled in this demo version. Clicking them shows informative toast messages.

---

## 🎨 Design System

### Colors (Exact Match)

```css
:root {
  --bg: #fff;              /* Main background */
  --soft: #f6f4fa;         /* Secondary backgrounds */
  --line: #ece9f2;         /* Border lines */
  --text: #15121d;        /* Primary text */
  --muted: #6d6979;        /* Muted text */
  --pink: #ff3d81;         /* Primary accent (buttons, highlights) */
  --pink-strong: #d81e63;  /* Strong pink (referral code) */
  --pink-soft: #ffe4ef;    /* Soft pink backgrounds */
  --yellow: #ffe45c;       /* Warning/status yellow */
  --lilac: #e7e0ff;        /* Lilac backgrounds */
  --mint: #cbf4e0;         /* Mint green (refer section) */
  --sky: #d7ecff;          /* Sky blue */
  --peach: #ffe1cf;        /* Peach tones */
}
```

### Typography

- **Font Stack:** `"Bricolage Grotesque", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
- **Mobile-first responsive design**
- **Exact spacing and margins from original app**

---

## 📱 Features (Demo Version)

- ✅ **Header Navigation** - Coy logo with settings button
- ✅ **Status Indicator** - "No one has added you yet" message
- ⏸️ **Invite Friends** - Disabled (demo mode)
- ❌ **Email Nudge** - Removed from demo
- ❌ **Add Crush Functionality** - Button disabled (no backend)
- ❌ **More Slots Upgrade** - Removed from demo  
- ❌ **Referral Section** - Removed from demo

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Framework |
| Vite | 5.4.21 | Build Tool & Dev Server |
| Vanilla CSS | N/A | Pure styling (no framework dependencies) |

---

## 📦 Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 🌐 Deployment

To deploy the app to a hosting service:

```bash
# Build for production
cd Frontend
npm run build

# Deploy the contents of 'dist/' folder to:
# - Netlify: https://app.netlify.com/drop
# - Vercel: https://vercel.com/new
# - GitHub Pages: https://pages.github.com/
```

---

## 📝 Development Notes

This is a **1:1 recreation** of the offline saved Coy webpage from `Original/Coy.html`. The design, colors, and layout exactly match the original app.

### Demo Version Features

This version is specifically configured as a **DEMO MODE** application:

- ✅ All UI elements present and styled correctly
- ❌ All interactive buttons are disabled
- ✅ Toast notifications show informative messages
- ⚠️ No backend database integration
- ⚠️ No authentication system
- ⚠️ No real-time matching functionality
- ⚠️ Empty crushes list (no add functionality)

### Removed Sections from Demo:

1. **Email Nudge Section** - "Add your email" button removed
2. **More Slots Link** - Upgrade CTA link removed
3. **Referral Section** - "Get a slot free" section removed

---

## 🤝 Contributing

This project is currently in development. Feel free to:

1. Report bugs or suggest improvements
2. Optimize performance
3. Add new features
4. Improve accessibility

---

## 🔗 Resources

- [Original Coy App](https://app.getcoy.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

---

**⚠️ Status: Work In Progress**

This project is actively being developed. Some features may be incomplete or subject to change.
