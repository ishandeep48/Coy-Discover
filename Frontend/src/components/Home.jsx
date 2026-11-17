import React from 'react';

/**
 * Home Component
 * 
 * Clean blank placeholder as specified by the requirements.
 */
function Home() {
  return (
    <div 
      className="home-placeholder" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '32px 16px',
        textAlign: 'center',
        color: '#6d6979'
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '12px' }} aria-hidden="true">🏠</div>
      <h2 style={{ fontSize: '1.25rem', color: '#15121d', margin: '0 0 8px 0', fontWeight: 700 }}>Home</h2>
      <p style={{ margin: 0, fontSize: '0.875rem', maxWidth: '280px', opacity: 0.8 }}>
        Home screen placeholder. Switch to the Discover tab to explore profiles.
      </p>
    </div>
  );
}

export default Home;
