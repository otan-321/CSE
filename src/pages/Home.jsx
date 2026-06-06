import { useState } from 'react';
import { ArrowRight, BookOpen, Code2, Brain, Database, Heart } from 'lucide-react';
import ExamSelection from '../components/ExamSelection';

function Home() {
  const [activeTab, setActiveTab] = useState('about');

  const tips = [
    "Review basic grammar and vocabulary daily",
    "Practice mathematical operations without calculator",
    "Study Philippine Constitution and government structure",
    "Take timed practice tests regularly",
    "Focus on weakest areas"
  ];

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="text-center mb-6 pt-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Pass the CSE.
          <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            No Excuses.
          </span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-200 max-w-3xl mx-auto mb-8">
          Stop wishing, start drilling. Free mock exams and full study guides built for the Philippine Civil Service Exam. No shortcuts — just results.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <a href="#exams" className="px-8 py-4 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center">
            Start Exam Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
          <a href="/review" className="px-8 py-4 bg-white dark:bg-gray-950 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center">
            Study Hard
            <BookOpen className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>

      <div id="exams" className="scroll-mt-16 mb-16">
        <ExamSelection />
      </div>

      {/* Tabs */}
      <div className="mb-16">
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`px-6 py-3 font-medium text-lg ${activeTab === 'about' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-100'}`}
            onClick={() => setActiveTab('about')}
          >
            About the Exam
          </button>
          <button
            className={`px-6 py-3 font-medium text-lg ${activeTab === 'tips' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-100'}`}
            onClick={() => setActiveTab('tips')}
          >
            Study Tips
          </button>
          <button
            className={`px-6 py-3 font-medium text-lg ${activeTab === 'requirements' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-100'}`}
            onClick={() => setActiveTab('requirements')}
          >
            Requirements
          </button>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-8 shadow-lg">
          {activeTab === 'about' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">About the Civil Service Exam</h3>
              <p className="text-gray-700 dark:text-gray-200 mb-4">
                The Civil Service Examination (CSE) is conducted by the Philippine Civil Service Commission (CSC) to determine the fitness of individuals who want to enter government service.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="p-4 bg-blue-50 dark:bg-gray-900 rounded-xl">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-2">Professional Level</h4>
                  <ul className="text-gray-700 dark:text-gray-200 space-y-2">
                    <li>• For college graduates</li>
                    <li>• 170 multiple-choice items</li>
                    <li>• 3.5 hours duration</li>
                    <li>• Higher salary grade eligibility</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 dark:bg-gray-900 rounded-xl">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-2">Sub-Professional Level</h4>
                  <ul className="text-gray-700 dark:text-gray-200 space-y-2">
                    <li>• For non-college graduates</li>
                    <li>• 165 multiple-choice items</li>
                    <li>• 2.5 hours duration</li>
                    <li>• Entry-level government positions</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Effective Study Tips</h3>
              <div className="space-y-4">
                {tips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="p-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-lg">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-200 pt-1">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Examination Requirements</h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-200">
                <li className="flex items-center"><div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>Filipino citizen</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>At least 18 years old</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>Of good moral character</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>No criminal record</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>Not removed from service for cause</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* About This Project */}
      <div className="mb-16">
        <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-lg overflow-hidden">
          {/* Header bar */}
          <div className="bg-linear-to-r from-blue-500 to-purple-600 px-8 py-5">
            <h3 className="text-xl font-bold text-white">About This Project</h3>
            <p className="text-blue-100 text-sm mt-1">Made by Otan</p>
          </div>

          <div className="p-8">
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 dark:bg-gray-900 rounded-xl p-4 text-center">
                <Code2 className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Built With</div>
                <div className="text-sm font-bold text-gray-800 dark:text-white mt-1">Vibe Coding</div>
              </div>
              <div className="bg-purple-50 dark:bg-gray-900 rounded-xl p-4 text-center">
                <Brain className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Powered By</div>
                <div className="text-sm font-bold text-gray-800 dark:text-white mt-1">Claude AI</div>
              </div>
              <div className="bg-green-50 dark:bg-gray-900 rounded-xl p-4 text-center">
                <Database className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Questions</div>
                <div className="text-sm font-bold text-gray-800 dark:text-white mt-1">Multi-Source</div>
              </div>
              <div className="bg-red-50 dark:bg-gray-900 rounded-xl p-4 text-center">
                <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Cost</div>
                <div className="text-sm font-bold text-gray-800 dark:text-white mt-1">100% Free</div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <p>
                This is not your typical reviewer app. It was built entirely through <span className="font-semibold text-blue-500">vibe coding</span> — no traditional hand-coding, no computer science degree required. Every feature, every component, and every line of code was generated using <span className="font-semibold text-purple-500">Claude AI</span> by Anthropic, guided by ideas and direction from the creator.
              </p>
              <p>
                The project started as a clone and evolved into something original — redesigned, expanded, and continuously improved through conversations with AI. Think of it as a collaboration between human creativity and machine execution.
              </p>
              <p>
                <span className="font-semibold text-gray-800 dark:text-white">Study materials and mock exam questions</span> are compiled and collected from different reviewers — including AI-generated content (Gemini, DeepSeek, ChatGPT), CSE review centers, social media study groups, and old Philippine Civil Service reviewer books. Some questions may have inconsistencies — reports are welcome.
              </p>

              {/* Free forever banner */}
              <div className="mt-4 bg-linear-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-900 border border-blue-100 dark:border-gray-800 rounded-xl p-4 text-center">
                <p className="font-bold text-gray-800 dark:text-white">This site is and will always be free.</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">No ads. No paywalls. Built for Filipinos, by a Filipino, with a little help from AI. 🇵🇭</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;
