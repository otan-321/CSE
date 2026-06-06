import { useState, useEffect } from "react";
import "./StudyViewer.css";

const DATA_MAP = {
  "vocabulary":              "/src/data/study/verbal/vocabulary.json",
  "grammar":                 "/src/data/study/verbal/grammar.json",
  "reading-comprehension":   "/src/data/study/verbal/reading-comprehension.json",
  "analogy":                 "/src/data/study/verbal/analogy.json",
  "logic":                   "/src/data/study/verbal/logic.json",
  "basic-math":              "/src/data/study/numerical/basic-math.json",
  "word-problems":           "/src/data/study/numerical/word-problems.json",
  "number-series":           "/src/data/study/numerical/number-series.json",
  "data-interpretation":     "/src/data/study/numerical/data-interpretation.json",
  "analytical-ability":      "/src/data/study/analytical/analytical-ability.json",
  "clerical-ability":        "/src/data/study/clerical/clerical-ability.json",
  "philippine-constitution": "/src/data/study/general/philippine-constitution.json",
  "ra-6713":                 "/src/data/study/general/ra-6713.json",
  "peace-human-rights":      "/src/data/study/general/peace-human-rights.json",
  "environmental-management":"/src/data/study/general/environmental-management.json",
};

const STUDY_KEYS = {
  "Vocabulary":                "vocabulary",
  "Grammar":                   "grammar",
  "Reading Comprehension":     "reading-comprehension",
  "Analogy":                   "analogy",
  "Logic":                     "logic",
  "Basic Math":                "basic-math",
  "Word Problems":             "word-problems",
  "Number Series":             "number-series",
  "Data Interpretation":       "data-interpretation",
  "Analytical Ability (Pro)":  "analytical-ability",
  "Clerical Ability (Sub)":    "clerical-ability",
  "Philippine Constitution":   "philippine-constitution",
  "Environmental Management":  "environmental-management",
  "Peace and Human Rights":    "peace-human-rights",
  "RA 6713":                   "ra-6713",
};

function ContentBlock({ block }) {
  switch (block.type) {
    case "definition":
      return <div className="sv-definition"><p>{block.text}</p></div>;
    case "heading":
      return <h3 className="sv-heading">{block.text}</h3>;
    case "subheading":
      return <h4 className="sv-subheading">{block.text}</h4>;
    case "list":
      return <ul className="sv-list">{block.items.map((item, i) => <li key={i}>{item}</li>)}</ul>;
    case "numbered":
      return <ol className="sv-numbered">{block.items.map((item, i) => <li key={i}>{item}</li>)}</ol>;
    case "table":
      return (
        <div className="sv-table-wrapper">
          <table className="sv-table">
            {block.headers && <thead><tr>{block.headers.map((h,i)=><th key={i}>{h}</th>)}</tr></thead>}
            <tbody>{block.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
    case "example":
      return <div className="sv-example"><span className="sv-example-label">Example</span><p>{block.text}</p></div>;
    case "tip":
      return <div className="sv-tip"><span className="sv-tip-label">💡 Tip</span><p>{block.text}</p></div>;
    case "formula":
      return <div className="sv-formula"><span className="sv-formula-label">Formula</span><code>{block.text}</code></div>;
    case "note":
      return <div className="sv-note"><p>{block.text}</p></div>;
    default:
      return block.text ? <p className="sv-paragraph">{block.text}</p> : null;
  }
}

function TopicCard({ topic, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className={`sv-topic-card ${open ? "sv-topic-card--open" : ""}`}>
      <button className="sv-topic-header" onClick={() => setOpen(!open)}>
        <div className="sv-topic-title-row">
          <span className="sv-topic-number">{String(index + 1).padStart(2, "0")}</span>
          <span className="sv-topic-title">{topic.title}</span>
        </div>
        <span className={`sv-topic-chevron ${open ? "sv-topic-chevron--up" : ""}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      {open && (
        <div className="sv-topic-body">
          {topic.content.map((block, i) => <ContentBlock key={i} block={block} />)}
        </div>
      )}
    </div>
  );
}

export default function StudyViewer({ subcategory, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState(null);

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
    if (section.heading?.toLowerCase().includes(q)) return true;
    return section.topics?.some(t =>
      t.title?.toLowerCase().includes(q) ||
      t.content?.some(b => b.text?.toLowerCase().includes(q) || b.items?.some(item => item.toLowerCase().includes(q)))
    );
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
        <div className="sv-header-meta">
          <h1 className="sv-title">{data.title}</h1>
          {data.description && <p className="sv-description">{data.description}</p>}
        </div>
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

      {data.sections && data.sections.length > 1 && (
        <div className="sv-section-nav">
          <button className={`sv-section-tab ${!activeSection ? "sv-section-tab--active" : ""}`} onClick={() => setActiveSection(null)}>All</button>
          {data.sections.map((s, i) => (
            <button key={i} className={`sv-section-tab ${activeSection === i ? "sv-section-tab--active" : ""}`} onClick={() => setActiveSection(activeSection === i ? null : i)}>
              {s.heading}
            </button>
          ))}
        </div>
      )}

      <div className="sv-content">
        {(filteredSections || [])
          .filter((_, i) => activeSection === null || activeSection === i)
          .map((section, si) => (
            <div key={si} className="sv-section">
              {section.heading && <h2 className="sv-section-heading">{section.heading}</h2>}
              {section.topics?.map((topic, ti) => <TopicCard key={ti} topic={topic} index={ti} />)}
            </div>
          ))}
        {filteredSections?.length === 0 && (
          <div className="sv-empty"><p>No results for "<strong>{searchQuery}</strong>"</p></div>
        )}
      </div>
    </div>
  );
}
