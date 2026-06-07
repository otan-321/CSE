import { Link } from 'react-router-dom';

const C = {
  bg: '#09090B', surface: '#131315', surfaceLow: '#1C1B1D',
  border: '#27272A', text: '#E5E1E4', textMuted: '#C4C7C8',
  textDim: '#8E9192', white: '#FFFFFF',
};

const sections = [
  {
    tag: '01',
    title: 'What This Is',
    body: 'CSE Reviewer is a free, independent practice platform for the Philippine Civil Service Examination. It is not affiliated with, endorsed by, or connected to the Civil Service Commission (CSC) or any government agency. Use it to practice — not as your only source.',
  },
  {
    tag: '02',
    title: 'Where the Content Comes From',
    body: 'Questions and study materials are compiled from Philippine CSE review books, old reviewer materials, mock exams, online study groups, social media communities, and AI-generated content (Claude, ChatGPT, Gemini, DeepSeek). Some answers may have inconsistencies. Always verify with official sources.',
  },
  {
    tag: '03',
    title: 'How It Was Built',
    body: 'This site was imagined and directed by Otan. It was built entirely through vibe coding — using AI tools (Claude AI and ChatGPT) to generate every component, design, and feature based on instructions and ideas. No traditional development background was required.',
  },
  {
    tag: '04',
    title: 'Your Responsibility',
    body: 'This is a supplementary study tool. Your score here does not predict your actual CSE result. Use multiple sources to prepare. All your data (scores, history) is stored locally on your browser and may be lost if you clear your browser data.',
  },
  {
    tag: '05',
    title: 'No Warranties',
    body: 'This platform is provided as-is. The creator is not liable for any inaccuracies in questions or answers, your performance on the actual exam, or any technical issues you encounter. For official information, always refer to the Civil Service Commission website at csc.gov.ph.',
  },
  {
    tag: '06',
    title: 'Content Removal',
    body: 'If you are a content owner and believe specific material should be removed, reach out and we will address it promptly.',
  },
  {
    tag: '07',
    title: 'Updates',
    body: 'These terms may be updated at any time without prior notice. Continued use of the platform means you accept any changes.',
  },
];

function TermsOfUse() {
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
          // TERMS OF USE
        </p>
        <h1 className="ob-font-display" style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', color: C.white, marginBottom: '8px' }}>
          Straight to the Point.
        </h1>
        <p className="ob-font-mono" style={{ fontSize: '10px', color: C.textDim, marginBottom: '48px' }}>
          Effective: {new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
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
            For official CSE information visit{' '}
            <a href="https://www.csc.gov.ph" target="_blank" rel="noopener noreferrer"
              style={{ color: C.white, textDecoration: 'none' }}>
              csc.gov.ph
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}

export default TermsOfUse;
