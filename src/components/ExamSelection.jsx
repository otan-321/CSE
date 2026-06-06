import { Link } from 'react-router-dom';
import { ClipboardCheck, Users, Clock, TrendingUp } from 'lucide-react';

function ExamSelection() {
  const C = { bg3: '#111', border: '#1e1e1e', text: '#fff', muted: '#555', dim: '#333', mono: "'IBM Plex Mono', monospace", font: "'DM Serif Display', Georgia, serif" };
  const exams = [
    { id: 'professional',    title: 'Professional Level',    desc: 'For college graduates. 170 items, 3.5 hours duration.',           items: '170 items', dur: '3.5 hrs', diff: 'Advanced',     accent: '#3b82f6', icon: <ClipboardCheck className="w-5 h-5" /> },
    { id: 'subprofessional', title: 'Sub-Professional',      desc: 'For non-college graduates. 165 items, 2.5 hours.',                items: '165 items', dur: '2.5 hrs', diff: 'Intermediate', accent: '#22c55e', icon: <Users className="w-5 h-5" /> },
    { id: 'practice',        title: 'Quick Practice',        desc: '60-item practice test from both levels. 30 minutes.',            items: '60 items',  dur: '30 mins', diff: 'All Levels',  accent: '#8b5cf6', icon: <TrendingUp className="w-5 h-5" /> },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
      {exams.map((e) => (
        <Link key={e.id} to={`/exam/${e.id}`} style={{ textDecoration: 'none' }}>
          <div className="dark-card" style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, cursor: 'pointer', height: '100%' }}
            onMouseEnter={(ev) => (ev.currentTarget.style.borderColor = e.accent)}
            onMouseLeave={(ev) => (ev.currentTarget.style.borderColor = C.border)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ color: e.accent }}>{e.icon}</div>
              <span style={{ fontFamily: C.mono, fontSize: 9, color: e.accent, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>{e.diff}</span>
            </div>
            <h3 style={{ fontFamily: C.font, color: C.text, fontSize: 17, fontWeight: 400, margin: '0 0 8px', letterSpacing: '-0.3px' }}>{e.title}</h3>
            <p style={{ fontFamily: C.mono, color: C.muted, fontSize: 11, lineHeight: 1.7, margin: '0 0 14px' }}>{e.desc}</p>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {[e.items, e.dur].map((d) => (
                <span key={d} style={{ fontFamily: C.mono, fontSize: 9, color: C.dim, border: `1px solid ${C.border}`, borderRadius: 4, padding: '3px 7px' }}>{d}</span>
              ))}
            </div>
            <button className="btn btn-sm">Start Exam</button>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ExamSelection;
