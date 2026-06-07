import { useState, useEffect } from 'react';
import { Maximize2, X } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';

const C = {
  bg: '#09090B', surface: '#131315', surfaceLow: '#1C1B1D',
  surfaceHigh: '#2A2A2C', surfaceHighest: '#353437',
  border: '#27272A', borderHover: '#3F3F46',
  text: '#E5E1E4', textMuted: '#C4C7C8', textDim: '#8E9192',
  white: '#FFFFFF', success: '#22C55E', error: '#FF4444',
};

function QuestionCard({ question, questionNumber, totalQuestions, onAnswer, selectedAnswer, isLastQuestion }) {
  const [localSelected, setLocalSelected] = useState(selectedAnswer);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  useEffect(() => {
    setLocalSelected(selectedAnswer);
  }, [question.id, selectedAnswer]);

  const handleAnswerSelect = (answerId) => {
    setLocalSelected(answerId);
    onAnswer(answerId);
  };

  const getLetter = (index) => String.fromCharCode(65 + index);

  const containsLatex = (text) => text && (text.includes('$') || text.includes('$$'));

  const renderTextWithLatex = (text) => {
    if (!text) return null;
    const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) return <BlockMath key={index} math={part.slice(2, -2)} />;
      if (part.startsWith('$') && part.endsWith('$')) return <InlineMath key={index} math={part.slice(1, -1)} />;
      return <span key={index}>{part}</span>;
    });
  };

  const pct = Math.round((questionNumber / totalQuestions) * 100);

  return (
    <>
      <div style={{ background: C.surface, border: `1px solid ${C.border}` }} data-question-card tabIndex={-1}>
        {/* Progress */}
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="ob-font-mono" style={{ fontSize: '10px', color: C.textDim }}>
              QUESTION {questionNumber} OF {totalQuestions}
            </span>
            <span className="ob-font-mono" style={{ fontSize: '10px', color: C.textDim }}>{pct}%</span>
          </div>
          <div className="ob-progress-track">
            <div className="ob-progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Metadata tags */}
        <div style={{ padding: '16px 24px 0', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {question.language && (
            <span className="ob-font-mono" style={{
              fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '3px 8px', border: `1px solid ${C.border}`, color: C.textDim,
            }}>{question.language === 'filipino' ? 'FILIPINO' : 'ENGLISH'}</span>
          )}
          {question.difficulty && (
            <span className="ob-font-mono" style={{
              fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '3px 8px', border: `1px solid ${C.border}`,
              color: question.difficulty === 'easy' ? C.success : question.difficulty === 'moderate' ? '#EAB308' : C.error,
            }}>{question.difficulty}</span>
          )}
          {question.category && (
            <span className="ob-font-mono" style={{
              fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '3px 8px', border: `1px solid ${C.border}`, color: C.textDim,
            }}>{question.category}</span>
          )}
        </div>

        {/* Question text */}
        <div style={{ padding: '20px 24px' }}>
          {question.src && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ position: 'relative', border: `1px solid ${C.border}`, overflow: 'hidden', background: C.surfaceLow }}>
                <img
                  src={question.src}
                  alt={question.imageAlt || 'Question image'}
                  style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain', cursor: 'pointer' }}
                  onClick={() => setIsImageZoomed(true)}
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <button
                  onClick={() => setIsImageZoomed(true)}
                  style={{
                    position: 'absolute', top: '8px', right: '8px',
                    background: 'rgba(9,9,11,0.7)', border: `1px solid ${C.border}`,
                    color: C.white, padding: '6px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                ><Maximize2 style={{ width: 14, height: 14 }} /></button>
              </div>
              <p className="ob-font-mono" style={{ fontSize: '9px', color: C.textDim, marginTop: '6px', textAlign: 'center' }}>Click image to enlarge</p>
            </div>
          )}

          <p className="ob-font-body" style={{ fontSize: '16px', lineHeight: 1.7, color: C.text }}>
            {containsLatex(question.text) ? renderTextWithLatex(question.text) : question.text}
          </p>
        </div>

        {/* Answer options */}
        <div style={{ padding: '0 24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p className="ob-font-mono" style={{ fontSize: '9px', letterSpacing: '0.15em', color: C.textDim, marginBottom: '4px', textTransform: 'uppercase' }}>
            Select your answer:
          </p>
          {question.options && question.options.map((option, index) => {
            const isSelected = localSelected === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                  padding: '16px 18px', textAlign: 'left', cursor: 'pointer',
                  background: isSelected ? C.surfaceHigh : C.surfaceLow,
                  border: `1px solid ${isSelected ? C.white : C.border}`,
                  transition: 'border-color 0.15s, background 0.15s',
                  width: '100%',
                }}
                onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.background = C.surfaceHigh; } }}
                onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surfaceLow; } }}
              >
                {/* Checkbox */}
                <div style={{
                  width: '18px', height: '18px', flexShrink: 0,
                  border: `2px solid ${isSelected ? C.white : C.borderHover}`,
                  background: isSelected ? C.white : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px',
                  transition: 'border-color 0.15s, background 0.15s',
                }}>
                  {isSelected && <span style={{ fontSize: '10px', color: C.bg, fontWeight: 700 }}>✓</span>}
                </div>
                {/* Letter label */}
                <span className="ob-font-mono" style={{ fontSize: '10px', color: C.textDim, minWidth: '16px', marginTop: '2px' }}>
                  {getLetter(index)}.
                </span>
                {/* Answer text */}
                <span className="ob-font-body" style={{ fontSize: '14px', color: C.text, flex: 1 }}>
                  {containsLatex(option.text) ? renderTextWithLatex(option.text) : option.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 24px', borderTop: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span className="ob-font-mono" style={{ fontSize: '10px', color: C.textDim }}>
            {isLastQuestion ? 'LAST QUESTION' : `${totalQuestions - questionNumber} REMAINING`}
          </span>
          <button
            onClick={() => handleAnswerSelect(null)}
            disabled={!localSelected}
            className="ob-btn-text"
            style={{ opacity: localSelected ? 1 : 0.3, cursor: localSelected ? 'pointer' : 'not-allowed' }}
          >
            CLEAR
          </button>
        </div>
      </div>

      {/* Image zoom modal */}
      {isImageZoomed && question.src && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
          zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
        }}>
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img
              src={question.src}
              alt={question.imageAlt || 'Question image zoomed'}
              style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }}
            />
            <button
              onClick={() => setIsImageZoomed(false)}
              style={{
                position: 'absolute', top: '8px', right: '8px',
                background: 'rgba(9,9,11,0.85)', border: `1px solid ${C.border}`,
                color: C.white, padding: '8px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            ><X style={{ width: 16, height: 16 }} /></button>
          </div>
        </div>
      )}
    </>
  );
}

export default QuestionCard;
