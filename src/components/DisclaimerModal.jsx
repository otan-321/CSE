const C = {
  bg: '#09090B', surface: '#131315', surfaceLow: '#1C1B1D',
  border: '#27272A', borderHover: '#3F3F46',
  text: '#E5E1E4', textMuted: '#C4C7C8', textDim: '#8E9192',
  white: '#FFFFFF',
};

export default function DisclaimerModal({ onAccept, onClose }) {
  return (
    <div onClick={e => e.stopPropagation()} style={{
      background: C.surface, border: `1px solid ${C.border}`,
      maxWidth: '420px', width: '100%', padding: '32px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px', height: '44px', background: C.surfaceLow,
            border: `1px solid ${C.border}`, display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0,
          }}>⚠</div>
          <div>
            <h2 className="ob-font-display" style={{ fontSize: '20px', fontWeight: 700, color: C.white, margin: 0, letterSpacing: '-0.02em' }}>
              Important Disclaimer
            </h2>
            <p className="ob-font-mono" style={{ fontSize: '10px', color: C.textDim, letterSpacing: '0.12em', marginTop: '4px' }}>
              PLEASE READ BEFORE PROCEEDING
            </p>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: 'transparent', border: `1px solid ${C.border}`,
          color: C.textDim, width: '32px', height: '32px',
          cursor: 'pointer', fontSize: '16px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>×</button>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: C.border, marginBottom: '24px' }} />

      {/* Warning box */}
      <div style={{
        border: `1px solid #3D2E00`,
        background: '#1A1400',
        padding: '20px',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>⚠</span>
          <div>
            <p className="ob-font-mono" style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#F59E0B', marginBottom: '8px', fontWeight: 700 }}>
              UNOFFICIAL MOCK EXAM / REVIEWER TOOL
            </p>
            <p className="ob-font-body" style={{ fontSize: '13px', color: C.textMuted, lineHeight: 1.7, margin: 0 }}>
              Always refer to the{' '}
              <a href="https://csc.gov.ph" target="_blank" rel="noopener noreferrer"
                style={{ color: '#F59E0B', fontWeight: 600, textDecoration: 'underline' }}>
                official Civil Service Commission website
              </a>{' '}
              for the most accurate and up-to-date information regarding the Civil Service Examination.
            </p>
          </div>
        </div>
      </div>

      {/* Source note */}
      <div style={{
        border: `1px solid ${C.border}`,
        background: C.surfaceLow,
        padding: '16px',
        marginBottom: '24px',
      }}>
        <p className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.1em', color: C.textDim, marginBottom: '6px' }}>
          // QUESTION SOURCES
        </p>
        <p className="ob-font-body" style={{ fontSize: '12px', color: C.textMuted, lineHeight: 1.7, margin: 0 }}>
          Questions are compiled from AI-generated content (Gemini, DeepSeek, ChatGPT), CSE review centers, social media study groups, and old reviewer books. Some may have inconsistencies.
        </p>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        <a href="https://csc.gov.ph" target="_blank" rel="noopener noreferrer" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '14px', border: `1px solid ${C.borderHover}`,
          background: 'transparent', color: C.text,
          fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          textDecoration: 'none', letterSpacing: '0.04em',
        }}>
          🌐 Visit Official CSC Website
        </a>
        <button onClick={onAccept} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '14px', border: 'none',
          background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
          color: '#fff', fontSize: '13px', fontWeight: 700,
          cursor: 'pointer', letterSpacing: '0.04em',
        }}>
          ✅ I Understand &amp; Accept
        </button>
      </div>

      {/* Fine print */}
      <p className="ob-font-mono" style={{ fontSize: '10px', color: C.textDim, textAlign: 'center', letterSpacing: '0.06em', lineHeight: 1.6 }}>
        By clicking "I Understand &amp; Accept", you acknowledge that you have read and understood this disclaimer.
      </p>
    </div>
  );
}
