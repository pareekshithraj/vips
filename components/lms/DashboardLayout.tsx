import React, { useState } from 'react';
import {
    Target, Layers, ChartColumn, BookOpen, Zap, Clock, RefreshCw, CreditCard, FileText,
    CheckCircle, TrendingUp, Layout, Calendar, Flame, Moon, Sun, Compass
} from 'lucide-react';
import { format, getDay } from 'date-fns';
import { UserConfig, StudyTask, Syllabus, Checkpoint, Difficulty, ChapterProgress } from '../../types';
import { generateSchedule } from '../../services/scheduler'; // Needed for "Update Schedule" button
import { LibraryView } from '../LibraryView';
import { FocusView } from '../FocusView';
import { TimetableView } from '../TimetableView';
import { Leaderboard } from '../Leaderboard';
import { CareerView } from '../CareerView';
import { gamificationService } from '../../services/gamification';
// Student Modules removed for separation
import schoolLogo from '../../assets/logo.png'; // Assuming asset path needs adjustment or prop pass

// Checkpoints constant
const CHECKPOINTS: Checkpoint[] = ['Read', 'Revised', 'Practiced', 'Thorough'];

interface DashboardLayoutProps {
    userConfig: UserConfig;
    setUserConfig: React.Dispatch<React.SetStateAction<UserConfig>>;
    schedule: StudyTask[];
    setSchedule: React.Dispatch<React.SetStateAction<StudyTask[]>>;
    currentSyllabus: Syllabus;
    activeTab: 'plan' | 'syllabus' | 'library' | 'insights' | 'focus' | 'timetable' | 'pathfinder' | 'my-fees' | 'my-attendance' | 'materials' | 'student-quizzes' | 'reports';
    setActiveTab: (t: any) => void;
    setView: (v: any) => void;
    onLogout: () => void;
    currentTime: Date;
    daysLeft: number;
    masteryScore: number;
    todayTasks: StudyTask[];
    darkMode: boolean;
    toggleDarkMode: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    userConfig, setUserConfig, schedule, setSchedule, currentSyllabus,
    activeTab, setActiveTab, setView, onLogout, currentTime, daysLeft, masteryScore, todayTasks,
    darkMode, toggleDarkMode
}) => {
    const [dailyHoursInput, setDailyHoursInput] = useState(3);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

    // Sync local input state with global config when it changes
    React.useEffect(() => {
        const todayDay = getDay(new Date());
        const todayConfig = userConfig.availableHours.find(h => h.weekday === todayDay);
        if (todayConfig) {
            setDailyHoursInput(todayConfig.hours);
        }
    }, [userConfig.availableHours]);

    // --- Feature Handlers (Moved from App.tsx or redefined to use props) ---
    const toggleCheckpoint = (chapterId: string, cp: Checkpoint) => {
        setUserConfig(prev => {
            const currentProgress = prev.chapterProgress[chapterId] || { difficulty: Difficulty.MEDIUM, checkpoints: [] };
            const hasCheckpoint = currentProgress.checkpoints.includes(cp);
            const newCheckpoints = hasCheckpoint ? currentProgress.checkpoints.filter(c => c !== cp) : [...currentProgress.checkpoints, cp];
            return { ...prev, chapterProgress: { ...prev.chapterProgress, [chapterId]: { ...currentProgress, checkpoints: newCheckpoints } } };
        });
    };

    const setChapterDifficulty = (chapterId: string, diff: Difficulty) => {
        setUserConfig(prev => {
            const currentProgress = prev.chapterProgress[chapterId] || { difficulty: diff, checkpoints: [] };
            return {
                ...prev,
                chapterProgress: {
                    ...prev.chapterProgress,
                    [chapterId]: { ...currentProgress, difficulty: diff }
                }
            };
        });
    };

    const markTaskDone = (taskId: string, topicId: string) => {
        setSchedule(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
        setUserConfig(prev => {
            const isAlreadyCompleted = prev.completedTopicIds.includes(topicId);
            let newCompleted = prev.completedTopicIds;

            if (isAlreadyCompleted) {
                newCompleted = prev.completedTopicIds.filter(id => id !== topicId);
                return { ...prev, completedTopicIds: newCompleted };
            } else {
                newCompleted = [...prev.completedTopicIds, topicId];
                // Check for achievements and update points
                // We pass the masteryScore (calculated derived state) but since we are inside setState, 
                // we might need to approximate or refactor. 
                // For safely, let's just trigger point gain. 
                // Actually `checkAchievements` needs the *new* state references if possible, 
                // but passing the `prev` config with new completed items is "good enough" for points.
                // Note: masteryScore in `checkAchievements` is merely for the 50%/100% badge.
                // We'll pass the current `masteryScore` prop which is *close enough* (it will update on next render).

                const configWithCompletion = { ...prev, completedTopicIds: newCompleted };
                const updatedConfig = gamificationService.checkAchievements(configWithCompletion, masteryScore, new Date());

                // Also update local storage immediately if feasible, but App.tsx handles that via effect.
                return updatedConfig;
            }
        });
    };

    const addManualChapter = (subjectId: string, chapterName: string, topicName: string, hours: number) => {
        setUserConfig(prev => {
            const currentChapters = prev.manualChapters?.[subjectId] || [];
            const isCustom = prev.customSubjects?.find(s => s.id === subjectId);
            const newTopic = { id: `t-${Date.now()}`, name: topicName, estimatedHours: hours };
            const newChapter = { id: `c-${Date.now()}`, name: chapterName, difficulty: Difficulty.MEDIUM, topics: [newTopic] };

            if (isCustom) {
                return {
                    ...prev,
                    customSubjects: prev.customSubjects.map(s => s.id === subjectId ? { ...s, chapters: [...s.chapters, newChapter] } : s)
                };
            } else {
                return {
                    ...prev,
                    manualChapters: {
                        ...prev.manualChapters,
                        [subjectId]: [...currentChapters, newChapter]
                    }
                };
            }
        });
    };

    return (
        <div className={`min-h-screen pb-24 lg:pb-0 transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            <nav className={`fixed top-0 w-full border-b px-6 py-3 flex justify-between items-center z-50 shadow-sm transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center gap-2">
                    <img src={schoolLogo} alt="Logo" className="w-8 h-8 rounded-md" />
                    <h1 className={`font-black text-base hidden md:block ${darkMode ? 'text-white' : 'text-indigo-950'}`}>Vidyabodhini LMS</h1>
                </div>

                <div className="flex flex-col items-center">
                    <div className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-indigo-200' : 'text-indigo-950'}`}>
                        {format(currentTime, 'EEEE, d MMM yyyy')} <span className="text-indigo-400">|</span> {format(currentTime, 'h:mm a')}
                    </div>
                    <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5">
                        {daysLeft > 0 ? `${daysLeft} Days to Exam` : 'Exams Started!'}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={toggleDarkMode} className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                    <div className="hidden sm:flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full border border-orange-100">
                        <Flame className="w-4 h-4 fill-orange-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{userConfig.gamification?.streak || 0} Day Streak</span>
                    </div>
                    <span className="hidden sm:block text-[10px] font-black text-slate-400 uppercase tracking-widest">{userConfig.name}</span>
                    <button onClick={onLogout} className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-900 font-black text-xs border border-white shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors">
                        {userConfig.name.substring(0, 1)}
                    </button>
                </div>
            </nav>

            <main className="pt-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Desktop Sidebar */}
                {/* Desktop Sidebar */}
                <aside className={`fixed left-0 top-16 h-full w-64 border-r hidden lg:flex flex-col py-8 px-6 z-40 transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                    <div className="space-y-2">
                        <button onClick={() => { setActiveTab('plan'); setView('dashboard'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'plan' ? (darkMode ? 'bg-indigo-900/50 text-indigo-200' : 'bg-indigo-50 text-indigo-900') : 'text-slate-400 hover:text-slate-600'}`}>
                            <Target className="w-5 h-5" /> My Plan
                        </button>
                        <button onClick={() => { setActiveTab('syllabus'); setView('dashboard'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'syllabus' ? (darkMode ? 'bg-indigo-900/50 text-indigo-200' : 'bg-indigo-50 text-indigo-900') : 'text-slate-400 hover:text-slate-600'}`}>
                            <Layers className="w-5 h-5" /> Syllabus
                        </button>
                        <button onClick={() => { setActiveTab('insights'); setView('dashboard'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'insights' ? (darkMode ? 'bg-indigo-900/50 text-indigo-200' : 'bg-indigo-50 text-indigo-900') : 'text-slate-400 hover:text-slate-600'}`}>
                            <ChartColumn className="w-5 h-5" /> Insights
                        </button>
                        <button onClick={() => { setActiveTab('library'); setView('dashboard'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'library' ? (darkMode ? 'bg-indigo-900/50 text-indigo-200' : 'bg-indigo-50 text-indigo-900') : 'text-slate-400 hover:text-slate-600'}`}>
                            <BookOpen className="w-5 h-5" /> Library
                        </button>
                        <button onClick={() => { setActiveTab('focus'); setView('dashboard'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'focus' ? (darkMode ? 'bg-indigo-900/50 text-indigo-200' : 'bg-indigo-50 text-indigo-900') : 'text-slate-400 hover:text-slate-600'}`}>
                            <Zap className="w-5 h-5" /> Focus Zone
                        </button>
                        <button onClick={() => { setActiveTab('timetable'); setView('dashboard'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'timetable' ? (darkMode ? 'bg-indigo-900/50 text-indigo-200' : 'bg-indigo-50 text-indigo-900') : 'text-slate-400 hover:text-slate-600'}`}>
                            <Calendar className="w-5 h-5" /> Timetable
                        </button>
                        {(userConfig.classLevel === 10 || userConfig.classLevel === 12) && (
                            <button onClick={() => { setActiveTab('pathfinder'); setView('dashboard'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'pathfinder' ? (darkMode ? 'bg-indigo-900/50 text-indigo-200' : 'bg-indigo-50 text-indigo-900') : 'text-slate-400 hover:text-slate-600'}`}>
                                <Compass className="w-5 h-5" /> Pathfinder <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded ml-auto">NEW</span>
                            </button>
                        )}
                    </div>

                    {/* School Portal Link Removed for Strict Separation */}

                    <div className={`p-5 rounded-2xl border shadow-sm animate-in fade-in mt-8 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-3">Overall Progress</h4>
                        <div className="h-2 bg-slate-50 rounded-full overflow-hidden mb-2 border border-slate-100">
                            <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${masteryScore}%` }} />
                        </div>
                        <div className="flex justify-between items-center">
                            <p className={`text-[10px] font-black ${darkMode ? 'text-indigo-200' : 'text-indigo-900'}`}>{masteryScore}% Complete</p>
                            <div className="text-right">
                                <p className="text-[8px] font-bold text-slate-300">Class {userConfig.classLevel}</p>
                                <p className="text-[8px] font-bold text-slate-300 truncate max-w-[100px]">{userConfig.schoolName}</p>
                            </div>
                        </div>
                        <button onClick={() => setView('profile')} className="w-full mt-4 py-2 rounded-lg border border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 hover:text-indigo-900 transition-colors">Edit Profile</button>
                    </div>
                </aside>

                <section className="lg:col-span-9 xl:col-span-7 space-y-6">
                    {activeTab === 'plan' && (
                        <div className="space-y-6">
                            <div className={`p-8 rounded-3xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                                <div>
                                    <h2 className={`text-2xl font-black ${darkMode ? 'text-indigo-100' : 'text-indigo-950'}`}>Study Desk</h2>
                                    <p className="text-slate-400 text-sm font-medium">Class {userConfig.classLevel} Board Preparation Plan</p>
                                </div>
                                <div className="flex gap-4 text-center">
                                    <div className="px-3">
                                        <div className="text-xl font-black text-indigo-900">{masteryScore}%</div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase">Mastery</div>
                                    </div>
                                    <div className="w-[1px] bg-slate-100 dark:bg-slate-800" />
                                    <div className="px-3">
                                        <div className={`text-xl font-black ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{todayTasks.length}</div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase">Tasks</div>
                                    </div>
                                </div>
                            </div>

                            {/* Daily Plan Widget */}
                            <div className={`p-8 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-indigo-100'}`}>
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="space-y-2">
                                        <h3 className={`text-lg font-black ${darkMode ? 'text-indigo-100' : 'text-indigo-950'}`}>Customize Today's Plan</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Hours: {dailyHoursInput}h</p>
                                    </div>
                                    <div className={`flex items-center gap-4 p-3 rounded-2xl border-2 flex-1 w-full max-w-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                                        <Clock className="w-5 h-5 text-indigo-400" />
                                        <input
                                            type="range" min="2" max="12" step="1"
                                            value={dailyHoursInput} onChange={(e) => setDailyHoursInput(parseInt(e.target.value))}
                                            className="flex-1 accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            const todayDay = getDay(new Date());
                                            const newHours = userConfig.availableHours.map(h => h.weekday === todayDay ? { ...h, hours: dailyHoursInput } : h);
                                            setUserConfig({ ...userConfig, availableHours: newHours });
                                            setTimeout(() => setSchedule(generateSchedule(currentSyllabus, { ...userConfig, availableHours: newHours })), 50);
                                        }}
                                        className="bg-indigo-900 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-800 transition-all shadow-md flex items-center gap-2"
                                    >
                                        <RefreshCw className="w-4 h-4" /> Update Schedule
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 ml-1">
                                <h3 className={`text-lg font-black ${darkMode ? 'text-indigo-100' : 'text-indigo-950'}`}>Today's Schedule</h3>
                                <button
                                    onClick={() => {
                                        const newSchedule = generateSchedule(currentSyllabus, userConfig, undefined, true);
                                        setSchedule(newSchedule);
                                    }}
                                    className={`p-2 rounded-xl border text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-sm transition-all ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
                                    title="Refresh Schedule"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {todayTasks.length === 0 ? (
                                    <div className={`col-span-full p-12 rounded-3xl border border-dashed text-center ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                        <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-4" />
                                        <h4 className={`font-black ${darkMode ? 'text-indigo-100' : 'text-indigo-950'}`}>Daily Goals Achieved</h4>
                                        <p className="text-slate-400 text-xs mt-1">Check back tomorrow or review your syllabus checkpoints.</p>
                                    </div>
                                ) : (
                                    todayTasks.map(task => {
                                        const getSubjectColor = (name: string | undefined) => {
                                            const n = (name || '').toLowerCase();
                                            if (n.includes('math')) return { bg: darkMode ? 'bg-blue-900/30' : 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', badge: darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700' };
                                            if (n.includes('phy')) return { bg: darkMode ? 'bg-violet-900/30' : 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', badge: darkMode ? 'bg-violet-900/50 text-violet-300' : 'bg-violet-100 text-violet-700' };
                                            if (n.includes('chem')) return { bg: darkMode ? 'bg-emerald-900/30' : 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', badge: darkMode ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700' };
                                            if (n.includes('bio')) return { bg: darkMode ? 'bg-rose-900/30' : 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', badge: darkMode ? 'bg-rose-900/50 text-rose-300' : 'bg-rose-100 text-rose-700' };
                                            if (n.includes('eng')) return { bg: darkMode ? 'bg-amber-900/30' : 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', badge: darkMode ? 'bg-amber-900/50 text-amber-300' : 'bg-amber-100 text-amber-700' };
                                            if (n.includes('soc') || n.includes('hist')) return { bg: darkMode ? 'bg-orange-900/30' : 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', badge: darkMode ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-700' };
                                            return { bg: darkMode ? 'bg-slate-800' : 'bg-slate-50', text: 'text-indigo-600', border: darkMode ? 'border-slate-700' : 'border-slate-100', badge: darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600' };
                                        };
                                        const colors = getSubjectColor(task.subjectName);

                                        return (
                                            <div key={task.id} className={`p-6 rounded-3xl border-l-4 shadow-sm transition-all flex flex-col justify-between group ${task.isCompleted ? 'opacity-50 grayscale' : ''} ${colors.border} ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${colors.badge}`}>{task.subjectName || 'General'}</span>
                                                        <span className="text-[9px] font-bold text-slate-400">
                                                            {(() => {
                                                                const totalMins = Math.round(task.duration * 60);
                                                                const h = Math.floor(totalMins / 60);
                                                                const m = totalMins % 60;
                                                                if (h > 0 && m > 0) return `${h}h ${m}m`;
                                                                if (h > 0) return `${h}h`;
                                                                return `${m}m`;
                                                            })()}
                                                        </span>
                                                    </div>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest mb-1 block ${colors.text}`}>{task.chapterName}</span>
                                                    <h4 className={`text-lg font-black leading-tight ${task.isCompleted ? 'line-through' : ''} ${darkMode ? 'text-slate-100' : 'text-indigo-950'}`}>{task.topicName}</h4>
                                                </div>
                                                <div className={`mt-6 flex items-center justify-between border-t pt-4 ${darkMode ? 'border-slate-800' : 'border-slate-50'}`}>
                                                    <span className="text-[9px] font-black text-slate-400 uppercase">
                                                        {task.difficulty} Priority
                                                    </span>
                                                    <button onClick={() => markTaskDone(task.id, task.topicId)} className={`p-3 rounded-xl transition-all shadow-md ${task.isCompleted ? 'bg-emerald-500 text-white' : 'bg-indigo-900 text-white hover:bg-indigo-800'}`}>
                                                        {task.isCompleted ? <CheckCircle className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'syllabus' && (
                        <div className="space-y-4">
                            <div className="flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
                                {userConfig.selectedSubjectIds.map(sid => (
                                    <button key={sid} onClick={() => setSelectedSubjectId(sid)} className={`px-4 py-2 rounded-xl text-[9px] font-black transition-all whitespace-nowrap shadow-sm ${selectedSubjectId === sid ? 'bg-indigo-900 text-white' : (darkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white text-slate-400')}`}>
                                        {currentSyllabus.subjects.find(s => s.id === sid)?.name}
                                    </button>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {currentSyllabus.subjects.find(s => s.id === selectedSubjectId)?.chapters.map(ch => {
                                    const userProgress = userConfig.chapterProgress[ch.id];
                                    const selectedDiff = userProgress?.difficulty || ch.difficulty;

                                    return (
                                        <div key={ch.id} className={`p-6 rounded-3xl border shadow-sm space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <h4 className={`font-black text-lg ${darkMode ? 'text-indigo-100' : 'text-indigo-950'}`}>{ch.name}</h4>
                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                        {CHECKPOINTS.map(cp => {
                                                            const active = userProgress?.checkpoints.includes(cp);
                                                            return (
                                                                <button
                                                                    key={cp}
                                                                    onClick={() => toggleCheckpoint(ch.id, cp)}
                                                                    className={`px-2.5 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all border ${active ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm' : (darkMode ? 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700' : 'bg-slate-50 text-slate-300 border-transparent')}`}
                                                                >
                                                                    {cp}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2 min-w-[120px]">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase text-center">Your Difficulty</span>
                                                    <div className={`flex p-1 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                                        {[Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD].map(diff => (
                                                            <button
                                                                key={diff}
                                                                onClick={() => setChapterDifficulty(ch.id, diff)}
                                                                className={`flex-1 py-1 px-2 rounded-lg text-[8px] font-black transition-all ${selectedDiff === diff ? (darkMode ? 'bg-slate-900 text-indigo-300 shadow-sm' : 'bg-white shadow-sm text-indigo-900') : 'text-slate-300 hover:text-slate-400'}`}
                                                            >
                                                                {diff.substring(0, 1)}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`flex items-center justify-between pt-2 border-t ${darkMode ? 'border-slate-800' : 'border-slate-50'}`}>
                                                <div className="flex items-center gap-2 text-[9px] font-black text-indigo-400">
                                                    <ChartColumn className="w-3 h-3" />
                                                    {selectedDiff.toUpperCase()} PRIORITY
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Add Chapter Button for Manual Subjects */}
                                {(currentSyllabus.subjects.find(s => s.id === selectedSubjectId)?.isManual) && (
                                    <div className={`border-2 border-dashed p-6 rounded-3xl flex flex-col items-center justify-center gap-4 text-center transition-all group ${darkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200'}`}>
                                        <div className={`w-12 h-12 rounded-full shadow-sm flex items-center justify-center transition-colors ${darkMode ? 'bg-slate-800 text-slate-500 group-hover:text-indigo-400' : 'bg-white text-slate-400 group-hover:text-indigo-600'}`}>
                                            <Layers className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className={`font-black ${darkMode ? 'text-indigo-100' : 'text-indigo-950'}`}>Add New Chapter</h4>
                                            <p className="text-xs text-slate-400 font-bold mt-1">Missing a chapter? Add it manually.</p>
                                        </div>
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            const form = e.target as HTMLFormElement;
                                            const chName = (form.elements.namedItem('chName') as HTMLInputElement).value;
                                            const topicName = (form.elements.namedItem('topicName') as HTMLInputElement).value;
                                            if (chName && topicName && selectedSubjectId) {
                                                addManualChapter(selectedSubjectId, chName, topicName, 2);
                                                form.reset();
                                            }
                                        }} className="w-full space-y-2 mt-2">
                                            <input name="chName" placeholder="Chapter Name" required className="w-full p-3 rounded-xl text-xs font-bold border-2 border-transparent focus:border-indigo-500 outline-none" />
                                            <input name="topicName" placeholder="Topic Name" required className="w-full p-3 rounded-xl text-xs font-bold border-2 border-transparent focus:border-indigo-500 outline-none" />
                                            <button type="submit" className="w-full py-3 bg-indigo-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-800">Add Chapter</button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'insights' && (
                        <div className={`p-10 rounded-[3rem] border shadow-sm flex flex-col items-center justify-center animate-in zoom-in-95 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-10">Academic Readiness Score</span>
                            <div className="relative w-64 h-64 flex items-center justify-center">
                                <svg viewBox="0 0 256 256" className="w-full h-full transform -rotate-90">
                                    <circle cx="128" cy="128" r="120" className={darkMode ? 'stroke-slate-800' : 'stroke-slate-100'} strokeWidth="16" fill="none" />
                                    <circle
                                        cx="128" cy="128" r="120"
                                        className="stroke-indigo-600"
                                        strokeWidth="16"
                                        fill="none"
                                        strokeDasharray={753}
                                        strokeDashoffset={753 - (753 * masteryScore) / 100}
                                        strokeLinecap="round"
                                        style={{ transition: 'stroke-dashoffset 2s ease-in-out' }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className={`text-7xl font-black leading-none ${darkMode ? 'text-indigo-100' : 'text-indigo-950'}`}>{masteryScore}%</span>
                                    <span className="text-[11px] font-black text-indigo-500 uppercase mt-2 tracking-widest">Syllabus Mastery</span>
                                </div>
                            </div>
                            <div className="mt-12 flex items-center gap-3 bg-indigo-50 text-indigo-900 px-6 py-3 rounded-2xl border border-indigo-100">
                                <TrendingUp className="w-5 h-5" />
                                <p className="font-black text-[10px] uppercase tracking-widest">Tracking Board Excellence</p>
                            </div>
                            <p className="mt-6 text-slate-400 font-bold text-xs text-center max-w-xs">Achieve 100% by marking all chapters as 'Thorough' in the Syllabus tab.</p>
                        </div>
                    )}

                    {activeTab === 'pathfinder' && (
                        <CareerView userConfig={userConfig} setUserConfig={setUserConfig} setView={setView} darkMode={darkMode} />
                    )}

                    {activeTab === 'library' && <LibraryView userConfig={userConfig} currentSyllabus={currentSyllabus} />}
                    {activeTab === 'focus' && <FocusView tasks={todayTasks} />}
                    {activeTab === 'timetable' && (
                        <TimetableView
                            userConfig={userConfig}
                            setUserConfig={setUserConfig}
                            schedule={schedule}
                        />
                    )}

                    {/* School Modules Removed */}
                </section>

                {/* Right Sidebar (Leaderboard) */}
                <aside className="hidden xl:flex col-span-3 flex-col gap-6 sticky top-24 h-fit">
                    <Leaderboard currentUser={userConfig} />

                    {/* Mini Badges Preview */}
                    <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Your Achievements</h4>
                        <div className="grid grid-cols-4 gap-2">
                            {(userConfig.gamification?.unlockedAchievementIds || []).map(id => (
                                <div key={id} title={id} className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm border ${darkMode ? 'bg-yellow-900/30 border-yellow-800' : 'bg-yellow-50 border-yellow-100'}`}>
                                    🏆
                                </div>
                            ))}
                            {(!userConfig.gamification?.unlockedAchievementIds?.length) && (
                                <p className="col-span-4 text-[9px] text-slate-400 font-bold">No badges yet. Start studying!</p>
                            )}
                        </div>
                    </div>
                </aside>
            </main>

            <nav className={`lg:hidden fixed bottom-0 w-full border-t px-6 py-4 flex justify-between items-center z-50 rounded-t-[2.5rem] shadow-lg ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                {[{ id: 'plan', icon: Layout }, { id: 'syllabus', icon: Layers }, { id: 'library', icon: BookOpen }, { id: 'timetable', icon: Calendar }].map(item => (
                    <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`p-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-indigo-900 text-white shadow-lg' : 'text-slate-400'}`}>
                        <item.icon className="w-6 h-6" />
                    </button>
                ))}
                {(userConfig.classLevel === 10 || userConfig.classLevel === 12) && (
                    <button onClick={() => setActiveTab('pathfinder')} className={`p-4 rounded-2xl transition-all ${activeTab === 'pathfinder' ? 'bg-indigo-900 text-white shadow-lg' : 'text-slate-400'}`}>
                        <Compass className="w-6 h-6" />
                    </button>
                )}
            </nav>
        </div>
    );
};
