import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

/**
 * ProfileCard Component
 * 
 * Displays an individual discover profile with rich imagery, bio, interests,
 * and smooth touch/mouse gesture swipe physics.
 */
function ProfileCard({ profile, onSwipe, disabled }) {
  const [exitDirection, setExitDirection] = useState(null);

  // Motion values for drag position
  const x = useMotionValue(0);
  
  // Dynamic rotation derived from horizontal drag
  const rotate = useTransform(x, [-200, 0, 200], [-18, 0, 18]);

  // Dynamic opacity for LIKE / PASS visual stamp badges
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const passOpacity = useTransform(x, [-20, -100], [0, 1]);

  const handleDragEnd = (event, info) => {
    if (disabled) return;

    const swipeThreshold = 90;
    const velocityThreshold = 400;

    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      setExitDirection('right');
      onSwipe('LIKE');
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      setExitDirection('left');
      onSwipe('PASS');
    }
  };

  return (
    <motion.div
      style={{
        width: '100%',
        maxWidth: '420px',
        height: 'min(580px, 72vh)',
        position: 'relative',
        cursor: disabled ? 'default' : 'grab',
        x,
        rotate,
        touchAction: 'none',
        userSelect: 'none'
      }}
      drag={!disabled ? 'x' : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      animate={
        exitDirection === 'right'
          ? { x: 500, opacity: 0, rotate: 25, transition: { duration: 0.28 } }
          : exitDirection === 'left'
          ? { x: -500, opacity: 0, rotate: -25, transition: { duration: 0.28 } }
          : { scale: 1, opacity: 1 }
      }
      initial={{ scale: 0.96, opacity: 0 }}
      whileTap={{ cursor: 'grabbing' }}
    >
      {/* Outer Card Container */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '26px',
          overflow: 'hidden',
          position: 'relative',
          background: '#15121d',
          boxShadow: '0 12px 36px rgba(21, 18, 29, 0.16)',
          border: '2px solid #15121d',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Profile Image with subtle gradient overlay */}
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img
            src={profile.photo}
            alt={profile.name}
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              pointerEvents: 'none'
            }}
          />

          {/* Dark gradient for text readability */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(21, 18, 29, 0.95) 0%, rgba(21, 18, 29, 0.65) 35%, rgba(21, 18, 29, 0) 65%)',
              pointerEvents: 'none'
            }}
          />

          {/* LIKE Stamp Badge Overlay (When dragging right) */}
          <motion.div
            style={{
              position: 'absolute',
              top: '28px',
              left: '24px',
              border: '3.5px solid #25d366',
              borderRadius: '12px',
              color: '#25d366',
              fontSize: '1.75rem',
              fontWeight: 900,
              padding: '4px 14px',
              transform: 'rotate(-14deg)',
              opacity: likeOpacity,
              letterSpacing: '0.06em',
              background: 'rgba(21, 18, 29, 0.4)',
              pointerEvents: 'none',
              zIndex: 10
            }}
          >
            LIKE
          </motion.div>

          {/* NOPE / PASS Stamp Badge Overlay (When dragging left) */}
          <motion.div
            style={{
              position: 'absolute',
              top: '28px',
              right: '24px',
              border: '3.5px solid #ff3d81',
              borderRadius: '12px',
              color: '#ff3d81',
              fontSize: '1.75rem',
              fontWeight: 900,
              padding: '4px 14px',
              transform: 'rotate(14deg)',
              opacity: passOpacity,
              letterSpacing: '0.06em',
              background: 'rgba(21, 18, 29, 0.4)',
              pointerEvents: 'none',
              zIndex: 10
            }}
          >
            NOPE
          </motion.div>

          {/* Profile Details (Bottom of card) */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '24px 20px',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              zIndex: 5
            }}
          >
            {/* Name & Age */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  fontFamily: '"Bricolage Grotesque", system-ui, sans-serif',
                  lineHeight: 1.1
                }}
              >
                {profile.name}
              </h2>
              <span style={{ fontSize: '1.35rem', fontWeight: 600, opacity: 0.9 }}>
                {profile.age}
              </span>
            </div>

            {/* City or College */}
            {profile.cityOrCollege && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.875rem',
                  color: '#ffe45c',
                  fontWeight: 600
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{profile.cityOrCollege}</span>
              </div>
            )}

            {/* Bio */}
            {profile.bio && (
              <p
                style={{
                  margin: '4px 0 6px 0',
                  fontSize: '0.9375rem',
                  lineHeight: 1.35,
                  opacity: 0.92,
                  color: '#f6f4fa',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {profile.bio}
              </p>
            )}

            {/* Interest Tags */}
            {profile.interests && profile.interests.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  marginTop: '2px'
                }}
              >
                {profile.interests.map((interest, i) => (
                  <span
                    key={i}
                    style={{
                      background: 'rgba(255, 255, 255, 0.18)',
                      backdropFilter: 'blur(6px)',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      border: '1px solid rgba(255, 255, 255, 0.25)'
                    }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProfileCard;
