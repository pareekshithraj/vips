import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, CreditCard, CheckCircle, Layers, FileText,
    LogOut, ChevronLeft, GraduationCap, HelpCircle, Megaphone, Layout, X, Menu, User, Sparkles, TrendingUp, CheckCircle2, Moon, Sun, Calendar, Clock, ArrowRight, Bell
} from 'lucide-react';
import { managementService } from '../../../services/management';
import { UserConfig } from '../../../types';
import { StudentFees, StudentAttendance, StudentMaterials, StudentQuizzes, StudentHelpdesk, StudentTimetable, StudentCalendar, StudentNotices } from '../../modules/student/StudentModules';
import { ProfileView } from '../../ProfileView';

interface StudentSchoolPortalProps {
    userConfig: UserConfig | null;
    setUserConfig: React.Dispatch<React.SetStateAction<UserConfig | null>>;
    darkMode: boolean;
    onToggleDarkMode: () => void;
    onBackToLMS: () => void;
    onLogout: () => void;
}

export const StudentSchoolPortal: React.FC<StudentSchoolPortalProps> = ({ userConfig, setUserConfig, darkMode, onToggleDarkMode, onBackToLMS, onLogout }) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'fees' | 'timetable' | 'attendance' | 'materials' | 'quizzes' | 'helpdesk' | 'profile' | 'calendar' | 'notices'>('dashboard');
    const [notices, setNotices] = useState<any[]>([]);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const allNotices = await managementService.getNotices('Admin');
                console.log("All Notices:", allNotices);
                // Loose filtering for legacy support
                setNotices(allNotices.filter((n: any) => {
                    const aud = (n.audience || 'All').toString().toLowerCase();
                    return ['all', 'students', 'student', 'parents', 'parent'].includes(aud);
                }));
            } catch (e) {
                console.error("Error fetching notices", e);
            }
        };
        fetchNotices();
    }, []);

    if (!userConfig) return <div>Loading...</div>;

    const menuItems = [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'notices', label: 'Notices', icon: Megaphone },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'fees', label: 'My Fees', icon: CreditCard },
        { id: 'timetable', label: 'Timetable', icon: Layout },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
        { id: 'attendance', label: 'Attendance', icon: CheckCircle },
        { id: 'materials', label: 'Materials', icon: Layers },
        { id: 'quizzes', label: 'Quizzes', icon: FileText },
        { id: 'helpdesk', label: 'Helpdesk', icon: HelpCircle },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className={`relative flex min-h-screen font-['Inter'] transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Floating Glass Sidebar (Desktop) */}
            <aside className={`
                fixed lg:sticky top-4 lg:top-4 h-[calc(100vh-2rem)] z-50 w-72 flex flex-col mx-4 lg:ml-4 lg:mr-0 p-6 rounded-[2.5rem] transform transition-all duration-300 ease-in-out shadow-2xl border backdrop-blur-xl
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'}
                ${darkMode ? 'bg-slate-900/90 border-slate-800 shadow-black/50' : 'bg-white/90 border-white shadow-indigo-100'}
            `}>
                <div className="mb-10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-500/30">
                                {userConfig.schoolName.substring(0, 1)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"></div>
                        </div>
                        <div>
                            <h3 className={`text-lg font-black tracking-tight leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Student<br />Portal</h3>
                        </div>
                    </div>
                    {/* Close Button mobile */}
                    <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 pl-4">Menu</div>
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id as any); setIsMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 group relative overflow-hidden ${activeTab === item.id
                                ? (darkMode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200')
                                : (darkMode ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-900')
                                } `}
                        >
                            {activeTab === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20"></div>}
                            <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : (darkMode ? 'text-slate-500 group-hover:text-white' : 'text-slate-400 group-hover:text-indigo-600')} `} />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    <button
                        onClick={onToggleDarkMode}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs uppercase transition-colors ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>

                    <button onClick={onLogout} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs uppercase transition-colors ${darkMode ? 'text-red-400 hover:bg-red-950/20 hover:text-red-300' : 'text-red-500 hover:bg-red-50 hover:text-red-600'}`}>
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 p-4 lg:p-6 lg:h-screen lg:overflow-y-auto custom-scrollbar">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between p-4 mb-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}>
                            <LayoutDashboard className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                        </div>
                        <span className={`font-black uppercase tracking-wider ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {menuItems.find(i => i.id === activeTab)?.label}
                        </span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(true)} className={`p-2.5 rounded-xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}>
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                <div className="max-w-7xl mx-auto space-y-8">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {/* Premium Hero Section */}
                            <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-indigo-700 via-violet-600 to-indigo-600 text-white p-8 lg:p-12 shadow-2xl shadow-indigo-500/20 dark:shadow-none ring-1 ring-white/10 group">
                                {/* Decorative Glows & Animations */}
                                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-400/20 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none mix-blend-overlay animate-pulse duration-3000"></div>
                                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none mix-blend-overlay"></div>
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-10">
                                    <div className="space-y-6 max-w-2xl">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest shadow-sm">
                                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                                <span>{new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}</span>
                                            </span>
                                            <span className="text-indigo-200 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-300"></div>
                                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                            </span>
                                        </div>

                                        <div>
                                            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-4 leading-[0.9]">
                                                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">{userConfig.name.split(' ')[0]}</span>.
                                            </h2>
                                            <p className="text-lg text-indigo-100 font-medium opacity-90 leading-relaxed max-w-lg">
                                                Ready for a productive day? You have <span className="bg-white/20 px-2 py-0.5 rounded-lg text-white font-bold">4 classes</span> and <span className="bg-white/20 px-2 py-0.5 rounded-lg text-white font-bold">2 tasks</span> pending.
                                            </p>
                                        </div>

                                        <div className="flex gap-4 pt-2">
                                            <button onClick={() => setActiveTab('timetable')} className="px-6 py-3 bg-white text-indigo-600 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-900/20 hover:bg-indigo-50 transition-all hover:-translate-y-1">View Timetable</button>
                                            <button onClick={() => setActiveTab('notices')} className="px-6 py-3 bg-indigo-500/30 backdrop-blur-md border border-indigo-400/30 text-white rounded-2xl font-bold text-sm hover:bg-indigo-500/40 transition-all">Check Notices</button>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-auto">
                                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2.5rem] w-full md:min-w-[320px] hover:bg-white/15 transition-all duration-300 group cursor-pointer shadow-2xl shadow-black/10">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="space-y-1">
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-200 opacity-80">Up Next</div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                                        <span className="text-sm font-bold text-white tracking-wide">11:00 AM START</span>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-white/20 rounded-2xl group-hover:rotate-12 transition-transform duration-500 shadow-inner">
                                                    <Clock className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-3xl font-black text-white tracking-tight">Mathematics</div>
                                                <div className="text-sm font-medium text-indigo-200">Chapter 4: Calculus • Room 302</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid - "Glassy" Modern */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Attendance', value: '92.5%', sub: 'Target: 95%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-200/50' },
                                    { label: 'Assignments', value: '12', sub: '3 Pending', icon: Layers, color: 'text-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-200/50' },
                                    { label: 'Avg. Grade', value: 'A+', sub: 'Top 5%', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-500/10', border: 'border-purple-200/50' },
                                    { label: 'Fees Paid', value: '100%', sub: 'No Dues', icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-200/50' },
                                ].map((stat, i) => (
                                    <div key={i} className={`p-8 rounded-[2.5rem] border transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 group ${darkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' : 'bg-white border-white shadow-xl shadow-slate-200/50'}`}>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`p-4 rounded-[1.2rem] ${darkMode ? 'bg-slate-800' : stat.bg} ${stat.color} transition-colors group-hover:scale-110 duration-300`}>
                                                <stat.icon className="w-7 h-7" />
                                            </div>
                                            <ArrowRight className={`w-5 h-5 -rotate-45 transition-transform group-hover:rotate-0 duration-300 ${darkMode ? 'text-slate-600' : 'text-slate-300'}`} />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className={`text-4xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</h3>
                                            <div className="flex items-center justify-between">
                                                <p className={`text-sm font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
                                                <span className={`text-[10px] uppercase font-black tracking-wider px-2 py-1 rounded-lg ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{stat.sub}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Main Content - Attendance Chart */}
                                <div className={`lg:col-span-2 p-10 rounded-[3rem] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white shadow-xl shadow-slate-200/50'}`}>
                                    <div className="flex justify-between items-center mb-10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-600">
                                                <TrendingUp className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Weekly Presence</h3>
                                                <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Activity Report</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setActiveTab('attendance')} className={`text-xs font-black uppercase tracking-widest px-6 py-3 rounded-2xl border transition-all hover:scale-105 active:scale-95 ${darkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'}`}>
                                            View Report
                                        </button>
                                    </div>

                                    <div className="flex items-end justify-between h-56 gap-2 sm:gap-6 px-2">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group cursor-pointer">
                                                <div className="w-full relative h-full bg-slate-50 dark:bg-slate-950 rounded-[1rem] overflow-hidden flex items-end ring-4 ring-white dark:ring-slate-800 group-hover:ring-indigo-100 dark:group-hover:ring-indigo-900/30 transition-all duration-300">
                                                    <div
                                                        className={`w-full transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative ${i === 3 ? 'h-[60%] bg-amber-400' : i === 5 ? 'h-0' : 'h-full bg-indigo-500 group-hover:bg-indigo-600'}`}
                                                    >
                                                        {i !== 5 && (
                                                            <div className="absolute top-0 w-full h-1 bg-white/30"></div>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${darkMode ? 'text-slate-600 group-hover:text-indigo-400' : 'text-slate-300 group-hover:text-indigo-600'}`}>{day}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Sidebar - Notices Feed */}
                                <div className={`lg:col-span-1 flex flex-col p-8 rounded-[3rem] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white shadow-xl shadow-slate-200/50'}`}>
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-2xl bg-red-500/10 text-red-600 relative">
                                                <Bell className="w-6 h-6" />
                                                <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-900"></span>
                                            </div>
                                            <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Updates</h3>
                                        </div>
                                    </div>

                                    <div className="space-y-4 flex-1 overflow-y-auto max-h-[450px] custom-scrollbar pr-2 -mr-2">
                                        {notices.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-12 text-slate-400 h-full">
                                                <Megaphone className="w-10 h-10 opacity-10 mb-4" />
                                                <p className="text-sm font-bold opacity-50">No recent updates</p>
                                            </div>
                                        ) : notices.slice(0, 4).map(n => (
                                            <div key={n.id} className={`p-6 rounded-[2rem] border transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${darkMode ? 'bg-slate-950/50 border-slate-800 hover:bg-slate-800' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-100 hover:border-indigo-100'}`}>
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${darkMode ? 'bg-indigo-500/10 text-indigo-300' : 'bg-white text-indigo-600 border border-indigo-100'}`}>
                                                        {new Date(n.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <h5 className={`font-bold text-sm mb-2 leading-snug ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{n.title}</h5>
                                                <p className={`text-xs line-clamp-2 leading-relaxed font-medium ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{n.content || n.message}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <button onClick={() => setActiveTab('notices')} className={`w-full mt-6 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest border border-dashed transition-all hover:border-solid ${darkMode ? 'border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white' : 'border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}>
                                        View All Notices
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'profile' && (
                        <div className="max-w-3xl mx-auto">
                            <ProfileView
                                userConfig={userConfig}
                                setUserConfig={setUserConfig}
                                setView={() => setActiveTab('dashboard')} // Not used in embedded
                                variant="embedded"
                                role="student"
                            />
                        </div>
                    )}
                    {activeTab === 'notices' && <StudentNotices userConfig={userConfig} />}
                    {activeTab === 'fees' && <StudentFees userConfig={userConfig} />}
                    {activeTab === 'timetable' && <StudentTimetable userConfig={userConfig} />}
                    {activeTab === 'calendar' && <StudentCalendar userConfig={userConfig} />}
                    {activeTab === 'attendance' && <StudentAttendance userConfig={userConfig} />}
                    {activeTab === 'materials' && <StudentMaterials userConfig={userConfig} />}
                    {activeTab === 'quizzes' && <StudentQuizzes userConfig={userConfig} />}
                    {activeTab === 'helpdesk' && <StudentHelpdesk userConfig={userConfig} />}
                </div>
            </main>
        </div>
    );
};
