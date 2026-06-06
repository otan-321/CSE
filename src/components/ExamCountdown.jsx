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
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 12px', border: '1px solid #2a2a2a', borderRadius: 999, background: '#111' }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#3b82f6' }} />
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#555', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {shortDate} · <strong style={{ color: '#fff' }}>{days}d</strong>
      </span>
    </div>
  );
}
