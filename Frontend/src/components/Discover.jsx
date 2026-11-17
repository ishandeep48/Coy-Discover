import React, { useState, useEffect, useCallback } from 'react';
import ProfileCard from './ProfileCard';
import MatchModal from './MatchModal';
import { getFeed, postSwipe, devResetData } from '../api';

/**
 * Discover Component
 * 
 * Main discovery feed featuring card-swiping, desktop controls,
 * mutual match celebration, progress tracking, and resilient error recovery.
 */
function Discover({ onOpenMatches, showToast }) {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMatch, setActiveMatch] = useState(null);

  // Fetch feed on mount
  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFeed();
      setProfiles(data.profiles || []);
      setCurrentIndex(0);
    } catch (err) {
      console.error('Failed to load discover feed:', err);
      setError(err.message || 'Could not connect to the backend server. Make sure it is running on port 5000.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  // Current active profile
  const currentProfile = profiles[currentIndex];
  const remainingCount = profiles.length - currentIndex;

  // Handle Swipe (called either by gesture drag or action button click)
  const handleSwipe = async (action) => {
    if (!currentProfile || isSubmitting) return;

    const targetProfile = currentProfile;
    setIsSubmitting(true);

    try {
      const res = await postSwipe(targetProfile.id, action);

      // Advance to next profile
      setCurrentIndex((prev) => prev + 1);

      // Check if mutual match was formed
      if (res.matched || res.isMatch) {
        setActiveMatch(res.match || { profile: targetProfile });
        if (showToast) {
          showToast(`💖 Mutual Match with ${targetProfile.name}!`);
        }
      }
    } catch (err) {
      console.error('Swipe submission error:', err);
      if (showToast) {
        showToast(err.message || 'Failed to submit swipe. Profile kept in feed.');
      }
      // If error occurred (e.g. network failure), do not permanently advance/lose profile
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset demo data in development mode
  const handleResetDemo = async () => {
    try {
      await devResetData();
      if (showToast) showToast('Reset demo state to initial seed profiles.');
      await loadFeed();
    } catch (err) {
      if (showToast) showToast('Reset failed: ' + err.message);
    }
  };

  return (
    <div
      className="discover-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        minHeight: '75vh',
        justifyContent: 'space-between',
        padding: '8px 0 16px'
      }}
    >
      {/* Top Contextual Bar: Progress / Matches link */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 4px 12px 4px'
        }}
      >
        <span
          style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: '#6d6979',
            background: '#f6f4fa',
            padding: '4px 10px',
            borderRadius: '999px',
            border: '1px solid #ece9f2'
          }}
        >
          {loading
            ? 'Finding profiles...'
            : remainingCount > 0
            ? `${remainingCount} profiles nearby`
            : '0 profiles nearby'}
        </span>

        {onOpenMatches && (
          <button
            type="button"
            onClick={onOpenMatches}
            style={{
              background: '#e7e0ff',
              color: '#15121d',
              border: '1.5px solid #15121d',
              boxShadow: '2px 2px 0 #15121d',
              borderRadius: '999px',
              padding: '5px 12px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: '"Bricolage Grotesque", system-ui, sans-serif'
            }}
          >
            <span>Matches</span>
            <span style={{ fontSize: '1rem' }}>💬</span>
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1
        }}
      >
        {/* Loading Spinner State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6d6979' }}>
            <div style={{ fontSize: '2.5rem', animation: 'pulse 1.2s infinite' }}>⚡️</div>
            <p style={{ fontWeight: 700, fontSize: '1rem', marginTop: '12px', color: '#15121d' }}>
              Finding your potential matches...
            </p>
          </div>
        )}

        {/* Error State with Retry Button */}
        {!loading && error && (
          <div
            style={{
              background: '#ffe4ef',
              border: '2px solid #ff3d81',
              borderRadius: '24px',
              padding: '24px',
              textAlign: 'center',
              maxWidth: '360px',
              color: '#15121d',
              boxShadow: '3px 3px 0 #15121d'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.125rem', fontWeight: 800 }}>Connection Error</h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.875rem', opacity: 0.9 }}>{error}</p>
            <button
              type="button"
              onClick={loadFeed}
              style={{
                background: '#ff3d81',
                color: '#ffffff',
                border: '2px solid #15121d',
                borderRadius: '999px',
                padding: '10px 22px',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: '2px 2px 0 #15121d'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Active Profile Card */}
        {!loading && !error && currentProfile && (
          <ProfileCard
            key={currentProfile.id}
            profile={currentProfile}
            onSwipe={handleSwipe}
            disabled={isSubmitting}
          />
        )}

        {/* Empty State (When all profiles have been swiped) */}
        {!loading && !error && !currentProfile && (
          <div
            style={{
              background: '#f6f4fa',
              border: '2px dashed #cfcadb',
              borderRadius: '28px',
              padding: '40px 24px',
              textAlign: 'center',
              maxWidth: '380px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
              margin: 'auto 0'
            }}
          >
            <span style={{ fontSize: '3.5rem' }}>🤫</span>
            <h3
              style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#15121d',
                fontFamily: '"Bricolage Grotesque", system-ui, sans-serif'
              }}
            >
              You're all caught up!
            </h3>
            <p style={{ margin: 0, fontSize: '0.9375rem', color: '#6d6979', lineHeight: 1.45 }}>
              You have reviewed all available profiles for now. Check back soon for new people around you, or view your matches.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '8px' }}>
              {onOpenMatches && (
                <button
                  type="button"
                  onClick={onOpenMatches}
                  style={{
                    background: '#ff3d81',
                    color: '#ffffff',
                    border: '2px solid #15121d',
                    borderRadius: '999px',
                    padding: '12px 20px',
                    fontWeight: 800,
                    fontSize: '0.9375rem',
                    cursor: 'pointer',
                    boxShadow: '3px 3px 0 #15121d'
                  }}
                >
                  View Mutual Matches
                </button>
              )}

              <button
                type="button"
                onClick={handleResetDemo}
                style={{
                  background: '#ffffff',
                  color: '#15121d',
                  border: '1.5px solid #ece9f2',
                  borderRadius: '999px',
                  padding: '10px 18px',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  cursor: 'pointer'
                }}
              >
                🔄 Reset Demo Data (Start Over)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop & Touch Action Controls (PASS & LIKE Buttons) */}
      {!loading && !error && currentProfile && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '28px',
            width: '100%',
            paddingTop: '16px'
          }}
        >
          {/* PASS BUTTON (Left) */}
          <button
            type="button"
            onClick={() => handleSwipe('PASS')}
            disabled={isSubmitting}
            aria-label="Pass Profile"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '2.5px solid #15121d',
              boxShadow: '3px 3px 0 #15121d',
              display: 'grid',
              placeItems: 'center',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              color: '#6d6979',
              fontSize: '1.5rem',
              fontWeight: 800,
              opacity: isSubmitting ? 0.6 : 1,
              transition: 'transform 0.1s ease, background 0.15s ease'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            ✕
          </button>

          {/* LIKE BUTTON (Right) */}
          <button
            type="button"
            onClick={() => handleSwipe('LIKE')}
            disabled={isSubmitting}
            aria-label="Like Profile"
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#ff3d81',
              border: '2.5px solid #15121d',
              boxShadow: '4px 4px 0 #15121d',
              display: 'grid',
              placeItems: 'center',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              color: '#ffffff',
              fontSize: '2rem',
              opacity: isSubmitting ? 0.6 : 1,
              transition: 'transform 0.1s ease'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            💖
          </button>
        </div>
      )}

      {/* Match Celebration Modal */}
      {activeMatch && (
        <MatchModal
          match={activeMatch}
          onClose={() => setActiveMatch(null)}
          onViewMatches={() => {
            setActiveMatch(null);
            if (onOpenMatches) onOpenMatches();
          }}
        />
      )}
    </div>
  );
}

export default Discover;
