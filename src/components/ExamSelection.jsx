import { Link } from 'react-router-dom';

const C = {
  surfaceLow: '#1C1B1D', surfaceHigh: '#2A2A2C',
  border: '#27272A', textDim: '#8E9192', textMuted: '#C4C7C8', white: '#FFFFFF',
};

const exams = [
  { id: 'professional',    tag: 'ADVANCED',      title: 'Professional Level',  desc: 'For college graduates. Full exam simulation.',  items: 170, duration: '3.5 HRS' },
  { id: 'subprofessional', tag: 'INTERMEDIATE',  title: 'Sub-Professional',    desc: 'For non-college graduates.',                   items: 165, duration: '2.5 HRS' },
  { id: 'practice',        tag: 'ALL LEVELS',    title: 'Quick Practice',      desc: '60-item mixed practice test.',                 items: 60,  duration: '30 MIN' },
];

function ExamSelection() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1px', background: C.border }}>
      {exams.map(({ id, tag, title, desc, items, duration }) => (
        <Link key={id} to={`/exam/${id}`} style={{ textDecoration: 'none' }}>
          <div
            style={{
              background: C.surfaceLow, padding: '28px 24px',
              cursor: 'pointer', transition: 'background 0.15s, border-top-color 0.15s',
              borderTop: '2px solid transparent',
              height: '100%',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = C.surfaceHigh;
              e.currentTarget.style.borderTopColor = C.white;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = C.surfaceLow;
              e.currentTarget.style.borderTopColor = 'transparent';
            }}
          >
            <p className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.15em', color: C.textDim, marginBottom: '14px' }}>{tag}</p>
            <h3 className="ob-font-display" style={{ fontSize: '18px', fontWeight: 700, color: C.white, marginBottom: '8px' }}>{title}</h3>
            <p className="ob-font-body" style={{ fontSize: '13px', color: C.textMuted, marginBottom: '20px', lineHeight: 1.6 }}>{desc}</p>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              {[['ITEMS', items], ['DURATION', duration]].map(([k, v]) => (
                <div key={k}>
                  <p className="ob-font-mono" style={{ fontSize: '9px', color: C.textDim, letterSpacing: '0.12em' }}>{k}</p>
                  <p className="ob-font-display" style={{ fontSize: '20px', fontWeight: 700, color: C.white }}>{v}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: C.white }}>
              <span className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>START EXAM</span>
              <span>→</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ExamSelection;
