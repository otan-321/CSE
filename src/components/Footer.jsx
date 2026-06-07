import { useState } from 'react';
import { Link } from 'react-router-dom';

const colors = {
  bg: "#09090B", surface: "#131315", border: "#27272A",
  textDim: "#8E9192", textMuted: "#C4C7C8", white: "#FFFFFF",
};

function Footer() {
  const currentYear = new Date().getFullYear();
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <footer style={{
        borderTop: `1px solid ${colors.border}`,
        padding: '28px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: colors.surface, flexWrap: 'wrap', gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '22px', height: '22px', border: `1px solid ${colors.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: '8px', height: '8px', background: colors.white, clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />
          </div>
          <span className="ob-font-mono" style={{ fontSize: '10px', color: colors.textDim }}>
            © {currentYear} CSE REVIEWER
          </span>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[
            { to: '/privacy', label: 'Privacy Policy' },
            { to: '/terms', label: 'Terms of Use' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} className="ob-font-mono" style={{
              fontSize: '10px', letterSpacing: '0.08em', color: colors.textDim,
              textDecoration: 'none', transition: 'color 0.15s',
            }}
              onMouseEnter={e => e.target.style.color = colors.white}
              onMouseLeave={e => e.target.style.color = colors.textDim}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={() => setShowAbout(true)}
            className="ob-font-mono"
            style={{
              fontSize: '10px', letterSpacing: '0.08em', color: colors.textDim,
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: 0, transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.target.style.color = colors.white}
            onMouseLeave={e => e.target.style.color = colors.textDim}
          >
            About
          </button>
        </div>
      </footer>

      {showAbout && (
        <div
          onClick={() => setShowAbout(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', padding: '24px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: colors.surface, border: `1px solid ${colors.border}`,
              maxWidth: '480px', width: '100%',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 28px', borderBottom: `1px solid ${colors.border}`,
            }}>
              <p className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.2em', color: colors.textDim, margin: 0 }}>
                // ABOUT
              </p>
              <button onClick={() => setShowAbout(false)} style={{
                background: 'transparent', border: `1px solid ${colors.border}`,
                color: colors.textDim, width: '28px', height: '28px',
                cursor: 'pointer', fontSize: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>×</button>
            </div>

            {/* Content */}
            <div style={{ padding: '28px' }}>
              {[
                {
                  label: 'CSE REVIEWER',
                  value: 'A free Civil Service Exam reviewer for everyone.',
                },
                {
                  label: 'CREATOR',
                  value: 'Otan — concept, direction, and product decisions.',
                },
                {
                  label: 'HOW IT WAS BUILT',
                  value: 'Vibe coded through AI (Claude, ChatGPT). No traditional development — every component was generated through conversation and iteration.',
                },
                {
                  label: 'CONTENT SOURCES',
                  value: 'Questions and study materials are compiled from Philippine CSE review books, mock exams, review centers, social media study groups, and AI-generated content. Not affiliated with the Civil Service Commission.',
                },
                {
                  label: 'STACK',
                  value: 'React · Vite · Tailwind · Vercel',
                },
              ].map(({ label, value }) => (
                <div key={label} style={{ marginBottom: '24px' }}>
                  <p className="ob-font-mono" style={{
                    fontSize: '9px', letterSpacing: '0.2em', color: colors.textDim,
                    textTransform: 'uppercase', marginBottom: '6px',
                  }}>{label}</p>
                  <p className="ob-font-body" style={{
                    fontSize: '13px', color: colors.textMuted,
                    lineHeight: 1.7, margin: 0,
                  }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;
