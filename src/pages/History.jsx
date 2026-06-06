import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Clock, Target, TrendingUp, Trash2, RotateCcw, ChevronDown, ChevronUp, AlertTriangle, BookOpen } from 'lucide-react';

function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const last = localStorage.getItem('lastExamResult');
    if (last) {
      try {
        const result = JSON.parse(last);
        const existing = JSON.parse(localStorage.getItem('examHistory') || '[]');
        const alreadySaved = existing.some(r => r.date === result.date);
        if (!alreadySaved) {
          const updated = [result, ...existing].slice(0, 50);
          localStorage.setItem('examHistory', JSON.stringify(updated));
        }
      } catch {}
    }
    const stored = JSON.parse(localStorage.getItem('examHistory') || '[]');
    setHistory(stored);
  }, []);

  const clearHistory = () => {
    if (window.confirm('Clear all exam history? This cannot be undone.')) {
      localStorage.removeItem('examHistory');
      setHistory([]);
    }
  };

  const resetAllData = () => {
    localStorage.removeItem('examHistory');
    localStorage.removeItem('lastExamResult');
    localStorage.removeItem('studyProgress');
    setHistory([]);
    setShowResetConfirm(false);
  };

  const deleteOne = (date) => {
    const updated = history.filter(r => r.date !== date);
    localStorage.setItem('examHistory', JSON.stringify(updated));
    setHistory(updated);
  };

  const getScoreColor = (pct) => {
    if (pct >= 80) return 'text-green-500';
    if (pct >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (pct) => {
    if (pct >= 80) return 'from-green-500 to-emerald-500';
    if (pct >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getBadge = (pct) => {
    if (pct >= 80) return { label: 'Passing', cls: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' };
    if (pct >= 60) return { label: 'Close', cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' };
    return { label: 'Needs Work', cls: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' };
  };

  // ── Weak Areas: average each category across all exams ──────────────────
  const weakAreas = (() => {
    if (history.length === 0) return [];
    const totals = {};
    history.forEach(r => {
      if (!r.categoryScores) return;
      Object.entries(r.categoryScores).forEach(([cat, scores]) => {
        if (!totals[cat]) totals[cat] = { sum: 0, count: 0 };
        totals[cat].sum += scores.percentage;
        totals[cat].count += 1;
      });
    });
    return Object.entries(totals)
      .map(([cat, { sum, count }]) => ({ cat, avg: Math.round(sum / count) }))
      .filter(({ avg }) => avg < 60)
      .sort((a, b) => a.avg - b.avg);
  })();

  const avg = history.length
    ? Math.round(history.reduce((s, r) => s + Math.round((r.score / r.totalQuestions) * 100), 0) / history.length)
    : 0;
  const best = history.length
    ? Math.max(...history.map(r => Math.round((r.score / r.totalQuestions) * 100)))
    : 0;
  const passing = history.filter(r => Math.round((r.score / r.totalQuestions) * 100) >= 80).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl" style={{background:"#0a0a0a",minHeight:"100vh"}}>

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32}}>
        <button
          onClick={() => navigate('/')}
          className="btn btn-dark" style={{padding:"8px 16px",fontSize:11}}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="btn btn-danger"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <h2 style={{fontFamily:"'DM Serif Display',Georgia,serif",color:"#fff",fontSize:28,fontWeight:400,marginBottom:24,letterSpacing:"-0.5px"}}>Score History</h2>

      {/* Summary Stats */}
      {history.length > 0 && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:28}}>
          <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:10,padding:20}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{padding:6,background:"#0d1f3c",borderRadius:6}}>
                <Target className="w-4 h-4 text-blue-600 dark:text-blue-300" />
              </div>
              <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#444",textTransform:"uppercase",letterSpacing:"0.1em"}}>Exams Taken</span>
            </div>
            <div style={{fontFamily:"'DM Serif Display',Georgia,serif",color:"#fff",fontSize:32,fontWeight:400}}>{history.length}</div>
          </div>
          <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:10,padding:20}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{padding:6,background:"#1a0d3c",borderRadius:6}}>
                <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-300" />
              </div>
              <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#444",textTransform:"uppercase",letterSpacing:"0.1em"}}>Average</span>
            </div>
            <div className={`text-3xl font-bold ${getScoreColor(avg)}`}>{avg}%</div>
          </div>
          <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:10,padding:20}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{padding:6,background:"#2a1f00",borderRadius:6}}>
                <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-300" />
              </div>
              <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#444",textTransform:"uppercase",letterSpacing:"0.1em"}}>Best Score</span>
            </div>
            <div className={`text-3xl font-bold ${getScoreColor(best)}`}>{best}%</div>
          </div>
          <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:10,padding:20}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{padding:6,background:"#0a2a1a",borderRadius:6}}>
                <Target className="w-4 h-4 text-green-600 dark:text-green-300" />
              </div>
              <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#444",textTransform:"uppercase",letterSpacing:"0.1em"}}>Passing</span>
            </div>
            <div className="text-3xl font-bold text-green-500">{passing}/{history.length}</div>
          </div>
        </div>
      )}

      {/* Weak Areas */}
      {weakAreas.length > 0 && (
        <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderLeft:"3px solid #ef4444",borderRadius:10,padding:24,marginBottom:24}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 style={{fontFamily:"'DM Serif Display',Georgia,serif",color:"#fff",fontSize:16,fontWeight:400}}>Weak Areas — Focus Here</h3>
            <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#333",marginLeft:4}}>(avg below 60% across all exams)</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {weakAreas.map(({ cat, avg: catAvg }) => (
              <div key={cat} style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#888",width:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cat}</span>
                <div style={{flex:1,background:"#1a1a1a",borderRadius:999,height:6}}>
                  <div
                    className="h-2.5 rounded-full bg-linear-to-r from-red-500 to-rose-400 transition-all"
                    style={{ width: `${catAvg}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-red-500 w-10 text-right">{catAvg}%</span>
                <button
                  onClick={() => navigate('/review')}
                  style={{display:"flex",alignItems:"center",gap:4,padding:"3px 8px",background:"#2a0a0a",color:"#ef4444",border:"1px solid #4a1a1a",borderRadius:5,fontSize:10,fontFamily:"'IBM Plex Mono',monospace",cursor:"pointer"}}
                >
                  <BookOpen className="w-3 h-3" />
                  Study
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Score Trend */}
      {history.length > 1 && (
        <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:10,padding:24,marginBottom:24}}>
          <h3 style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#444",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:16}}>Score Trend (latest → oldest)</h3>
          <div style={{display:"flex",alignItems:"flex-end",gap:4,height:80}}>
            {[...history].slice(0, 20).map((r, i) => {
              const pct = Math.round((r.score / r.totalQuestions) * 100);
              return (
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,position:"relative"}}>
                  <div
                    className={`w-full rounded-t-md bg-linear-to-t ${getScoreBg(pct)} transition-all`}
                    style={{ height: `${Math.max(8, pct * 0.72)}px` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {pct}%
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
            <span>Latest</span>
            <span>Oldest</span>
          </div>
        </div>
      )}

      {/* History List */}
      {history.length === 0 ? (
        <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:10,padding:48,textAlign:"center"}}>
          <Trophy style={{width:48,height:48,color:"#222",margin:"0 auto 16px"}} />
          <h3 style={{fontFamily:"'DM Serif Display',Georgia,serif",color:"#fff",fontSize:22,fontWeight:400,marginBottom:8}}>No Exam History Yet</h3>
          <p style={{fontFamily:"'IBM Plex Mono',monospace",color:"#555",fontSize:12,marginBottom:24}}>Take a mock exam to start tracking your progress.</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-white"
          >
            Start an Exam
          </button>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {history.map((r, i) => {
            const pct = Math.round((r.score / r.totalQuestions) * 100);
            const badge = getBadge(pct);
            const isOpen = expanded === i;
            const label = r.examType === 'professional' ? 'Professional' : r.examType === 'subprofessional' ? 'Sub-Professional' : 'Practice';
            return (
              <div key={i} style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:10,overflow:"hidden"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:20,gap:16}}>
                  <div className={`w-14 h-14 rounded-full bg-linear-to-br ${getScoreBg(pct)} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-sm">{pct}%</span>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                      <span style={{fontFamily:"'DM Serif Display',Georgia,serif",color:"#fff",fontSize:15,fontWeight:400}}>{label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>{badge.label}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginTop:4,flexWrap:"wrap"}}>
                      <span>{r.score}/{r.totalQuestions} correct</span>
                      <span style={{display:"flex",alignItems:"center",gap:4}}><Clock className="w-3 h-3" />{r.timeTaken}</span>
                      <span>{new Date(r.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                    <button
                      onClick={() => { localStorage.setItem('lastExamResult', JSON.stringify(r)); navigate('/results'); }}
                      style={{padding:7,background:"#0d1f3c",color:"#3b82f6",border:"1px solid #1a3a6a",borderRadius:6,cursor:"pointer"}}
                      title="View full results"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteOne(r.date)}
                      style={{padding:7,background:"#111",color:"#444",border:"1px solid #1e1e1e",borderRadius:6,cursor:"pointer"}}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setExpanded(isOpen ? null : i)}
                      style={{padding:7,background:"#111",color:"#444",border:"1px solid #1e1e1e",borderRadius:6,cursor:"pointer"}}
                    >
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {isOpen && r.categoryScores && (
                  <div style={{padding:"16px 20px 20px",borderTop:"1px solid #1e1e1e"}}>
                    <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#444",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:12}}>Category Breakdown</p>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {Object.entries(r.categoryScores).map(([cat, scores]) => (
                        <div key={cat} style={{display:"flex",alignItems:"center",gap:10}}>
                          <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#666",width:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cat}</span>
                          <div style={{flex:1,background:"#1a1a1a",borderRadius:999,height:4}}>
                            <div className={`h-2 rounded-full bg-linear-to-r ${getScoreBg(scores.percentage)}`} style={{ width: `${scores.percentage}%` }} />
                          </div>
                          <span className={`text-sm font-semibold w-10 text-right ${getScoreColor(scores.percentage)}`}>{scores.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Reset All Data ── */}
      <div style={{marginTop:48,paddingTop:32,borderTop:"1px solid #1e1e1e"}}>
        {!showResetConfirm ? (
          <div style={{textAlign:"center"}}>
            <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#333",marginBottom:12}}>This will erase all exam history and study progress.</p>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="btn btn-danger" style={{margin:"0 auto",display:"flex"}}
            >
              <Trash2 className="w-4 h-4" />
              Reset All Data
            </button>
          </div>
        ) : (
          <div style={{background:"#1a0505",border:"1px solid #3a1010",borderRadius:10,padding:24,textAlign:"center",maxWidth:420,margin:"0 auto"}}>
            <AlertTriangle style={{width:28,height:28,color:"#ef4444",margin:"0 auto 12px"}} />
            <p style={{fontFamily:"'DM Serif Display',Georgia,serif",color:"#fff",fontSize:16,fontWeight:400,marginBottom:4}}>Reset everything?</p>
            <p style={{fontFamily:"'IBM Plex Mono',monospace",color:"#555",fontSize:11,marginBottom:20}}>All exam history and study progress will be permanently deleted. This cannot be undone.</p>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="btn btn-dark" style={{padding:"8px 18px",fontSize:11}}
              >
                Cancel
              </button>
              <button
                onClick={resetAllData}
                className="btn btn-danger" style={{padding:"8px 18px",fontSize:11,background:"#ef4444",color:"#fff"}}
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default History;
