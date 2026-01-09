import React, { useState } from 'react';
import { authService } from '../../../services/auth';
import { Bus, MapPin, Users, Fuel, Clock, Navigation, Phone, LogOut, Moon, Sun, Menu, X, Shield, LayoutDashboard, AlertCircle, Wrench, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import schoolLogo from '../../../assets/logo.png';

interface DriverDashboardProps {
    setView: (view: string) => void;
    darkMode: boolean;
    toggleDarkMode: () => void;
    user: any;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({ setView, darkMode, toggleDarkMode, user }) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'route' | 'fuel' | 'maintenance' | 'students'>('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await authService.logout();
        localStorage.removeItem('admin_token');
        window.location.reload();
    };

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
                                T
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"></div>
                        </div>
                        <div>
                            <h3 className={`text-lg font-black tracking-tight leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Transport<br />Portal</h3>
                        </div>
                    </div>
                    {/* Close Button mobile */}
                    <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 pl-4">Menu</div>
                    {[
                        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
                        { id: 'route', label: 'Active Route', icon: Navigation },
                        { id: 'fuel', label: 'Fuel Log', icon: Fuel },
                        { id: 'maintenance', label: 'Maintenance', icon: Wrench },
                        { id: 'students', label: 'Students', icon: Users },
                    ].map((item) => (
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

            {/* Main Content */}
            <main className="flex-1 min-w-0 p-4 lg:p-6 lg:h-screen lg:overflow-y-auto custom-scrollbar">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between p-4 mb-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}>
                            <Bus className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                        </div>
                        <span className={`font-black uppercase tracking-wider ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            Dashboard
                        </span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(true)} className={`p-2.5 rounded-xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}>
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8">
                            {/* Welcome Card */}
                            <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-10 shadow-2xl shadow-indigo-500/20">
                                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-400/20 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none mix-blend-overlay animate-pulse duration-3000"></div>
                                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none mix-blend-overlay"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest shadow-sm">
                                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                            <span>{new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}</span>
                                        </span>
                                    </div>
                                    <h2 className="text-4xl font-black mb-2">Hello, {user?.name || 'Driver'}</h2>
                                    <p className="font-medium text-indigo-100 mb-6">Route #42 • Bus KA-01-AB-1234</p>
                                    <div className="flex gap-4 mt-8">
                                        <button onClick={() => setActiveTab('route')} className="px-8 py-4 bg-white text-indigo-700 rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl hover:scale-105 transition-transform">
                                            Start Route
                                        </button>
                                        <button onClick={() => setActiveTab('maintenance')} className="px-8 py-4 bg-indigo-500/30 border border-indigo-400/30 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-indigo-500/50 transition-colors">
                                            Report Issue
                                        </button>
                                    </div>
                                </div>
                                <Bus className="absolute -right-10 -bottom-10 w-64 h-64 text-indigo-950/20 rotate-[-10deg]" />
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Fuel Level', value: '75%', sub: 'Tank Status', icon: Fuel, color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-200/50' },
                                    { label: 'Distance Today', value: '45 km', sub: 'Route', icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-200/50' },
                                    { label: 'Students Onboard', value: '24', sub: 'Pickups Done', icon: Users, color: 'text-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-200/50' },
                                    { label: 'Next Maintenance', value: '2 weeks', sub: 'Schedule', icon: Wrench, color: 'text-purple-600', bg: 'bg-purple-500/10', border: 'border-purple-200/50' },
                                ].map((stat, i) => (
                                    <div key={i} className={`p-8 rounded-[2.5rem] border transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 group ${darkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' : 'bg-white border-white shadow-xl shadow-slate-200/50'}`}>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`p-4 rounded-[1.2rem] ${darkMode ? 'bg-slate-800' : stat.bg} ${stat.color} transition-colors group-hover:scale-110 duration-300`}>
                                                <stat.icon className="w-7 h-7" />
                                            </div>
                                            <ArrowRight className={`w-5 h-5 -rotate-45 transition-transform group-hover:rotate-0 duration-300 ${darkMode ? 'text-slate-600' : 'text-slate-300'}`} />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className={`text-3xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</h3>
                                            <div className="flex items-center justify-between">
                                                <p className={`text-sm font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
                                                <span className={`text-[10px] uppercase font-black tracking-wider px-2 py-1 rounded-lg ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{stat.sub}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Activity Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className={`p-10 rounded-[3rem] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white shadow-xl shadow-slate-200/50'}`}>
                                    <div className="flex justify-between items-center mb-10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-600">
                                                <TrendingUp className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Weekly Activity</h3>
                                                <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Distance & Time</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className={`font-bold text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{day}</span>
                                                    <span className={`font-black text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{40 + i * 5} km</span>
                                                </div>
                                                <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                                    <div className="h-full bg-indigo-500" style={{ width: `${(40 + i * 5) / 80 * 100}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={`p-10 rounded-[3rem] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white shadow-xl shadow-slate-200/50'}`}>
                                    <div className="flex justify-between items-center mb-10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-2xl bg-red-500/10 text-red-600">
                                                <AlertCircle className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Alerts & Notices</h3>
                                                <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Important Updates</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className={`p-6 rounded-[2rem] border transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${darkMode ? 'bg-slate-950/50 border-slate-800 hover:bg-slate-800' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-100 hover:border-indigo-100'}`}>
                                            <div className="flex justify-between items-start mb-3">
                                                <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${darkMode ? 'bg-red-500/10 text-red-300' : 'bg-white text-red-600 border border-red-100'}`}>
                                                    Urgent
                                                </span>
                                            </div>
                                            <h5 className={`font-bold text-sm mb-2 leading-snug ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>Route Detour Tomorrow</h5>
                                            <p className={`text-xs line-clamp-2 leading-relaxed font-medium ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Road maintenance on Main Street. Use alternate route.</p>
                                        </div>
                                        <div className={`p-6 rounded-[2rem] border transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${darkMode ? 'bg-slate-950/50 border-slate-800 hover:bg-slate-800' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-100 hover:border-indigo-100'}`}>
                                            <div className="flex justify-between items-start mb-3">
                                                <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${darkMode ? 'bg-blue-500/10 text-blue-300' : 'bg-white text-blue-600 border border-blue-100'}`}>
                                                    Info
                                                </span>
                                            </div>
                                            <h5 className={`font-bold text-sm mb-2 leading-snug ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>Maintenance Scheduled</h5>
                                            <p className={`text-xs line-clamp-2 leading-relaxed font-medium ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Bus servicing on Saturday. No route operation.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'route' && (
                        <div className={`p-10 rounded-[3rem] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white shadow-xl shadow-slate-200/50'}`}>
                            <h2 className={`text-2xl font-black mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Active Route - Route #42</h2>
                            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Real-time route tracking and GPS navigation coming soon...</p>
                        </div>
                    )}
                    {activeTab === 'fuel' && (
                        <div className={`p-10 rounded-[3rem] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white shadow-xl shadow-slate-200/50'}`}>
                            <h2 className={`text-2xl font-black mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Fuel Log</h2>
                            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Track fuel consumption and expenses coming soon...</p>
                        </div>
                    )}
                    {activeTab === 'maintenance' && (
                        <div className={`p-10 rounded-[3rem] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white shadow-xl shadow-slate-200/50'}`}>
                            <h2 className={`text-2xl font-black mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Maintenance & Issues</h2>
                            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Report and track vehicle maintenance issues coming soon...</p>
                        </div>
                    )}
                    {activeTab === 'students' && (
                        <div className={`p-10 rounded-[3rem] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white shadow-xl shadow-slate-200/50'}`}>
                            <h2 className={`text-2xl font-black mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Students Onboard</h2>
                            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>View and manage student list for your route coming soon...</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
