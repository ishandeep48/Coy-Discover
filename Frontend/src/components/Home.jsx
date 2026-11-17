import React from 'react';

/**
 * Home Component
 * 
 * Existing Home page content containing the status card and your crushes section.
 */
function Home({ showToast }) {
  return (
    <div className="home-page">
      {/* Status Section */}
      <div style={{
        background: '#e7e0ff',
        border: '2px solid #15121d',
        boxShadow: '4px 4px 0 #15121d',
        borderRadius: '26px',
        marginTop: '8px',
        padding: '22px 20px'
      }}>
        <div style={{ fontSize: '2.25rem', lineHeight: '1' }} aria-hidden="true">🤫</div>
        <h1 style={{
          marginTop: '12px',
          fontSize: '1.875rem',
          lineHeight: '1.08',
          color: '#15121d',
          margin: 0
        }}>No one has added you yet</h1>
        <p style={{
          marginTop: '8px',
          fontSize: '1.1875rem',
          color: '#15121d',
          opacity: 0.75
        }}>Invite friends so your crush can join too.</p>
        <div style={{
          marginTop: '18px',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '14px'
        }}>
          <a 
            href="#"
            onClick={(e) => { e.preventDefault(); showToast && showToast('Invite friends is disabled. This is a demo version.'); }}
            style={{
              border: '2px dashed #cfcadb',
              minHeight: '42px',
              background: '#fff',
              color: '#9ca3af',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'not-allowed',
              borderRadius: '999px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              padding: '0 16px',
              textDecoration: 'none',
              opacity: 0.5,
              display: 'inline-flex'
            }}
          >
            Invite friends
          </a>
        </div>
      </div>

      {/* Your Crushes Section */}
      <section style={{ padding: '28px 0 0' }}>
        <div style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          display: 'flex'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.1875rem' }}>Your crushes</h2>
          <span style={{
            fontWeight: 700,
            fontSize: '0.875rem',
            background: '#f6f4fa',
            color: '#6d6979',
            borderRadius: '999px',
            padding: '7px 11px'
          }}>1/3</span>
        </div>

        <ul style={{ gap: '10px', margin: 0, padding: 0, display: 'grid', listStyle: 'none' }}>
          {/* Demo mode - Add button disabled */}
          <li>
            <button 
              disabled
              onClick={() => showToast && showToast('Add crush is disabled. This is a demo version.')}
              style={{
                background: '#fff',
                width: '100%',
                color: '#9ca3af',
                textAlign: 'left',
                border: '2px dashed #cfcadb',
                borderRadius: '18px',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 14px',
                textDecoration: 'none',
                display: 'flex',
                opacity: 0.5,
                cursor: 'not-allowed'
              }}
            >
              <span style={{
                background: '#ff3d81',
                border: '2px solid #15121d',
                borderRadius: '50%',
                placeItems: 'center',
                width: '46px',
                height: '46px',
                fontSize: '1.5rem',
                fontWeight: 600,
                display: 'grid',
                color: '#fff'
              }}>+</span>
              <span>Add a crush</span>
            </button>
          </li>
        </ul>

        <div style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          marginTop: '14px',
          display: 'flex'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#6d6979',
            margin: 0
          }}>They get an anonymous heads-up right away. Never who.</p>
          <a 
            href="#"
            onClick={(e) => { e.preventDefault(); showToast && showToast('Upgrade feature is disabled. This is a demo version.'); }}
            style={{
              color: '#9ca3af',
              fontWeight: 700,
              fontSize: '0.875rem',
              textDecoration: 'underline',
              margin: '-8px -4px',
              padding: '8px 4px',
              opacity: 0.5,
              cursor: 'not-allowed',
              whiteSpace: 'nowrap'
            }}
          >More slots</a>
        </div>
      </section>
    </div>
  );
}

export default Home;
