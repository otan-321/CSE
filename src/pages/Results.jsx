import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Share2, RotateCcw, FileText } from 'lucide-react';
import ResultCard from '../components/ResultCard';
import LoadingSpinner from '../components/LoadingSpinner';

const C = {
  bg: '#09090B', surface: '#131315', surfaceLow: '#1C1B1D',
  surfaceHigh: '#2A2A2C', border: '#27272A', borderHover: '#3F3F46',
  text: '#E5E1E4', textMuted: '#C4C7C8', textDim: '#8E9192',
  white: '#FFFFFF', success: '#22C55E', error: '#FF4444',
};

function Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const savedResult = localStorage.getItem('lastExamResult');
    if (savedResult) setResult(JSON.parse(savedResult));
    setIsLoading(false);
  }, []);

  const handleRetakeExam = () => { if (result) navigate(`/exam/${result.examType}`); };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `cse-results-${new Date().toISOString().split('T')[0]}.json`);
    link.click();
  };

  const handleDownloadPDF = async () => {
    if (!result) return;
    setIsGeneratingPDF(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const PRIMARY_COLOR = [59, 130, 246];
      const TEXT_COLOR = [30, 41, 59];
      const MUTED_COLOR = [100, 116, 139];
      const LIGHT_BG_COLOR = [240, 245, 255];
      const resetText = () => { doc.setTextColor(...TEXT_COLOR); doc.setFont('helvetica', 'normal'); };
      doc.setFillColor(...PRIMARY_COLOR);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.setTextColor(255, 255, 255);
      doc.text('Civil Service Mock Exam Results', 105, 20, { align: 'center' });
      doc.setFontSize(10); doc.setFont('helvetica', 'normal');
      doc.text('Unofficial Result - CSE Reviewer', 105, 30, { align: 'center' });
      let yPos = 60;
      doc.setFontSize(14); doc.setTextColor(...PRIMARY_COLOR); doc.setFont('helvetica', 'bold');
      doc.text('Exam Details', 20, 55);
      const drawRow = (label, value, x, y) => {
        doc.setFont('helvetica', 'bold'); doc.text(label, x, y);
        doc.setFont('helvetica', 'normal'); doc.text(value, x + 35, y);
      };
      resetText(); doc.setFontSize(11);
      drawRow('Exam Type:', result.examType === 'professional' ? 'Professional Level' : 'Sub-Professional Level', 20, yPos);
      drawRow('Date:', new Date(result.date).toLocaleDateString(), 20, yPos + 8);
      const percentageVal = Math.round((result.score / result.totalQuestions) * 100);
      const isPassing = percentageVal >= 80;
      doc.setFontSize(14); doc.setTextColor(...PRIMARY_COLOR); doc.setFont('helvetica', 'bold');
      doc.text('Score Overview', 110, 55);
      doc.setFillColor(...LIGHT_BG_COLOR); doc.roundedRect(110, 58, 80, 25, 3, 3, 'F');
      doc.setFontSize(10); doc.setTextColor(...MUTED_COLOR); doc.text('FINAL SCORE', 115, 66);
      doc.setFontSize(20); doc.setFont('helvetica', 'bold');
      doc.setTextColor(...(isPassing ? [22, 163, 74] : PRIMARY_COLOR));
      doc.text(`${result.score}/${result.totalQuestions}`, 115, 76);
      doc.setFontSize(14); doc.text(`${percentageVal}%`, 185, 76, { align: 'right' });
      yPos = 95; resetText(); doc.setFontSize(10);
      drawRow('Time Taken:', result.timeTaken, 110, yPos - 6);
      drawRow('Answered:', `${result.answersCount || 0}/${result.totalQuestions}`, 110, yPos + 2);
      doc.setDrawColor(226, 232, 240); doc.line(20, 105, 190, 105);
      yPos = 120; doc.setFontSize(14); doc.setTextColor(...PRIMARY_COLOR); doc.setFont('helvetica', 'bold');
      doc.text('Category Performance', 20, yPos); yPos += 10; doc.setFontSize(11);
      if (result.categoryScores) {
        Object.entries(result.categoryScores).forEach(([category, scores], index) => {
          if (yPos > 260) { doc.addPage(); yPos = 20; }
          if (index % 2 === 0) { doc.setFillColor(...LIGHT_BG_COLOR); doc.rect(20, yPos - 6, 170, 10, 'F'); }
          resetText(); doc.text(category, 25, yPos);
          doc.setFont('helvetica', 'bold');
          doc.text(`${scores.correct}/${scores.total}`, 160, yPos, { align: 'right' });
          doc.setTextColor(...PRIMARY_COLOR); doc.text(`(${scores.percentage}%)`, 185, yPos, { align: 'right' });
          yPos += 10;
        });
      }
      const pageHeight = doc.internal.pageSize.height;
      doc.setDrawColor(200, 200, 200); doc.line(20, pageHeight - 20, 190, pageHeight - 20);
      doc.setFontSize(9); doc.setTextColor(150, 150, 150);
      doc.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 105, pageHeight - 12, { align: 'center' });
      doc.save(`cse-results-${result.examType}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally { setIsGeneratingPDF(false); }
  };

  if (isLoading) return <LoadingSpinner message="Loading results..." />;

  if (!result) {
    return (
      <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: '48px', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
          <h2 className="ob-font-display" style={{ color: C.white, fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>No Results Found</h2>
          <p className="ob-font-mono" style={{ color: C.textDim, fontSize: '12px', marginBottom: '24px' }}>You haven't taken any exams yet. Start your preparation now!</p>
          <button className="ob-btn-primary" onClick={() => navigate('/')}>TAKE AN EXAM</button>
        </div>
      </div>
    );
  }

  const pct = result.percentage || Math.round((result.score / result.totalQuestions) * 100);
  const passed = pct >= 80;

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: '56px',
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        position: 'sticky', top: '64px', zIndex: 40,
      }}>
        <span className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.15em', color: C.textDim }}>EXAM COMPLETE</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={handleDownloadJSON} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'transparent', color: C.white, border: `1px solid ${C.border}`, fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', letterSpacing: '0.1em' }}>
            <Download style={{ width: 14, height: 14 }} /> JSON
          </button>
          <button onClick={handleDownloadPDF} disabled={isGeneratingPDF} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'transparent', color: C.error, border: `1px solid ${C.error}`, fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', letterSpacing: '0.1em', opacity: isGeneratingPDF ? 0.6 : 1 }}>
            <FileText style={{ width: 14, height: 14 }} /> {isGeneratingPDF ? 'GENERATING...' : 'PDF'}
          </button>
          <button onClick={() => { const shareText = `I scored ${result.score}/${result.totalQuestions} (${pct}%) on the CSE ${result.examType === 'professional' ? 'Professional' : 'Sub-Professional'} mock exam!`; if (navigator.share) { navigator.share({ title: 'My CSE Results', text: shareText, url: window.location.href }); } else { navigator.clipboard.writeText(shareText); alert('Results copied to clipboard!'); } }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'transparent', color: C.white, border: `1px solid ${C.border}`, fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', letterSpacing: '0.1em' }}>
            <Share2 style={{ width: 14, height: 14 }} /> SHARE
          </button>
          <button onClick={() => navigate('/')} className="ob-btn-ghost" style={{ padding: '8px 16px' }}>HOME</button>
          <button onClick={handleRetakeExam} className="ob-btn-primary" style={{ padding: '8px 16px' }}>RETAKE</button>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
          {/* Left — Score summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Score card */}
            <div className="ob-corner" style={{ position: 'relative', border: `1px solid ${C.border}`, padding: '4px' }}>
              <div style={{ border: `1px solid ${C.border}`, padding: '28px 24px' }}>
                <p className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.12em', color: C.textDim, marginBottom: '12px' }}>FINAL MASTERY SCORE</p>
                <p className="ob-font-display" style={{ fontSize: '64px', fontWeight: 700, lineHeight: 1, color: C.white, marginBottom: '4px' }}>
                  {pct}<span style={{ fontSize: '28px' }}>%</span>
                </p>
                <p className="ob-font-mono" style={{ fontSize: '13px', letterSpacing: '0.15em', color: passed ? C.success : C.error, marginBottom: '16px' }}>
                  {passed ? '✓ PASSED' : '✗ FAILED'}
                </p>
                <div className="ob-progress-track">
                  <div className="ob-progress-fill" style={{ width: `${pct}%`, background: passed ? C.success : C.error }} />
                </div>
              </div>
            </div>

            {/* Quick stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: C.border }}>
              {[
                ['CORRECT', `${result.score}/${result.totalQuestions}`],
                ['INCORRECT', String(result.totalQuestions - result.score).padStart(2, '0')],
                ['TIME USED', result.timeTaken || '—'],
                ['ANSWERED', `${result.answersCount || 0}/${result.totalQuestions}`],
              ].map(([k, v]) => (
                <div key={k} style={{ background: C.surfaceLow, padding: '18px 16px' }}>
                  <p className="ob-font-mono" style={{ fontSize: '9px', letterSpacing: '0.12em', color: C.textDim, marginBottom: '6px' }}>{k}</p>
                  <p className="ob-font-display" style={{ fontSize: '20px', fontWeight: 700, color: C.white }}>{v}</p>
                </div>
              ))}
            </div>

            {/* Category breakdown */}
            {result.categoryScores && Object.keys(result.categoryScores).length > 0 && (
              <div style={{ border: `1px solid ${C.border}`, padding: '20px 24px', background: C.surface }}>
                <p className="ob-font-display" style={{ fontSize: '16px', fontWeight: 700, color: C.white, marginBottom: '16px' }}>Subject Breakdown</p>
                {Object.entries(result.categoryScores).map(([name, scores]) => {
                  const catPct = scores.percentage || Math.round((scores.correct / scores.total) * 100);
                  return (
                    <div key={name} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span className="ob-font-body" style={{ fontSize: '12px', color: C.textMuted }}>{name}</span>
                        <span className="ob-font-mono" style={{ fontSize: '10px', color: catPct >= 80 ? C.success : catPct >= 60 ? '#EAB308' : C.error }}>{catPct}%</span>
                      </div>
                      <div className="ob-progress-track">
                        <div className="ob-progress-fill" style={{ width: `${catPct}%`, background: catPct >= 80 ? C.success : catPct >= 60 ? '#EAB308' : C.error }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right — Full result card + recommendations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* ResultCard (existing component) */}
            <div style={{ border: `1px solid ${C.border}`, background: C.surface }}>
              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}` }}>
                <p className="ob-font-display" style={{ fontSize: '18px', fontWeight: 700, color: C.white }}>Detailed Analysis</p>
              </div>
              <div style={{ padding: '24px' }}>
                <ResultCard result={result} />
              </div>
            </div>

            {/* Study Recommendations */}
            <div style={{ border: `1px solid ${C.border}`, background: C.surface, padding: '24px' }}>
              <p className="ob-font-display" style={{ fontSize: '18px', fontWeight: 700, color: C.white, marginBottom: '20px' }}>Study Recommendations</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', background: C.border, marginBottom: '20px' }}>
                {[
                  { title: 'STRENGTHS', color: C.success, items: Object.entries(result.categoryScores || {}).filter(([, s]) => s.percentage >= 80).map(([n, s]) => `${n}: ${s.percentage}%`) },
                  { title: 'NEEDS WORK', color: C.error, items: Object.entries(result.categoryScores || {}).filter(([, s]) => s.percentage < 60).map(([n, s]) => `${n}: ${s.percentage}%`) },
                  { title: 'NEXT STEPS', color: '#EAB308', items: ['Review wrong answers', 'Focus on weak areas', 'Practice time management', 'Take more mock tests'] },
                ].map(({ title, color, items }) => (
                  <div key={title} style={{ background: C.surfaceLow, padding: '20px' }}>
                    <p className="ob-font-mono" style={{ fontSize: '10px', letterSpacing: '0.15em', color, marginBottom: '12px' }}>{title}</p>
                    {items.length === 0
                      ? <p className="ob-font-body" style={{ fontSize: '12px', color: C.textDim }}>None at this time.</p>
                      : items.map((item, i) => (
                        <p key={i} className="ob-font-body" style={{ fontSize: '12px', color: C.textMuted, marginBottom: '6px', lineHeight: 1.5 }}>
                          <span style={{ color, marginRight: '6px' }}>▸</span>{item}
                        </p>
                      ))
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="ob-btn-primary" onClick={handleRetakeExam} style={{ padding: '14px 32px' }}>RETAKE EXAM</button>
              <button className="ob-btn-ghost" onClick={() => navigate('/')} style={{ padding: '14px 32px' }}>BACK TO HOME</button>
              <button onClick={handleDownloadPDF} disabled={isGeneratingPDF} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px', background: 'transparent', color: C.error, border: `1px solid ${C.error}`, fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', opacity: isGeneratingPDF ? 0.6 : 1 }}>
                <FileText style={{ width: 14, height: 14 }} />
                {isGeneratingPDF ? 'GENERATING...' : 'DOWNLOAD PDF'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;
