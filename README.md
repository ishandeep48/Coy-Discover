# Coy Discover - Work In Progress ⚠️

> **Status: REACTUALIZING OFFLINE SAVED WEBPAGE**

This repository contains a React.js recreation of the [Coy](https://app.getcoy.com/) anonymous crush detection app.

## 🚧 Work In Progress

This project is currently being developed and optimized. Some features may not be fully implemented or may change during development.

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

## 🎨 Features Implemented

| Feature | Status | Description |
|---------|--------|-------------|
| **Header** | ✅ | Logo with settings button |
| **Status Indicator** | ✅ | "No one has added you yet" message |
| **Invite Friends** | ✅ | WhatsApp share link |
| **Email Nudge** | ✅ | Add email functionality |
| **Crushes List** | ✅ | Avatar-based crush list (1/3 slots) |
| **Add Crush Tile** | ✅ | Interactive add button |
| **Upgrade CTA** | ✅ | "More slots" call-to-action |
| **Referral Section** | ✅ | Get a slot free promotion |
| **Referral Code** | ✅ | Copy to clipboard functionality |
| **Share Buttons** | ✅ | Copy link & share via WhatsApp |
| **Toast Notifications** | ✅ | User feedback system |

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

## 📱 Features

- **Anonymous Crush Detection**: Secretly add your crushes and find out if they like you back
- **Mutual Discovery**: Both parties find out only when the feeling is mutual
- **Invite System**: Get referrals to unlock free slots
- **Email Lookup**: People can find you via email address
- **Referral Program**: Copy code and share with friends

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

### Known Limitations (WIP)

- Authentication system not implemented
- Backend database integration pending
- Real-time matching functionality to be added
- User profile management coming soon

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
