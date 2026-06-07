import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ExamCountdown from './ExamCountdown';

const colors = {
  bg: "#09090B", surface: "#131315", border: "#27272A",
  text: "#E5E1E4", textDim: "#8E9192", white: "#FFFFFF",
};

function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/review', label: 'Review' },
    { to: '/history', label: 'History' },
    { to: '/results', label: 'Results' },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: '56px',
        background: 'rgba(9,9,11,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${colors.border}`,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: '26px', height: '26px',
            border: `1px solid ${colors.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '9px', height: '9px',
              background: colors.white,
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
            }} />
          </div>
          <span className="ob-font-display" style={{
            fontWeight: 700, fontSize: '14px', letterSpacing: '-0.02em', color: colors.white,
          }}>
            CSE Reviewer
          </span>
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {navLinks.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} className="ob-font-mono" style={{
                fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em',
                textTransform: 'uppercase', textDecoration: 'none',
                color: active ? colors.white : colors.textDim,
                borderBottom: active ? `1px solid ${colors.white}` : '1px solid transparent',
                paddingBottom: '2px',
                transition: 'color 0.15s',
              }}>
                {label}
              </Link>
            );
          })}
        </div>

        {/* Desktop right — hidden on mobile */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ExamCountdown obsidian />
        </div>

        {/* Mobile hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'transparent', border: `1px solid ${colors.border}`,
            color: colors.white, width: '36px', height: '36px',
            cursor: 'pointer', display: 'none',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', flexShrink: 0,
          }}
        >
          {menuOpen ? '×' : '☰'}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="mobile-menu" style={{
          position: 'fixed', top: '56px', left: 0, right: 0, zIndex: 49,
          background: colors.bg, borderBottom: `1px solid ${colors.border}`,
          padding: '16px 20px', display: 'none', flexDirection: 'column', gap: '4px',
        }}>
          {navLinks.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to}
                onClick={() => setMenuOpen(false)}
                className="ob-font-mono"
                style={{
                  fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase',
                  textDecoration: 'none', padding: '12px 0',
                  color: active ? colors.white : colors.textDim,
                  borderBottom: `1px solid ${colors.border}`,
                }}>
                {label}
              </Link>
            );
          })}
          <div style={{ paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <ExamCountdown obsidian />
            <Link to="/" className="ob-btn-primary"
              onClick={() => setMenuOpen(false)}
              style={{ padding: '10px 20px', textDecoration: 'none', fontSize: '10px' }}>
              START EXAM
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
