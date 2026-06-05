import { useState } from 'react';
import { ArrowRight, Star, BookOpen } from 'lucide-react';
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
        <div className="inline-flex items-center px-4 py-2 bg-linear-to-r from-blue-100 to-purple-100 rounded-full mb-4">
          <Star className="w-4 h-4 text-yellow-500 mr-2" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-950">Philippine Civil Service Examination</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Master the Civil Service Exam with{' '}
          <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CSE Reviewer
          </span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-200 max-w-3xl mx-auto mb-8">
          Prepare smarter with personalized mock tests and detailed explanations for both Professional and Sub-Professional levels.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <a href="#exams" className="px-8 py-4 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center">
            Start Free Mock Examination
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
          <a href="/review" className="px-8 py-4 bg-white border-2 border-blue-500 text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center">
            Start Review
            <BookOpen className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>

      <div id="exams" className="scroll-mt-16 mb-16">
        <ExamSelection />
      </div>

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
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Filipino citizen
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  At least 18 years old
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Of good moral character
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  No criminal record
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Not removed from service for cause
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default Home;
