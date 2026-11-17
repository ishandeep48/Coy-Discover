import React, { useState } from 'react';
import './index.css';
import Home from './components/Home';
import Discover from './components/Discover';

const HomeIcon = ({ width = 16, height = 16, color = 'currentColor' }) => (
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

const DiscoverIcon = ({ width = 16, height = 16, color = 'currentColor', filled = false }) => (
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
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1 2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path>
  </svg>
);

function App() {
  // Discover is the initial/default tab
  const [activeTab, setActiveTab] = useState('discover');
  const [toast, setToast] = useState({ show: false, message: '' });
  
  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard!');
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      textarea.style.padding = '4px';
      textarea.style.fontSize = '12px';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showToast('Copied!');
      } catch (e) {
        showToast('Failed to copy');
      }
      document.body.removeChild(textarea);
    }
  };

  const referralCode = "CY4SRJQ";

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          left: '50%',
          bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
          transform: 'translateX(-50%)',
          background: '#15121d',
          color: '#fff',
          width: 'max-content',
          maxWidth: 'calc(100vw - 32px)',
          fontWeight: 600,
          fontSize: '0.875rem',
          zIndex: 40,
          borderRadius: '16px',
          padding: '13px 18px',
          display: 'flex',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
        }}>
          {toast.message}
        </div>
      )}

      <main style={{
        maxWidth: '480px',
        minHeight: '100dvh',
        padding: '0 20px calc(40px + env(safe-area-inset-bottom, 0px))',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        {/* Navigation Bar / Header */}
        <header style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '64px',
          padding: '16px 0 8px',
          display: 'flex',
          gap: '8px'
        }}>
          {/* Logo on the Left */}
          <CoyWordmark onClick={() => setActiveTab('home')} />
          
          {/* Right Area: Side-by-side Home & Discover Buttons + Settings */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Home Button */}
              <button 
                type="button"
                onClick={() => setActiveTab('home')}
                aria-label="Home page"
                aria-current={activeTab === 'home' ? 'page' : undefined}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: activeTab === 'home' ? '#e53935' : '#f6f4fa',
                  color: activeTab === 'home' ? '#ffffff' : '#15121d',
                  border: activeTab === 'home' ? '1.5px solid #b71c1c' : '1.5px solid #ece9f2',
                  borderRadius: '999px',
                  padding: '7px 13px',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  fontFamily: '"Bricolage Grotesque", system-ui, -apple-system, sans-serif',
                  boxShadow: activeTab === 'home' ? '0 2px 6px rgba(229, 57, 53, 0.3)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <HomeIcon width={15} height={15} color={activeTab === 'home' ? '#ffffff' : '#15121d'} />
                <span>Home</span>
              </button>

              {/* Discover Button */}
              <button 
                type="button"
                onClick={() => setActiveTab('discover')}
                aria-label="Discover page"
                aria-current={activeTab === 'discover' ? 'page' : undefined}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: activeTab === 'discover' ? '#e53935' : '#f6f4fa',
                  color: activeTab === 'discover' ? '#ffffff' : '#15121d',
                  border: activeTab === 'discover' ? '1.5px solid #b71c1c' : '1.5px solid #ece9f2',
                  borderRadius: '999px',
                  padding: '7px 13px',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  fontFamily: '"Bricolage Grotesque", system-ui, -apple-system, sans-serif',
                  boxShadow: activeTab === 'discover' ? '0 2px 6px rgba(229, 57, 53, 0.3)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <DiscoverIcon 
                  width={15} 
                  height={15} 
                  color={activeTab === 'discover' ? '#ffffff' : '#15121d'} 
                  filled={activeTab === 'discover'} 
                />
                <span>Discover</span>
              </button>
            </div>

            {/* Settings Button */}
            <button 
              type="button"
              aria-label="Settings"
              onClick={() => showToast('Settings is disabled. This is a demo version.')}
              style={{
                background: '#f6f4fa',
                width: '40px',
                height: '40px',
                border: 'none',
                borderRadius: '50%',
                display: 'grid',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <SettingsIcon />
            </button>
          </div>
        </header>

        {/* Content View: Discover (Default) or Home */}
        {activeTab === 'discover' ? (
          <Discover />
        ) : (
          <Home showToast={showToast} />
        )}
      </main>
    </>
  );
}

export default App;
