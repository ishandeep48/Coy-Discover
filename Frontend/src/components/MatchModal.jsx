import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CURRENT_USER_PROFILE } from '../api';

/**
 * MatchModal Component
 * 
 * Celebration overlay modal rendered exclusively when the backend confirms a mutual match.
 */
function MatchModal({ match, onClose, onViewMatches }) {
  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (_) {
      // Safe fallback if canvas is unavailable
    }
  }, []);

  if (!match || !match.profile) return null;

  const matchedProfile = match.profile;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mutual Match Celebration"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(21, 18, 29, 0.88)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '32px',
          border: '3px solid #15121d',
          boxShadow: '6px 6px 0 #15121d',
          padding: '36px 24px',
          maxWidth: '380px',
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '18px'
        }}
      >
        {/* Heart icon badge */}
        <div
          style={{
            background: '#ffe4ef',
            color: '#ff3d81',
            borderRadius: '50%',
            width: '64px',
            height: '64px',
            display: 'grid',
            placeItems: 'center',
            fontSize: '2rem',
            border: '2px solid #ff3d81',
            boxShadow: '2px 2px 0 #15121d'
          }}
        >
          💖
        </div>

        <div>
          <h2
            style={{
              margin: '0 0 6px 0',
              fontFamily: '"Bricolage Grotesque", system-ui, sans-serif',
              fontWeight: 800,
              fontSize: '2rem',
              color: '#15121d',
              letterSpacing: '-0.03em'
            }}
          >
            It's a Match!
          </h2>
          <p style={{ margin: 0, color: '#6d6979', fontSize: '0.9375rem', fontWeight: 500 }}>
            You and <strong style={{ color: '#15121d' }}>{matchedProfile.name}</strong> liked each other!
          </p>
        </div>

        {/* Dual Avatars (You + Matched Profile) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', margin: '8px 0' }}>
          {/* User 1: Current User */}
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid #ff3d81',
              boxShadow: '3px 3px 0 #15121d',
              position: 'relative',
              zIndex: 2,
              transform: 'translateX(10px)'
            }}
          >
            <img
              src={CURRENT_USER_PROFILE.photo}
              alt="You"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* User 2: Matched Profile */}
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid #25d366',
              boxShadow: '3px 3px 0 #15121d',
              position: 'relative',
              zIndex: 1,
              transform: 'translateX(-10px)'
            }}
          >
            <img
              src={matchedProfile.photo}
              alt={matchedProfile.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '6px' }}>
          <button
            type="button"
            onClick={onViewMatches}
            style={{
              background: '#ff3d81',
              color: '#ffffff',
              border: '2px solid #15121d',
              borderRadius: '999px',
              padding: '13px 20px',
              fontWeight: 800,
              fontSize: '0.9375rem',
              cursor: 'pointer',
              fontFamily: '"Bricolage Grotesque", system-ui, sans-serif',
              boxShadow: '3px 3px 0 #15121d',
              transition: 'transform 0.1s ease'
            }}
          >
            View in Matches
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f6f4fa',
              color: '#15121d',
              border: '2px solid #15121d',
              borderRadius: '999px',
              padding: '12px 20px',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              fontFamily: '"Bricolage Grotesque", system-ui, sans-serif'
            }}
          >
            Keep Swiping
          </button>
        </div>
      </div>
    </div>
  );
}

export default MatchModal;
