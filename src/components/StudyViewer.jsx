import { useState, useEffect } from "react";
import "./StudyViewer.css";

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

const STUDY_KEYS = {
  "Vocabulary":               "vocabulary",
  "Grammar":                  "grammar",
  "Reading Comprehension":    "reading-comprehension",
  "Analogy":                  "analogy",
  "Logic":                    "logic",
  "Basic Math":               "basic-math",
  "Word Problems":            "word-problems",
  "Number Series":            "number-series",
  "Data Interpretation":      "data-interpretation",
  "Analytical Ability (Pro)": "analytical-ability",
  "Clerical Ability (Sub)":   "clerical-ability",
  "Philippine Constitution":  "philippine-constitution",
  "Environmental Management": "environmental-management",
  "Peace and Human Rights":   "peace-human-rights",
  "RA 6713":                  "ra-6713",
};

function SectionCard({ section, index }) {
  const [open, setOpen] = useState(index === 0);

  const renderContent = () => {
    switch (section.type) {
      case "table":
        return (
          <div className="sv-table-wrapper">
            <table className="sv-table">
              {section.headers && (
                <thead>
                  <tr>{section.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
                </thead>
              )}
              <tbody>
                {section.rows && section.rows.map((row, i) => (
                  <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "list":
        return (
          <ul className="sv-list">
            {section.items && section.items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        );
      case "numbered":
        return (
          <ol className="sv-numbered">
            {section.items && section.items.map((item, i) => <li key={i}>{item}</li>)}
          </ol>
        );
      case "definition":
        return <div className="sv-definition"><p>{section.text || section.content}</p></div>;
      case "example":
        return <div className="sv-example"><span className="sv-example-label">Example</span><p>{section.text || section.content}</p></div>;
      case "tip":
        return <div className="sv-tip"><span className="sv-tip-label">💡 Tip</span><p>{section.text || section.content}</p></div>;
      case "formula":
        return <div className="sv-formula"><span className="sv-formula-label">Formula</span><code>{section.text || section.content}</code></div>;
      case "note":
        return <div className="sv-note"><p>{section.text || section.content}</p></div>;
      default:
        if (section.items) return <ul className="sv-list">{section.items.map((item, i) => <li key={i}>{item}</li>)}</ul>;
        if (section.rows) return (
          <div className="sv-table-wrapper">
            <table className="sv-table">
              {section.headers && <thead><tr>{section.headers.map((h,i)=><th key={i}>{h}</th>)}</tr></thead>}
              <tbody>{section.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
        );
        if (section.text || section.content) return <p className="sv-paragraph">{section.text || section.content}</p>;
        return null;
    }
  };

  return (
    <div className={`sv-topic-card ${open ? "sv-topic-card--open" : ""}`}>
      <button className="sv-topic-header" onClick={() => setOpen(!open)}>
        <div className="sv-topic-title-row">
          <span className="sv-topic-number">{String(index + 1).padStart(2, "0")}</span>
          <span className="sv-topic-title">{section.title}</span>
        </div>
        <span className={`sv-topic-chevron ${open ? "sv-topic-chevron--up" : ""}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      {open && <div className="sv-topic-body">{renderContent()}</div>}
    </div>
  );
}

export default function StudyViewer({ subcategory, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const key = STUDY_KEYS[subcategory] || subcategory;
  const filePath = DATA_MAP[key];

  useEffect(() => {
    if (!filePath) { setError("Study material not found."); setLoading(false); return; }
    setLoading(true); setError(null);
    fetch(filePath)
      .then(res => { if (!res.ok) throw new Error("Failed to load."); return res.json(); })
      .then(json => { setData(json); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [filePath]);

  const filteredSections = data?.sections?.filter(section => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    if (section.title?.toLowerCase().includes(q)) return true;
    if (section.text?.toLowerCase().includes(q)) return true;
    if (section.content?.toLowerCase().includes(q)) return true;
    if (section.items?.some(item => item.toLowerCase().includes(q))) return true;
    if (section.rows?.some(row => row.some(cell => cell.toLowerCase().includes(q)))) return true;
    return false;
  });

  if (loading) return (
    <div className="sv-state sv-loading">
      <div className="sv-spinner" />
      <p>Loading study material…</p>
    </div>
  );

  if (error) return (
    <div className="sv-state sv-error">
      <p>⚠️ {error}</p>
      <button className="sv-back-btn" onClick={onBack}>← Back</button>
    </div>
  );

  if (!data) return null;

  return (
    <div className="sv-container">
      <div className="sv-header">
        <button className="sv-back-btn" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <h1 className="sv-title">{data.title}</h1>
        {data.category && <p className="sv-description">{data.category}</p>}
      </div>

      <div className="sv-search-bar">
        <svg className="sv-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          placeholder={`Search in ${data.title}…`}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="sv-search-input"
        />
        {searchQuery && <button className="sv-search-clear" onClick={() => setSearchQuery("")}>✕</button>}
      </div>

      <div className="sv-content">
        {filteredSections && filteredSections.length > 0
          ? filteredSections.map((section, i) => <SectionCard key={section.id || i} section={section} index={i} />)
          : <div className="sv-empty"><p>No results for "<strong>{searchQuery}</strong>"</p></div>
        }
      </div>
    </div>
  );
}
