import React, { useState } from 'react';
import { authService } from '../../../services/auth';
import {
    LayoutDashboard, Users, CheckCircle, BookOpen, FileText,
    Layers, Zap, MessageCircle, PenTool, Clock, Megaphone,
    LogOut, Moon, Sun, Menu, X, Grip
} from 'lucide-react';
import {
    TeacherOverview, StudentMonitoring, AttendanceMarker, HomeworkManager,
    QuizScheduler, MaterialsManager, QuestionPaperCreator, TeacherMessages, Whiteboard
} from '../../modules/teacher/TeacherModules';
import { CircularsManager, TimetableBuilder, EventCalendar } from '../../modules/admin/AdminModules';
import { ProfileView } from '../../ProfileView';
import schoolLogo from '../../../assets/logo.png';

interface TeacherDashboardProps {
    setView: (view: string) => void;
    darkMode: boolean;
    toggleDarkMode: () => void;
    user: any;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ setView, darkMode, toggleDarkMode, user }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'monitoring' | 'attendance' | 'homework' | 'quizzes' | 'materials' | 'assessments' | 'messages' | 'whiteboard' | 'timetable' | 'calendar' | 'notices' | 'profile'>('overview');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await authService.logout();
        localStorage.removeItem('admin_token');
        window.location.reload();
    };

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'monitoring', label: 'Students', icon: Users },
        { id: 'attendance', label: 'Attendance', icon: CheckCircle },
        { id: 'homework', label: 'Homework', icon: BookOpen },
        { id: 'notices', label: 'Notices', icon: Megaphone },
        { id: 'timetable', label: 'Timetable', icon: Grip },
        { id: 'calendar', label: 'Calendar', icon: Clock },
        { id: 'quizzes', label: 'Quizzes', icon: FileText },
        { id: 'materials', label: 'Materials', icon: Layers },
        { id: 'assessments', label: 'Exams', icon: Zap },
        { id: 'profile', label: 'Profile', icon: Users },
    ];

    return (
        <div className={`relative flex min-h-screen font-['Inter'] transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Floating Glass Dock (Sidebar) */}
            <aside className={`
                fixed lg:sticky top-4 lg:top-4 h-[calc(100vh-2rem)] z-50 w-72 flex flex-col mx-4 lg:ml-4 lg:mr-0 p-6 rounded-[2.5rem] transform transition-all duration-300 ease-in-out shadow-2xl border backdrop-blur-xl
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'}
                ${darkMode ? 'bg-slate-900/90 border-slate-800 shadow-black/50' : 'bg-white/90 border-white shadow-indigo-100'}
            `}>
                <div className="mb-8 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-500/30">
                                E
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"></div>
                        </div>
                        <div>
                            <h3 className={`text-lg font-black tracking-tight leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Teacher<br />Portal</h3>
                        </div>
                    </div>
                    {/* Close Button mobile */}
                    <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-1 flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 pl-4">Menu</div>
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id as any); setIsMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200 group relative overflow-hidden ${activeTab === item.id
                                ? (darkMode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200')
                                : (darkMode ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-900')
                                } `}
                        >
                            <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : (darkMode ? 'text-slate-500 group-hover:text-white' : 'text-slate-400 group-hover:text-indigo-600')} `} />
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    <button
                        onClick={toggleDarkMode}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs uppercase transition-colors ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>

                    <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs uppercase transition-colors ${darkMode ? 'text-red-400 hover:bg-red-950/20 hover:text-red-300' : 'text-red-500 hover:bg-red-50 hover:text-red-600'}`}>
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 p-4 lg:p-6 lg:h-screen lg:overflow-y-auto custom-scrollbar">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between p-4 mb-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('profile')}>
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border-2 border-white dark:border-slate-800 shadow-sm">
                            {user?.name?.[0] || 'T'}
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">{user?.name || 'Teacher'}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">View Profile</div>
                        </div>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
                        <Menu size={20} />
                    </button>
                </div>

                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Dynamic Module Rendering */}
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {activeTab === 'overview' && <TeacherOverview />}
                        {activeTab === 'monitoring' && <StudentMonitoring />}
                        {activeTab === 'attendance' && <AttendanceMarker />}
                        {activeTab === 'homework' && <HomeworkManager />}
                        {activeTab === 'quizzes' && <QuizScheduler />}
                        {activeTab === 'materials' && <MaterialsManager />}
                        {activeTab === 'profile' && <ProfileView userConfig={user} setUserConfig={() => { }} setView={setView} />}
                        {activeTab === 'notices' && <CircularsManager />}
                        {activeTab === 'timetable' && <TimetableBuilder />}
                        {activeTab === 'calendar' && <EventCalendar />}

                        {/* Modules not fully implemented or under construction */}
                        {['assessments', 'assessments'].includes(activeTab) && (
                            <QuestionPaperCreator />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
