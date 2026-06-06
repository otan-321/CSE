import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, RotateCcw, FileText } from 'lucide-react';
import ResultCard from '../components/ResultCard';
import LoadingSpinner from '../components/LoadingSpinner';

function Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    // Load results from localStorage
    const savedResult = localStorage.getItem('lastExamResult');
    if (savedResult) {
      setResult(JSON.parse(savedResult));
    }
    setIsLoading(false);
  }, []);

  const handleRetakeExam = () => {
    if (result) {
      navigate(`/exam/${result.examType}`);
    }
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `civil-service-exam-results-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleDownloadPDF = async () => {
    if (!result) return;

    setIsGeneratingPDF(true);

    try {
        // Dynamic import for jsPDF
        const { jsPDF } = await import('jspdf');

        // Create PDF document
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // --- STYLING CONSTANTS ---
        const PRIMARY_COLOR = [59, 130, 246]; // Blue
        const LIGHT_BG_COLOR = [240, 245, 255]; // Very light blue
        const TEXT_COLOR = [30, 41, 59]; // Dark Slate
        const MUTED_COLOR = [100, 116, 139]; // Gray

        // Helper to reset text styles
        const resetText = () => {
            doc.setTextColor(...TEXT_COLOR);
            doc.setFont('helvetica', 'normal');
        };

        // --- HEADER SECTION ---
        doc.setFillColor(...PRIMARY_COLOR);
        doc.rect(0, 0, 210, 40, 'F'); // Blue header background

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.text('Civil Service Mock Exam Results', 105, 20, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Unofficial Result - CSE Reviewer (CSE)', 105, 30, { align: 'center' });

        // --- INFO GRID SECTION (2 Columns) ---
        let yPos = 60;
        
        // Left Column: Exam Details
        doc.setFontSize(14);
        doc.setTextColor(...PRIMARY_COLOR);
        doc.setFont('helvetica', 'bold');
        doc.text('Exam Details', 20, 55);

        doc.setFontSize(11);
        doc.setTextColor(...MUTED_COLOR);
        doc.setFont('helvetica', 'normal');
        
        // Helper to draw label-value pairs
        const drawRow = (label, value, x, y) => {
            doc.setFont('helvetica', 'bold');
            doc.text(label, x, y);
            doc.setFont('helvetica', 'normal');
            doc.text(value, x + 35, y);
        };

        resetText();
        drawRow('Exam Type:', result.examType === 'professional' ? 'Professional Level' : 'Sub-Professional Level', 20, yPos);
        drawRow('Date:', new Date(result.date).toLocaleDateString(), 20, yPos + 8);
        drawRow('Language:', result.language === 'english' ? 'English' : 'English/Filipino', 20, yPos + 16);

        // Right Column: Score Snapshot
        doc.setFontSize(14);
        doc.setTextColor(...PRIMARY_COLOR);
        doc.setFont('helvetica', 'bold');
        doc.text('Score Overview', 110, 55);

        resetText();
        // Calculate Percentage Color
        const percentageVal = Math.round((result.score / result.totalQuestions) * 100);
        const isPassing = percentageVal >= 80;
        
        // Draw a big score box
        doc.setFillColor(...LIGHT_BG_COLOR);
        doc.roundedRect(110, 58, 80, 25, 3, 3, 'F');
        
        doc.setFontSize(10);
        doc.setTextColor(...MUTED_COLOR);
        doc.text('FINAL SCORE', 115, 66);
        
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...(isPassing ? [22, 163, 74] : PRIMARY_COLOR)); // Green if passing, else Blue
        doc.text(`${result.score}/${result.totalQuestions}`, 115, 76);
        
        doc.setFontSize(14);
        doc.text(`${percentageVal}%`, 185, 76, { align: 'right' });

        // Stats below box
        yPos = 95;
        resetText();
        doc.setFontSize(10);
        drawRow('Time Taken:', result.timeTaken, 110, yPos - 6);
        drawRow('Answered:', `${result.answersCount || 0}/${result.totalQuestions}`, 110, yPos + 2);

        // Divider Line
        doc.setDrawColor(226, 232, 240);
        doc.line(20, 105, 190, 105);

        // --- CATEGORY PERFORMANCE SECTION ---
        yPos = 120;
        doc.setFontSize(14);
        doc.setTextColor(...PRIMARY_COLOR);
        doc.setFont('helvetica', 'bold');
        doc.text('Category Performance', 20, yPos);
        yPos += 10;

        doc.setFontSize(11);
        
        if (result.categoryScores) {
            Object.entries(result.categoryScores).forEach(([category, scores], index) => {
                if (yPos > 260) {
                    doc.addPage();
                    yPos = 20;
                }

                // Zebra striping for better readability
                if (index % 2 === 0) {
                    doc.setFillColor(...LIGHT_BG_COLOR);
                    doc.rect(20, yPos - 6, 170, 10, 'F');
                }

                // Category Name
                resetText();
                doc.text(category, 25, yPos);

                // Score Details (Right aligned logic)
                doc.setFont('helvetica', 'bold');
                const scoreText = `${scores.correct}/${scores.total}`;
                const percText = `(${scores.percentage}%)`;
                
                doc.text(scoreText, 160, yPos, { align: 'right' });
                
                doc.setTextColor(...PRIMARY_COLOR);
                doc.text(percText, 185, yPos, { align: 'right' });

                yPos += 10;
            });
        }

        // --- SUMMARY BOX ---
        yPos += 5;
        if (yPos > 240) {
            doc.addPage();
            yPos = 20;
        }

        // Background Box for Summary
        doc.setFillColor(...LIGHT_BG_COLOR);
        doc.setDrawColor(...PRIMARY_COLOR);
        doc.roundedRect(20, yPos, 170, 35, 3, 3, 'FD'); // Fill and Draw border

        doc.setFontSize(12);
        doc.setTextColor(...PRIMARY_COLOR);
        doc.setFont('helvetica', 'bold');
        doc.text('Performance Verdict', 28, yPos + 10);

        doc.setFontSize(11);
        doc.setTextColor(...TEXT_COLOR);
        doc.setFont('helvetica', 'normal');

        let summaryText = '';
        if (percentageVal >= 80) {
            summaryText = "Excellent! You're well-prepared for the actual Civil Service Exam.";
        } else if (percentageVal >= 60) {
            summaryText = "Good effort! Review the areas where you struggled to improve your score.";
        } else {
            summaryText = "Needs improvement. Focus on studying key concepts and practice more.";
        }

        const splitText = doc.splitTextToSize(summaryText, 155);
        doc.text(splitText, 28, yPos + 20);

        // --- FOOTER ---
        const pageHeight = doc.internal.pageSize.height;
        doc.setDrawColor(200, 200, 200);
        doc.line(20, pageHeight - 20, 190, pageHeight - 20);
        
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 105, pageHeight - 12, { align: 'center' });

        // Save PDF
        const fileName = `csc-exam-results-${result.examType}-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
    } finally {
        setIsGeneratingPDF(false);
    }
};

  if (isLoading) {
    return <LoadingSpinner message="Loading results..." />;
  }

  if (!result) {
    return (
      <div style={{background:"#0a0a0a",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:10,padding:32,maxWidth:420,width:"100%"}}>
          <h2 style={{fontFamily:"'DM Serif Display',Georgia,serif",color:"#fff",fontSize:24,fontWeight:400,marginBottom:12}}>No Results Found</h2>
          <p style={{fontFamily:"'IBM Plex Mono',monospace",color:"#555",fontSize:12,marginBottom:24}}>
            You haven't taken any exams yet. Start your preparation now!
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-white"
          >
            Take an Exam
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl" style={{background:"#0a0a0a",minHeight:"100vh"}}>
      {/* Header */}
      <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",marginBottom:32,gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <button
            onClick={() => navigate('/')}
            className="btn btn-dark" style={{padding:"8px 16px",fontSize:11}}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div className="relative">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",background:"#1a0505",color:"#ef4444",border:"1px solid #3a1010",borderRadius:7,fontSize:11,fontFamily:"'IBM Plex Mono',monospace",cursor:"pointer"}}
            >
              {isGeneratingPDF ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">PDF</span>
                </>
              )}
            </button>
          </div>
          <button
            onClick={handleDownloadJSON}
            style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",background:"transparent",color:"#fff",border:"1px solid #2a2a2a",borderRadius:7,fontSize:11,fontFamily:"'IBM Plex Mono',monospace",cursor:"pointer"}}
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">JSON</span>
          </button>
          <button
            onClick={() => {
              const shareText = `I scored ${result.score}/${result.totalQuestions} (${Math.round((result.score / result.totalQuestions) * 100)}%) on the CSC ${result.examType === 'professional' ? 'Professional' : 'Sub-Professional'} Exam Practice!`;
              if (navigator.share) {
                navigator.share({
                  title: 'My CSC Exam Results',
                  text: shareText,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(shareText);
                alert('Results copied to clipboard!');
              }
            }}
            style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",background:"transparent",color:"#fff",border:"1px solid #2a2a2a",borderRadius:7,fontSize:11,fontFamily:"'IBM Plex Mono',monospace",cursor:"pointer"}}
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Share</span>
          </button>
          <button
            onClick={handleRetakeExam}
            className="btn btn-white" style={{padding:"7px 16px",fontSize:11}}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm">Retake?</span>
          </button>
        </div>
      </div>

      {/* Main Result Card */}
      <div className="mb-8">
        <ResultCard result={result} />
      </div>

      {/* Study Recommendations */}
      <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:10,padding:24,marginBottom:24}}>
        <h3 style={{fontFamily:"'DM Serif Display',Georgia,serif",color:"#fff",fontSize:20,fontWeight:400,marginBottom:24}}>Study Recommendations</h3>
        
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginBottom:24}}>
          <div style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:8,padding:16}}>
            <div style={{fontFamily:"'DM Serif Display',Georgia,serif",color:"#3b82f6",fontSize:16,fontWeight:400,marginBottom:8}}>Strengths</div>
            {result.categoryScores && Object.entries(result.categoryScores)
              .filter(([category, scores]) => scores.percentage >= 80)
              .map(([category, scores]) => (
                <div key={category} className="flex items-center justify-between mb-1">
                  <span style={{fontFamily:"'IBM Plex Mono',monospace",color:"#888",fontSize:11}}>{category}</span>
                  <span className="text-sm font-bold text-green-600">{scores.percentage}%</span>
                </div>
              ))}
            {!Object.entries(result.categoryScores || {}).some(([, scores]) => scores.percentage >= 80) && (
              <p style={{fontFamily:"'IBM Plex Mono',monospace",color:"#888",fontSize:11}}>Keep practicing to identify your strengths!</p>
            )}
          </div>
          
          <div style={{background:"#111",border:"1px solid #2a1f00",borderRadius:8,padding:16}}>
            <div style={{fontFamily:"'DM Serif Display',Georgia,serif",color:"#eab308",fontSize:16,fontWeight:400,marginBottom:8}}>Areas to Improve</div>
            {result.categoryScores && Object.entries(result.categoryScores)
              .filter(([category, scores]) => scores.percentage < 60)
              .map(([category, scores]) => (
                <div key={category} className="flex items-center justify-between mb-1">
                  <span style={{fontFamily:"'IBM Plex Mono',monospace",color:"#888",fontSize:11}}>{category}</span>
                  <span className="text-sm font-bold text-red-600">{scores.percentage}%</span>
                </div>
              ))}
            {!Object.entries(result.categoryScores || {}).some(([, scores]) => scores.percentage < 60) && (
              <p style={{fontFamily:"'IBM Plex Mono',monospace",color:"#888",fontSize:11}}>Great job! Focus on maintaining your performance.</p>
            )}
          </div>
          
          <div style={{background:"#111",border:"1px solid #0a2a1a",borderRadius:8,padding:16}}>
            <div style={{fontFamily:"'DM Serif Display',Georgia,serif",color:"#22c55e",fontSize:16,fontWeight:400,marginBottom:8}}>Next Steps</div>
            <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
              <li>• Review explanations for incorrect answers</li>
              <li>• Focus on weaker categories</li>
              <li>• Practice time management</li>
              <li>• Take more practice tests</li>
            </ul>
          </div>
        </div>

        {/* Study Plan */}
        <div>
          <h4 style={{fontFamily:"'IBM Plex Mono',monospace",color:"#666",fontSize:11,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:16}}>Recommended Study Plan</h4>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>
            <div style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:8,padding:16}}>
              <div style={{fontFamily:"'DM Serif Display',Georgia,serif",color:"#3b82f6",fontSize:16,fontWeight:400,marginBottom:8}}>Week 1-2</div>
              <ul style={{fontFamily:"'IBM Plex Mono',monospace",color:"#555",fontSize:11,lineHeight:1.8}}>
                <li>• Review basic concepts</li>
                <li>• Focus on weaker areas</li>
                <li>• Daily practice questions</li>
              </ul>
            </div>
            <div style={{background:"#111",border:"1px solid #1a0d3c",borderRadius:8,padding:16}}>
              <div style={{fontFamily:"'DM Serif Display',Georgia,serif",color:"#8b5cf6",fontSize:16,fontWeight:400,marginBottom:8}}>Week 3-4</div>
              <ul style={{fontFamily:"'IBM Plex Mono',monospace",color:"#555",fontSize:11,lineHeight:1.8}}>
                <li>• Practice timed tests</li>
                <li>• Review question patterns</li>
                <li>• Focus on accuracy</li>
              </ul>
            </div>
            <div style={{background:"#111",border:"1px solid #0a2a1a",borderRadius:8,padding:16}}>
              <div style={{fontFamily:"'DM Serif Display',Georgia,serif",color:"#22c55e",fontSize:16,fontWeight:400,marginBottom:8}}>Week 5-6</div>
              <ul style={{fontFamily:"'IBM Plex Mono',monospace",color:"#555",fontSize:11,lineHeight:1.8}}>
                <li>• Full-length mock exams</li>
                <li>• Review all explanations</li>
                <li>• Final preparation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center"}}>
        <button
          onClick={handleRetakeExam}
          className="btn btn-white"
        >
          Take Another Test
        </button>
        <button
          onClick={() => navigate('/')}
          className="btn btn-dark"
        >
          Back to Dashboard
        </button>
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"13px 30px",background:"#1a0505",color:"#ef4444",border:"1px solid #3a1010",borderRadius:7,fontSize:13,fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,cursor:"pointer"}}
        >
          {isGeneratingPDF ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Generating PDF...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5 mr-2" />
              Download PDF Report
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Results;