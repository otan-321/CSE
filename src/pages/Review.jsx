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
      <div className="container mx-auto px-4 py-8">
        <StudyViewer subcategory={activeStudy} onBack={() => setActiveStudy(null)} />
      </div>
    );
  }

  if (activeFlashcard) {
    return (
      <div className="container mx-auto px-4 py-8">
        <FlashcardViewer subcategory={activeFlashcard} onBack={() => setActiveFlashcard(null)} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-4 py-2 bg-linear-to-r from-blue-100 to-purple-100 rounded-full mb-4">
          <BookOpen className="w-4 h-4 text-blue-500 mr-2" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Study Mode</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">Choose a Category</h2>
        <p className="text-gray-600 dark:text-gray-200 max-w-2xl mx-auto">Select a subject area to start reviewing.</p>
      </div>

      {/* Overall Progress */}
      <div className="max-w-4xl mx-auto mb-8 bg-white dark:bg-gray-950 rounded-2xl shadow-lg p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Overall Study Progress</span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{doneAll}/{totalAll} topics</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">{overallPct}% complete</span>
          {doneAll === totalAll && (
            <span className="text-xs text-green-500 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> All topics reviewed!
            </span>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {categories.map((cat) => {
          const catDone  = cat.subcategories.filter(sub => progress[STUDY_KEYS[sub]]).length;
          const catTotal = cat.subcategories.length;
          const catPct   = Math.round((catDone / catTotal) * 100);

          return (
            <div
              key={cat.id}
              className={"group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 " + cat.bgColor}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={"p-3 rounded-xl bg-linear-to-br " + cat.color + " text-white"}>
                    {iconMap[cat.icon]}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-3 py-1 bg-white dark:bg-gray-950 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-sm">{cat.badge}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{catDone}/{catTotal} done</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{cat.title}</h3>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-3">
                  <div
                    className={"h-1.5 rounded-full bg-linear-to-r " + cat.color + " transition-all duration-500"}
                    style={{ width: `${catPct}%` }}
                  />
                </div>
                <p className="text-gray-600 dark:text-gray-200 mb-4 text-sm">{cat.description}</p>

                <div className="space-y-2 mb-2">
                  {cat.subcategories.map((sub) => {
                    const key     = STUDY_KEYS[sub];
                    const studied = !!progress[key];
                    return (
                      <div
                        key={sub}
                        className="w-full flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 group-hover:shadow-sm transition-all"
                      >
                        {/* Left: check + name */}
                        <div className="flex items-center gap-2 min-w-0">
                          {studied
                            ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            : <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
                          }
                          <span className="text-sm text-gray-700 dark:text-gray-200 font-medium truncate">{sub}</span>
                        </div>
                        {/* Right: two buttons */}
                        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                          <button
                            onClick={() => { markStudied(key); setActiveStudy(key); }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-all"
                          >
                            <BookOpen className="w-3 h-3" />
                            Study
                          </button>
                          <button
                            onClick={() => { markStudied(key); setActiveFlashcard(key); }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 transition-all"
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
        <a href="/" className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:shadow-md transition-all">
          Back to Home
        </a>
      </div>
    </div>
  );
}

export default Review;
