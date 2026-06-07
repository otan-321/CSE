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
    <nav style={{
      position: 'sticky', top: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', height: '64px',
      background: 'rgba(9,9,11,0.92)', backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${colors.border}`,
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
        <div style={{
          width: '28px', height: '28px',
          border: `1px solid ${colors.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: '10px', height: '10px',
            background: colors.white,
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          }} />
        </div>
        <span className="ob-font-display" style={{
          fontWeight: 700, fontSize: '15px', letterSpacing: '-0.02em', color: colors.white,
        }}>
          CSE Reviewer
        </span>
      </Link>

      {/* Desktop nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        {navLinks.map(({ to, label }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} className="ob-font-mono" style={{
              fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em',
              textTransform: 'uppercase', textDecoration: 'none',
              color: active ? colors.white : colors.textDim,
              borderBottom: active ? `1px solid ${colors.white}` : '1px solid transparent',
              paddingBottom: '2px',
              transition: 'color 0.15s, border-color 0.15s',
            }}>
              {label}
            </Link>
          );
        })}
      </div>

      {/* Right — countdown + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ExamCountdown obsidian />
        <Link to="/" className="ob-btn-primary" style={{ padding: '9px 18px', textDecoration: 'none', fontSize: '10px' }}>
          START EXAM
        </Link>
      </div>
    </nav>
  );
}

export default Header;
