import React, { useState } from 'react';
import './index.css';
import Home from './components/Home';
import Discover from './components/Discover';
import MatchesView from './components/MatchesView';

const HomeIcon = ({ width = 15, height = 15, color = 'currentColor' }) => (
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

const DiscoverIcon = ({ width = 15, height = 15, color = 'currentColor', filled = false }) => (
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

const MatchesIcon = ({ width = 15, height = 15, color = 'currentColor' }) => (
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
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const CoyWordmark = ({ onClick }) => (
  <div 
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={(e) => {
      if (onClick && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick();
      }
    }}
    style={{
      display: 'inline-flex',
      alignItems: 'baseline',
      fontFamily: '"Bricolage Grotesque", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      fontWeight: 800,
      fontSize: '1.75rem',
      letterSpacing: '-0.04em',
      color: '#15121d',
      textDecoration: 'none',
      cursor: onClick ? 'pointer' : 'default',
      userSelect: 'none'
    }}
  >
    coy<span style={{
      display: 'inline-block',
      width: '0.32em',
      height: '0.32em',
      borderRadius: '50%',
      backgroundColor: '#ff3d81',
      marginLeft: '1px'
    }}></span>
  </div>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path>
  </svg>
);

function App() {
  // Discover is the initial default tab as mandated by requirements
  const [activeTab, setActiveTab] = useState('discover');
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3200);
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
            transform: 'translateX(-50%)',
            background: '#15121d',
            color: '#fff',
            width: 'max-content',
            maxWidth: 'calc(100vw - 32px)',
            fontWeight: 600,
            fontSize: '0.875rem',
            zIndex: 110,
            borderRadius: '16px',
            padding: '13px 18px',
            display: 'flex',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
          }}
        >
          {toast.message}
        </div>
      )}

      <main
        style={{
          maxWidth: '460px',
          minHeight: '100dvh',
          padding: '0 16px calc(24px + env(safe-area-inset-bottom, 0px))',
          paddingTop: 'env(safe-area-inset-top, 0px)',
          margin: '0 auto',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Navigation Bar / Header */}
        <header
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: '60px',
            padding: '12px 0 8px',
            display: 'flex',
            gap: '8px'
          }}
        >
          {/* Coy Wordmark on the Left */}
          <CoyWordmark onClick={() => setActiveTab('discover')} />

          {/* Navigation Action Area on the Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: '#f6f4fa',
                padding: '3px',
                borderRadius: '999px',
                border: '1.5px solid #ece9f2'
              }}
            >
              {/* Home Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                aria-label="Home page"
                aria-current={activeTab === 'home' ? 'page' : undefined}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: activeTab === 'home' ? '#e53935' : 'transparent',
                  color: activeTab === 'home' ? '#ffffff' : '#6d6979',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '6px 10px',
                  fontWeight: 700,
                  fontSize: '0.78125rem',
                  cursor: 'pointer',
                  fontFamily: '"Bricolage Grotesque", system-ui, sans-serif',
                  boxShadow: activeTab === 'home' ? '0 2px 6px rgba(229, 57, 53, 0.3)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <HomeIcon width={14} height={14} color={activeTab === 'home' ? '#ffffff' : '#6d6979'} />
                <span>Home</span>
              </button>

              {/* Discover Tab (Default) */}
              <button
                type="button"
                onClick={() => setActiveTab('discover')}
                aria-label="Discover page"
                aria-current={activeTab === 'discover' ? 'page' : undefined}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: activeTab === 'discover' ? '#e53935' : 'transparent',
                  color: activeTab === 'discover' ? '#ffffff' : '#6d6979',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '6px 11px',
                  fontWeight: 700,
                  fontSize: '0.78125rem',
                  cursor: 'pointer',
                  fontFamily: '"Bricolage Grotesque", system-ui, sans-serif',
                  boxShadow: activeTab === 'discover' ? '0 2px 6px rgba(229, 57, 53, 0.3)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <DiscoverIcon
                  width={14}
                  height={14}
                  color={activeTab === 'discover' ? '#ffffff' : '#6d6979'}
                  filled={activeTab === 'discover'}
                />
                <span>Discover</span>
              </button>

              {/* Matches Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('matches')}
                aria-label="Matches page"
                aria-current={activeTab === 'matches' ? 'page' : undefined}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: activeTab === 'matches' ? '#e53935' : 'transparent',
                  color: activeTab === 'matches' ? '#ffffff' : '#6d6979',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '6px 10px',
                  fontWeight: 700,
                  fontSize: '0.78125rem',
                  cursor: 'pointer',
                  fontFamily: '"Bricolage Grotesque", system-ui, sans-serif',
                  boxShadow: activeTab === 'matches' ? '0 2px 6px rgba(229, 57, 53, 0.3)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <MatchesIcon width={14} height={14} color={activeTab === 'matches' ? '#ffffff' : '#6d6979'} />
                <span>Matches</span>
              </button>
            </div>

            {/* Settings Button */}
            <button
              type="button"
              aria-label="Settings"
              onClick={() => showToast('Settings is in demo mode.')}
              style={{
                background: '#f6f4fa',
                width: '38px',
                height: '38px',
                border: 'none',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <SettingsIcon />
            </button>
          </div>
        </header>

        {/* View Routing: Discover (Default) | Home (Blank) | Matches */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'discover' && (
            <Discover
              onOpenMatches={() => setActiveTab('matches')}
              showToast={showToast}
            />
          )}

          {activeTab === 'home' && <Home />}

          {activeTab === 'matches' && (
            <MatchesView onBackToDiscover={() => setActiveTab('discover')} />
          )}
        </div>
      </main>
    </>
  );
}

export default App;
