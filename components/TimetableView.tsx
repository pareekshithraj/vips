
import React, { useState } from 'react';
import { UserConfig, StudyTask, DailyRoutine } from '../types';
import { Clock, Coffee, Moon, Sun, Briefcase, ChevronRight, Save, Layout, Calendar } from 'lucide-react';

interface TimetableViewProps {
    userConfig: UserConfig;
    setUserConfig: React.Dispatch<React.SetStateAction<UserConfig>>;
    schedule: StudyTask[];
}

export const TimetableView: React.FC<TimetableViewProps> = ({ userConfig, setUserConfig, schedule }) => {
    const [isSetupMode, setIsSetupMode] = useState(!userConfig.dailyRoutine);
    const [formData, setFormData] = useState<DailyRoutine>(userConfig.dailyRoutine || {
        wakeTime: "06:00",
        morningFreshUpTime: "06:15",
        breakfastTime: "07:30",
        schoolStartTime: "08:30",
        schoolEndTime: "15:30",
        eveningFreshUpTime: "16:00",
        lunchTime: "12:30",
        snackTime: "16:30",
        dinnerTime: "20:00",
        bedTime: "22:00",
        freeSlotBuffers: 15
    });

    const handleSave = () => {
        setUserConfig(prev => ({ ...prev, dailyRoutine: formData }));
        setIsSetupMode(false);
    };

    const handleChange = (field: keyof DailyRoutine, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (isSetupMode) {
        return (
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mb-4">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black text-indigo-950 mb-2">Let's Build Your Perfect Day</h2>
                    <p className="text-slate-500">Tell us your routine so we can fit study sessions around your life.</p>
                </div>

                <div className="space-y-6">
                    <div className="p-4 bg-yellow-50 rounded-xl space-y-4 text-yellow-900">
                        <h3 className="font-bold flex items-center gap-2">
                            <Sun className="w-4 h-4" /> Morning
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Wake Up" value={formData.wakeTime} onChange={(v) => handleChange('wakeTime', v)} />
                            <InputGroup label="Fresh Up" value={formData.morningFreshUpTime} onChange={(v) => handleChange('morningFreshUpTime', v)} />
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                        <h3 className="font-bold text-slate-700 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" /> School / College
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Starts" value={formData.schoolStartTime} onChange={(v) => handleChange('schoolStartTime', v)} />
                            <InputGroup label="Ends (Home)" value={formData.schoolEndTime} onChange={(v) => handleChange('schoolEndTime', v)} />
                        </div>
                        <div className="pt-2 border-t border-slate-200">
                            <InputGroup label="Fresh Up (After School)" value={formData.eveningFreshUpTime} onChange={(v) => handleChange('eveningFreshUpTime', v)} />
                        </div>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-xl space-y-4 text-orange-900">
                        <h3 className="font-bold flex items-center gap-2">
                            <Coffee className="w-4 h-4" /> Meals
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            <InputGroup label="Breakfast" value={formData.breakfastTime} onChange={(v) => handleChange('breakfastTime', v)} />
                            <InputGroup label="Lunch" value={formData.lunchTime} onChange={(v) => handleChange('lunchTime', v)} />
                            <InputGroup label="Snacks" value={formData.snackTime} onChange={(v) => handleChange('snackTime', v)} />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <InputGroup label="Dinner" value={formData.dinnerTime} onChange={(v) => handleChange('dinnerTime', v)} />
                        </div>
                    </div>

                    <div className="p-4 bg-indigo-50 rounded-xl space-y-4 text-indigo-900">
                        <h3 className="font-bold flex items-center gap-2">
                            <Moon className="w-4 h-4" /> Night
                        </h3>
                        <InputGroup label="Bed Time" value={formData.bedTime} onChange={(v) => handleChange('bedTime', v)} />
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" /> Save Routine
                    </button>
                </div>
            </div>
        );
    }

    // Visualization Logic
    const generateTimeline = () => {
        const events: Array<{ time: string, title: string, type: 'fixed' | 'study' | 'free', duration?: string, color?: string }> = [];
        const r = formData;

        // Add Fixed Events
        const addEvent = (time: string, title: string, color: string) => {
            if (time) events.push({ time, title, type: 'fixed', color });
        };

        addEvent(r.wakeTime, 'Wake Up', 'bg-yellow-100 text-yellow-800');
        addEvent(r.morningFreshUpTime, 'Fresh Up', 'bg-teal-50 text-teal-700');
        addEvent(r.breakfastTime, 'Breakfast', 'bg-orange-100 text-orange-800');
        addEvent(r.schoolStartTime, 'School Starts', 'bg-slate-100 text-slate-800');
        addEvent(r.schoolEndTime, 'Back from School', 'bg-slate-100 text-slate-800');
        addEvent(r.eveningFreshUpTime, 'Fresh Up & Relax', 'bg-teal-50 text-teal-700');
        addEvent(r.lunchTime, 'Lunch', 'bg-orange-100 text-orange-800');
        addEvent(r.snackTime, 'Snacks', 'bg-orange-100 text-orange-800');
        addEvent(r.dinnerTime, 'Dinner', 'bg-orange-100 text-orange-800');
        addEvent(r.bedTime, 'Sleep', 'bg-indigo-900 text-white');

        // Robust Sort: Day starts at Wake Time
        // Any time "before" wake time is treated as next day (e.g. 1 AM lunch -> 25:00)
        const wakeMins = getMinutes(r.wakeTime);
        const getAdjustedMinutes = (t: string) => {
            const m = getMinutes(t);
            return m < wakeMins ? m + 1440 : m; // Add 24h if earlier than wake time
        };

        events.sort((a, b) => getAdjustedMinutes(a.time) - getAdjustedMinutes(b.time));

        // Inject Study Tasks into Gaps
        const studySlot1Index = events.findIndex(e => e.title === 'Snacks');
        const tasksToSchedule = schedule.filter(t => !t.isCompleted);

        let taskIdx = 0;

        // Helper to inject task
        const injectTask = (afterIndex: number, offsetMinutes: number, task: StudyTask) => {
            if (afterIndex === -1) return;
            const baseTime = getMinutes(events[afterIndex].time);
            const newTimeVal = baseTime + offsetMinutes;
            const h = Math.floor(newTimeVal / 60);
            const m = newTimeVal % 60;
            const newTimeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

            events.splice(afterIndex + 1, 0, {
                time: newTimeStr,
                title: `Study: ${task.topicName}`,
                type: 'study',
                duration: formatDuration(task.duration)
            });
        };

        // Inject first task 30 mins after Snacks
        if (studySlot1Index !== -1 && tasksToSchedule[taskIdx]) {
            injectTask(studySlot1Index, 30, tasksToSchedule[taskIdx]);
            taskIdx++;
            // Note: Index of original 'Snacks' is still valid, but if we want to chain, we can just insert at same index+1 (pushing previous down) or index+2.
            // My previous logic using splice at specific offsets works if I account for shift.
            // Actually, simplified:
        }

        // Inject second task 90 mins after Snacks (or 1h after first task)
        // Re-find index because splice shifted things? 
        // No, `events` array mutated. `studySlot1Index` points to "Snacks" index.
        // If I inserted at `studySlot1Index + 1`, "Snacks" is still at `studySlot1Index`.
        // The NEW task is at `studySlot1Index + 1`.
        // So to insert AFTER the new task, I insert at `studySlot1Index + 2`.

        if (tasksToSchedule[taskIdx] && studySlot1Index !== -1) {
            injectTask(studySlot1Index + 1, 60, tasksToSchedule[taskIdx]); // This inserts BEFORE the previous one if I use index+1?
            // Wait. 
            // [Snacks (i), Dinner (i+1)]
            // Splice(i+1, 0, Task1) -> [Snacks(i), Task1(i+1), Dinner(i+2)]
            // Splice(i+2, 0, Task2) -> [Snacks(i), Task1(i+1), Task2(i+2), Dinner(i+3)]
            // Yes. This works to append.
            taskIdx++;
        }

        // Inject after Dinner
        const dinnerIndex = events.findIndex(e => e.title === 'Dinner');
        if (dinnerIndex !== -1 && tasksToSchedule[taskIdx]) {
            injectTask(dinnerIndex, 45, tasksToSchedule[taskIdx]);
            taskIdx++;
        }

        return events;
    };

    const timeline = generateTimeline();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-black text-indigo-950">Your Daily Timeline</h1>
                    <button onClick={() => setIsSetupMode(true)} className="text-sm font-bold text-indigo-600 hover:underline">
                        Edit Routine
                    </button>
                </div>

                {/* Auto-Set Daily Hours Prompt */}
                {(() => {
                    // Calculate Free Hours
                    const r = formData;
                    const fixedEvents = [
                        { t: getMinutes(r.wakeTime) }, { t: getMinutes(r.morningFreshUpTime) },
                        { t: getMinutes(r.breakfastTime) },
                        { t: getMinutes(r.schoolStartTime) }, { t: getMinutes(r.schoolEndTime) },
                        { t: getMinutes(r.eveningFreshUpTime) },
                        { t: getMinutes(r.lunchTime) }, { t: getMinutes(r.snackTime) },
                        { t: getMinutes(r.dinnerTime) }, { t: getMinutes(r.bedTime) }
                    ].sort((a, b) => {
                        // Adjust like we did for sorting
                        const wm = getMinutes(r.wakeTime);
                        const adjA = a.t < wm ? a.t + 1440 : a.t;
                        const adjB = b.t < wm ? b.t + 1440 : b.t;
                        return adjA - adjB;
                    });

                    let totalFreeMins = 0;
                    // Heuristic Calculation
                    let sStart = getMinutes(r.schoolStartTime);
                    let sEnd = getMinutes(r.schoolEndTime);
                    if (sEnd < sStart) sEnd += 1440;
                    const schoolMins = sEnd - sStart;

                    let bed = getMinutes(r.bedTime);
                    let wake = getMinutes(r.wakeTime);
                    if (wake < bed) wake += 1440;
                    const sleepMins = wake - bed;

                    // Meals (2h) + Fresh Up (1h approx)
                    const lifeMins = 180;

                    const estFreeHours = Math.max(0, (1440 - schoolMins - sleepMins - lifeMins) / 60);
                    const formattedFree = estFreeHours.toFixed(1);

                    return (
                        <div className="bg-indigo-900 text-white p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <Clock className="w-5 h-5 text-indigo-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Sync Daily Target?</h3>
                                    <p className="text-xs text-indigo-200">Based on your routine, you have about <span className="font-black text-white">{formattedFree} hours</span> of free time.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    const newHours = Math.floor(estFreeHours);
                                    const allDaysHours = userConfig.availableHours.map(h => ({ ...h, hours: newHours }));
                                    setUserConfig(prev => ({ ...prev, availableHours: allDaysHours }));
                                    alert(`Daily target updated to ${newHours} hours for all days!`);
                                }}
                                className="px-4 py-2 bg-white text-indigo-900 text-xs font-black uppercase tracking-widest rounded-lg hover:bg-indigo-50 transition-colors whitespace-nowrap"
                            >
                                Set Goal to {Math.floor(estFreeHours)}h
                            </button>
                        </div>
                    );
                })()}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative">
                <div className="absolute top-6 bottom-6 left-[27px] w-0.5 bg-slate-100"></div>

                <div className="space-y-8">
                    {timeline.map((event, idx) => (
                        <div key={idx} className="flex gap-6 relative">
                            {/* Time Bubble */}
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 z-10 border-4 border-white leading-tight text-center ${event.type === 'study' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-slate-100 text-slate-500'}`}>
                                {formatTimeDisplay(event.time)}
                            </div>

                            {/* Content Card */}
                            <div className={`flex-1 p-4 rounded-xl border ${event.type === 'study' ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-slate-100'}`}>
                                <div className="flex justify-between items-start">
                                    <h3 className={`font-bold ${event.type === 'study' ? 'text-indigo-900' : 'text-slate-700'}`}>
                                        {event.title}
                                    </h3>
                                    {event.duration && (
                                        <span className="text-xs font-bold px-2 py-1 bg-white rounded-md text-indigo-600 shadow-sm">
                                            {event.duration}
                                        </span>
                                    )}
                                </div>
                                {event.type === 'study' && (
                                    <div className="mt-2 text-xs text-indigo-600 font-medium flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Targeted Session
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Helper Components & Functions
const InputGroup = ({ label, value, onChange, icon }: any) => (
    <div className="space-y-1">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            {icon} {label}
        </label>
        <input
            type="time"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
    </div>
);

const getMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h * 60) + (m || 0);
};

const formatTimeDisplay = (timeStr: string) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const normH = h % 24;
    const suffix = normH >= 12 ? 'PM' : 'AM';
    const h12 = normH % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${suffix}`;
};

const formatDuration = (h: number) => {
    const totalMins = Math.round(h * 60);
    const hrs = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    if (hrs > 0 && m > 0) return `${hrs}h ${m}m`;
    if (hrs > 0) return `${hrs}h`;
    return `${m}m`;
};
