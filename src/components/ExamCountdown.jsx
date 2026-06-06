import { useEffect, useState } from 'react';

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
    const diff = examDate - new Date();
    setDays(diff <= 0 ? 0 : Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, []);

  if (days === null || days === 0) return null;

  const shortDate = examDate.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });

  return (
    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-900 border border-blue-400 dark:border-blue-600 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
      <span>🗓</span>
      <span>{shortDate}</span>
      <span className="text-blue-500 font-bold">{days}d</span>
    </div>
  );
}
