import React from 'react';

const HomeIcon = ({ width = 22, height = 22, color = 'currentColor' }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    aria-hidden="true"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const DiscoverIcon = ({ width = 22, height = 22, color = 'currentColor', filled = false }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <polygon 
      points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" 
      fill={filled ? color : 'none'} 
    />
  </svg>
);

/**
 * BottomNav Component
 * 
 * Bottom navigation bar with Home and Discover tabs.
 * Styled to fit Coy's design system with mobile-friendly touch targets.
 */
function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav
      aria-label="Bottom Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#ffffff',
        borderTop: '2px solid #15121d',
        zIndex: 35,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -4px 16px rgba(21, 18, 29, 0.06)'
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: '64px',
          padding: '0 12px'
        }}
      >
        {/* Home Tab Button */}
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          aria-label="Home tab"
          aria-current={activeTab === 'home' ? 'page' : undefined}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            cursor: 'pointer',
            flex: 1,
            height: '100%',
            padding: '6px 0',
            color: activeTab === 'home' ? '#ff3d81' : '#6d6979',
            fontFamily: '"Bricolage Grotesque", system-ui, -apple-system, sans-serif',
            fontSize: '0.75rem',
            fontWeight: activeTab === 'home' ? 800 : 600,
            transition: 'color 0.15s ease, transform 0.1s ease',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <HomeIcon 
            width={22} 
            height={22} 
            color={activeTab === 'home' ? '#ff3d81' : '#6d6979'} 
          />
          <span>Home</span>
        </button>

        {/* Discover Tab Button */}
        <button
          type="button"
          onClick={() => setActiveTab('discover')}
          aria-label="Discover tab"
          aria-current={activeTab === 'discover' ? 'page' : undefined}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            cursor: 'pointer',
            flex: 1,
            height: '100%',
            padding: '6px 0',
            color: activeTab === 'discover' ? '#ff3d81' : '#6d6979',
            fontFamily: '"Bricolage Grotesque", system-ui, -apple-system, sans-serif',
            fontSize: '0.75rem',
            fontWeight: activeTab === 'discover' ? 800 : 600,
            transition: 'color 0.15s ease, transform 0.1s ease',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <DiscoverIcon 
            width={22} 
            height={22} 
            color={activeTab === 'discover' ? '#ff3d81' : '#6d6979'} 
            filled={activeTab === 'discover'}
          />
          <span>Discover</span>
        </button>
      </div>
    </nav>
  );
}

export default BottomNav;
export { HomeIcon, DiscoverIcon };
