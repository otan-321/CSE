import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

const EXAM_DATES = [
  new Date('2026-08-09T00:00:00'),
  new Date('2027-03-14T00:00:00'),
];

function getNextExamDate() {
  const now = new Date();
  return EXAM_DATES.find(d => d > now) || EXAM_DATES[EXAM_DATES.length - 1];
}

export default function ExamCountdown() {
  const [days, setDays] = useState(null);
  const examDate = getNextExamDate();

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const diff = examDate - now;
      setDays(diff <= 0 ? 0 : Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };
    calc();
  }, []);

  if (days === null || days === 0) return null;

  const examLabel = examDate.toLocaleDateString('en-PH', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="mx-auto max-w-2xl mb-8">
      <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            Next CSE-PPT · {examLabel}
          </p>
        </div>
        <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-900 rounded-xl py-5 px-12 mt-2">
          <span className="text-5xl font-bold bg-linear-to-br from-blue-500 to-purple-500 bg-clip-text text-transparent tabular-nums">
            {days}
          </span>
          <span className="text-sm text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">
            {days === 1 ? 'Day' : 'Days'} to go
          </span>
        </div>
      </div>
    </div>
  );
}
