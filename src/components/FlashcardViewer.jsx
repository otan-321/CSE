import { useState, useEffect } from "react";
import "./FlashcardViewer.css";

const DATA_MAP = {
  "vocabulary":               "/data/study/verbal/vocabulary.json",
  "grammar":                  "/data/study/verbal/grammar.json",
  "reading-comprehension":    "/data/study/verbal/reading-comprehension.json",
  "analogy":                  "/data/study/verbal/analogy.json",
  "logic":                    "/data/study/verbal/logic.json",
  "basic-math":               "/data/study/numerical/basic-math.json",
  "word-problems":            "/data/study/numerical/word-problems.json",
  "number-series":            "/data/study/numerical/number-series.json",
  "data-interpretation":      "/data/study/numerical/data-interpretation.json",
  "analytical-ability":       "/data/study/analytical/analytical-ability.json",
  "clerical-ability":         "/data/study/clerical/clerical-ability.json",
  "philippine-constitution":  "/data/study/general/philippine-constitution.json",
  "ra-6713":                  "/data/study/general/ra-6713.json",
  "peace-human-rights":       "/data/study/general/peace-human-rights.json",
  "environmental-management": "/data/study/general/environmental-management.json",
};

/* Convert a JSON section into a readable answer string/node */
function SectionAnswer({ section }) {
  if (section.type === "table" || section.rows) {
    return (
      <table>
        {section.headers && (
          <thead><tr>{section.headers.map((h,i) => <th key={i}>{h}</th>)}</tr></thead>
        )}
        <tbody>
          {(section.rows || []).slice(0, 6).map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
          {(section.rows || []).length > 6 && (
            <tr><td colSpan={section.headers?.length || 1} style={{color:'#4a5568',fontStyle:'italic'}}>
              +{section.rows.length - 6} more rows…
            </td></tr>
          )}
        </tbody>
      </table>
    );
  }
  if (section.items) {
    return (
      <ul>
        {section.items.slice(0, 6).map((item, i) => <li key={i}>{item}</li>)}
        {section.items.length > 6 && (
          <li style={{color:'#4a5568',fontStyle:'italic'}}>+{section.items.length - 6} more…</li>
        )}
      </ul>
    );
  }
  if (section.text || section.content) {
    return <span>{section.text || section.content}</span>;
  }
  return <span style={{color:'#4a5568'}}>See study notes for details.</span>;
}

export default function FlashcardViewer({ subcategory, onBack }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [cards, setCards]     = useState([]);
  const [index, setIndex]     = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [got, setGot]         = useState([]); // indices marked "got it"
  const [again, setAgain]     = useState([]); // indices marked "again"
  const [done, setDone]       = useState(false);

  const filePath = DATA_MAP[subcategory];

  useEffect(() => {
    if (!filePath) { setError("No flashcards found."); setLoading(false); return; }
    fetch(filePath)
      .then(r => { if (!r.ok) throw new Error("Failed to load."); return r.json(); })
      .then(json => {
        const c = (json.sections || []).filter(s => s.title);
        setCards(c);
        setData(json);
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [filePath]);

  const current = cards[index];
  const total   = cards.length;
  const pct     = total ? Math.round(((got.length + again.length) / total) * 100) : 0;

  const handleFlip = () => setFlipped(f => !f);

  const handleGot = () => {
    if (!flipped) return;
    setGot(g => [...g, index]);
    advance();
  };

  const handleAgain = () => {
    if (!flipped) return;
    setAgain(a => [...a, index]);
    advance();
  };

  const advance = () => {
    setFlipped(false);
    setTimeout(() => {
      if (index + 1 >= total) { setDone(true); }
      else { setIndex(i => i + 1); }
    }, 200);
  };

  const restart = () => {
    setIndex(0); setFlipped(false);
    setGot([]); setAgain([]); setDone(false);
  };

  const restartMissed = () => {
    const missed = again.map(i => cards[i]);
    setCards(missed);
    setIndex(0); setFlipped(false);
    setGot([]); setAgain([]); setDone(false);
  };

  if (loading) return (
    <div className="fc-state"><div className="fc-spinner" /><p>Loading flashcards…</p></div>
  );
  if (error) return (
    <div className="fc-state"><p>⚠️ {error}</p><button className="fc-back-btn" onClick={onBack}>← Back</button></div>
  );
  if (cards.length === 0) return (
    <div className="fc-state"><p>No flashcards available for this topic.</p><button className="fc-exit-btn" onClick={onBack}>← Back</button></div>
  );

  if (done) {
    const score = Math.round((got.length / total) * 100);
    const emoji = score >= 80 ? "🏆" : score >= 50 ? "💪" : "📚";
    return (
      <div className="fc-container">
        <div className="fc-header">
          <button className="fc-back-btn" onClick={onBack}>← Back</button>
        </div>
        <div className="fc-results">
          <div className="fc-results-icon">{emoji}</div>
          <div className="fc-results-title">
            {score >= 80 ? "Excellent!" : score >= 50 ? "Good job!" : "Keep studying!"}
          </div>
          <div className="fc-results-sub">{data?.title} — Flashcard Session Complete</div>
          <div className="fc-results-stats">
            <div className="fc-stat">
              <div className="fc-stat-num" style={{color:"#68d391"}}>{got.length}</div>
              <div className="fc-stat-label">Got It</div>
            </div>
            <div className="fc-stat">
              <div className="fc-stat-num" style={{color:"#fc814a"}}>{again.length}</div>
              <div className="fc-stat-label">Still Learning</div>
            </div>
            <div className="fc-stat">
              <div className="fc-stat-num" style={{color:"#63b3ed"}}>{score}%</div>
              <div className="fc-stat-label">Score</div>
            </div>
          </div>
          <div className="fc-results-btns">
            <button className="fc-restart-btn" onClick={restart}>Restart All</button>
            {again.length > 0 && (
              <button className="fc-restart-btn" style={{background:"linear-gradient(135deg,#fc814a,#f6ad55)"}} onClick={restartMissed}>
                Retry {again.length} Missed
              </button>
            )}
            <button className="fc-exit-btn" onClick={onBack}>Exit</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fc-container">
      <div className="fc-header">
        <button className="fc-back-btn" onClick={onBack}>← Back</button>
        <div className="fc-title">{data?.title}</div>
        <div className="fc-subtitle">Flashcard Mode • Tap card to reveal answer</div>
      </div>

      {/* Progress */}
      <div className="fc-progress-wrap">
        <div className="fc-progress-row">
          <span>Card {index + 1} of {total}</span>
          <span style={{color:"#68d391"}}>{got.length} ✓  <span style={{color:"#fc814a"}}>{again.length} ↺</span></span>
        </div>
        <div className="fc-progress-bar">
          <div className="fc-progress-fill" style={{width:`${pct}%`}} />
        </div>
      </div>

      {/* Flip Card */}
      <div className="fc-card-wrap" onClick={handleFlip}>
        <div className={`fc-card ${flipped ? "fc-card--flipped" : ""}`}>
          {/* Front */}
          <div className="fc-card-face fc-card-front">
            <span className="fc-card-label">Topic</span>
            <div className="fc-card-question">{current?.title}</div>
            <div className="fc-card-hint">Tap to reveal key points</div>
          </div>
          {/* Back */}
          <div className="fc-card-face fc-card-back">
            <span className="fc-card-label">Key Points</span>
            <div className="fc-card-answer">
              <SectionAnswer section={current} />
            </div>
          </div>
        </div>
      </div>

      {/* Got it / Again — only show after flipping */}
      {flipped ? (
        <div className="fc-actions">
          <button className="fc-btn fc-btn--again" onClick={handleAgain}>↺ Still Learning</button>
          <button className="fc-btn fc-btn--got" onClick={handleGot}>✓ Got It</button>
        </div>
      ) : (
        <div style={{height:"60px", marginBottom:"1.5rem"}} />
      )}

      {/* Prev / Next nav */}
      <div className="fc-nav">
        <button
          className="fc-nav-btn"
          disabled={index === 0}
          onClick={() => { setFlipped(false); setIndex(i => i - 1); }}
        >
          ← Prev
        </button>
        <span className="fc-nav-count">{index + 1} / {total}</span>
        <button
          className="fc-nav-btn"
          disabled={index + 1 >= total}
          onClick={() => { setFlipped(false); setIndex(i => i + 1); }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
