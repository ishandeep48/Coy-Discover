# Coy - React.js Recreation

A complete recreation of the Coy anonymous crush detection app built with React.js.

## What You Have

✅ **Complete Source Code** - All files ready for development
✅ **Mobile-First Design** - Exact replica of the original app's mobile UI
✅ **Vanilla CSS** - No framework dependencies (pure styling)
✅ **Responsive Layout** - Works on all screen sizes
✅ **Toast Notifications** - Interactive user feedback system

## Project Structure

```
Frontend/
├── public/              # Static assets (favicon, icons)
│   └── favicon.svg      # Heart emoji logo
├── src/
│   ├── main.jsx        # React entry point
│   ├── App.jsx         # Main application component
│   └── index.css       # Complete styling (23KB CSS)
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── vite.config.js      # Build configuration
├── .gitignore          # Git ignore rules
├── README.md           # Project documentation
└── START_HERE.md       # This file - quick start guide
```

## Quick Start

### 1. Install Dependencies

```bash
cd G:/Project/coy-assignment/Frontend
npm install
```

This will install:
- React 18.3.1
- Vite 5.3.1
- Required TypeScript types

### 2. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173` in your browser automatically!

### 3. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Features Implemented

| Feature | Original | React Version |
|---------|----------|---------------|
| Header with settings button | ✅ | ✅ |
| Status indicator (calm state) | ✅ | ✅ |
| "Invite friends" WhatsApp link | ✅ | ✅ |
| Email nudge button | ✅ | ✅ |
| Crushes list with avatar | ✅ | ✅ |
| Contact info display | ✅ | ✅ |
| Add crush tile | ✅ | ✅ |
| More slots call-to-action | ✅ | ✅ |
| Referral section with emoji | ✅ | ✅ |
| Progress indicators (0/3) | ✅ | ✅ |
| Referral code display | ✅ | ✅ |
| Copy to clipboard functionality | ✅ | ✅ |
| Share link buttons | ✅ | ✅ |

## Design Fidelity

The CSS exactly replicates:
- **Color Palette**: All 14 original colors (pinks, lilacs, mints, etc.)
- **Typography**: Bricolage Grotesque font stack with custom sizing
- **Components**: Buttons, cards, avatars, dialog boxes
- **Spacing**: Exact margins, paddings, and gaps
- **Animations**: Fade-ins, hover effects, toast notifications
- **Responsive Layout**: Mobile-first breakpoints

## Customization Guide

### Changing the Logo

Edit `src/App.jsx` - find the `<CoyWordmark />` component:

```jsx
const CoyWordmark = () => (
  <div style={{/* styling */}}>
    coy<span style={{/* dot */}}></span>
  </div>
);
```

### Adding Your Own Favicon

Replace `public/favicon.svg` with your own SVG or PNG.

### Modifying Colors

Edit `src/index.css` - all colors use CSS custom properties:

```css
:root {
  --bg: #fff;        /* Main background */
  --pink: #ff3d81;   /* Primary accent */
  --soft: #f6f4fa;   /* Secondary backgrounds */
}
```

### Adding New Features

The React structure makes it easy to add:
- User authentication (Auth0, Firebase)
- Database integration (Supabase, MongoDB)
- Real-time updates with Socket.io
- WebSocket connections for live matching

## Browser Support

Works on all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

**Issue**: Styles not loading
- Solution: Run `npm run dev` and refresh (Ctrl+F5)

**Issue**: Favicon doesn't show
- Solution: Clear browser cache or use a different browser

**Issue**: Toast notifications not appearing
- Solution: Click elements to trigger them - they're functional!

## Next Steps

1. **Install dependencies**: `npm install`
2. **Start development**: `npm run dev`
3. **Customize**: Edit colors, text, images in CSS/App.jsx
4. **Deploy**: Build with `npm run build` and deploy to Netlify/Vercel

## License

This is a recreation for educational purposes. Original Coy app is available at https://app.getcoy.com

---

Built with ❤️ using React + Vite
