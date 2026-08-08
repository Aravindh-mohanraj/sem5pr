import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  GraduationCap, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { learningChapters } from '../data/mockData';

export default function LearningCenter() {
  const [selectedModuleIdx, setSelectedModuleIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState({}); // Stores scores per module id

  const activeModule = learningChapters[selectedModuleIdx];
  const quiz = activeModule.quiz;

  const handleOptionSelect = (optionIdx) => {
    if (submitted) return;
    setSelectedOption(optionIdx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || submitted) return;
    setSubmitted(true);
    
    const isCorrect = selectedOption === quiz.answer;
    setQuizScore(prev => ({
      ...prev,
      [activeModule.id]: isCorrect
    }));
  };

  const handleResetQuiz = () => {
    setSelectedOption(null);
    setSubmitted(false);
    setQuizScore(prev => {
      const copy = { ...prev };
      delete copy[activeModule.id];
      return copy;
    });
  };

  const handleSelectModule = (idx) => {
    setSelectedModuleIdx(idx);
    setSelectedOption(null);
    setSubmitted(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/10">
          <GraduationCap size={22} className="text-slate-950" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold">Newbie Investor Learning Center</h2>
          <p className="text-slate-400 text-sm mt-0.5">Learn core trading and portfolio management terms with interactive lessons and mini-quizzes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Chapter Navigation List (1 col) */}
        <div className="space-y-3 lg:col-span-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Modules</span>
          <div className="space-y-2">
            {learningChapters.map((chapter, idx) => {
              const isActive = idx === selectedModuleIdx;
              const hasScore = quizScore[chapter.id] !== undefined;
              const isCorrect = quizScore[chapter.id] === true;

              return (
                <button
                  key={chapter.id}
                  onClick={() => handleSelectModule(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isActive
                      ? 'border-emerald-500/40 bg-emerald-500/5 text-slate-200 shadow-md'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-900/30 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-display leading-normal">{chapter.title}</span>
                    {hasScore && (
                      isCorrect 
                        ? <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                        : <XCircle size={14} className="text-red-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{chapter.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Lessons & Quizzes (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Lessons Section */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <BookOpen size={18} className="text-emerald-400" /> Core Concepts
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeModule.lessons.map((lesson, idx) => (
                <div key={idx} className="p-4 bg-slate-900/50 border border-slate-800/80 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-display">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> {lesson.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{lesson.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz Section */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <HelpCircle size={18} className="text-indigo-400" /> Lesson Quiz
            </h3>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-slate-200">{quiz.question}</p>
              
              <div className="space-y-2.5">
                {quiz.options.map((option, idx) => {
                  let optionClass = 'border-slate-800 hover:border-slate-700 bg-slate-900/20';
                  
                  if (selectedOption === idx) {
                    optionClass = 'border-indigo-500 bg-indigo-500/5 text-slate-200';
                  }

                  if (submitted) {
                    if (idx === quiz.answer) {
                      optionClass = 'border-emerald-500 bg-emerald-500/10 text-slate-200';
                    } else if (selectedOption === idx) {
                      optionClass = 'border-red-500 bg-red-500/10 text-slate-200';
                    } else {
                      optionClass = 'border-slate-800 opacity-60 bg-slate-900/20';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={submitted}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${optionClass}`}
                    >
                      <span>{option}</span>
                      {submitted && idx === quiz.answer && (
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0 ml-3" />
                      )}
                      {submitted && selectedOption === idx && idx !== quiz.answer && (
                        <XCircle size={16} className="text-red-400 shrink-0 ml-3" />
                      )}
                    </button>
                  );
                })}
              </div>

              {!submitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-100 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-600/10"
                >
                  Submit Answer <ArrowRight size={14} />
                </button>
              ) : (
                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-emerald-400" />
                    <span className="text-xs font-bold text-slate-200">AI Mentor Explanation:</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{quiz.explanation}</p>
                  
                  <button
                    onClick={handleResetQuiz}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <RefreshCw size={12} /> Retry Quiz
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
