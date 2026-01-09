import React, { useState, useEffect } from 'react';
import { adminService, StudentSummary } from '../services/admin';
import { authService } from '../services/auth';
import { seederService } from '../services/seeder';
import { Users, BookOpen, GraduationCap, Search, Filter, ArrowUpRight, LogOut, Moon, Sun, School, Layout, Menu, X, Zap as ZapIcon, Database } from 'lucide-react';
import schoolLogo from '../assets/logo.png';
import { SchoolManagement } from './SchoolManagement';

interface AdminDashboardProps {
    setView: (view: any) => void;
    darkMode: boolean;
    toggleDarkMode: () => void;
    role?: 'admin' | 'teacher' | 'school_admin' | 'staff'; // Added Role Prop
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setView, darkMode, toggleDarkMode, role = 'admin' }) => {
    const [activePortal, setActivePortal] = useState<'erp' | 'analytics'>('erp');
    const [students, setStudents] = useState<StudentSummary[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<StudentSummary[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [filterClass, setFilterClass] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        adminService.getAllStudents().then(data => {
            setStudents(data);
            setFilteredStudents(data);
        });
        adminService.getStats().then(setStats);
    }, []);

    useEffect(() => {
        let res = students;
        if (filterClass !== 'All') {
            res = res.filter(s => s.class === filterClass);
        }
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            res = res.filter(s => s.name.toLowerCase().includes(lower) || s.email.toLowerCase().includes(lower));
        }
        setFilteredStudents(res);
    }, [filterClass, searchTerm, students]);

    const handleLogout = async () => {
        await authService.logout();
        localStorage.removeItem('admin_token');
        setView('landing');
        window.location.reload();
    };

    const dashboardTitle = role === 'teacher' ? 'Teacher Portal' : role === 'staff' ? 'Staff Portal' : 'Admin Portal';

    const menuItems = [
        { id: 'erp', label: 'School ERP', icon: School },
        { id: 'analytics', label: 'Analytics', icon: Layout },
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
                        <img src={schoolLogo} className="w-10 h-10 rounded-xl" alt="School Logo" />
                        <div>
                            <h3 className={`text-lg font-black tracking-tight leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{dashboardTitle}<br />Vidyabodhini</h3>
                        </div>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-1 flex-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 pl-4">Switch View</div>
                    {menuItems.map((item) => (
                        // Only show Analytics if permitted
                        (item.id === 'analytics' && role !== 'admin' && role !== 'school_admin') ? null :
                            <button
                                key={item.id}
                                onClick={() => { setActivePortal(item.id as any); setIsMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200 group relative overflow-hidden ${activePortal === item.id
                                    ? (darkMode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200')
                                    : (darkMode ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-900')
                                    } `}
                            >
                                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activePortal === item.id ? 'text-white' : (darkMode ? 'text-slate-500 group-hover:text-white' : 'text-slate-400 group-hover:text-indigo-600')} `} />
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
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between p-4 mb-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}>
                            {activePortal === 'erp' ? <School className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} /> : <Layout className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />}
                        </div>
                        <span className={`font-black uppercase tracking-wider ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {menuItems.find(i => i.id === activePortal)?.label}
                        </span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(true)} className={`p-2.5 rounded-xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}>
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {activePortal === 'erp' ? (
                        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                            {/* NOTE: We pass role to SchoolManagement. Be aware SchoolManagement has its OWN sidebar typically. 
                                In this "Ultra Premium" redesign, we might want to HIDE SchoolManagement's internal sidebar if we are using AdminDashboard's outer sidebar. 
                                HOWEVER, SchoolManagement handles sub-tabs (fees, transport etc). 
                                STRATEGY: Render SchoolManagement AS IS, but maybe we can style it to fit better? 
                                Actually, SchoolManagement HAS a sidebar. Rendering it inside another sidebar layout is double sidebar.
                                BETTER FIX: SchoolManagement IS the content. 
                                The AdminDashboard here acts as a "Portal Switcher". 
                                IF activePortal is ERP, we just render SchoolManagement. 
                                BUT SchoolManagement takes full screen width usually. 
                                Let's wrap it in a div that handles it gracefully. 
                                OR: If SchoolManagement has its own sidebar, we might have a conflict visual.
                                Ideally, AdminDashboard shouldn't have a sidebar if SchoolManagement has one.
                                Let's check: SchoolManagement has a sidebar.
                                So if we are in ERP mode, we should perhaps HIDE the AdminDashboard Sidebar? 
                                or make AdminDashboard Sidebar minimal? 
                                
                                DECISION: AdminDashboard acts as the ROOT. 
                                The "Floating Dock" I added IS the global navigation. 
                                SchoolManagement should ideally NOT have its own sidebar if used here, 
                                OR we accept the nested navigation pattern (Global Scope [ERP/Analytics] -> Local Scope [Fees/Transport]).
                                This is common in complex apps.
                                I will proceed with rendering SchoolManagement inside the content area. 
                             */}
                            <div className="h-[calc(100vh-6rem)] relative">
                                {/* Since SchoolManagement is complex and not easily refactored in one shot to remove its sidebar without breaking internal state logic,
                                  we will render it. It will look like an app-within-an-app, which is acceptable for "ERP" module. 
                                  However, to make it "Ultra Premium", we might want to eventually refactor SchoolManagement to accept "hideSidebar" prop.
                                  For now, I'll render it as is. It contains the sub-module navigation which is critical. */}
                                <SchoolManagement darkMode={darkMode} role={role} />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 max-w-7xl mx-auto">
                            {/* Analytics Content */}
                            <header>
                                <h2 className={`text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Analytics Overview</h2>
                                <p className={`font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Deep dive into school performance metrics.</p>
                            </header>

                            {/* Stats Row */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                                    { label: 'Active Today', value: stats?.activeToday || 0, icon: ZapIcon, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                    { label: 'Avg Syllabus', value: `${stats?.averageProgress || 0}%`, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
                                    { label: 'Retention', value: '98%', icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-50' }
                                ].map((stat, i) => (
                                    <div key={i} className={`p-6 rounded-[2rem] border shadow-sm transition-all hover:-translate-y-1 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white shadow-xl shadow-slate-200/50'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-3 rounded-2xl ${darkMode ? 'bg-slate-800' : stat.bg} ${stat.color}`}>
                                                <stat.icon className="w-6 h-6" />
                                            </div>
                                        </div>
                                        <h3 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</h3>
                                        <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Class Dist Chart */}
                                <div className={`lg:col-span-1 p-8 rounded-[2.5rem] border shadow-sm text-white shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-gradient-to-br from-indigo-900 to-indigo-800 border-indigo-900'}`}>
                                    <h4 className="font-bold text-indigo-200 uppercase text-xs tracking-widest mb-8">Class Distribution</h4>
                                    <div className="flex justify-between items-end h-40 gap-3">
                                        {Object.entries(stats?.classDistribution || {}).map(([cls, count]: any) => (
                                            <div key={cls} className="flex-1 flex flex-col justify-end items-center gap-2 group cursor-pointer relative">
                                                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold bg-black text-white px-2 py-1 rounded-lg">{count}</div>
                                                <div className="w-full bg-indigo-400/30 rounded-t-xl transition-all group-hover:bg-indigo-400 relative overflow-hidden" style={{ height: `${stats?.totalStudents ? (count / stats.totalStudents) * 100 : 0}%` }}>
                                                    <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-indigo-500/50 to-transparent"></div>
                                                </div>
                                                <span className="text-[10px] font-bold opacity-70">{cls}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Students Table */}
                                <div className={`lg:col-span-2 rounded-[2.5rem] border shadow-sm overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white shadow-xl shadow-slate-200/50'}`}>
                                    <div className={`p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                        <h2 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Student Directory</h2>
                                        <div className="flex gap-3">
                                            <div className="relative">
                                                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search..."
                                                    className={`pl-10 pr-4 py-2.5 rounded-xl border-none text-xs font-bold outline-none ring-2 ${darkMode ? 'bg-slate-950 ring-slate-800 text-slate-200 focus:ring-indigo-500' : 'bg-slate-50 ring-transparent text-slate-600 focus:ring-indigo-100'} w-48`}
                                                    value={searchTerm}
                                                    onChange={e => setSearchTerm(e.target.value)}
                                                />
                                            </div>
                                            <select
                                                className={`px-4 py-2 rounded-xl text-xs font-bold border-none outline-none cursor-pointer ${darkMode ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-600'}`}
                                                value={filterClass}
                                                onChange={e => setFilterClass(e.target.value)}
                                            >
                                                <option value="All">All Classes</option>
                                                <option value="8">Class 8</option>
                                                <option value="9">Class 9</option>
                                                <option value="10">Class 10</option>
                                                <option value="11">Class 11</option>
                                                <option value="12">Class 12</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto max-h-[400px] custom-scrollbar">
                                        <table className="w-full text-left">
                                            <thead className={`sticky top-0 z-10 text-[10px] font-black uppercase tracking-widest ${darkMode ? 'bg-slate-950 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
                                                <tr>
                                                    <th className="px-6 py-4">Student</th>
                                                    <th className="px-6 py-4">Class</th>
                                                    <th className="px-6 py-4">Progress</th>
                                                    <th className="px-6 py-4">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-50'}`}>
                                                {filteredStudents.map(student => (
                                                    <tr key={student.id} className={`transition-colors group ${darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-indigo-50/50'}`}>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                                                                    {student.name.substring(0, 1)}
                                                                </div>
                                                                <div>
                                                                    <p className={`font-bold text-xs ${darkMode ? 'text-indigo-100' : 'text-indigo-950'}`}>{student.name}</p>
                                                                    <p className="text-[10px] text-slate-400">{student.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`font-bold text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{student.class} - {student.section}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-16 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                                                    <div className={`h-full rounded-full ${student.progress > 75 ? 'bg-emerald-500' : student.progress > 40 ? 'bg-indigo-500' : 'bg-orange-500'}`} style={{ width: `${student.progress}%` }}></div>
                                                                </div>
                                                                <span className={`text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{student.progress}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wide ${student.status === 'Active' ? (darkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-600') : (darkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400')}`}>
                                                                {student.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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
