import { useState } from 'react';
import { ArrowRight, BookOpen, Code2, Brain, Database, Heart, X } from 'lucide-react';
import ExamSelection from '../components/ExamSelection';

function Home() {
  const [showExamModal, setShowExamModal] = useState(false);
  const [activeTab, setActiveTab]         = useState('about');
  const [showAbout, setShowAbout]         = useState(false);

  const tips = [
    'Review basic grammar and vocabulary daily',
    'Practice mathematical operations without calculator',
    'Study Philippine Constitution and government structure',
    'Take timed practice tests regularly',
    'Focus on weakest areas',
  ];

  const C = {
    bg: '#0a0a0a', bg2: '#0f0f0f', bg3: '#111',
    border: '#1e1e1e', border2: '#2a2a2a',
    text: '#fff', muted: '#555', dim: '#333',
    blue: '#3b82f6', green: '#22c55e',
    font: "'DM Serif Display', Georgia, serif",
    mono: "'IBM Plex Mono', monospace",
  };

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: C.bg, padding: '100px 24px 80px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: '64px 64px', opacity: 0.45 }} />
        <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse, rgba(59,130,246,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 780, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', border: `1px solid ${C.border2}`, borderRadius: 999, marginBottom: 40, background: C.bg3 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green }} />
            <span style={{ fontFamily: C.mono, fontSize: 10, color: C.muted, letterSpacing: '0.06em' }}>FREE · NO ADS · BUILT FOR FILIPINOS 🇵🇭</span>
          </div>

          <h1 style={{ fontFamily: C.font, fontSize: 'clamp(48px,8vw,90px)', fontWeight: 400, color: C.text, lineHeight: 1.0, letterSpacing: '-3px', margin: '0 0 20px' }}>
            Pass the CSE.<br />
            <span style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>No Excuses.</span>
          </h1>

          <p style={{ fontFamily: C.mono, color: C.muted, fontSize: 13, lineHeight: 1.9, marginBottom: 52, letterSpacing: '0.01em' }}>
            Stop wishing, start drilling. Free mock exams and full study guides<br />built for the Philippine Civil Service Exam. No shortcuts — just results.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-white" onClick={() => setShowExamModal(true)}>
              Start Exam Now <ArrowRight className="w-4 h-4" />
            </button>
            <a href="/review" className="btn btn-dark">
              Study Hard <BookOpen className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Stats */}
        <div style={{ position: 'relative', display: 'inline-flex', marginTop: 80, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', background: C.bg2 }}>
          {[{ v: '680+', l: 'Questions' }, { v: '15', l: 'Topics' }, { v: '100%', l: 'Free' }].map((s, i) => (
            <div key={s.l} style={{ padding: '18px 44px', borderLeft: i > 0 ? `1px solid ${C.border}` : 'none', textAlign: 'center' }}>
              <div style={{ fontFamily: C.font, fontSize: 28, color: C.text }}>{s.v}</div>
              <div style={{ fontFamily: C.mono, fontSize: 9, color: C.dim, marginTop: 5, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TABS ── */}
      <section style={{ background: C.bg, borderTop: `1px solid ${C.border}`, padding: '72px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
            {[{ id: 'about', label: 'About the Exam' }, { id: 'tips', label: 'Study Tips' }, { id: 'requirements', label: 'Requirements' }].map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '11px 22px', background: 'transparent', border: 'none', borderBottom: activeTab === t.id ? '2px solid #fff' : '2px solid transparent', color: activeTab === t.id ? C.text : C.muted, fontFamily: C.mono, fontSize: 11, cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: -1, transition: 'color 0.2s' }}>
                {t.label}
              </button>
            ))}
          </div>
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderTop: 'none', borderRadius: '0 0 10px 10px', padding: 36 }}>
            {activeTab === 'about' && (
              <div>
                <h3 style={{ fontFamily: C.font, color: C.text, fontSize: 28, fontWeight: 400, marginBottom: 14, letterSpacing: '-0.5px' }}>About the Civil Service Exam</h3>
                <p style={{ fontFamily: C.mono, color: C.muted, fontSize: 12, lineHeight: 1.9, marginBottom: 28 }}>The Civil Service Examination (CSE) is conducted by the Philippine Civil Service Commission (CSC) to determine the fitness of individuals who want to enter government service.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    { title: 'Professional Level', items: ['For college graduates', '170 multiple-choice items', '3.5 hours duration', 'Higher salary grade eligibility'], accent: '#3b82f6' },
                    { title: 'Sub-Professional Level', items: ['For non-college graduates', '165 multiple-choice items', '2.5 hours duration', 'Entry-level government positions'], accent: '#22c55e' },
                  ].map((card) => (
                    <div key={card.title} style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, padding: 18 }}>
                      <div style={{ width: 2, height: 14, background: card.accent, borderRadius: 2, marginBottom: 10 }} />
                      <h4 style={{ fontFamily: C.font, color: C.text, fontSize: 15, fontWeight: 400, marginBottom: 10 }}>{card.title}</h4>
                      {card.items.map((item) => (
                        <div key={item} style={{ fontFamily: C.mono, color: C.muted, fontSize: 11, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: card.accent, fontSize: 9 }}>▸</span> {item}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'tips' && (
              <div>
                <h3 style={{ fontFamily: C.font, color: C.text, fontSize: 28, fontWeight: 400, marginBottom: 22, letterSpacing: '-0.5px' }}>Effective Study Tips</h3>
                {tips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 7, padding: '13px 16px', marginBottom: 10 }}>
                    <span style={{ fontFamily: C.font, fontSize: 18, color: '#3b82f6', minWidth: 26 }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ fontFamily: C.mono, color: C.muted, fontSize: 12, lineHeight: 1.7 }}>{tip}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'requirements' && (
              <div>
                <h3 style={{ fontFamily: C.font, color: C.text, fontSize: 28, fontWeight: 400, marginBottom: 22, letterSpacing: '-0.5px' }}>Examination Requirements</h3>
                {['Filipino citizen', 'At least 18 years old', 'Of good moral character', 'No criminal record', 'Not removed from service for cause'].map((req) => (
                  <div key={req} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 7, marginBottom: 10 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
                    <span style={{ fontFamily: C.mono, color: C.muted, fontSize: 12 }}>{req}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── ABOUT PROJECT ── */}
      <section style={{ background: C.bg, padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <button onClick={() => setShowAbout(!showAbout)} style={{ display: 'block', margin: '0 auto 20px', background: 'transparent', border: 'none', color: C.dim, fontFamily: C.mono, fontSize: 10, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {showAbout ? '▲ hide' : '▼ about this project'}
          </button>
          {showAbout && (
            <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(90deg,#0d1f3c,#130d2e)', padding: '18px 24px', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: C.font, color: C.text, fontSize: 18 }}>About This Project</div>
                <div style={{ fontFamily: C.mono, color: C.muted, fontSize: 10, marginTop: 4 }}>Made by Otan</div>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
                  {[
                    { icon: <Code2 className="w-4 h-4" />, label: 'Built With', value: 'Vibe Coding' },
                    { icon: <Brain className="w-4 h-4" />, label: 'Powered By', value: 'Claude AI' },
                    { icon: <Database className="w-4 h-4" />, label: 'Questions', value: 'Multi-Source' },
                    { icon: <Heart className="w-4 h-4" />, label: 'Cost', value: '100% Free' },
                  ].map((m) => (
                    <div key={m.label} style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 7, padding: '14px 10px', textAlign: 'center' }}>
                      <div style={{ color: '#3b82f6', marginBottom: 6, display: 'flex', justifyContent: 'center' }}>{m.icon}</div>
                      <div style={{ fontFamily: C.mono, fontSize: 8, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{m.label}</div>
                      <div style={{ fontFamily: C.font, fontSize: 13, color: C.text }}>{m.value}</div>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: C.mono, color: C.muted, fontSize: 11, lineHeight: 1.9, marginBottom: 12 }}>This is not your typical reviewer app. Built entirely through <span style={{ color: '#3b82f6' }}>vibe coding</span> — no traditional hand-coding, no computer science degree required. Every line of code was generated using <span style={{ color: '#8b5cf6' }}>Claude AI</span> by Anthropic.</p>
                <p style={{ fontFamily: C.mono, color: C.muted, fontSize: 11, lineHeight: 1.9, marginBottom: 12 }}>The project started as a clone and evolved into something original — redesigned, expanded, and continuously improved through AI conversations.</p>
                <p style={{ fontFamily: C.mono, color: C.muted, fontSize: 11, lineHeight: 1.9, marginBottom: 16 }}><span style={{ color: C.text }}>Study materials and mock exam questions</span> are compiled from AI-generated content (Gemini, DeepSeek, ChatGPT), CSE review centers, social media study groups, and old Philippine Civil Service reviewer books. Some questions may have inconsistencies — reports are welcome.</p>
                <div style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 7, padding: '14px 18px', textAlign: 'center' }}>
                  <div style={{ fontFamily: C.font, color: C.text, fontSize: 15 }}>This site is and will always be free.</div>
                  <div style={{ fontFamily: C.mono, color: C.dim, fontSize: 10, marginTop: 6, letterSpacing: '0.04em' }}>No ads. No paywalls. Built for Filipinos, by a Filipino, with a little help from AI.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── EXAM MODAL ── */}
      {showExamModal && (
        <div onClick={() => setShowExamModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, width: '100%', maxWidth: 860, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '20px 26px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontFamily: C.font, color: C.text, fontSize: 24, fontWeight: 400, letterSpacing: '-0.5px', margin: 0 }}>Choose Your Exam Type</h2>
                <p style={{ fontFamily: C.mono, color: C.muted, fontSize: 10, margin: '5px 0 0', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Select the level that matches your qualifications</p>
              </div>
              <button onClick={() => setShowExamModal(false)} style={{ background: C.bg3, border: `1px solid ${C.border2}`, color: C.muted, borderRadius: 6, width: 30, height: 30, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: C.mono }}>✕</button>
            </div>
            <div style={{ padding: 20 }}>
              <ExamSelection />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
