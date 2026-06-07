import { Link } from 'react-router-dom';

const C = {
  bg: '#09090B', surface: '#131315', surfaceLow: '#1C1B1D',
  border: '#27272A', text: '#E5E1E4', textMuted: '#C4C7C8',
  textDim: '#8E9192', white: '#FFFFFF',
};

const sections = [
  {
    tag: '01',
    title: 'No Data Collection',
    body: 'CSE Reviewer does not collect any personal information. No name, email, phone number, or any identifying data is ever asked for or stored on our end. You are completely anonymous here.',
  },
  {
    tag: '02',
    title: 'Your Data Stays on Your Device',
    body: 'Everything — your exam scores, study progress, and history — is stored locally in your browser. It never leaves your device and is never sent to any server. If you clear your browser data, it is gone.',
  },
  {
    tag: '03',
    title: 'No Tracking, No Ads',
    body: 'There are no third-party trackers, no analytics scripts, no advertising networks, and no cookies used for tracking. This site does not monitor your behavior in any way.',
  },
  {
    tag: '04',
    title: 'Your Rights',
    body: 'You can delete all your data anytime by clearing your browser storage. You can use this site without any account. You are always in full control of whatever is stored on your device.',
  },
  {
    tag: '05',
    title: 'Changes',
    body: 'If anything about this policy changes, the date at the top of this page will be updated. Continued use of the site means you are okay with any updates.',
  },
];

function PrivacyPolicy() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', padding: '64px 24px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Back */}
        <Link to="/" className="ob-font-mono" style={{
          fontSize: '10px', letterSpacing: '0.15em', color: C.textDim,
          textDecoration: 'none', textTransform: 'uppercase', display: 'inline-block', marginBottom: '48px',
        }}>← Back</Link>

        {/* Header */}
        <p className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.2em', color: C.textDim, textTransform: 'uppercase', marginBottom: '8px' }}>
          // PRIVACY POLICY
        </p>
        <h1 className="ob-font-display" style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', color: C.white, marginBottom: '8px' }}>
          Your Privacy Matters.
        </h1>
        <p className="ob-font-mono" style={{ fontSize: '10px', color: C.textDim, marginBottom: '48px' }}>
          Last updated: {new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: C.border }}>
          {sections.map(({ tag, title, body }) => (
            <div key={tag} style={{ background: C.surface, padding: '28px 24px', display: 'flex', gap: '24px' }}>
              <span className="ob-font-mono" style={{ fontSize: '10px', color: C.textDim, flexShrink: 0, paddingTop: '3px' }}>{tag}</span>
              <div>
                <h2 className="ob-font-display" style={{ fontSize: '15px', fontWeight: 700, color: C.white, marginBottom: '8px' }}>{title}</h2>
                <p className="ob-font-body" style={{ fontSize: '13px', color: C.textMuted, lineHeight: 1.8, margin: 0 }}>{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{ marginTop: '48px', borderTop: `1px solid ${C.border}`, paddingTop: '24px' }}>
          <p className="ob-font-mono" style={{ fontSize: '10px', color: C.textDim, lineHeight: 1.8 }}>
            CSE Reviewer is not affiliated with the Civil Service Commission of the Philippines.
            This is an independent project built to help Filipinos prepare for the CSE.
          </p>
        </div>

      </div>
    </div>
  );
}

export default PrivacyPolicy;
