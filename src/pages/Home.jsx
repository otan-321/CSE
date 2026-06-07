import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExamSelection from '../components/ExamSelection';

const C = {
  bg: '#09090B', surface: '#131315', surfaceLow: '#1C1B1D',
  surfaceHigh: '#2A2A2C', border: '#27272A', borderHover: '#3F3F46',
  text: '#E5E1E4', textMuted: '#C4C7C8', textDim: '#8E9192',
  white: '#FFFFFF', success: '#22C55E', error: '#FF4444',
};

function Home() {
  const [showExamModal, setShowExamModal] = useState(false);
  const navigate = useNavigate();

  // Load stats from localStorage
  const lastExamRaw = localStorage.getItem('lastExamResult');
  const lastExam = lastExamRaw ? JSON.parse(lastExamRaw) : null;
  const historyRaw = localStorage.getItem('examHistory');
  const history = historyRaw ? JSON.parse(historyRaw) : [];
  const examsTaken = history.length;

  return (
    <>
      {/* ── HERO ── */}
      <section style={{
        position: 'relative', minHeight: '70vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '48px 24px 64px', overflow: 'hidden',
        background: C.bg,
      }}>
        {/* Grid overlay */}
        <div className="ob-grid-overlay" style={{
          position: 'absolute', inset: 0, opacity: 0.4, zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px' }}>
          {/* Headline */}
          <h1 className="ob-font-display" style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 800, lineHeight: 1.05,
            letterSpacing: '-0.03em', color: C.white,
            margin: '0 0 24px',
          }}>
            Pass the CSE.<br />
            <em style={{ fontStyle: 'italic' }}>No Excuses.</em>
          </h1>

          <p className="ob-font-body" style={{
            fontSize: '16px', lineHeight: 1.7,
            color: C.textMuted, margin: '0 auto 48px', maxWidth: '560px',
          }}>
            Stop wishing, start drilling. Free mock exams and full study guides built for the Philippine Civil Service Exam. No shortcuts — just results.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="ob-btn-primary" onClick={() => setShowExamModal(true)}>
              START EXAM
            </button>
            <a href="/review" className="ob-btn-ghost" style={{ textDecoration: 'none' }}>
              STUDY
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{
        borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
        background: C.surfaceLow, padding: '48px 24px',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {[
            { label: 'TOTAL DATABASE', value: '680+', sub: 'CURATED QUESTIONS', bar: 75 },
            { label: 'SUBJECT MASTERY', value: '15', sub: 'CORE TOPICS', bar: 100 },
            { label: 'ACCESS LEVEL', value: '100%', sub: 'TOTALLY FREE', bar: 100 },
          ].map(({ label, value, sub, bar }) => (
            <div key={label} className="ob-corner" style={{ position: 'relative', border: `1px solid ${C.border}`, padding: '4px' }}>
              <div style={{ border: `1px solid ${C.border}`, padding: '28px 24px' }}>
                <p className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.15em', color: C.textDim, marginBottom: '16px' }}>
                  {label}
                </p>
                <p className="ob-font-display" style={{ fontSize: '52px', fontWeight: 700, lineHeight: 1, color: C.white, marginBottom: '8px' }}>
                  {value}
                </p>
                <p className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.15em', color: C.white, marginBottom: '20px' }}>
                  {sub}
                </p>
                <div className="ob-progress-track">
                  <div className="ob-progress-fill" style={{ width: `${bar}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT / EXAM INFO TABS ── */}
      <section style={{ background: C.bg, padding: '72px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.2em', color: C.textDim, textTransform: 'uppercase', marginBottom: '8px' }}>
            // ABOUT THE EXAM
          </p>
          <h2 className="ob-font-display" style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', color: C.white, marginBottom: '32px' }}>
            Civil Service Examination
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: C.border }}>
            {[
              { tag: 'ADVANCED', title: 'Professional Level', desc: 'For college graduates. 170 multiple-choice items, 3.5 hours duration. Higher salary grade eligibility.' },
              { tag: 'INTERMEDIATE', title: 'Sub-Professional', desc: 'For non-college graduates. 165 multiple-choice items, 2.5 hours duration. Entry-level government positions.' },
            ].map(({ tag, title, desc }) => (
              <div key={tag} style={{ background: C.surfaceLow, padding: '28px 24px' }}>
                <p className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.15em', color: C.textDim, marginBottom: '12px' }}>{tag}</p>
                <h3 className="ob-font-display" style={{ fontSize: '18px', fontWeight: 700, color: C.white, marginBottom: '10px' }}>{title}</h3>
                <p className="ob-font-body" style={{ fontSize: '13px', color: C.textMuted, lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── YOUR PROGRESS (if exams taken) ── */}
      {examsTaken > 0 && lastExam && (
        <section style={{ padding: '0 24px 64px', maxWidth: '1100px', margin: '0 auto' }}>
          <p className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.2em', color: C.textDim, textTransform: 'uppercase', marginBottom: '8px' }}>
            // YOUR PROGRESS
          </p>
          <h2 className="ob-font-display" style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', color: C.white, marginBottom: '28px' }}>
            Current Session
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="ob-card" style={{ padding: '24px' }}>
              <p className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.12em', color: C.textDim, marginBottom: '12px' }}>LAST EXAM SCORE</p>
              <p className="ob-font-display" style={{
                fontSize: '42px', fontWeight: 700, marginBottom: '4px',
                color: lastExam.percentage >= 80 ? C.success : C.error,
              }}>
                {lastExam.percentage}%
              </p>
              <p className="ob-font-mono" style={{ fontSize: '10px', color: C.textDim }}>
                {lastExam.score}/{lastExam.totalQuestions} CORRECT
              </p>
              <a href="/history" className="ob-btn-text" style={{ marginTop: '12px', display: 'block' }}>VIEW HISTORY →</a>
            </div>
            <div className="ob-card" style={{ padding: '24px' }}>
              <p className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.12em', color: C.textDim, marginBottom: '12px' }}>EXAMS TAKEN</p>
              <p className="ob-font-display" style={{ fontSize: '42px', fontWeight: 700, color: C.white, marginBottom: '4px' }}>{examsTaken}</p>
              <a href="/history" className="ob-btn-text" style={{ marginTop: '12px', display: 'block' }}>VIEW ALL →</a>
            </div>
            <div className="ob-card" style={{ padding: '24px' }}>
              <p className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.12em', color: C.textDim, marginBottom: '12px' }}>TIME TAKEN</p>
              <p className="ob-font-display" style={{ fontSize: '32px', fontWeight: 700, color: C.white, marginBottom: '4px' }}>{lastExam.timeTaken || '—'}</p>
              <p className="ob-font-mono" style={{ fontSize: '10px', color: C.textDim }}>LAST EXAM</p>
            </div>
          </div>
        </section>
      )}

      {/* ── DISCLAIMER ── */}
      <section style={{
        borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
        background: C.surfaceLow, padding: '64px 24px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            width: '40px', height: '40px', border: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
          }}>
            <span style={{ color: C.white, fontSize: '18px' }}>⚠</span>
          </div>
          <p className="ob-font-mono" style={{ fontSize: '11px', letterSpacing: '0.2em', color: C.textDim, textTransform: 'uppercase', marginBottom: '20px' }}>
            IMPORTANT DISCLAIMER
          </p>
          <div style={{ border: `1px solid ${C.border}`, padding: '24px', textAlign: 'left' }}>
            <p className="ob-font-body" style={{ fontSize: '14px', color: C.textMuted, lineHeight: 1.7, margin: 0 }}>
              Some questions here are generated via AI (Gemini, Deepseek and ChatGPT), some are from social media groups and old reviewer from a review center. If you see inconsistency, please submit a report. This site is NOT affiliated with the Civil Service Commission.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section style={{ padding: '80px 24px', textAlign: 'center', background: C.bg }}>
        <h2 className="ob-font-display" style={{
          fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
          letterSpacing: '-0.02em', color: C.white, marginBottom: '12px',
        }}>
          Ready to Start?
        </h2>
        <button className="ob-btn-primary" onClick={() => setShowExamModal(true)} style={{ padding: '16px 48px' }}>
          LAUNCH EXAM MODULE →
        </button>
      </section>

      {/* ── EXAM MODAL ── */}
      {showExamModal && (
        <div onClick={() => setShowExamModal(false)} style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', padding: '24px',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: C.surface, border: `1px solid ${C.border}`,
            maxWidth: '860px', width: '100%',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '24px 32px', borderBottom: `1px solid ${C.border}`,
            }}>
              <div>
                <p className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.2em', color: C.textDim, marginBottom: '4px' }}>// SELECT MODULE</p>
                <h2 className="ob-font-display" style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', color: C.white, margin: 0 }}>
                  Choose Your Exam Type
                </h2>
              </div>
              <button onClick={() => setShowExamModal(false)} style={{
                background: 'transparent', border: `1px solid ${C.border}`,
                color: C.textDim, width: '36px', height: '36px',
                cursor: 'pointer', fontSize: '18px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>×</button>
            </div>
            <div style={{ padding: '24px' }}>
              <ExamSelection />
            </div>
            <div style={{ padding: '16px 32px', borderTop: `1px solid ${C.border}` }}>
              <p className="ob-font-mono" style={{ fontSize: '10px', color: C.textDim, letterSpacing: '0.08em' }}>
                Questions are randomly selected · No sign-up required
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
