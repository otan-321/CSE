import { Link } from 'react-router-dom';

const colors = {
  surface: "#131315", border: "#27272A",
  textDim: "#8E9192", white: "#FFFFFF",
};

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
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
          © {currentYear} CSE REVIEWER · BUILT FOR FILIPINOS · FREE FOREVER
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
      </div>
    </footer>
  );
}

export default Footer;
