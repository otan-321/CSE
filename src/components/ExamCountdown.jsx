import { useState, useEffect } from 'react';
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
  const [timeLeft, setTimeLeft] = useState({});
  const examDate = getNextExamDate();

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const diff = examDate - now;
      if (diff <= 0) return setTimeLeft({ expired: true });
      setTimeLeft({
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = n => String(n).padStart(2, '0');

  const examLabel = examDate.toLocaleDateString('en-PH', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  if (timeLeft.expired) return null;

  return (
    <div className="mx-auto max-w-2xl mb-8">
      <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-blue-500" />
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            Next CSE-PPT · {examLabel}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Days',    value: timeLeft.days },
            { label: 'Hours',   value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center bg-gray-50 dark:bg-gray-900 rounded-xl py-4 px-2">
              <span className="text-3xl md:text-4xl font-bold bg-linear-to-br from-blue-500 to-purple-500 bg-clip-text text-transparent tabular-nums">
                {pad(value ?? 0)}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">
                {label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-4">
          {timeLeft.days === 0
            ? "🔥 Exam is today! You got this!"
            : timeLeft.days <= 7
            ? "⚡ Final stretch — study hard!"
            : timeLeft.days <= 30
            ? "📚 Less than a month — stay focused!"
            : "💪 Keep grinding — every day counts!"}
        </p>
      </div>
    </div>
  );
}
