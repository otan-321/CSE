import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { examService } from '../services/examService';

const C = {
  bg: '#09090B', surface: '#131315', surfaceLow: '#1C1B1D',
  surfaceHigh: '#2A2A2C', surfaceHighest: '#353437',
  border: '#27272A', borderHover: '#3F3F46',
  text: '#E5E1E4', textMuted: '#C4C7C8', textDim: '#8E9192',
  white: '#FFFFFF', success: '#22C55E', error: '#FF4444',
};

function Exam() {
  const { type } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryProgress, setCategoryProgress] = useState({});
  const [examConfig, setExamConfig] = useState(null);
  const timerRef = useRef(null);
  const hasShownContinuePrompt = useRef(false);

  useEffect(() => {
    if (!isLoading && questions.length > 0) {
      const questionCard = document.querySelector('[data-question-card]');
      if (questionCard) questionCard.focus({ preventScroll: true });
    }
  }, [isLoading, questions]);

  useEffect(() => {
    let isMounted = true;
    const initializeExam = async () => {
      if (hasShownContinuePrompt.current) return;
      const savedProgress = examService.loadProgress(type);
      if (savedProgress) {
        hasShownContinuePrompt.current = true;
        const continueExam = window.confirm('You have an exam in progress. Would you like to continue?');
        if (continueExam && isMounted) {
          setQuestions(savedProgress.questions || []);
          setAnswers(savedProgress.answers || {});
          setCurrentQuestion(savedProgress.currentQuestion || 0);
          setTimeRemaining(savedProgress.timeRemaining || 0);
          let totalQuestions;
          let categories = [];
          if (type === 'practice') {
            totalQuestions = savedProgress.questions?.length || 60;
          } else {
            categories = examService.getExamCategories(type);
            totalQuestions = savedProgress.questions?.length || categories.length * 20;
          }
          setExamConfig({
            totalQuestions,
            timeLimit: savedProgress.timeRemaining || examService.getAdaptedTimeLimit(type, totalQuestions),
            categories: type === 'practice' ? 6 : categories.length,
          });
          updateCategoryProgress(savedProgress.questions || [], savedProgress.answers || {});
          setIsLoading(false);
          return;
        } else if (isMounted) {
          examService.clearProgress(type);
          hasShownContinuePrompt.current = false;
        }
      }
      let totalQuestions, categoriesCount, categories = [];
      if (type === 'practice') {
        totalQuestions = 60; categoriesCount = 6;
      } else {
        categories = examService.getExamCategories(type);
        totalQuestions = categories.reduce((sum, cat) => sum + (cat === 'General Information' ? 10 : 20), 0);
        categoriesCount = categories.length;
      }
      if (isMounted) setExamConfig({ totalQuestions, timeLimit: examService.getAdaptedTimeLimit(type, totalQuestions), categories: categoriesCount });
      await generateNewExam(isMounted);
    };
    initializeExam();
    return () => { isMounted = false; };
  }, [type]);

  const generateNewExam = async (isMounted = true) => {
    if (!isMounted) return;
    setIsLoading(true);
    try {
      await examService.initialize();
      const examQuestions = await examService.generateExam(type);
      if (examQuestions.length === 0) throw new Error('No questions were generated.');
      if (isMounted) {
        setQuestions(examQuestions);
        updateCategoryProgress(examQuestions, {});
        const timeLimit = examService.getAdaptedTimeLimit(type, examQuestions.length);
        setTimeRemaining(timeLimit);
        setExamConfig(prev => ({ ...prev, totalQuestions: examQuestions.length, timeLimit }));
        saveProgress(timeLimit, examQuestions);
      }
    } catch (error) {
      console.error('Failed to generate exam:', error);
      alert(`Failed to load exam questions: ${error.message}`);
      if (isMounted) navigate('/');
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  const updateCategoryProgress = (questionsList, currentAnswers) => {
    const progress = {};
    questionsList.forEach(q => {
      if (!progress[q.category]) progress[q.category] = { total: 0, answered: 0 };
      progress[q.category].total++;
      if (currentAnswers[q.id]) progress[q.category].answered++;
    });
    setCategoryProgress(progress);
  };

  const saveProgress = (currentTime, currentQuestions = questions) => {
    examService.saveProgress(type, { questions: currentQuestions, answers, currentQuestion, timeRemaining: currentTime, examType: type, timestamp: Date.now() });
  };

  useEffect(() => {
    if (timeRemaining <= 0 || questions.length === 0 || !examConfig) return;
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        if (newTime % 30 === 0) saveProgress(newTime);
        if (newTime <= 0) { clearInterval(timerRef.current); handleSubmitExam(); return 0; }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeRemaining, questions, examConfig]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId, answerId) => {
    const newAnswers = { ...answers, [questionId]: answerId };
    setAnswers(newAnswers);
    updateCategoryProgress(questions, newAnswers);
    saveProgress(timeRemaining);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) setCurrentQuestion(prev => { const n = prev + 1; saveProgress(timeRemaining); return n; });
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion(prev => { const n = prev - 1; saveProgress(timeRemaining); return n; });
  };

  const handleSubmitExam = () => {
    if (questions.length === 0 || !examConfig) return;
    examService.clearProgress(type);
    const { score, total, percentage, evaluations } = examService.calculateScore(questions, answers);
    const categoryScores = examService.calculateCategoryScores(questions, answers);
    const result = {
      examType: type, score, totalQuestions: total, percentage,
      timeTaken: formatTime(examConfig.timeLimit - timeRemaining),
      date: new Date().toISOString(), categoryScores, evaluations,
      answersCount: Object.keys(answers).length,
    };
    localStorage.setItem('lastExamResult', JSON.stringify(result));
    navigate('/results');
  };

  const getCurrentCategory = () => questions.length === 0 ? '' : questions[currentQuestion]?.category || '';
  const getAnsweredCount = () => Object.keys(answers).length;

  if (isLoading) return <LoadingSpinner message="Loading exam questions..." />;

  if (questions.length === 0) {
    return (
      <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: '48px', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
          <AlertCircle style={{ width: 48, height: 48, color: C.error, margin: '0 auto 20px' }} />
          <h2 className="ob-font-display" style={{ color: C.white, fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>No Questions Available</h2>
          <p className="ob-font-mono" style={{ color: C.textDim, fontSize: '12px', marginBottom: '24px' }}>Failed to load exam questions. Please try again.</p>
          <button className="ob-btn-primary" onClick={() => navigate('/')}>RETURN TO HOME</button>
        </div>
      </div>
    );
  }

  if (!examConfig) return <LoadingSpinner message="Loading exam configuration..." />;

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const answeredCount = getAnsweredCount();
  const isLowTime = timeRemaining < 300;

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      {/* ── TOP BAR ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: '56px',
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        position: 'sticky', top: '64px', zIndex: 40,
      }}>
        <div>
          <span className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.15em', color: C.textDim }}>
            {type === 'professional' ? 'PROFESSIONAL LEVEL' : type === 'subprofessional' ? 'SUB-PROFESSIONAL' : 'QUICK PRACTICE'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Timer */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            border: `1px solid ${isLowTime ? C.error : C.border}`, padding: '6px 14px',
          }}>
            <span style={{ fontSize: '12px' }}>⏱</span>
            <span className="ob-font-mono" style={{ fontSize: '13px', color: isLowTime ? C.error : C.white, letterSpacing: '0.05em' }}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          <button className="ob-btn-ghost" onClick={() => { if (window.confirm('Quit the exam? Your progress will be lost.')) navigate('/'); }} style={{ padding: '8px 16px' }}>
            QUIT
          </button>
        </div>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div style={{ background: C.surface, padding: '10px 32px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span className="ob-font-mono" style={{ fontSize: '10px', color: C.textDim }}>{answeredCount} OF {questions.length} ANSWERED</span>
          <span className="ob-font-mono" style={{ fontSize: '10px', color: C.textDim }}>{Math.round((answeredCount / questions.length) * 100)}%</span>
        </div>
        <div className="ob-progress-track">
          <div className="ob-progress-fill" style={{ width: `${(answeredCount / questions.length) * 100}%`, background: C.success }} />
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Left — Question */}
        <div>
          <QuestionCard
            question={currentQ}
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
            onAnswer={(answerId) => handleAnswer(currentQ.id, answerId)}
            selectedAnswer={answers[currentQ.id]}
            isLastQuestion={isLastQuestion}
          />
        </div>

        {/* Right — Controls & Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Nav + Submit */}
          <div style={{ border: `1px solid ${C.border}`, background: C.surface, padding: '20px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <button
                className="ob-btn-ghost"
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                style={{ flex: 1, padding: '10px 0', opacity: currentQuestion === 0 ? 0.3 : 1, cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer' }}
              >← PREV</button>
              <button
                className="ob-btn-ghost"
                onClick={handleNextQuestion}
                disabled={currentQuestion === questions.length - 1}
                style={{ flex: 1, padding: '10px 0', opacity: currentQuestion === questions.length - 1 ? 0.3 : 1, cursor: currentQuestion === questions.length - 1 ? 'not-allowed' : 'pointer' }}
              >NEXT →</button>
            </div>
            <button
              className="ob-btn-primary"
              onClick={() => { if (window.confirm('Are you sure you want to submit the exam?')) handleSubmitExam(); }}
              style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
            >
              SUBMIT EXAM
            </button>
          </div>

          {/* Stats */}
          <div style={{ border: `1px solid ${C.border}`, background: C.surface, padding: '20px' }}>
            <p className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.15em', color: C.textDim, marginBottom: '16px' }}>EXAM STATS</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: C.border, marginBottom: '16px' }}>
              {[
                ['ANSWERED', answeredCount],
                ['REMAINING', questions.length - answeredCount],
                ['TIME USED', formatTime(examConfig.timeLimit - timeRemaining)],
                ['CATEGORY', getCurrentCategory().split(' ')[0] || '—'],
              ].map(([k, v]) => (
                <div key={k} style={{ background: C.surfaceLow, padding: '14px 12px' }}>
                  <p className="ob-font-mono" style={{ fontSize: '9px', letterSpacing: '0.12em', color: C.textDim, marginBottom: '4px' }}>{k}</p>
                  <p className="ob-font-display" style={{ fontSize: '18px', fontWeight: 700, color: C.white }}>{v}</p>
                </div>
              ))}
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="ob-font-mono" style={{ fontSize: '9px', color: C.textDim }}>TIME USED</span>
                <span className="ob-font-mono" style={{ fontSize: '9px', color: C.textDim }}>
                  {Math.round(((examConfig.timeLimit - timeRemaining) / examConfig.timeLimit) * 100)}%
                </span>
              </div>
              <div className="ob-progress-track">
                <div className="ob-progress-fill" style={{ width: `${((examConfig.timeLimit - timeRemaining) / examConfig.timeLimit) * 100}%`, background: isLowTime ? C.error : C.white }} />
              </div>
            </div>
          </div>

          {/* Category Progress */}
          {Object.keys(categoryProgress).length > 0 && (
            <div style={{ border: `1px solid ${C.border}`, background: C.surface, padding: '20px' }}>
              <p className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.15em', color: C.textDim, marginBottom: '16px' }}>CATEGORY PROGRESS</p>
              {Object.entries(categoryProgress).map(([category, stats]) => {
                const pct = Math.round((stats.answered / stats.total) * 100);
                return (
                  <div key={category} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span className="ob-font-body" style={{ fontSize: '12px', color: C.textMuted }}>{category}</span>
                      <span className="ob-font-mono" style={{ fontSize: '10px', color: C.textDim }}>{stats.answered}/{stats.total}</span>
                    </div>
                    <div className="ob-progress-track">
                      <div className="ob-progress-fill" style={{ width: `${pct}%`, background: pct === 100 ? C.success : C.white }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── QUESTION NAVIGATOR ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 32px' }}>
        <div style={{ border: `1px solid ${C.border}`, background: C.surface, padding: '20px' }}>
          <p className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.15em', color: C.textDim, marginBottom: '16px' }}>QUESTION NAVIGATOR</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {questions.map((q, index) => {
              const isAnswered = !!answers[q.id];
              const isCurrent = index === currentQuestion;
              return (
                <button
                  key={q.id}
                  onClick={() => { setCurrentQuestion(index); saveProgress(timeRemaining); }}
                  className="ob-font-mono"
                  title={`Q${index + 1}: ${q.category}${isAnswered ? ' (Answered)' : ''}`}
                  style={{
                    width: '36px', height: '36px', fontSize: '10px', fontWeight: 700,
                    border: `1px solid ${isCurrent ? C.white : isAnswered ? C.success : C.border}`,
                    background: isCurrent ? C.white : isAnswered ? 'rgba(34,197,94,0.1)' : C.surfaceLow,
                    color: isCurrent ? C.bg : isAnswered ? C.success : C.textDim,
                    cursor: 'pointer', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >{index + 1}</button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
            {[
              { color: C.white, bg: C.white, label: 'Current' },
              { color: C.success, border: C.success, label: 'Answered' },
              { color: C.textDim, border: C.border, label: 'Unanswered' },
            ].map(({ color, bg, border, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', border: `1px solid ${border || color}`, background: bg || 'transparent' }} />
                <span className="ob-font-mono" style={{ fontSize: '9px', color: C.textDim }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── GUIDELINES ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 48px' }}>
        <div style={{ border: `1px solid ${C.border}`, background: C.surfaceLow, padding: '20px 24px' }}>
          <p className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.15em', color: C.textDim, marginBottom: '12px' }}>CSC EXAM GUIDELINES</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
            {[
              'Read each question carefully before answering',
              'Manage your time wisely across all categories',
              'Answer all questions — no penalty for wrong answers',
              'Review your answers before submitting',
              'You can change answers anytime before submission',
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span className="ob-font-mono" style={{ fontSize: '9px', color: C.textDim, minWidth: '16px' }}>{String(i + 1).padStart(2, '0')}</span>
                <span className="ob-font-body" style={{ fontSize: '12px', color: C.textMuted, lineHeight: 1.6 }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Exam;
