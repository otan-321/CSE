import { BookOpen, Clock, ChevronRight, ArrowLeft } from 'lucide-react';

function Review() {
  const categories = [
    {
      title: 'Verbal Ability',
      color: 'from-blue-500 to-blue-600',
      light: 'bg-blue-50 dark:bg-blue-950',
      border: 'border-blue-200 dark:border-blue-800',
      subcategories: ['Vocabulary', 'Grammar', 'Reading Comprehension', 'Analogy', 'Logic'],
    },
    {
      title: 'Numerical Ability',
      color: 'from-purple-500 to-purple-600',
      light: 'bg-purple-50 dark:bg-purple-950',
      border: 'border-purple-200 dark:border-purple-800',
      subcategories: ['Basic Math', 'Word Problems', 'Number Series', 'Data Interpretation'],
    },
    {
      title: 'General Information',
      color: 'from-green-500 to-green-600',
      light: 'bg-green-50 dark:bg-green-950',
      border: 'border-green-200 dark:border-green-800',
      subcategories: [
        'Philippine Constitution',
        'Environmental Management',
        'Peace and Human Rights',
        'RA 6713',
      ],
    },
    {
      title: 'Analytical Ability',
      color: 'from-orange-500 to-orange-600',
      light: 'bg-orange-50 dark:bg-orange-950',
      border: 'border-orange-200 dark:border-orange-800',
      subcategories: ['Analytical Ability (Pro)', 'Clerical Ability (Sub)'],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-4 py-2 bg-linear-to-r from-blue-100 to-purple-100 rounded-full mb-4">
          <BookOpen className="w-4 h-4 text-blue-500 mr-2" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Study Mode</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Start Review
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Choose a category to begin reviewing. More features coming soon!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {categories.map((cat) => (
          <div
            key={cat.title}
            className={`rounded-2xl border ${cat.border} ${cat.light} p-6 shadow-md`}
          >
            <div className={`inline-flex items-center px-4 py-2 bg-linear-to-r ${cat.color} text-white rounded-xl font-semibold text-base mb-4`}>
              {cat.title}
            </div>
            <div className="space-y-2">
              {cat.subcategories.map((sub) => (
                <div
                  key={sub}
                  className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl px-4 py-3 cursor-pointer hover:shadow-md transition-all group"
                >
                  <span className="text-gray-700 dark:text-gray-200 font-medium">{sub}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Coming Soon
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        
          href="/"
          className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </a>
      </div>
    </div>
  );
}

export default Review;
