import { Link, useLocation } from 'react-router-dom';
import { Trophy, BookOpen, History, ClipboardList } from 'lucide-react';
import ExamCountdown from './ExamCountdown';

function Header() {
  const location = useLocation();
  const links = [
    { to: '/', label: 'Home', icon: <BookOpen className="w-3 h-3" /> },
    { to: '/review', label: 'Review', icon: <ClipboardList className="w-3 h-3" /> },
    { to: '/history', label: 'History', icon: <History className="w-3 h-3" /> },
    { to: '/results', label: 'Results', icon: <Trophy className="w-3 h-3" /> },
  ];

  return (
    <header style={{ background: '#0a0a0a', borderBottom: '1px solid #1e1e1e', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo/logo.png" alt="Logo" style={{ width: 26, height: 26, borderRadius: 6 }} />
          <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 15, color: '#fff', letterSpacing: '-0.3px' }}>
            CSE<span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#444', letterSpacing: '0.06em', marginLeft: 6, fontWeight: 400 }}>Reviewer</span>
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="nav-link"
              style={{ color: location.pathname === l.to ? '#fff' : '#444' }}
            >
              {l.icon}
              <span className="hidden sm:inline">{l.label}</span>
            </Link>
          ))}
        </nav>

        {/* Countdown */}
        <ExamCountdown />
      </div>
    </header>
  );
}

export default Header;
