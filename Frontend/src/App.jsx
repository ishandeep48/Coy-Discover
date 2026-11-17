import React, { useState } from 'react';
import './index.css'

const CoyWordmark = () => (
  <div style={{
    display: 'inline-flex',
    alignItems: 'baseline',
    fontFamily: '"Bricolage Grotesque", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    fontWeight: 800,
    fontSize: '1.75rem',
    letterSpacing: '-0.04em',
    color: '#15121d',
    textDecoration: 'none'
  }}>
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
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path>
  </svg>
);

function App() {
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
          bottom: '20px',
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
          display: 'flex'
        }}>
          {toast.message}
        </div>
      )}

      <main style={{
        maxWidth: '480px',
        minHeight: '100dvh',
        padding: '0 20px calc(40px + env(safe-area-inset-bottom))',
        paddingTop: 'env(safe-area-inset-top)',
        margin: '0 auto'
      }}>
        {/* Header */}
        <header style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '64px',
          padding: '16px 0 8px',
          display: 'flex'
        }}>
          <CoyWordmark />
          <button 
            aria-label="Settings"
            style={{
              background: '#f6f4fa',
              width: '44px',
              height: '44px',
              border: 'none',
              borderRadius: '50%',
              display: 'grid',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SettingsIcon />
          </button>
        </header>

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
              href="https://wa.me/?text=Someone%20in%20this%20group%20might%20have%20a%20crush%20on%20you%20%E2%9C%90%20On%20Coy%20you%20add%20your%20crushes%20secretly.%20If%20it%27s%20mutual%2C%20you%20both%20find%20out.%20Nobody%20else%20ever%20does.%20https%3A%2F%2Fapp.getcoy.com%2Fi%2Fcy4srjq" 
              target="_blank" 
              rel="noopener"
              style={{
                border: '2px solid #15121d',
                minHeight: '42px',
                background: '#fff',
                color: '#15121d',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                borderRadius: '999px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                padding: '0 16px',
                textDecoration: 'none',
                boxShadow: '3px 3px 0 #15121d'
              }}
            >
              Invite friends
            </a>
          </div>
        </div>

        {/* Nudge Section */}
        <button 
          type="button" 
          onClick={() => showToast('Email feature coming soon!')}
          style={{
            border: '2px solid #ece9f2',
            background: '#fff',
            textAlign: 'left',
            cursor: 'pointer',
            width: '100%',
            color: '#15121d',
            borderRadius: '18px',
            alignItems: 'center',
            gap: '12px',
            marginTop: '14px',
            padding: '12px 14px',
            display: 'flex'
          }}
        >
          <span aria-hidden="true" style={{
            background: '#d7ecff',
            borderRadius: '12px',
            flex: 'none',
            placeItems: 'center',
            width: '42px',
            height: '42px',
            fontSize: '1.2rem'
          }}>📧</span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <strong>Add your email</strong>
            <span style={{ display: 'block' }}>So people who only have your email can find you.</span>
          </div>
          <span style={{ color: '#d81e63', fontWeight: 750 }}>Add</span>
        </button>

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

          <ul style={{ gap: '10px', margin: 0, padding: 0, display: 'grid' }}>
            <li style={{
              background: '#f6f4fa',
              borderRadius: '18px',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 12px 12px 14px',
              display: 'flex'
            }}>
              <span style={{
                width: '46px',
                height: '46px',
                fontFamily: '"Bricolage Grotesque", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                fontWeight: 750,
                fontSize: '1.125rem',
                lineHeight: 1,
                color: '#15121d',
                background: '#e7e0ff',
                borderRadius: '50%',
                display: 'grid',
                alignItems: 'center',
                justifyContent: 'center'
              }}>M</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ fontSize: '1rem' }}>Me Me Me</strong>
                <span style={{ 
                  fontSize: '0.875rem', 
                  color: '#6d6979',
                  display: 'block' 
                }}>
                  +91 84342 11577
                  <span style={{ display: 'block' }}>ishandeep47@gmail.com</span>
                </span>
              </div>
            </li>
            <li>
              <button 
                onClick={() => showToast('Add crush feature coming soon!')}
                style={{
                  background: '#fff',
                  width: '100%',
                  color: '#15121d',
                  textAlign: 'left',
                  border: '2px dashed #cfcadb',
                  borderRadius: '18px',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 14px',
                  textDecoration: 'none',
                  display: 'flex'
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
                  display: 'grid'
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
              color: '#6d6979'
            }}>They get an anonymous heads-up right away. Never who.</p>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); showToast('Upgrade feature coming soon!'); }}
              style={{
                color: '#d81e63',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'underline',
                margin: '-8px -4px',
                padding: '8px 4px'
              }}
            >More slots</a>
          </div>
        </section>

        {/* Refer Section */}
        <section style={{
          border: '2px solid #15121d',
          background: '#cbf4e0',
          boxShadow: '3px 3px 0 #15121d',
          borderRadius: '22px',
          marginTop: '26px',
          padding: '18px'
        }}>
          <div style={{ alignItems: 'flex-start', gap: '12px', display: 'flex' }}>
            <span aria-hidden="true" style={{
              background: '#fff',
              borderRadius: '12px',
              flex: 'none',
              placeItems: 'center',
              width: '42px',
              height: '42px',
              fontSize: '1.3rem'
            }}>🎁</span>
            <div style={{ minWidth: 0 }}>
              <strong style={{ 
                fontSize: '1.1875rem', 
                lineHeight: '1.2', 
                display: 'block' 
              }}>Get a slot free</strong>
              <span style={{ 
                fontSize: '0.875rem', 
                opacity: 0.8, 
                marginTop: '2px', 
                lineHeight: '1.4',
                display: 'block'
              }}>Invite 3 friends. When 3 join and add a crush, you get a slot.</span>
            </div>
          </div>

          <div style={{
            alignItems: 'center',
            gap: '6px',
            marginTop: '16px',
            display: 'flex'
          }}>
            {[...Array(3)].map((_, i) => (
              <span key={i} style={{
                background: '#fff',
                border: '2px solid #15121d',
                borderRadius: '999px',
                flex: 1,
                height: '10px'
              }}></span>
            ))}
            <span style={{
              fontWeight: 750,
              fontSize: '0.875rem'
            }}>0/3</span>
          </div>

          <div style={{
            border: '2px solid #15121d',
            background: '#fff',
            borderRadius: '18px',
            marginTop: '16px',
            padding: '16px'
          }}>
            <div style={{ borderBottom: '2px dashed #ece9f2', paddingBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <div>
                <span style={{ 
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#6d6979',
                  display: 'block'
                }}>Your referral code</span>
                <strong style={{ 
                  fontSize: '2rem',
                  letterSpacing: '0.06em',
                  color: '#d81e63',
                  overflowWrap: 'anywhere',
                  marginTop: '8px',
                  display: 'block'
                }}>{referralCode}</strong>
              </div>
              <button 
                onClick={() => copyToClipboard(referralCode)}
                style={{
                  border: '2px solid #15121d',
                  background: '#ffe4ef',
                  width: '48px',
                  height: '48px',
                  color: '#15121d',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  display: 'grid',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="9" y="9" width="12" height="12" rx="2.5"></rect>
                  <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5"></path>
                </svg>
              </button>
            </div>

            <div style={{ gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px', display: 'grid' }}>
              <button 
                onClick={() => {
                  const url = `https://app.getcoy.com/?ref=${referralCode}`;
                  copyToClipboard(url);
                }}
                style={{
                  background: '#fff',
                  minHeight: '42px',
                  color: '#15121d',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  borderRadius: '999px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0 12px',
                  textDecoration: 'none',
                  display: 'inline-flex'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3.2-3.2a4.5 4.5 0 0 0-6.4-6.4L12 5.6"></path>
                  <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3.2 3.2a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"></path>
                </svg>
                <span>Copy link</span>
              </button>
              <a 
                href={`https://wa.me/?text=Check%20out%20this%20app!%20My%20referral%20code%20is%20${encodeURIComponent(referralCode)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  background: '#fff',
                  minHeight: '42px',
                  color: '#15121d',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  borderRadius: '999px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0 12px',
                  textDecoration: 'none',
                  display: 'inline-flex'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3.2-3.2a4.5 4.5 0 0 0-6.4-6.4L12 5.6"></path>
                  <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3.2 3.2a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"></path>
                </svg>
                <span>Share link</span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
