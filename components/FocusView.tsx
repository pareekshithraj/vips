import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, Zap, Clock, ChevronDown } from 'lucide-react';
import { StudyTask } from '../types';

interface FocusViewProps {
    tasks: StudyTask[];
}

export const FocusView: React.FC<FocusViewProps> = ({ tasks }) => {
    // Timer State
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins default
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break'>('focus');
    const [selectedTaskId, setSelectedTaskId] = useState<string | 'self'>('self');
    const [isTaskDropdownOpen, setIsTaskDropdownOpen] = useState(false);

    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = window.setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const switchMode = (newMode: 'focus' | 'break') => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const selectedTask = tasks.find(t => t.id === selectedTaskId);

    return (
        <div className="max-w-xl mx-auto min-h-[80vh] flex flex-col items-center justify-center">

            {/* Mode Switcher - Simple Text Toggle */}
            <div className="flex gap-8 mb-12">
                <button
                    onClick={() => switchMode('focus')}
                    className={`text-sm font-black uppercase tracking-widest transition-colors ${mode === 'focus' ? 'text-indigo-950 border-b-2 border-indigo-950 pb-1' : 'text-slate-300 hover:text-slate-400'}`}
                >
                    Focus
                </button>
                <button
                    onClick={() => switchMode('break')}
                    className={`text-sm font-black uppercase tracking-widest transition-colors ${mode === 'break' ? 'text-emerald-600 border-b-2 border-emerald-600 pb-1' : 'text-slate-300 hover:text-slate-400'}`}
                >
                    Break
                </button>
            </div>

            {/* Timer Display */}
            <div className={`text-[12rem] leading-none font-black tracking-tighter tabular-nums mb-12 ${mode === 'focus' ? 'text-indigo-950' : 'text-emerald-500'}`}>
                {formatTime(timeLeft)}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6 mb-16">
                <button
                    onClick={resetTimer}
                    className="p-4 rounded-full text-slate-300 hover:bg-slate-50 hover:text-slate-500 transition-all"
                >
                    <RotateCcw className="w-6 h-6" />
                </button>

                <button
                    onClick={toggleTimer}
                    className={`w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all ${mode === 'focus' ? 'bg-indigo-950 text-white shadow-indigo-200' : 'bg-emerald-500 text-white shadow-emerald-200'}`}
                >
                    {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>
            </div>

            {/* Modern Task Selector */}
            <div className="w-full relative">
                <button
                    onClick={() => setIsTaskDropdownOpen(!isTaskDropdownOpen)}
                    className="w-full bg-slate-50 hover:bg-white border rounded-2xl p-4 flex items-center justify-between transition-all group shadow-sm hover:shadow-md"
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${mode === 'focus' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            <Zap className="w-4 h-4" />
                        </div>
                        <div className="text-left overflow-hidden">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Task</p>
                            <p className="font-bold text-indigo-950 truncate">
                                {selectedTaskId === 'self' ? 'Self Study / General' : selectedTask?.topicName}
                            </p>
                        </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isTaskDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isTaskDropdownOpen && (
                    <div className="absolute top-full text-left left-0 w-full bg-white border rounded-2xl shadow-xl mt-2 p-2 z-20 max-h-60 overflow-y-auto animate-in slide-in-from-top-2">
                        <button
                            onClick={() => { setSelectedTaskId('self'); setIsTaskDropdownOpen(false); }}
                            className={`w-full p-3 rounded-xl flex items-center gap-3 transition-colors ${selectedTaskId === 'self' ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-slate-50 text-slate-600'}`}
                        >
                            <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center shrink-0">
                                <Zap className="w-3 h-3 text-indigo-600" />
                            </div>
                            <span className="font-bold text-xs">Self Study / General</span>
                            {selectedTaskId === 'self' && <CheckCircle className="ml-auto w-4 h-4 text-indigo-600" />}
                        </button>

                        <div className="h-px bg-slate-100 my-1" />

                        {tasks.length > 0 ? (
                            tasks.filter(t => !t.isCompleted).map(task => (
                                <button
                                    key={task.id}
                                    onClick={() => { setSelectedTaskId(task.id); setIsTaskDropdownOpen(false); }}
                                    className={`w-full p-3 rounded-xl flex items-center gap-3 transition-colors ${selectedTaskId === task.id ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-slate-50 text-slate-600'}`}
                                >
                                    <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                                        <Clock className="w-3 h-3 text-slate-500" />
                                    </div>
                                    <div className="text-left overflow-hidden">
                                        <p className="font-bold text-xs truncate">{task.topicName}</p>
                                        <p className="text-[9px] text-slate-400 truncate">{task.subjectName} • {task.chapterName}</p>
                                    </div>
                                    {selectedTaskId === task.id && <CheckCircle className="ml-auto w-4 h-4 text-indigo-600" />}
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center text-xs text-slate-400 font-medium">No other tasks scheduled for today.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
