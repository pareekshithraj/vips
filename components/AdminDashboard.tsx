
import React, { useState, useEffect } from 'react';
import { adminService, StudentSummary } from '../services/admin';
import { Users, BookOpen, GraduationCap, Search, Filter, ArrowUpRight, LogOut } from 'lucide-react';
import schoolLogo from '../assets/logo.png';

interface AdminDashboardProps {
    setView: (view: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setView }) => {
    const [students, setStudents] = useState<StudentSummary[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<StudentSummary[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [filterClass, setFilterClass] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        adminService.getAllStudents().then(data => {
            setStudents(data);
            setFilteredStudents(data);
        });
        setStats(adminService.getStats());
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

    return (
        <div className="min-h-screen bg-slate-50 font-['Inter']">
            <nav className="bg-indigo-950 text-white px-8 py-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                    <img src={schoolLogo} className="w-8 h-8 rounded-lg border-2 border-indigo-800" />
                    <div>
                        <h1 className="font-black text-lg leading-none uppercase tracking-tight">Admin Portal</h1>
                        <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Vidyabodhini School</p>
                    </div>
                </div>
                <button onClick={() => setView('landing')} className="flex items-center gap-2 text-xs font-bold bg-indigo-900 hover:bg-indigo-800 px-4 py-2 rounded-lg transition-colors border border-indigo-700">
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl border shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Users className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12 new</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">{stats?.totalStudents || 0}</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Students</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                <ZapIcon className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">{stats?.activeToday || 0}</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Today</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <BookOpen className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">{stats?.averageProgress || 0}%</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Avg. Syllabus Compl.</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 p-6 rounded-2xl text-white shadow-xl">
                        <h4 className="font-bold text-indigo-200 uppercase text-xs tracking-widest mb-4">Class Distribution</h4>
                        <div className="flex justify-between items-end h-16 gap-2">
                            {Object.entries(stats?.classDistribution || {}).map(([cls, count]: any) => (
                                <div key={cls} className="flex-1 flex flex-col justify-end items-center gap-1 group cursor-pointer">
                                    <div className="w-full bg-indigo-400/30 rounded-t-lg transition-all group-hover:bg-indigo-400" style={{ height: `${(count / 150) * 100}%` }}></div>
                                    <span className="text-[10px] font-bold">{cls}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-black text-indigo-950">Student Directories</h2>
                        <div className="flex gap-3">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    className="pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border-none text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-100 w-64"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 px-4 rounded-xl">
                                <Filter className="w-4 h-4 text-slate-400" />
                                <select
                                    className="bg-transparent border-none text-sm font-bold text-slate-600 outline-none cursor-pointer py-2.5"
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
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">Student Name</th>
                                    <th className="px-6 py-4">Class & Section</th>
                                    <th className="px-6 py-4">Syllabus</th>
                                    <th className="px-6 py-4">Progress</th>
                                    <th className="px-6 py-4">Last Active</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredStudents.map(student => (
                                    <tr key={student.id} className="hover:bg-indigo-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs">
                                                    {student.name.substring(0, 1)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-indigo-950 text-sm">{student.name}</p>
                                                    <p className="text-[10px] text-slate-400">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-slate-600 text-xs">Class {student.class} - {student.section}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md text-[10px] font-bold uppercase">{student.syllabus}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${student.progress > 75 ? 'bg-emerald-500' : student.progress > 40 ? 'bg-indigo-500' : 'bg-orange-500'}`} style={{ width: `${student.progress}%` }}></div>
                                                </div>
                                                <span className="text-xs font-bold text-slate-600">{student.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-slate-500">{student.lastActive}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${student.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-slate-300 hover:text-indigo-600 transition-colors">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Helper Icon
const ZapIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);
