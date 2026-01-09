import React, { useState, useEffect } from 'react';
import { adminService, StudentSummary } from '../../../services/admin';
import { authService } from '../../../services/auth';
import { seederService } from '../../../services/seeder';
import { Users, BookOpen, GraduationCap, Search, LogOut, Moon, Sun, School, Layout, Menu, X, Zap as ZapIcon, Database, LayoutDashboard, User, Megaphone, Clock, CheckCircle, Sparkles, TrendingUp, Calendar, Bell, ArrowRight, BookMarked, UserPlus, Bus, CreditCard, Layers, ClipboardList, FileText } from 'lucide-react';
import schoolLogo from '../../../assets/logo.png';
import { SchoolManagement } from './SchoolManagement';
import { ProfileView } from '../../ProfileView';
import { PortalSelector } from '../../PortalSelector';
import { PortalType, portalContextService } from '../../../services/portalContext';
import { StaffManagement } from '../../modules/admin/StaffManagement';
import { AdmissionManagement } from '../../modules/admin/AdmissionManagement';
import { TransportManagement } from '../../modules/admin/TransportManagement';
import {
    InventoryManager,
    TimetableBuilder,
    CircularsManager,
    EventCalendar,
    FeeManagementModule
} from '../../modules/admin/AdminModules';
import { StudentDirectory } from '../../modules/admin/StudentDirectory';
import { ClassManagement } from '../../modules/admin/ClassManagement';

interface AdminDashboardProps {
    setView: (view: any) => void;
    darkMode: boolean;
    toggleDarkMode: () => void;
    role?: 'admin' | 'teacher' | 'school_admin' | 'staff';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setView, darkMode, toggleDarkMode, role = 'admin' }) => {
    const [activePortal, setActivePortal] = useState<PortalType>('school');
    const [activeTab, setActiveTab] = useState<string>('dashboard');
    const [stats, setStats] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Fetch data based on active portal
        adminService.getStats(activePortal).then(setStats);
    }, [activePortal]);

    const handleLogout = async () => {
        await authService.logout();
        localStorage.removeItem('admin_token');
        setView('landing');
        window.location.reload();
    };

    const dashboardTitle = role === 'teacher' ? 'Teacher Portal' : role === 'staff' ? 'Staff Portal' : 'Admin Portal';

    const allMenuItems = [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, portal: 'both', parent: null },
        // ERP Features - only in SCHOOL portal
        { id: 'admissions', label: 'Admissions', icon: UserPlus, portal: 'school', parent: 'erp' },
        { id: 'staff', label: 'Staff Hub', icon: Users, portal: 'school', parent: 'erp' },
        { id: 'students', label: 'Students', icon: GraduationCap, portal: 'both', parent: 'erp' },
        { id: 'fees', label: 'Fee Manager', icon: CreditCard, portal: 'school', parent: 'erp' },
        { id: 'transport', label: 'Transport', icon: Bus, portal: 'school', parent: 'erp' },
        { id: 'inventory', label: 'Inventory', icon: Layers, portal: 'school', parent: 'erp' },
        { id: 'timetable', label: 'Timetable', icon: ClipboardList, portal: 'school', parent: 'erp' },
        { id: 'classes', label: 'Classes & Subjects', icon: BookOpen, portal: 'school', parent: 'erp' },
        { id: 'circulars', label: 'Notices', icon: FileText, portal: 'school', parent: 'erp' },
        { id: 'calendar', label: 'Calendar', icon: Calendar, portal: 'school', parent: 'erp' },
        { id: 'analytics', label: 'Analytics', icon: LayoutDashboard, portal: 'school', parent: null },
        { id: 'profile', label: 'Profile', icon: User, portal: 'school', parent: null },
    ];

    // Filter menu items based on active portal
    const menuItems = allMenuItems.filter(item => item.portal === 'both' || item.portal === activePortal);

    return (
        <div className={`relative flex min-h-screen font-['Inter'] transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-4 lg:top-4 h-[calc(100vh-2rem)] z-50 w-72 flex flex-col mx-4 lg:ml-4 lg:mr-0 p-6 rounded-[2.5rem] transform transition-all duration-300 ease-in-out shadow-2xl border backdrop-blur-xl
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'}
                ${darkMode ? 'bg-slate-900/90 border-slate-800 shadow-black/50' : 'bg-white/90 border-white shadow-indigo-100'}
            `}>
                <div className="mb-10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-500/30">
                                V
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"></div>
                        </div>
                        <div>
                            <h3 className={`text-lg font-black tracking-tight leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Admin<br />Portal</h3>
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

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    {role === 'admin' && (
                        <button
                            onClick={async () => {
                                if (confirm('⚠️ WARNING: This will clear existing data and populate fresh dummy data. Continue?')) {
                                    await seederService.seedAll();
                                    alert('Database Seeded Successfully! Reloading...');
                                    window.location.reload();
                                }
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs uppercase transition-colors ${darkMode ? 'bg-indigo-900/20 text-indigo-400 hover:bg-indigo-900/40' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                        >
                            <Database className="w-4 h-4" /> Seed Data
                        </button>
                    )}
                    {role === 'admin' && (
                        <button
                            onClick={async () => {
                                const res = await seederService.repairData();
                                alert(res.message);
                                window.location.reload();
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs uppercase transition-colors ${darkMode ? 'bg-emerald-900/20 text-emerald-400 hover:bg-emerald-900/40' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                        >
                            <ZapIcon className="w-4 h-4" /> Repair Visibility
                        </button>
                    )}
                    <button onClick={toggleDarkMode} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs uppercase transition-colors ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs uppercase transition-colors ${darkMode ? 'text-red-400 hover:bg-red-950/20 hover:text-red-300' : 'text-red-500 hover:bg-red-50 hover:text-red-600'}`}>
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 p-4 lg:p-6 lg:h-screen lg:overflow-y-auto custom-scrollbar">
                {/* Top Header with Portal Selector */}
                <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className={`text-3xl font-black mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Admin Dashboard</h1>
                        <p className={`text-sm font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage your school and learning systems</p>
                    </div>
                    <PortalSelector
                        currentPortal={activePortal}
                        onPortalChange={(portal) => {
                            setActivePortal(portal);
                            setActiveTab('dashboard');
                        }}
                        darkMode={darkMode}
                    />
                </div>

                {/* Portal Info Banner */}
                <div className={`mb-6 p-4 rounded-2xl border flex items-center justify-between animate-in fade-in slide-in-from-top-2 ${activePortal === 'lms'
                    ? darkMode
                        ? 'bg-indigo-900/20 border-indigo-800 text-indigo-300'
                        : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : darkMode
                        ? 'bg-emerald-900/20 border-emerald-800 text-emerald-300'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">
                            {activePortal === 'lms' ? '📚' : '🏫'}
                        </span>
                        <div>
                            <div className="font-black text-sm">
                                {activePortal === 'lms'
                                    ? 'LMS Portal - All Students, All Schools'
                                    : 'School Portal - Vidyabodhini Only'}
                            </div>
                            <div className="text-xs font-bold opacity-75">
                                {activePortal === 'lms'
                                    ? 'Managing learning data across all schools'
                                    : 'Managing Vidyabodhini Integrated Public School'}
                            </div>
                        </div>
                    </div>
                    <div className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg"
                        style={{
                            backgroundColor: activePortal === 'lms' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        }}
                    >
                        ACTIVE
                    </div>
                </div>

                <div className="lg:hidden flex items-center justify-between p-4 mb-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}>
                            <School className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
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
                            <div className={`relative overflow-hidden rounded-[3rem] text-white p-8 lg:p-12 shadow-2xl dark:shadow-none ring-1 ring-white/10 group ${activePortal === 'lms'
                                ? 'bg-gradient-to-br from-indigo-700 via-violet-600 to-indigo-600 shadow-indigo-500/20'
                                : 'bg-gradient-to-br from-emerald-700 via-teal-600 to-emerald-600 shadow-emerald-500/20'
                                }`}>
                                {/* Decorative Glows & Animations */}
                                <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none mix-blend-overlay animate-pulse duration-3000 ${activePortal === 'lms'
                                    ? 'bg-indigo-400/20'
                                    : 'bg-emerald-400/20'
                                    }`}></div>
                                <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none mix-blend-overlay ${activePortal === 'lms'
                                    ? 'bg-purple-500/20'
                                    : 'bg-teal-500/20'
                                    }`}></div>
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-10">
                                    <div className="space-y-6 max-w-2xl">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest shadow-sm">
                                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                                <span>{new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}</span>
                                            </span>
                                            <span className={`font-bold text-xs uppercase tracking-widest flex items-center gap-2 ${activePortal === 'lms'
                                                ? 'text-indigo-200'
                                                : 'text-emerald-200'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${activePortal === 'lms'
                                                    ? 'bg-indigo-300'
                                                    : 'bg-emerald-300'
                                                    }`}></div>
                                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                            </span>
                                        </div>

                                        <div>
                                            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-4 leading-[0.9]">
                                                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">Admin</span>.
                                            </h2>
                                            {activePortal === 'lms' ? (
                                                <p className="text-lg text-indigo-100 font-medium opacity-90 leading-relaxed max-w-lg">
                                                    Manage learning across all schools. <span className="bg-white/20 px-2 py-0.5 rounded-lg text-white font-bold">{stats?.totalStudents || 0} Students</span> and <span className="bg-white/20 px-2 py-0.5 rounded-lg text-white font-bold">{stats?.activeToday || 0} Active</span> today.
                                                </p>
                                            ) : (
                                                <p className="text-lg text-indigo-100 font-medium opacity-90 leading-relaxed max-w-lg">
                                                    Manage Vidyabodhini Integrated Public School. <span className="bg-white/20 px-2 py-0.5 rounded-lg text-white font-bold">{stats?.totalStudents || 0} Students</span> and <span className="bg-white/20 px-2 py-0.5 rounded-lg text-white font-bold">{stats?.activeToday || 0} Active</span> today.
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-4 pt-2">
                                            {activePortal === 'lms' ? (
                                                <>
                                                    <button className="px-6 py-3 bg-white text-indigo-600 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-900/20 hover:bg-indigo-50 transition-all hover:-translate-y-1">Learning Management System</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => setActiveTab('erp')} className="px-6 py-3 bg-white text-emerald-600 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-900/20 hover:bg-emerald-50 transition-all hover:-translate-y-1">Manage School</button>
                                                    <button onClick={() => setActiveTab('analytics')} className="px-6 py-3 bg-emerald-500/30 backdrop-blur-md border border-emerald-400/30 text-white rounded-2xl font-bold text-sm hover:bg-emerald-500/40 transition-all">View Analytics</button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-full md:w-auto">
                                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2.5rem] w-full md:min-w-[320px] hover:bg-white/15 transition-all duration-300 group cursor-pointer shadow-2xl shadow-black/10">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="space-y-1">
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-200 opacity-80">Key Metric</div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                                        <span className="text-sm font-bold text-white tracking-wide">SYSTEM HEALTHY</span>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-white/20 rounded-2xl group-hover:rotate-12 transition-transform duration-500 shadow-inner">
                                                    <ZapIcon className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-3xl font-black text-white tracking-tight">98%</div>
                                                <div className="text-sm font-medium text-indigo-200">System Uptime</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Total Students', value: stats?.totalStudents || 0, sub: 'All Classes', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-500/10', border: 'border-indigo-200/50' },
                                    { label: 'Active Today', value: stats?.activeToday || 0, sub: 'Learning', icon: ZapIcon, color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-200/50' },
                                    { label: 'Avg Progress', value: `${stats?.averageProgress || 0}%`, sub: 'Syllabus', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-200/50' },
                                    { label: 'Completion', value: '94%', sub: 'Overall', icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-500/10', border: 'border-purple-200/50' },
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

                            {/* Students Table and Staff Directory Removed - Moved to respective tabs */}
                        </div>
                    )}
                    {activeTab === 'profile' && activePortal === 'school' && (
                        <div className="max-w-3xl mx-auto">
                            <ProfileView
                                userConfig={null}
                                setUserConfig={() => { }}
                                setView={() => setActiveTab('dashboard')}
                                variant="embedded"
                                role="admin"
                            />
                        </div>
                    )}
                    {/* ERP Features - Show when activeTab matches ERP feature ID */}
                    {(activeTab === 'students' || (['admissions', 'staff', 'fees', 'transport', 'inventory', 'timetable', 'classes', 'circulars', 'calendar'].includes(activeTab) && activePortal === 'school')) && (
                        <div>
                            {activeTab === 'admissions' && <AdmissionManagement darkMode={darkMode} />}
                            {activeTab === 'staff' && <StaffManagement darkMode={darkMode} />}
                            {activeTab === 'fees' && <FeeManagementModule darkMode={darkMode} />}
                            {activeTab === 'transport' && <TransportManagement darkMode={darkMode} />}
                            {activeTab === 'inventory' && <InventoryManager darkMode={darkMode} />}
                            {activeTab === 'timetable' && <TimetableBuilder darkMode={darkMode} />}
                            {activeTab === 'circulars' && <CircularsManager darkMode={darkMode} role={role} />}
                            {activeTab === 'calendar' && <EventCalendar darkMode={darkMode} />}
                            {activeTab === 'circulars' && <CircularsManager darkMode={darkMode} role={role} />}
                            {activeTab === 'calendar' && <EventCalendar darkMode={darkMode} />}
                            {activeTab === 'calendar' && <EventCalendar darkMode={darkMode} />}
                            {activeTab === 'students' && <StudentDirectory darkMode={darkMode} activePortal={activePortal} />}
                            {activeTab === 'classes' && <ClassManagement darkMode={darkMode} />}
                        </div>
                    )}
                    {activeTab === 'analytics' && activePortal === 'school' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <header>
                                <h2 className={`text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Analytics Overview</h2>
                                <p className={`font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Deep dive into school performance and learning metrics.</p>
                            </header>

                            {/* Analytics Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className={`p-10 rounded-[3rem] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white shadow-xl shadow-slate-200/50'}`}>
                                    <div className="flex justify-between items-center mb-10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-600">
                                                <TrendingUp className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Weekly Progress</h3>
                                                <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Student Activity</p>
                                            </div>
                                        </div>
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

                                <div className={`p-10 rounded-[3rem] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white shadow-xl shadow-slate-200/50'}`}>
                                    <div className="flex justify-between items-center mb-10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600">
                                                <Users className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Class Distribution</h3>
                                                <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Students per Class</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {stats?.classDistribution && Object.keys(stats.classDistribution).length > 0 ? (
                                            Object.entries(stats.classDistribution).map(([className, count]: [string, any], i) => {
                                                const total = stats.totalStudents || 1;
                                                const percent = Math.round((count / total) * 100);
                                                const colors = ['bg-emerald-500', 'bg-indigo-500', 'bg-amber-500', 'bg-purple-500', 'bg-blue-500', 'bg-rose-500'];
                                                const color = colors[i % colors.length];

                                                return (
                                                    <div key={className}>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className={`font-bold text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Class {className}</span>
                                                            <div className="text-right">
                                                                <span className={`font-black text-xs block ${darkMode ? 'text-white' : 'text-slate-900'}`}>{count} Students</span>
                                                                <span className={`text-[10px] font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{percent}%</span>
                                                            </div>
                                                        </div>
                                                        <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                                            <div className={`h-full ${color}`} style={{ width: `${percent}%` }}></div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-10 text-slate-400 font-bold">
                                                No student data available.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
