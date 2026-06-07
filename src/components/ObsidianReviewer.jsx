/**
 * OBSIDIAN REVIEWER — Full Redesign
 * Drop these components into your existing CSE Reviewer React project.
 *
 * SETUP:
 * 1. Add to your index.html <head>:
 *    <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
 *
 * 2. Add to your global CSS (index.css):
 *    (paste the CSS block from the bottom of this file)
 *
 * 3. Replace your components:
 *    - Header.jsx       → use <ObsidianHeader />
 *    - Home.jsx         → use <ObsidianHome />
 *    - ExamSelection.jsx → use <ObsidianExamSelection />
 *    - QuestionCard.jsx  → use <ObsidianQuestionCard />
 *    - Results.jsx       → use <ObsidianResults />
 *
 * All original onClick / navigation logic is preserved — only styling changes.
 */

import { useState, useEffect } from "react";

// ─── SHARED TOKENS ────────────────────────────────────────────────────────────
const colors = {
  bg: "#09090B",
  surface: "#131315",
  surfaceLow: "#1C1B1D",
  surfaceHigh: "#2A2A2C",
  surfaceHighest: "#353437",
  border: "#27272A",
  borderHover: "#3F3F46",
  text: "#E5E1E4",
  textMuted: "#C4C7C8",
  textDim: "#8E9192",
  white: "#FFFFFF",
  error: "#FF4444",
  success: "#22C55E",
};

// ─── CSS-IN-JS GLOBAL STYLES (inject once) ───────────────────────────────────
// Add this to your index.css instead:
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg: #09090B;
  --surface: #131315;
  --surface-low: #1C1B1D;
  --surface-high: #2A2A2C;
  --surface-highest: #353437;
  --border: #27272A;
  --border-hover: #3F3F46;
  --text: #E5E1E4;
  --text-muted: #C4C7C8;
  --text-dim: #8E9192;
}

body {
  background-color: var(--bg);
  color: var(--text);
  font-family: 'Inter', sans-serif;
}

.ob-grid-overlay {
  background-image:
    linear-gradient(to right, rgba(39,39,42,0.25) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(39,39,42,0.25) 1px, transparent 1px);
  background-size: 40px 40px;
}

.ob-corner::before {
  content: '';
  position: absolute;
  top: -2px; left: -2px;
  width: 14px; height: 14px;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
}
.ob-corner::after {
  content: '';
  position: absolute;
  bottom: -2px; right: -2px;
  width: 14px; height: 14px;
  border-bottom: 2px solid #fff;
  border-right: 2px solid #fff;
}

.ob-font-display { font-family: 'Hanken Grotesk', sans-serif; }
.ob-font-mono    { font-family: 'JetBrains Mono', monospace; }
.ob-font-body    { font-family: 'Inter', sans-serif; }

/* Button styles */
.ob-btn-primary {
  background: #fff;
  color: #09090B;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 14px 32px;
  border: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, transform 0.1s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.ob-btn-primary:hover {
  background: #E5E1E4;
}
.ob-btn-primary:active {
  transform: scale(0.98);
}

.ob-btn-ghost {
  background: transparent;
  color: #E5E1E4;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 14px 32px;
  border: 1px solid #27272A;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.ob-btn-ghost:hover {
  border-color: #fff;
  color: #fff;
}

.ob-btn-text {
  background: transparent;
  color: #8E9192;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 8px 0;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
}
.ob-btn-text:hover { color: #fff; }

/* Card */
.ob-card {
  background: var(--surface-low);
  border: 1px solid var(--border);
  transition: border-color 0.15s;
}
.ob-card:hover { border-color: var(--border-hover); }

/* Answer option */
.ob-answer {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 20px;
  background: var(--surface-low);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.ob-answer:hover {
  border-color: var(--border-hover);
  background: var(--surface-high);
}
.ob-answer.selected {
  border-color: #fff;
  background: var(--surface-high);
}
.ob-answer.correct {
  border-color: #22C55E;
  background: rgba(34, 197, 94, 0.06);
}
.ob-answer.incorrect {
  border-color: #FF4444;
  background: rgba(255, 68, 68, 0.06);
}

/* Progress bar */
.ob-progress-track {
  width: 100%;
  height: 2px;
  background: var(--surface-highest);
}
.ob-progress-fill {
  height: 100%;
  background: #fff;
  transition: width 0.4s ease;
}

/* Checkbox square */
.ob-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-hover);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  transition: border-color 0.15s, background 0.15s;
}
.ob-answer.selected .ob-checkbox,
.ob-answer.correct .ob-checkbox {
  background: #fff;
  border-color: #fff;
}
.ob-answer.incorrect .ob-checkbox {
  background: #FF4444;
  border-color: #FF4444;
}
`;

// ─── HEADER ───────────────────────────────────────────────────────────────────
/**
 * ObsidianHeader — replaces your existing Header.jsx
 *
 * Props:
 *   onStartExam : () => void   — same as your existing Start Exam button handler
 *   currentPath : string       — e.g. '/review', '/', '/history'
 *   examDaysLeft: number|null  — pass your existing countdown days
 */
export function ObsidianHeader({ onStartExam, currentPath = "/", examDaysLeft = null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Review", href: "/review" },
    { label: "History", href: "/history" },
    { label: "Results", href: "/results" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 48px", height: "64px",
      background: "rgba(9,9,11,0.85)", backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${colors.border}`,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "28px", height: "28px",
          border: `1px solid ${colors.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            width: "10px", height: "10px",
            background: colors.white,
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          }} />
        </div>
        <span className="ob-font-display" style={{
          fontWeight: 700, fontSize: "15px", letterSpacing: "-0.02em", color: colors.white,
        }}>
          CSE Reviewer
        </span>
      </div>

      {/* Desktop nav */}
      <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
        {navLinks.map(({ label, href }) => {
          const active = currentPath === href;
          return (
            <a key={label} href={href} className="ob-font-mono" style={{
              fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em",
              textTransform: "uppercase", textDecoration: "none",
              color: active ? colors.white : colors.textDim,
              borderBottom: active ? `1px solid ${colors.white}` : "1px solid transparent",
              paddingBottom: "2px",
              transition: "color 0.15s, border-color 0.15s",
            }}
              onMouseEnter={e => { if (!active) e.target.style.color = colors.text; }}
              onMouseLeave={e => { if (!active) e.target.style.color = colors.textDim; }}
            >
              {label}
            </a>
          );
        })}
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Countdown badge */}
        {examDaysLeft !== null && (
          <div className="ob-font-mono" style={{
            fontSize: "10px", letterSpacing: "0.1em", color: colors.textDim,
            border: `1px solid ${colors.border}`, padding: "4px 10px",
            display: "flex", alignItems: "center", gap: "6px",
          }}>
            <span style={{ color: colors.white, fontWeight: 700 }}>{examDaysLeft}D</span>
            <span style={{ color: colors.textDim }}>· AUG 9</span>
          </div>
        )}
        <button className="ob-btn-primary" onClick={onStartExam} style={{ padding: "10px 20px" }}>
          START EXAM
        </button>
      </div>
    </nav>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
/**
 * ObsidianHome — replaces your existing Home.jsx
 *
 * Props:
 *   onStartExam   : () => void   — opens your exam modal
 *   examDaysLeft  : number|null
 *   lastScore     : { score, total } | null  — from localStorage
 *   examsTaken    : number
 *   topicsStudied : number
 */
export function ObsidianHome({
  onStartExam,
  examDaysLeft = null,
  lastScore = null,
  examsTaken = 0,
  topicsStudied = 0,
}) {
  return (
    <div style={{ paddingTop: "64px", background: colors.bg, minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section style={{
        position: "relative", minHeight: "90vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "0 24px", overflow: "hidden",
      }}>
        {/* Grid overlay */}
        <div className="ob-grid-overlay" style={{
          position: "absolute", inset: 0, opacity: 0.4, zIndex: 0,
        }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "720px" }}>
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            border: `1px solid ${colors.border}`, padding: "6px 14px", marginBottom: "32px",
          }}>
            <span style={{
              width: "6px", height: "6px", background: colors.white,
              display: "inline-block",
              animation: "pulse 2s infinite",
            }} />
            <span className="ob-font-mono" style={{
              fontSize: "10px", letterSpacing: "0.2em",
              color: colors.textMuted, textTransform: "uppercase",
            }}>
              Civil Service Exam Preparation
            </span>
          </div>

          {/* Headline */}
          <h1 className="ob-font-display" style={{
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 800, lineHeight: 1.05,
            letterSpacing: "-0.03em", color: colors.white,
            marginBottom: "24px",
          }}>
            Pass the CSE.<br />
            <em style={{ fontStyle: "italic" }}>No Excuses.</em>
          </h1>

          {/* Subtitle */}
          <p className="ob-font-body" style={{
            fontSize: "16px", lineHeight: 1.7,
            color: colors.textMuted, marginBottom: "48px", maxWidth: "560px", margin: "0 auto 48px",
          }}>
            Stop wishing, start drilling. Free mock exams and full study guides built for the Philippine Civil Service Exam.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="ob-btn-primary" onClick={onStartExam}>
              START EXAM NOW →
            </button>
            <a href="/review" className="ob-btn-ghost" style={{ textDecoration: "none" }}>
              STUDY HARD
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{
        borderTop: `1px solid ${colors.border}`,
        borderBottom: `1px solid ${colors.border}`,
        background: colors.surfaceLow,
        padding: "48px 24px",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {[
            { label: "TOTAL DATABASE", value: "680+", sub: "CURATED QUESTIONS", bar: 75 },
            { label: "SUBJECT MASTERY", value: "15", sub: "CORE TOPICS", bar: 100 },
            { label: "ACCESS LEVEL", value: "100%", sub: "TOTALLY FREE", bar: 100 },
          ].map(({ label, value, sub, bar }) => (
            <div key={label} className="ob-corner" style={{
              position: "relative", border: `1px solid ${colors.border}`,
              padding: "4px",
            }}>
              <div style={{ border: `1px solid ${colors.border}`, padding: "28px 24px" }}>
                <p className="ob-font-mono" style={{
                  fontSize: "10px", letterSpacing: "0.15em",
                  color: colors.textDim, marginBottom: "16px",
                }}>
                  {label}
                </p>
                <p className="ob-font-display" style={{
                  fontSize: "52px", fontWeight: 700, lineHeight: 1,
                  color: colors.white, marginBottom: "8px",
                }}>
                  {value}
                </p>
                <p className="ob-font-mono" style={{
                  fontSize: "10px", letterSpacing: "0.15em", color: colors.white, marginBottom: "20px",
                }}>
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

      {/* ── YOUR PROGRESS ── */}
      {(examsTaken > 0 || topicsStudied > 0) && (
        <section style={{ padding: "64px 24px", maxWidth: "1100px", margin: "0 auto" }}>
          <p className="ob-font-mono" style={{
            fontSize: "10px", letterSpacing: "0.2em", color: colors.textDim,
            textTransform: "uppercase", marginBottom: "8px",
          }}>
            // YOUR PROGRESS
          </p>
          <h2 className="ob-font-display" style={{
            fontSize: "28px", fontWeight: 700, letterSpacing: "-0.02em",
            color: colors.white, marginBottom: "32px",
          }}>
            Current Session
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {/* Last Score */}
            <div className="ob-card" style={{ padding: "24px" }}>
              <p className="ob-font-mono" style={{ fontSize: "10px", letterSpacing: "0.12em", color: colors.textDim, marginBottom: "12px" }}>
                LAST EXAM SCORE
              </p>
              {lastScore ? (
                <>
                  <p className="ob-font-display" style={{
                    fontSize: "42px", fontWeight: 700,
                    color: Math.round((lastScore.score / lastScore.total) * 100) >= 80 ? colors.success : colors.error,
                    marginBottom: "4px",
                  }}>
                    {Math.round((lastScore.score / lastScore.total) * 100)}%
                  </p>
                  <p className="ob-font-mono" style={{ fontSize: "10px", color: colors.textDim }}>
                    {lastScore.score}/{lastScore.total} CORRECT
                  </p>
                  <a href="/history" className="ob-btn-text" style={{ marginTop: "12px", display: "block" }}>
                    VIEW HISTORY →
                  </a>
                </>
              ) : (
                <p className="ob-font-mono" style={{ fontSize: "11px", color: colors.textDim }}>
                  No exams taken yet.
                </p>
              )}
            </div>

            {/* Topics */}
            <div className="ob-card" style={{ padding: "24px" }}>
              <p className="ob-font-mono" style={{ fontSize: "10px", letterSpacing: "0.12em", color: colors.textDim, marginBottom: "12px" }}>
                TOPICS STUDIED
              </p>
              <p className="ob-font-display" style={{ fontSize: "42px", fontWeight: 700, color: colors.white, marginBottom: "8px" }}>
                {topicsStudied}<span style={{ fontSize: "18px", color: colors.textDim }}>/15</span>
              </p>
              <div className="ob-progress-track" style={{ marginBottom: "12px" }}>
                <div className="ob-progress-fill" style={{ width: `${Math.round((topicsStudied / 15) * 100)}%` }} />
              </div>
              <a href="/review" className="ob-btn-text">CONTINUE STUDYING →</a>
            </div>

            {/* Exams taken */}
            <div className="ob-card" style={{ padding: "24px" }}>
              <p className="ob-font-mono" style={{ fontSize: "10px", letterSpacing: "0.12em", color: colors.textDim, marginBottom: "12px" }}>
                EXAMS TAKEN
              </p>
              <p className="ob-font-display" style={{ fontSize: "42px", fontWeight: 700, color: colors.white, marginBottom: "4px" }}>
                {examsTaken}
              </p>
              <a href="/history" className="ob-btn-text" style={{ marginTop: "12px", display: "block" }}>
                VIEW ALL →
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── DISCLAIMER ── */}
      <section style={{
        borderTop: `1px solid ${colors.border}`,
        borderBottom: `1px solid ${colors.border}`,
        background: colors.surfaceLow,
        padding: "64px 24px", textAlign: "center",
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{
            width: "40px", height: "40px", border: `1px solid ${colors.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <span style={{ color: colors.white, fontSize: "18px" }}>⚠</span>
          </div>
          <p className="ob-font-mono" style={{
            fontSize: "11px", letterSpacing: "0.2em", color: colors.textDim,
            textTransform: "uppercase", marginBottom: "20px",
          }}>
            IMPORTANT DISCLAIMER
          </p>
          <div style={{ border: `1px solid ${colors.border}`, padding: "24px", textAlign: "left" }}>
            <p className="ob-font-body" style={{ fontSize: "14px", color: colors.textMuted, lineHeight: 1.7 }}>
              Some questions here are generated via AI (Gemini, Deepseek and ChatGPT), some are from social media groups and old reviewer from a review center. If you see inconsistency, please submit a report. This site is NOT affiliated with the Civil Service Commission.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <h2 className="ob-font-display" style={{
          fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
          letterSpacing: "-0.02em", color: colors.white, marginBottom: "12px",
        }}>
          Ready to Start?
        </h2>
        <p className="ob-font-mono" style={{
          fontSize: "11px", letterSpacing: "0.15em", color: colors.textDim,
          marginBottom: "32px", textTransform: "uppercase",
        }}>
          NO SIGN-UP REQUIRED · FREE FOREVER
        </p>
        <button className="ob-btn-primary" onClick={onStartExam} style={{ padding: "16px 48px" }}>
          LAUNCH EXAM MODULE →
        </button>
      </section>
    </div>
  );
}

// ─── EXAM SELECTION MODAL ─────────────────────────────────────────────────────
/**
 * ObsidianExamModal — replaces your existing ExamSelection inside the modal
 *
 * Props:
 *   isOpen   : boolean
 *   onClose  : () => void
 *   navigate : (path: string) => void   — your react-router navigate
 */
export function ObsidianExamModal({ isOpen, onClose, navigate }) {
  if (!isOpen) return null;

  const exams = [
    {
      id: "professional",
      tag: "ADVANCED",
      title: "Professional Level",
      desc: "For college graduates. Full exam simulation.",
      items: 170,
      duration: "3.5 HRS",
      path: "/exam/professional",
    },
    {
      id: "subprofessional",
      tag: "INTERMEDIATE",
      title: "Sub-Professional",
      desc: "For non-college graduates.",
      items: 165,
      duration: "2.5 HRS",
      path: "/exam/subprofessional",
    },
    {
      id: "practice",
      tag: "ALL LEVELS",
      title: "Quick Practice",
      desc: "60-item mixed practice test.",
      items: 60,
      duration: "30 MIN",
      path: "/exam/practice",
    },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
      padding: "24px",
    }} onClick={onClose}>
      <div style={{
        background: colors.surface, border: `1px solid ${colors.border}`,
        maxWidth: "860px", width: "100%",
        maxHeight: "90vh", overflowY: "auto",
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "24px 32px", borderBottom: `1px solid ${colors.border}`,
        }}>
          <div>
            <p className="ob-font-mono" style={{
              fontSize: "10px", letterSpacing: "0.2em",
              color: colors.textDim, marginBottom: "4px",
            }}>
              // SELECT MODULE
            </p>
            <h2 className="ob-font-display" style={{
              fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em", color: colors.white,
            }}>
              Choose Your Exam Type
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: "transparent", border: `1px solid ${colors.border}`,
            color: colors.textDim, width: "36px", height: "36px",
            cursor: "pointer", fontSize: "18px", display: "flex",
            alignItems: "center", justifyContent: "center",
            transition: "border-color 0.15s, color 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = colors.white; e.currentTarget.style.color = colors.white; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.textDim; }}
          >
            ×
          </button>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1px", background: colors.border }}>
          {exams.map(({ id, tag, title, desc, items, duration, path }) => (
            <div
              key={id}
              onClick={() => { navigate(path); onClose(); }}
              style={{
                background: colors.surfaceLow, padding: "32px 28px",
                cursor: "pointer", transition: "background 0.15s",
                borderTop: "2px solid transparent",
                position: "relative",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = colors.surfaceHigh;
                e.currentTarget.style.borderTopColor = colors.white;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = colors.surfaceLow;
                e.currentTarget.style.borderTopColor = "transparent";
              }}
            >
              <p className="ob-font-mono" style={{
                fontSize: "10px", letterSpacing: "0.15em",
                color: colors.textDim, marginBottom: "16px",
              }}>
                {tag}
              </p>
              <h3 className="ob-font-display" style={{
                fontSize: "18px", fontWeight: 700,
                color: colors.white, marginBottom: "8px",
              }}>
                {title}
              </h3>
              <p className="ob-font-body" style={{
                fontSize: "13px", color: colors.textMuted, marginBottom: "24px", lineHeight: 1.6,
              }}>
                {desc}
              </p>
              <div style={{ display: "flex", gap: "24px", marginBottom: "20px" }}>
                {[["ITEMS", items], ["DURATION", duration]].map(([k, v]) => (
                  <div key={k}>
                    <p className="ob-font-mono" style={{ fontSize: "9px", color: colors.textDim, letterSpacing: "0.12em" }}>{k}</p>
                    <p className="ob-font-display" style={{ fontSize: "20px", fontWeight: 700, color: colors.white }}>{v}</p>
                  </div>
                ))}
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: "6px",
                color: colors.white,
              }}>
                <span className="ob-font-mono" style={{ fontSize: "10px", letterSpacing: "0.1em" }}>START EXAM</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "16px 32px", borderTop: `1px solid ${colors.border}` }}>
          <p className="ob-font-mono" style={{ fontSize: "10px", color: colors.textDim, letterSpacing: "0.08em" }}>
            Questions are randomly selected · No sign-up required
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── QUESTION CARD ────────────────────────────────────────────────────────────
/**
 * ObsidianQuestionCard — replaces your existing QuestionCard.jsx
 *
 * Props: same as your current QuestionCard but with obsidian styling
 *   question        : { text, options: [{id, text}], correctAnswer, explanation }
 *   questionNumber  : number
 *   totalQuestions  : number
 *   selectedAnswer  : string | null
 *   onSelect        : (answerId: string) => void
 *   showResult      : boolean
 *   timeLeft        : string | null   — e.g. "44:57"
 *   onNext          : () => void
 *   onPrev          : () => void
 *   onQuit          : () => void
 */
export function ObsidianQuestionCard({
  question,
  questionNumber = 1,
  totalQuestions = 50,
  selectedAnswer = null,
  onSelect,
  showResult = false,
  timeLeft = null,
  onNext,
  onPrev,
  onQuit,
}) {
  const pct = Math.round((questionNumber / totalQuestions) * 100);

  const getAnswerClass = (optId) => {
    if (!showResult) return selectedAnswer === optId ? "ob-answer selected" : "ob-answer";
    if (optId === question.correctAnswer) return "ob-answer correct";
    if (optId === selectedAnswer && selectedAnswer !== question.correctAnswer) return "ob-answer incorrect";
    return "ob-answer";
  };

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: "56px",
        background: colors.surface, borderBottom: `1px solid ${colors.border}`,
      }}>
        <div>
          <span className="ob-font-mono" style={{ fontSize: "10px", letterSpacing: "0.15em", color: colors.textDim }}>
            EXAM PROGRESS
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {timeLeft && (
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              border: `1px solid ${colors.border}`, padding: "6px 14px",
            }}>
              <span style={{ fontSize: "12px" }}>⏱</span>
              <span className="ob-font-mono" style={{ fontSize: "13px", color: colors.white, letterSpacing: "0.05em" }}>
                {timeLeft}
              </span>
            </div>
          )}
          <button className="ob-btn-ghost" onClick={onQuit} style={{ padding: "8px 16px" }}>
            QUIT EXAM
          </button>
        </div>
      </div>

      {/* Progress */}
      <div style={{ background: colors.surface, padding: "12px 32px", borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span className="ob-font-mono" style={{ fontSize: "10px", color: colors.textDim }}>
            {questionNumber} OF {totalQuestions} ANSWERED
          </span>
          <span className="ob-font-mono" style={{ fontSize: "10px", color: colors.textDim }}>
            {pct}%
          </span>
        </div>
        <div className="ob-progress-track">
          <div className="ob-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: "880px", margin: "0 auto", width: "100%", padding: "40px 32px" }}>
        {/* Question label */}
        <div style={{ marginBottom: "24px" }}>
          <p className="ob-font-mono" style={{ fontSize: "10px", letterSpacing: "0.2em", color: colors.textDim, marginBottom: "8px" }}>
            QUESTION {questionNumber}
          </p>
          <p className="ob-font-body" style={{ fontSize: "17px", lineHeight: 1.65, color: colors.text }}>
            {question?.text}
          </p>
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "32px" }}>
          {question?.options?.map((opt) => (
            <div
              key={opt.id}
              className={getAnswerClass(opt.id)}
              onClick={() => !showResult && onSelect?.(opt.id)}
            >
              <div className="ob-checkbox">
                {(selectedAnswer === opt.id || (showResult && opt.id === question.correctAnswer)) && (
                  <span style={{ fontSize: "10px", color: showResult && opt.id !== question.correctAnswer ? colors.white : colors.bg, fontWeight: 700 }}>✓</span>
                )}
              </div>
              <span className="ob-font-mono" style={{ fontSize: "10px", color: colors.textDim, marginRight: "4px", minWidth: "16px" }}>
                {opt.id.toUpperCase()}.
              </span>
              <span className="ob-font-body" style={{ fontSize: "15px", color: colors.text }}>
                {opt.text}
              </span>
            </div>
          ))}
        </div>

        {/* Explanation */}
        {showResult && question?.explanation && (
          <div style={{
            border: `1px solid ${colors.border}`,
            background: colors.surfaceLow,
            padding: "20px 24px", marginBottom: "24px",
          }}>
            <p className="ob-font-mono" style={{ fontSize: "10px", letterSpacing: "0.12em", color: colors.textDim, marginBottom: "8px" }}>
              EXPLANATION
            </p>
            <p className="ob-font-body" style={{ fontSize: "14px", color: colors.textMuted, lineHeight: 1.6 }}>
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{
        borderTop: `1px solid ${colors.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: "64px",
        background: colors.surface,
      }}>
        <button className="ob-btn-ghost" onClick={onPrev} style={{ padding: "10px 20px" }}>
          ← PREVIOUS
        </button>
        <button className="ob-btn-primary" onClick={onNext} style={{ padding: "10px 24px" }}>
          NEXT QUESTION →
        </button>
      </div>
    </div>
  );
}

// ─── RESULTS DASHBOARD ────────────────────────────────────────────────────────
/**
 * ObsidianResults — replaces your existing Results.jsx
 *
 * Props:
 *   result: {
 *     score: number,
 *     totalQuestions: number,
 *     timeUsed: string,
 *     categoryBreakdown: { name: string, correct: number, total: number }[]
 *     answers: { question, selected, correct, isCorrect }[]
 *   }
 *   onRetake : () => void
 *   onHome   : () => void
 */
export function ObsidianResults({ result, onRetake, onHome }) {
  const [tab, setTab] = useState("all");
  if (!result) return null;

  const pct = Math.round((result.score / result.totalQuestions) * 100);
  const passed = pct >= 80;
  const incorrect = result.totalQuestions - result.score;

  const filteredAnswers = (result.answers || []).filter(a =>
    tab === "all" ? true : !a.isCorrect
  );

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, paddingTop: "64px" }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: "56px",
        background: colors.surface, borderBottom: `1px solid ${colors.border}`,
      }}>
        <span className="ob-font-mono" style={{ fontSize: "10px", letterSpacing: "0.15em", color: colors.textDim }}>
          EXAM COMPLETE
        </span>
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="ob-btn-ghost" onClick={onHome} style={{ padding: "8px 16px" }}>HOME</button>
          <button className="ob-btn-primary" onClick={onRetake} style={{ padding: "8px 16px" }}>RETAKE</button>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>

          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Score */}
            <div className="ob-corner" style={{ position: "relative", border: `1px solid ${colors.border}`, padding: "4px" }}>
              <div style={{ border: `1px solid ${colors.border}`, padding: "28px 24px" }}>
                <p className="ob-font-mono" style={{ fontSize: "10px", letterSpacing: "0.12em", color: colors.textDim, marginBottom: "12px" }}>
                  FINAL MASTERY SCORE
                </p>
                <p className="ob-font-display" style={{
                  fontSize: "64px", fontWeight: 700, lineHeight: 1,
                  color: colors.white, marginBottom: "4px",
                }}>
                  {pct}<span style={{ fontSize: "28px" }}>%</span>
                </p>
                <p className="ob-font-mono" style={{
                  fontSize: "13px", letterSpacing: "0.15em",
                  color: passed ? colors.success : colors.error,
                  marginBottom: "16px",
                }}>
                  {passed ? "PASSED" : "FAILED"}
                </p>
                <div className="ob-progress-track">
                  <div className="ob-progress-fill" style={{ width: `${pct}%`, background: passed ? colors.success : colors.error }} />
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: colors.border }}>
              {[
                ["CORRECT", `${result.score}/${result.totalQuestions}`],
                ["INCORRECT", incorrect.toString().padStart(2, "0")],
                ["TIME USED", result.timeUsed || "—"],
                ["SCORE", `${pct}%`],
              ].map(([k, v]) => (
                <div key={k} style={{ background: colors.surfaceLow, padding: "20px 16px" }}>
                  <p className="ob-font-mono" style={{ fontSize: "9px", letterSpacing: "0.12em", color: colors.textDim, marginBottom: "6px" }}>{k}</p>
                  <p className="ob-font-display" style={{ fontSize: "22px", fontWeight: 700, color: colors.white }}>{v}</p>
                </div>
              ))}
            </div>

            {/* Subject breakdown */}
            {result.categoryBreakdown?.length > 0 && (
              <div style={{ border: `1px solid ${colors.border}`, padding: "24px" }}>
                <p className="ob-font-display" style={{ fontSize: "16px", fontWeight: 700, color: colors.white, marginBottom: "16px" }}>
                  Subject Breakdown
                </p>
                {result.categoryBreakdown.map(({ name, correct, total }) => {
                  const catPct = Math.round((correct / total) * 100);
                  return (
                    <div key={name} style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span className="ob-font-body" style={{ fontSize: "13px", color: colors.textMuted }}>{name}</span>
                        <span className="ob-font-mono" style={{ fontSize: "11px", color: colors.white }}>{catPct}%</span>
                      </div>
                      <div className="ob-progress-track">
                        <div className="ob-progress-fill" style={{ width: `${catPct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right column — Itemized analysis */}
          <div style={{ border: `1px solid ${colors.border}` }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 24px", borderBottom: `1px solid ${colors.border}`,
            }}>
              <p className="ob-font-display" style={{ fontSize: "18px", fontWeight: 700, color: colors.white }}>
                Itemized Analysis
              </p>
              <div style={{ display: "flex", gap: "1px", background: colors.border }}>
                {["all", "failed"].map(t => (
                  <button key={t} onClick={() => setTab(t)} className="ob-font-mono" style={{
                    fontSize: "10px", letterSpacing: "0.1em", padding: "8px 16px",
                    background: tab === t ? colors.white : colors.surfaceLow,
                    color: tab === t ? colors.bg : colors.textDim,
                    border: "none", cursor: "pointer", textTransform: "uppercase",
                  }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowY: "auto", maxHeight: "600px" }}>
              {filteredAnswers.slice(0, 20).map((a, i) => (
                <div key={i} style={{
                  display: "flex", gap: "16px", padding: "16px 24px",
                  borderBottom: `1px solid ${colors.border}`,
                }}>
                  <div style={{
                    width: "32px", height: "32px", flexShrink: 0,
                    border: `1px solid ${a.isCorrect ? colors.success : colors.error}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span className="ob-font-mono" style={{
                      fontSize: "10px", fontWeight: 700,
                      color: a.isCorrect ? colors.success : colors.error,
                    }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span className="ob-font-mono" style={{ fontSize: "9px", letterSpacing: "0.1em", color: colors.textDim }}>
                        {a.question?.category || "—"}
                      </span>
                      <span className="ob-font-mono" style={{
                        fontSize: "9px", letterSpacing: "0.1em",
                        color: a.isCorrect ? colors.success : colors.error,
                      }}>
                        {a.isCorrect ? "CORRECT" : "INCORRECT"}
                      </span>
                    </div>
                    <p className="ob-font-body" style={{ fontSize: "13px", color: colors.text, marginBottom: "6px" }}>
                      {a.question?.text?.slice(0, 100)}{a.question?.text?.length > 100 ? "…" : ""}
                    </p>
                    {!a.isCorrect && (
                      <div style={{ display: "flex", gap: "16px" }}>
                        <span className="ob-font-mono" style={{ fontSize: "10px", color: colors.error }}>
                          YOUR: {a.selected?.toUpperCase() || "—"}
                        </span>
                        <span className="ob-font-mono" style={{ fontSize: "10px", color: colors.success }}>
                          CORRECT: {a.correct?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filteredAnswers.length === 0 && (
                <div style={{ padding: "48px 24px", textAlign: "center" }}>
                  <p className="ob-font-mono" style={{ fontSize: "11px", color: colors.textDim }}>
                    {tab === "failed" ? "NO FAILED QUESTIONS — PERFECT!" : "NO DATA"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
export function ObsidianFooter() {
  return (
    <footer style={{
      borderTop: `1px solid ${colors.border}`,
      padding: "32px 48px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: colors.surface,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "24px", height: "24px", border: `1px solid ${colors.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: "8px", height: "8px", background: colors.white, clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
        </div>
        <span className="ob-font-mono" style={{ fontSize: "10px", color: colors.textDim }}>
          © 2026 CSE REVIEWER · BUILT FOR FILIPINOS · FREE FOREVER
        </span>
      </div>
      <div style={{ display: "flex", gap: "24px" }}>
        {["Privacy Policy", "Terms of Use", "Sitemap"].map(link => (
          <a key={link} href="#" className="ob-font-mono" style={{
            fontSize: "10px", letterSpacing: "0.08em", color: colors.textDim,
            textDecoration: "none", transition: "color 0.15s",
          }}
            onMouseEnter={e => e.target.style.color = colors.white}
            onMouseLeave={e => e.target.style.color = colors.textDim}
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
}

// ─── DEMO / PREVIEW ──────────────────────────────────────────────────────────
// This default export is just a preview — remove it when integrating
export default function ObsidianPreview() {
  const [modal, setModal] = useState(false);
  const [page, setPage] = useState("home"); // "home" | "exam" | "results"

  const mockQuestion = {
    text: "Which of the following is considered the supreme law of the Philippines?",
    options: [
      { id: "a", text: "The Revised Penal Code" },
      { id: "b", text: "The 1987 Philippine Constitution" },
      { id: "c", text: "The Civil Code of the Philippines" },
      { id: "d", text: "Republic Act 6713" },
    ],
    correctAnswer: "b",
    explanation: "The 1987 Philippine Constitution is the supreme law of the land. All other laws must conform to it.",
  };

  const mockResult = {
    score: 44,
    totalQuestions: 50,
    timeUsed: "42:12",
    categoryBreakdown: [
      { name: "Verbal Reasoning", correct: 18, total: 20 },
      { name: "Numerical Ability", correct: 14, total: 18 },
      { name: "General Info", correct: 12, total: 12 },
    ],
    answers: Array.from({ length: 10 }, (_, i) => ({
      question: { text: mockQuestion.text, category: "Verbal Reasoning" },
      selected: i % 3 === 0 ? "a" : "b",
      correct: "b",
      isCorrect: i % 3 !== 0,
    })),
  };

  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  return (
    <div style={{ background: colors.bg, minHeight: "100vh" }}>
      {/* Inject global CSS */}
      <style>{GLOBAL_CSS}</style>

      <ObsidianHeader
        onStartExam={() => setModal(true)}
        currentPath="/"
        examDaysLeft={63}
      />

      {/* Page switcher for preview */}
      <div style={{
        position: "fixed", bottom: "24px", right: "24px", zIndex: 200,
        display: "flex", gap: "8px",
      }}>
        {["home", "exam", "results"].map(p => (
          <button key={p} onClick={() => setPage(p)} className="ob-font-mono" style={{
            fontSize: "9px", padding: "8px 12px", letterSpacing: "0.1em",
            background: page === p ? colors.white : colors.surfaceHigh,
            color: page === p ? colors.bg : colors.textDim,
            border: `1px solid ${colors.border}`, cursor: "pointer",
          }}>
            {p.toUpperCase()}
          </button>
        ))}
      </div>

      {page === "home" && (
        <ObsidianHome
          onStartExam={() => setModal(true)}
          examDaysLeft={63}
          lastScore={{ score: 44, total: 50 }}
          examsTaken={7}
          topicsStudied={9}
        />
      )}

      {page === "exam" && (
        <ObsidianQuestionCard
          question={mockQuestion}
          questionNumber={22}
          totalQuestions={50}
          selectedAnswer={selected}
          onSelect={setSelected}
          showResult={showResult}
          timeLeft="44:57"
          onNext={() => setShowResult(s => !s)}
          onPrev={() => {}}
          onQuit={() => setPage("home")}
        />
      )}

      {page === "results" && (
        <ObsidianResults
          result={mockResult}
          onRetake={() => setPage("exam")}
          onHome={() => setPage("home")}
        />
      )}

      <ObsidianExamModal
        isOpen={modal}
        onClose={() => setModal(false)}
        navigate={(path) => { console.log("Navigate to:", path); setModal(false); }}
      />

      {page === "home" && <ObsidianFooter />}
    </div>
  );
}
