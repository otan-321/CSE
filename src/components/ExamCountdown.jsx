import { useEffect, useState } from 'react';

const EXAM_DATES = [
  new Date('2026-08-09T00:00:00'),
  new Date('2027-03-14T00:00:00'),
];

function getNextExamDate() {
  const now = new Date();
  return EXAM_DATES.find(d => d > now) || EXAM_DATES[EXAM_DATES.length - 1];
}

export default function ExamCountdown({ obsidian = false }) {
  const [days, setDays] = useState(null);
  const examDate = getNextExamDate();

  useEffect(() => {
    const diff = examDate - new Date();
    setDays(diff <= 0 ? 0 : Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, []);

  if (days === null || days === 0) return null;

  const shortDate = examDate.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });

  return (
    <div className="ob-font-mono" style={{
      fontSize: '10px', letterSpacing: '0.1em', color: '#8E9192',
      border: '1px solid #27272A', padding: '5px 12px',
      display: 'flex', alignItems: 'center', gap: '6px',
    }}>
      <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{days}D</span>
      <span>· {shortDate}</span>
    </div>
  );
}
