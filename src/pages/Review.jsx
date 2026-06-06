import { useState, useEffect } from "react";
import { BookOpen, ChevronRight, FileText, Brain, Globe, BarChart2, CheckCircle2, Layers } from "lucide-react";
import StudyViewer from "../components/StudyViewer";
import FlashcardViewer from "../components/FlashcardViewer";

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

const PROGRESS_KEY = "studyProgress";

function getProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); } catch { return {}; }
}
function markStudied(key) {
  const p = getProgress();
  if (!p[key]) {
    p[key] = { studied: true, date: new Date().toISOString() };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  }
}

function Review() {
  const [activeStudy, setActiveStudy]       = useState(null);
  const [activeFlashcard, setActiveFlashcard] = useState(null);
  const [progress, setProgress]             = useState(getProgress());

  useEffect(() => { setProgress(getProgress()); }, [activeStudy, activeFlashcard]);

  const categories = [
    {
      id: "verbal", title: "Verbal Ability",
      description: "Vocabulary, grammar, reading comprehension, analogy and logic exercises.",
      icon: "FileText", color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-gray-950", badge: "Language",
      subcategories: ["Vocabulary","Grammar","Reading Comprehension","Analogy","Logic"],
    },
    {
      id: "numerical", title: "Numerical Ability",
      description: "Basic math, word problems, number series and data interpretation.",
      icon: "BarChart2", color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-gray-950", badge: "Mathematics",
      subcategories: ["Basic Math","Word Problems","Number Series","Data Interpretation"],
    },
    {
      id: "general", title: "General Information",
      description: "Philippine Constitution, environmental laws, human rights and RA 6713.",
      icon: "Globe", color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-gray-950", badge: "Civics",
      subcategories: ["Philippine Constitution","Environmental Management","Peace and Human Rights","RA 6713"],
    },
    {
      id: "analytical", title: "Analytical Ability",
      description: "Analytical reasoning for Professional level and clerical skills for Sub-Professional.",
      icon: "Brain", color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-gray-950", badge: "Reasoning",
      subcategories: ["Analytical Ability (Pro)","Clerical Ability (Sub)"],
    },
  ];

  const iconMap = {
    FileText: <FileText className="w-8 h-8" />,
    BarChart2: <BarChart2 className="w-8 h-8" />,
    Globe: <Globe className="w-8 h-8" />,
    Brain: <Brain className="w-8 h-8" />,
  };

  const totalAll = Object.keys(STUDY_KEYS).length;
  const doneAll  = Object.keys(progress).length;
  const overallPct = Math.round((doneAll / totalAll) * 100);

  if (activeStudy) {
    return (
      <div className="container mx-auto px-4 py-8" style={{background:"#0a0a0a",minHeight:"100vh"}}>
        <StudyViewer subcategory={activeStudy} onBack={() => setActiveStudy(null)} />
      </div>
    );
  }

  if (activeFlashcard) {
    return (
      <div className="container mx-auto px-4 py-8" style={{background:"#0a0a0a",minHeight:"100vh"}}>
        <FlashcardViewer subcategory={activeFlashcard} onBack={() => setActiveFlashcard(null)} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" style={{background:"#0a0a0a",minHeight:"100vh"}}>
      <div className="text-center mb-10">
        <h2 style={{fontFamily:"'DM Serif Display',Georgia,serif",color:"#fff",fontSize:28,fontWeight:400,marginBottom:12,letterSpacing:"-0.5px"}}>Choose a Category</h2>
        <p style={{fontFamily:"'IBM Plex Mono',monospace",color:"#555",fontSize:12,maxWidth:600,margin:"0 auto"}}>Select a subject area to start reviewing.</p>
      </div>

      {/* Overall Progress */}
      <div style={{maxWidth:896,margin:"0 auto 24px",background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:10,padding:20}}>
        <div className="flex items-center justify-between mb-2">
          <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#888",textTransform:"uppercase",letterSpacing:"0.06em"}}>Overall Study Progress</span>
          <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#3b82f6",fontWeight:700}}>{doneAll}/{totalAll} topics</span>
        </div>
        <div style={{width:"100%",background:"#1a1a1a",borderRadius:999,height:8,margin:"8px 0"}}>
          <div
            style={{height:8,borderRadius:999,background:"linear-gradient(90deg,#3b82f6,#8b5cf6)",transition:"width 0.5s"}}
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#333"}}>{overallPct}% complete</span>
          {doneAll === totalAll && (
            <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#22c55e",display:"flex",alignItems:"center",gap:4}}>
              <CheckCircle2 className="w-3 h-3" /> All topics reviewed!
            </span>
          )}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16,maxWidth:896,margin:"0 auto"}}>
        {categories.map((cat) => {
          const catDone  = cat.subcategories.filter(sub => progress[STUDY_KEYS[sub]]).length;
          const catTotal = cat.subcategories.length;
          const catPct   = Math.round((catDone / catTotal) * 100);

          return (
            <div
              key={cat.id}
              style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:10,transition:"border-color 0.2s"}} onMouseEnter={(e)=>e.currentTarget.style.borderColor="#3b82f6"} onMouseLeave={(e)=>e.currentTarget.style.borderColor="#1e1e1e"}
            >
              <div style={{padding:20}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
                  <div style={{padding:10,borderRadius:8,background:"linear-gradient(135deg,#1a1a1a,#222)",border:"1px solid #2a2a2a",color:"#fff"}}>
                    {iconMap[cat.icon]}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                    <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#555",border:"1px solid #2a2a2a",borderRadius:999,padding:"2px 8px",textTransform:"uppercase",letterSpacing:"0.08em"}}>{cat.badge}</span>
                    <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#444"}}>{catDone}/{catTotal} done</span>
                  </div>
                </div>

                <h3 style={{fontFamily:"'DM Serif Display',Georgia,serif",color:"#fff",fontSize:17,fontWeight:400,marginBottom:4,letterSpacing:"-0.3px"}}>{cat.title}</h3>
                <div style={{width:"100%",background:"#1a1a1a",borderRadius:999,height:4,marginBottom:10}}>
                  <div
                    style={{height:4,borderRadius:999,background:"linear-gradient(90deg,#3b82f6,#8b5cf6)",transition:"width 0.5s"}}
                    style={{ width: `${catPct}%` }}
                  />
                </div>
                <p style={{fontFamily:"'IBM Plex Mono',monospace",color:"#555",fontSize:11,lineHeight:1.7,marginBottom:14}}>{cat.description}</p>

                <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:8}}>
                  {cat.subcategories.map((sub) => {
                    const key     = STUDY_KEYS[sub];
                    const studied = !!progress[key];
                    return (
                      <div
                        key={sub}
                        style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#111",border:"1px solid #1e1e1e",borderRadius:7,padding:"10px 12px"}}
                      >
                        {/* Left: check + name */}
                        <div style={{display:"flex",alignItems:"center",gap:8,minWidth:0}}>
                          {studied
                            ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            : <div style={{width:14,height:14,borderRadius:"50%",border:"2px solid #2a2a2a",flexShrink:0}} />
                          }
                          <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#888",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sub}</span>
                        </div>
                        {/* Right: two buttons */}
                        <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0,marginLeft:8}}>
                          <button
                            onClick={() => { markStudied(key); setActiveStudy(key); }}
                            style={{display:"flex",alignItems:"center",gap:4,padding:"4px 8px",borderRadius:5,fontSize:10,fontFamily:"'IBM Plex Mono',monospace",background:"#0d1f3c",color:"#3b82f6",border:"1px solid #1a3a6a",cursor:"pointer"}}
                          >
                            <BookOpen className="w-3 h-3" />
                            Study
                          </button>
                          <button
                            onClick={() => { markStudied(key); setActiveFlashcard(key); }}
                            style={{display:"flex",alignItems:"center",gap:4,padding:"4px 8px",borderRadius:5,fontSize:10,fontFamily:"'IBM Plex Mono',monospace",background:"#1a0d3c",color:"#8b5cf6",border:"1px solid #3a1a6a",cursor:"pointer"}}
                          >
                            <Layers className="w-3 h-3" />
                            Cards
                          </button>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <a href="/" className="btn btn-dark" style={{marginTop:40,display:"inline-flex"}}>
          Back to Home
        </a>
      </div>
    </div>
  );
}

export default Review;
