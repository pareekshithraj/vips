import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowRight, CheckCircle, Compass, RefreshCw, BarChart3, GraduationCap, Coins, BookOpen } from 'lucide-react';
import { careerService, Question, CareerResult } from '../services/careerService';
import { UserConfig } from '../types';

interface CareerViewProps {
    userConfig: UserConfig;
    setUserConfig: React.Dispatch<React.SetStateAction<UserConfig>>;
    setView: (view: any) => void;
    darkMode: boolean;
}

export const CareerView: React.FC<CareerViewProps> = ({ userConfig, setUserConfig, setView, darkMode }) => {
    const [started, setStarted] = useState(false);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [result, setResult] = useState<CareerResult | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // Load saved result if exists
    useEffect(() => {
        if (userConfig.careerPath) {
            const details = careerService.getResultDetails(userConfig.classLevel, userConfig.careerPath.recommended);
            setResult(details);
            setStarted(true);
        }
    }, [userConfig.careerPath]);

    const questions = careerService.getQuestions(userConfig.classLevel);
    const progress = ((currentQIndex) / questions.length) * 100;

    const handleAnswer = (optionIndex: number) => {
        setIsAnimating(true);
        setTimeout(() => {
            const newAnswers = { ...answers, [questions[currentQIndex].id]: optionIndex };
            setAnswers(newAnswers);

            if (currentQIndex < questions.length - 1) {
                setCurrentQIndex(prev => prev + 1);
            } else {
                // Determine result
                const res = careerService.calculateRecommendation(userConfig.classLevel, newAnswers);
                const details = careerService.getResultDetails(userConfig.classLevel, res.recommended);
                setResult(details);

                // Persist Result
                setUserConfig(prev => ({
                    ...prev,
                    careerPath: {
                        recommended: res.recommended,
                        timestamp: new Date().toISOString()
                    }
                }));
            }
            setIsAnimating(false);
        }, 300);
    };

    const resetQuiz = () => {
        setStarted(false);
        setCurrentQIndex(0);
        setAnswers({});
        setResult(null);
    };

    if (!started) {
        return (
            <div className={`min-h-[80vh] flex flex-col items-center justify-center text-center p-8 rounded-3xl animate-in fade-in zoom-in-95 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border shadow-sm`}>
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 ${darkMode ? 'bg-indigo-900/30 text-indigo-400 animate-pulse' : 'bg-indigo-50 text-indigo-600 animate-bounce-slow'}`}>
                    <Compass className="w-12 h-12" />
                </div>
                <h1 className={`text-4xl font-black mb-4 ${darkMode ? 'text-white' : 'text-indigo-950'}`}>
                    Discover Your Perfect Path
                </h1>
                <p className={`text-lg max-w-xl mb-10 font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    AI-powered analysis of your interests, strengths, and personality to recommend the best career stream for you.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => setStarted(true)}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center gap-3"
                    >
                        Start Assessment <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
                <p className="mt-8 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Takes only 2 minutes • {questions.length} Questions
                </p>
            </div>
        );
    }

    if (result) {
        return (
            <div className="space-y-8 animate-in slide-in-from-bottom-4">
                {/* Result Header */}
                <div className={`p-8 rounded-3xl border shadow-lg overflow-hidden relative ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-indigo-50'}`}>
                    <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-3xl transform translate-x-12 -translate-y-12" />

                    <div className="relative z-10 text-center">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-500/20">
                            Highest Compatibility
                        </span>
                        <h2 className={`text-4xl md:text-5xl font-black mb-4 ${darkMode ? 'text-white' : 'text-indigo-950'}`}>
                            {result.title}
                        </h2>
                        <p className={`text-lg max-w-2xl mx-auto mb-8 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            {result.description}
                        </p>

                        <div className="flex flex-wrap justify-center gap-3">
                            {result.tags.map(tag => (
                                <span key={tag} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Career Paths */}
                    <div className={`p-8 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-500">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-indigo-950'}`}>Top Career Options</h3>
                        </div>
                        <ul className="space-y-3">
                            {result.paths.map(path => (
                                <li key={path} className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${darkMode ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-slate-50 hover:bg-indigo-50/50'}`}>
                                    <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-violet-400' : 'bg-indigo-500'}`} />
                                    <span className={`font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{path}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Outlook & Exams */}
                    <div className="space-y-8">
                        {/* Salary Outlook */}
                        <div className={`p-8 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                                    <Coins className="w-6 h-6" />
                                </div>
                                <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-indigo-950'}`}>Salary Outlook</h3>
                            </div>
                            <div className="flex items-end gap-2 mb-2">
                                <span className={`text-3xl font-black ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{result.salary}</span>
                                <span className="text-xs font-bold text-slate-400 mb-1.5 uppercase">Starting Avg.</span>
                            </div>
                            <p className="text-sm font-medium text-slate-400">{result.outlook}</p>
                        </div>

                        {/* Entrance Exams */}
                        <div className={`p-8 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-indigo-950'}`}>Key Entrance Exams</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {result.exams.map(exam => (
                                    <span key={exam} className={`px-3 py-1.5 rounded-lg text-xs font-black border ${darkMode ? 'border-orange-500/30 text-orange-400 bg-orange-500/5' : 'border-orange-100 text-orange-600 bg-orange-50'}`}>
                                        {exam}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pt-8 pb-16">
                    <button
                        onClick={resetQuiz}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-indigo-900 hover:bg-slate-100'}`}
                    >
                        <RefreshCw className="w-4 h-4" /> Retake Assessment
                    </button>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQIndex];

    return (
        <div className="max-w-2xl mx-auto py-12">
            {/* Progress Bar */}
            <div className="mb-12">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                    <span>Question {currentQIndex + 1} of {questions.length}</span>
                    <span>{Math.round(progress)}% Completed</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <div
                        className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                        style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className={`p-8 md:p-12 rounded-[2rem] border shadow-xl transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'} ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-indigo-50'}`}>
                <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                    {currentQ.category}
                </span>

                <h2 className={`text-2xl md:text-3xl font-black leading-tight mb-10 ${darkMode ? 'text-white' : 'text-indigo-950'}`}>
                    {currentQ.text}
                </h2>

                <div className="space-y-4">
                    {currentQ.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 group flex items-center justify-between ${darkMode
                                ? 'border-slate-800 hover:border-indigo-500 hover:bg-slate-800 text-slate-300 hover:text-white'
                                : 'border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/30 text-slate-600 hover:text-indigo-900'}`}
                        >
                            <span className="font-bold text-lg">{opt.text}</span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${darkMode ? 'bg-slate-800 group-hover:bg-indigo-500' : 'bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                                <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
