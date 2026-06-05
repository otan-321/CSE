import { BookOpen, Clock, ChevronRight, FileText, Brain, Globe, BarChart2 } from "lucide-react";

function Review() {
  const categories = [
    {
      id: "verbal",
      title: "Verbal Ability",
      description: "Vocabulary, grammar, reading comprehension, analogy and logic exercises.",
      icon: "FileText",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-gray-950",
      badge: "Language",
      subcategories: ["Vocabulary", "Grammar", "Reading Comprehension", "Analogy", "Logic"],
    },
    {
      id: "numerical",
      title: "Numerical Ability",
      description: "Basic math, word problems, number series and data interpretation.",
      icon: "BarChart2",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-gray-950",
      badge: "Mathematics",
      subcategories: ["Basic Math", "Word Problems", "Number Series", "Data Interpretation"],
    },
    {
      id: "general",
      title: "General Information",
      description: "Philippine Constitution, environmental laws, human rights and RA 6713.",
      icon: "Globe",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-gray-950",
      badge: "Civics",
      subcategories: ["Philippine Constitution", "Environmental Management", "Peace and Human Rights", "RA 6713"],
    },
    {
      id: "analytical",
      title: "Analytical Ability",
      description: "Analytical reasoning for Professional level and clerical skills for Sub-Professional.",
      icon: "Brain",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-gray-950",
      badge: "Reasoning",
      subcategories: ["Analytical Ability (Pro)", "Clerical Ability (Sub)"],
    },
  ];

  const iconMap = {
    FileText: <FileText className="w-8 h-8" />,
    BarChart2: <BarChart2 className="w-8 h-8" />,
    Globe: <Globe className="w-8 h-8" />,
    Brain: <Brain className="w-8 h-8" />,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-4 py-2 bg-linear-to-r from-blue-100 to-purple-100 rounded-full mb-4">
          <BookOpen className="w-4 h-4 text-blue-500 mr-2" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Study Mode</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">Choose a Category</h2>
        <p className="text-gray-600 dark:text-gray-200 max-w-2xl mx-auto">
          Select a subject area to start reviewing. More features coming soon!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={"group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 " + cat.bgColor}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={"p-3 rounded-xl bg-linear-to-br " + cat.color + " text-white"}>
                  {iconMap[cat.icon]}
                </div>
                <span className="px-3 py-1 bg-white dark:bg-gray-950 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-sm">
                  {cat.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{cat.title}</h3>
              <p className="text-gray-600 dark:text-gray-200 mb-4">{cat.description}</p>

              <div className="space-y-2 mb-6">
                {cat.subcategories.map((sub) => (
                  <div key={sub} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl px-4 py-2 group-hover:shadow-sm transition-all">
                    <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">{sub}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Coming Soon
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
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
