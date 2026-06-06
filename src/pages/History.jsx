import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Clock, Target, TrendingUp, Trash2, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    // Auto-save last exam result into history on page load
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

  const avg = history.length
    ? Math.round(history.reduce((s, r) => s + Math.round((r.score / r.totalQuestions) * 100), 0) / history.length)
    : 0;

  const best = history.length
    ? Math.max(...history.map(r => Math.round((r.score / r.totalQuestions) * 100)))
    : 0;

  const passing = history.filter(r => Math.round((r.score / r.totalQuestions) * 100) >= 80).length;

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-200 hover:text-gray-300 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-200 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all text-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Score History</h2>

      {/* Summary Stats */}
      {history.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-lg p-5">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Target className="w-4 h-4 text-blue-600 dark:text-blue-300" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Exams Taken</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white">{history.length}</div>
          </div>

          <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-lg p-5">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-300" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Average</span>
            </div>
            <div className={`text-3xl font-bold ${getScoreColor(avg)}`}>{avg}%</div>
          </div>

          <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-lg p-5">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-300" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Best Score</span>
            </div>
            <div className={`text-3xl font-bold ${getScoreColor(best)}`}>{best}%</div>
          </div>

          <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-lg p-5">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Target className="w-4 h-4 text-green-600 dark:text-green-300" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Passing</span>
            </div>
            <div className="text-3xl font-bold text-green-500">{passing}/{history.length}</div>
          </div>
        </div>
      )}

      {/* Progress Trend Bar */}
      {history.length > 1 && (
        <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-4">Score Trend (latest → oldest)</h3>
          <div className="flex items-end gap-2 h-20">
            {[...history].slice(0, 20).map((r, i) => {
              const pct = Math.round((r.score / r.totalQuestions) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
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
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Latest</span>
            <span>Oldest</span>
          </div>
        </div>
      )}

      {/* History List */}
      {history.length === 0 ? (
        <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-lg p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No Exam History Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Take a mock exam to start tracking your progress.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            Start an Exam
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((r, i) => {
            const pct = Math.round((r.score / r.totalQuestions) * 100);
            const badge = getBadge(pct);
            const isOpen = expanded === i;
            const label = r.examType === 'professional' ? 'Professional' : r.examType === 'subprofessional' ? 'Sub-Professional' : 'Practice';

            return (
              <div key={i} className="bg-white dark:bg-gray-950 rounded-2xl shadow-lg overflow-hidden">
                {/* Row */}
                <div className="flex items-center justify-between p-5 gap-4">
                  {/* Score circle */}
                  <div className={`w-14 h-14 rounded-full bg-linear-to-br ${getScoreBg(pct)} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-sm">{pct}%</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-800 dark:text-white">{label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>{badge.label}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                      <span>{r.score}/{r.totalQuestions} correct</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {r.timeTaken}
                      </span>
                      <span>{new Date(r.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => { localStorage.setItem('lastExamResult', JSON.stringify(r)); navigate('/results'); }}
                      className="p-2 bg-blue-50 dark:bg-gray-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition-all"
                      title="View full results"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteOne(r.date)}
                      className="p-2 bg-gray-50 dark:bg-gray-900 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setExpanded(isOpen ? null : i)}
                      className="p-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 transition-all"
                    >
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded category breakdown */}
                {isOpen && r.categoryScores && (
                  <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Category Breakdown</p>
                    <div className="space-y-2">
                      {Object.entries(r.categoryScores).map(([cat, scores]) => (
                        <div key={cat} className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 dark:text-gray-300 w-44 truncate">{cat}</span>
                          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full bg-linear-to-r ${getScoreBg(scores.percentage)}`}
                              style={{ width: `${scores.percentage}%` }}
                            />
                          </div>
                          <span className={`text-sm font-semibold w-10 text-right ${getScoreColor(scores.percentage)}`}>
                            {scores.percentage}%
                          </span>
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
    </div>
  );
}

export default History;
