import React, { useState, useEffect } from 'react';
import { getMatches } from '../api';

/**
 * MatchesView Component
 * 
 * Displays all confirmed mutual matches for the logged-in user.
 */
function MatchesView({ onBackToDiscover }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMatches();
      setMatches(res.matches || []);
    } catch (err) {
      console.error('Failed to load matches:', err);
      setError(err.message || 'Unable to load matches. Please check the backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  return (
    <div className="matches-view" style={{ width: '100%', padding: '8px 0 24px' }}>
      {/* Header bar within matches view */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#15121d', fontFamily: '"Bricolage Grotesque", system-ui, sans-serif' }}>
            Mutual Matches
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: '0.875rem', color: '#6d6979' }}>
            People who liked you back on Coy
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToDiscover}
          style={{
            background: '#ffe4ef',
            color: '#d81e63',
            border: '1.5px solid #ff3d81',
            borderRadius: '999px',
            padding: '6px 14px',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: '"Bricolage Grotesque", system-ui, sans-serif'
          }}
        >
          ← Discover
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '48px 16px', color: '#6d6979' }}>
          <div style={{ fontSize: '2rem', animation: 'pulse 1s infinite' }}>💜</div>
          <p style={{ fontWeight: 600, fontSize: '0.9375rem', marginTop: '8px' }}>Loading matches...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div
          style={{
            background: '#ffe4ef',
            border: '2px solid #ff3d81',
            borderRadius: '20px',
            padding: '20px',
            textAlign: 'center',
            color: '#15121d',
            margin: '20px 0'
          }}
        >
          <p style={{ fontWeight: 700, margin: '0 0 10px', color: '#d81e63' }}>{error}</p>
          <button
            type="button"
            onClick={loadMatches}
            style={{
              background: '#ff3d81',
              color: '#ffffff',
              border: 'none',
              borderRadius: '999px',
              padding: '8px 18px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && matches.length === 0 && (
        <div
          style={{
            background: '#f6f4fa',
            border: '2px dashed #ece9f2',
            borderRadius: '24px',
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            margin: '16px 0'
          }}
        >
          <span style={{ fontSize: '3rem' }}>🤫</span>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#15121d' }}>
            No mutual matches yet
          </h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6d6979', maxWidth: '280px', lineHeight: 1.4 }}>
            Keep swiping on the Discover tab! When someone you liked likes you back, they will appear here.
          </p>
          <button
            type="button"
            onClick={onBackToDiscover}
            style={{
              marginTop: '8px',
              background: '#ff3d81',
              color: '#ffffff',
              border: '2px solid #15121d',
              borderRadius: '999px',
              padding: '10px 20px',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: '2px 2px 0 #15121d'
            }}
          >
            Start Swiping
          </button>
        </div>
      )}

      {/* Matches Grid */}
      {!loading && !error && matches.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
          {matches.map((item) => {
            const p = item.profile;
            return (
              <div
                key={item.id}
                style={{
                  background: '#ffffff',
                  border: '2px solid #15121d',
                  borderRadius: '20px',
                  boxShadow: '3px 3px 0 #15121d',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Photo */}
                <div style={{ height: '170px', width: '100%', position: 'relative' }}>
                  <img
                    src={p.photo}
                    alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      background: 'rgba(21, 18, 29, 0.75)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px'
                    }}
                  >
                    Matched! 💖
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#15121d' }}>
                      {p.name}
                    </h4>
                    <span style={{ fontSize: '0.875rem', color: '#6d6979', fontWeight: 600 }}>
                      {p.age}
                    </span>
                  </div>

                  {p.cityOrCollege && (
                    <span style={{ fontSize: '0.75rem', color: '#6d6979', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      📍 {p.cityOrCollege}
                    </span>
                  )}

                  {p.bio && (
                    <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: '#15121d', opacity: 0.85, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {p.bio}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MatchesView;
