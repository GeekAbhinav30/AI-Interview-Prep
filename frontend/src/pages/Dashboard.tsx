import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, TrendingUp, TrendingDown, Award, CheckCircle, XCircle, Code, Mic, FileText } from 'lucide-react';

interface DashboardProps {
  onBack: () => void;
}

interface FinalReport {
  scores: {
    aptitude: number;
    technical: number;
    dsa: number;
    resume: number;
    overall: number;
  };
  resume_results: {
    responses: Array<{
      question_index: number;
      question?: string;
      answer?: string;
      relevance: number;
      clarity: number;
      completeness: number;
      feedback: string;
    }>;
  };
  proctoring_analysis: {
    alert_count: number;
    summary: string;
  };
  final_verdict: "Hire" | "Borderline" | "Reject";
  strengths: string[];
  weaknesses: string[];
  error?: string;
}

interface EvaluationResults {
  mcq_results?: {
    score: number;
    total: number;
    accuracy: number;
    wrong_questions: Array<{ question_index: number; user_answer: number; correct_answer: number }>;
  };
  dsa_results?: {
    correctness: string;
    approach: string;
    time_complexity: string;
    space_complexity: string;
    verdict: "pass" | "partial" | "fail";
  };
  resume_results?: {
    responses: Array<{
      question_index: number;
      transcript: string;
      relevance: number;
      clarity: number;
      completeness: number;
      feedback: string;
    }>;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [report, setReport] = useState<FinalReport | null>(null);
  const [evaluationResults, setEvaluationResults] = useState<EvaluationResults | null>(null);
  const [loading, setLoading] = useState(true);

  const [isDark, setIsDark] = useState(true);

  const theme = {
    dark: { 
      bg: 'bg-black', 
      text: 'text-white', 
      textSecondary: 'text-slate-400', 
      cardBg: 'bg-slate-900/40', 
      border: 'border-slate-800/50', 
      accent: 'from-slate-100 via-blue-100 to-slate-200',
      buttonPrimary: 'from-blue-600 via-blue-700 to-blue-800',
      glowBlue: 'shadow-blue-500/20' 
    },
    light: { 
      bg: 'bg-white', 
      text: 'text-slate-900', 
      textSecondary: 'text-slate-600', 
      cardBg: 'bg-white/80', 
      border: 'border-slate-200/60', 
      accent: 'from-slate-900 via-blue-900 to-slate-800',
      buttonPrimary: 'from-blue-600 via-blue-700 to-blue-800',
      glowBlue: 'shadow-blue-500/10' 
    }
  };
  const t = theme[isDark ? 'dark' : 'light'];

  useEffect(() => {
    // Get report data from navigation state
    const state = location.state as { report?: FinalReport; results?: EvaluationResults };
    
    if (state?.report) {
      // Error boundary check
      if (!state.report || Object.keys(state.report).length === 0) {
        console.error("Empty report data received");
        navigate('/start-practicing');
        return;
      }
      setReport(state.report);
      setEvaluationResults(state.results ?? null);
    } else {
      // No data found, redirect back
      console.error("No report data found in navigation state");
      navigate('/start-practicing');
      return;
    }
    
    setLoading(false);
  }, [location.state, navigate]);

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "Hire": return "text-green-500";
      case "Borderline": return "text-yellow-500";
      case "Reject": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getVerdictBg = (verdict: string) => {
    switch (verdict) {
      case "Hire": return "bg-green-500/20 border-green-500/30";
      case "Borderline": return "bg-yellow-500/20 border-yellow-500/30";
      case "Reject": return "bg-red-500/20 border-red-500/30";
      default: return "bg-gray-500/20 border-gray-500/30";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  if (loading) {
    return (
      <div className={`h-screen w-full transition-all duration-700 ${t.bg} ${t.text} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4">Loading your interview results...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className={`h-screen w-full transition-all duration-700 ${t.bg} ${t.text} flex items-center justify-center`}>
        <div className="text-center">
          <p>No interview results found.</p>
          <button 
            onClick={() => navigate('/start-practicing')}
            className={`mt-4 px-6 py-2 rounded-lg ${t.buttonPrimary} text-white`}
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full transition-all duration-700 ${t.bg} ${t.text}`}>
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className={`flex items-center ${t.textSecondary} hover:${t.text} transition-colors group`}
          >
            <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium tracking-wide" style={{fontSize: '14px'}}>Back to Interview</span>
          </button>
          <button 
            onClick={() => setIsDark(!isDark)} 
            className={`p-2.5 ${t.cardBg} backdrop-blur-2xl ${t.border} rounded-xl hover:scale-105 transition-all duration-300 ${t.glowBlue} shadow-lg`}
          >
            {isDark ? <span className="text-yellow-500">☀️</span> : <span className="text-blue-500">🌙</span>}
          </button>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Final Verdict Card */}
          <div className={`${t.cardBg} backdrop-blur-2xl ${t.border} rounded-3xl p-8 mb-6 ${t.glowBlue} shadow-2xl`}>
            <div className="text-center">
              <h1 className={`text-3xl font-bold mb-4 bg-gradient-to-r ${t.accent} bg-clip-text text-transparent`}>
                Interview Complete!
              </h1>
              
              <div className={`inline-flex items-center px-6 py-3 rounded-2xl border-2 ${getVerdictBg(report.final_verdict)}`}>
                <Award className="w-8 h-8 mr-3" />
                <span className={`text-2xl font-bold ${getVerdictColor(report.final_verdict)}`}>
                  {report.final_verdict}
                </span>
              </div>
              
              <div className="mt-6">
                <div className={`text-5xl font-bold ${getScoreColor(report.scores?.overall || 0)}`}>
                  {report.scores?.overall || 0}%
                </div>
                <p className={`${t.textSecondary} mt-2`}>Overall Score</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Strengths Card */}
            <div className={`${t.cardBg} backdrop-blur-2xl ${t.border} rounded-3xl p-6 ${t.glowBlue} shadow-2xl`}>
              <div className="flex items-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-500 mr-3" />
                <h2 className={`text-xl font-bold ${t.text}`}>Strengths</h2>
              </div>
              <ul className="space-y-2">
                {report.strengths.map((strength, index) => (
                  <li key={index} className={`flex items-start ${t.textSecondary}`}>
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses Card */}
            <div className={`${t.cardBg} backdrop-blur-2xl ${t.border} rounded-3xl p-6 ${t.glowBlue} shadow-2xl`}>
              <div className="flex items-center mb-4">
                <TrendingDown className="w-6 h-6 text-red-500 mr-3" />
                <h2 className={`text-xl font-bold ${t.text}`}>Areas for Improvement</h2>
              </div>
              <ul className="space-y-2">
                {report.weaknesses.map((weakness, index) => (
                  <li key={index} className={`flex items-start ${t.textSecondary}`}>
                    <XCircle className="w-4 h-4 text-red-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-sm">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detailed Results */}
          {evaluationResults && (
            <div className="space-y-6">
              {/* MCQ Results */}
              {evaluationResults.mcq_results && (
                <div className={`${t.cardBg} backdrop-blur-2xl ${t.border} rounded-3xl p-6 ${t.glowBlue} shadow-2xl`}>
                  <div className="flex items-center mb-4">
                    <FileText className="w-6 h-6 text-blue-500 mr-3" />
                    <h2 className={`text-xl font-bold ${t.text}`}>MCQ Performance</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${t.text}`}>{evaluationResults.mcq_results.score}</div>
                      <p className={`${t.textSecondary} text-sm`}>Correct</p>
                    </div>
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${t.text}`}>{evaluationResults.mcq_results.total}</div>
                      <p className={`${t.textSecondary} text-sm`}>Total</p>
                    </div>
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getScoreColor(evaluationResults.mcq_results.accuracy)}`}>
                        {evaluationResults.mcq_results.accuracy.toFixed(1)}%
                      </div>
                      <p className={`${t.textSecondary} text-sm`}>Accuracy</p>
                    </div>
                  </div>
                </div>
              )}

              {/* DSA Results */}
              {evaluationResults.dsa_results && (
                <div className={`${t.cardBg} backdrop-blur-2xl ${t.border} rounded-3xl p-6 ${t.glowBlue} shadow-2xl`}>
                  <div className="flex items-center mb-4">
                    <Code className="w-6 h-6 text-purple-500 mr-3" />
                    <h2 className={`text-xl font-bold ${t.text}`}>DSA Code Evaluation</h2>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={`${t.textSecondary}`}>Verdict:</span>
                      <span className={`font-bold ${getVerdictColor(evaluationResults.dsa_results.verdict)}`}>
                        {evaluationResults.dsa_results.verdict.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${t.textSecondary}`}>Time Complexity:</span>
                      <span className={`${t.text}`}>{evaluationResults.dsa_results.time_complexity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${t.textSecondary}`}>Space Complexity:</span>
                      <span className={`${t.text}`}>{evaluationResults.dsa_results.space_complexity}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Resume Results */}
              {report.resume_results && report.resume_results.responses.length > 0 && (
                <div className={`${t.cardBg} backdrop-blur-2xl ${t.border} rounded-3xl p-6 ${t.glowBlue} shadow-2xl`}>
                  <div className="flex items-center mb-4">
                    <Mic className="w-6 h-6 text-green-500 mr-3" />
                    <h2 className={`text-xl font-bold ${t.text}`}>Resume Interview Performance</h2>
                  </div>
                  <div className="space-y-4">
                    {report.resume_results.responses.map((response, index) => (
                      <div key={index} className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-100/80'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                          <div>
                            <div className={`text-2xl font-bold ${t.text}`}>{response.relevance}/3</div>
                            <p className={`${t.textSecondary} text-xs`}>Relevance</p>
                          </div>
                          <div>
                            <div className={`text-2xl font-bold ${t.text}`}>{response.clarity}/3</div>
                            <p className={`${t.textSecondary} text-xs`}>Clarity</p>
                          </div>
                          <div>
                            <div className={`text-2xl font-bold ${t.text}`}>{response.completeness}/3</div>
                            <p className={`${t.textSecondary} text-xs`}>Completeness</p>
                          </div>
                        </div>
                        {response.feedback && (
                          <div className={`mt-3 p-3 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-200/50'}`}>
                            <p className={`${t.textSecondary} text-sm`}>{response.feedback}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <button 
              onClick={() => navigate('/start-practicing')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 ${t.buttonPrimary} text-white ${t.glowBlue} shadow-lg`}
            >
              Start New Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
