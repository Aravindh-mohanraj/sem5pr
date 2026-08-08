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
  const [quizScore, setQuizScore] = useState({});

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
        <div className="h-10 w-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-600/20">
          <GraduationCap size={22} />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">Newbie Investor Learning Center</h2>
          <p className="text-slate-500 text-sm mt-0.5 font-medium">Learn core trading and portfolio management terms with interactive lessons and mini-quizzes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Chapter Navigation List */}
        <div className="space-y-3 lg:col-span-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold block mb-1">Modules</span>
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
                      ? 'border-sky-500 bg-sky-50 text-slate-900 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-display leading-normal">{chapter.title}</span>
                    {hasScore && (
                      isCorrect 
                        ? <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        : <XCircle size={14} className="text-rose-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed font-medium">{chapter.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Lessons & Quizzes */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Lessons Section */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <BookOpen size={18} className="text-sky-600" /> Core Concepts
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeModule.lessons.map((lesson, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-display">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-600"></span> {lesson.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{lesson.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz Section */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <HelpCircle size={18} className="text-indigo-600" /> Lesson Quiz
            </h3>

            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-900">{quiz.question}</p>
              
              <div className="space-y-2.5">
                {quiz.options.map((option, idx) => {
                  let optionClass = 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-800';
                  
                  if (selectedOption === idx) {
                    optionClass = 'border-sky-500 bg-sky-50 text-slate-900 font-bold';
                  }

                  if (submitted) {
                    if (idx === quiz.answer) {
                      optionClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                    } else if (selectedOption === idx) {
                      optionClass = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                    } else {
                      optionClass = 'border-slate-200 opacity-50 bg-slate-50';
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
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0 ml-3" />
                      )}
                      {submitted && selectedOption === idx && idx !== quiz.answer && (
                        <XCircle size={16} className="text-rose-600 shrink-0 ml-3" />
                      )}
                    </button>
                  );
                })}
              </div>

              {!submitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md shadow-sky-600/20"
                >
                  Submit Answer <ArrowRight size={14} />
                </button>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-sky-600" />
                    <span className="text-xs font-bold text-slate-900">AI Mentor Explanation:</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{quiz.explanation}</p>
                  
                  <button
                    onClick={handleResetQuiz}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-900 transition-colors"
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
