# Coy - Anonymous Crush Detection App

A React.js recreation of the Coy app that lets you secretly add your crushes and find out if they like you back. Only mutual likes are revealed!

## Features

- 🤫 **Secretly Add Crushes**: Anonymously add people who might have a crush on you
- 💜 **Mutual Discovery**: Both parties find out only when the feeling is mutual
- 👥 **Invite Friends**: Get referrals and unlock free slots
- 📧 **Email Lookup**: People can find you via email address

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
cd Frontend
npm install
```

### Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
```

## Tech Stack

- React 18
- Vite (Build Tool)
- Vanilla CSS (No framework dependencies!)

## Design Notes

This recreation uses:
- Exact color scheme from the original app
- Custom SVG icons for all UI elements
- Responsive mobile-first design
- Toast notifications for user feedback
- Clipboard API integration for referral code copying

## Project Structure

```
Frontend/
├── public/           # Static assets (favicons, etc.)
├── src/
│   ├── index.css     # Complete CSS styling
│   └── App.jsx       # Main application component
├── index.html        # HTML entry point
├── package.json      # Dependencies
└── vite.config.js    # Vite configuration
```

## Screenshots

The app features a clean, mobile-first design with:
- Top navigation bar with settings button
- Status indicator (calm state shown by default)
- Crush list with avatars and contact info
- Add crush tile for new entries
- Referral section with copyable code
- Toast notifications for user actions

## Colors

The app uses a soft, pastel color scheme:
- Primary Pink: #ff3d81
- Background: #fff
- Secondary: #f6f4fa (soft), #ece9f2 (line)
- Accent Yellow: #ffe45c
- Mint Green: #cbf4e0
- Lilac: #e7e0ff
