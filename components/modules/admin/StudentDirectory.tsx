import React, { useState, useEffect } from 'react';
import { Search, GraduationCap, Edit2, Save, X } from 'lucide-react';
import { adminService, StudentSummary } from '../../../services/admin';
import { PortalType } from '../../../services/portalContext';
import { managementService } from '../../../services/management';

export const StudentDirectory = ({ darkMode, activePortal }: { darkMode?: boolean, activePortal: PortalType }) => {
    const [students, setStudents] = useState<StudentSummary[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<StudentSummary[]>([]);
    const [filterClass, setFilterClass] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'class' | 'progress' | 'status'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Editing State
    const [editingStudent, setEditingStudent] = useState<StudentSummary | null>(null);
    const [editForm, setEditForm] = useState<{ name: string; email: string; phone: string; class: string }>({ name: '', email: '', phone: '', class: '' });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadStudents();
    }, [activePortal]);

    const loadStudents = () => {
        adminService.getAllStudents(activePortal).then(data => {
            setStudents(data);
            setFilteredStudents(data);
        });
    };

    useEffect(() => {
        let res = students;
        if (filterClass !== 'All') {
            res = res.filter(s => s.class === filterClass);
        }
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            res = res.filter(s => s.name.toLowerCase().includes(lower) || s.email.toLowerCase().includes(lower));
        }

        // Apply sorting
        res = res.sort((a, b) => {
            let compareA: any, compareB: any;

            switch (sortBy) {
                case 'name':
                    compareA = a.name.toLowerCase();
                    compareB = b.name.toLowerCase();
                    break;
                case 'class':
                    compareA = parseInt(a.class) || 0;
                    compareB = parseInt(b.class) || 0;
                    break;
                case 'progress':
                    compareA = a.progress;
                    compareB = b.progress;
                    break;
                case 'status':
                    compareA = a.status === 'Active' ? 1 : 0;
                    compareB = b.status === 'Active' ? 1 : 0;
                    break;
                default:
                    compareA = a.name.toLowerCase();
                    compareB = b.name.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return compareA > compareB ? 1 : compareA < compareB ? -1 : 0;
            } else {
                return compareA < compareB ? 1 : compareA > compareB ? -1 : 0;
            }
        });

        setFilteredStudents(res);
    }, [filterClass, searchTerm, students, sortBy, sortOrder]);

    const startEdit = (student: StudentSummary) => {
        setEditingStudent(student);
        setEditForm({
            name: student.name,
            email: student.email,
            phone: student.phone,
            class: student.class
        });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStudent) return;
        setUpdating(true);
        try {
            await managementService.updateStudent(editingStudent.id, {
                name: editForm.name,
                email: editForm.email,
                phone: editForm.phone,
                classLevel: editForm.class, // Assuming classLevel stores the grade
                // Update basic info in root
            });
            alert("Student updated successfully!");
            setEditingStudent(null);
            loadStudents();
        } catch (error: any) {
            console.error("Update failed", error);
            alert("Update Failed: " + error.message);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className={`space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Inter']`}>
            <header className={`flex justify-between items-center p-6 rounded-[2rem] border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div>
                    <h3 className={`text-2xl font-black flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        <GraduationCap className="text-indigo-500" /> Student Directory
                    </h3>
                    <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage All Students</p>
                </div>
            </header>

            {/* Edit Modal / Overlay */}
            {editingStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className={`w-full max-w-lg p-8 rounded-[2rem] shadow-2xl animate-in zoom-in-95 ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Edit Student</h3>
                            <button onClick={() => setEditingStudent(null)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <X className={`w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Full Name</label>
                                <input required type="text" className={`w-full p-3 rounded-xl font-bold text-sm outline-none border focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                    value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Email (ID)</label>
                                <input disabled type="email" className={`w-full p-3 rounded-xl font-bold text-sm outline-none border opacity-50 cursor-not-allowed ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                    value={editForm.email} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Phone</label>
                                <input type="tel" className={`w-full p-3 rounded-xl font-bold text-sm outline-none border focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                    value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Class / Grade</label>
                                <select className={`w-full p-3 rounded-xl font-bold text-sm outline-none border focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                    value={editForm.class} onChange={e => setEditForm({ ...editForm, class: e.target.value })}>
                                    {[8, 9, 10, 11, 12].map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>

                            <button disabled={updating} type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all flex justify-center items-center gap-2 mt-4">
                                {updating ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className={`rounded-[2.5rem] border shadow-sm overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white shadow-xl shadow-slate-200/50'}`}>
                <div className={`p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none">
                            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className={`pl-10 pr-4 py-2.5 rounded-xl border-none text-xs font-bold outline-none ring-2 ${darkMode ? 'bg-slate-950 ring-slate-800 text-slate-200 focus:ring-indigo-500' : 'bg-slate-50 ring-transparent text-slate-600 focus:ring-indigo-100'} w-full md:w-64`}
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
                        <select
                            className={`px-4 py-2 rounded-xl text-xs font-bold border-none outline-none cursor-pointer ${darkMode ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-600'}`}
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as any)}
                        >
                            <option value="name">Sort by Name</option>
                            <option value="class">Sort by Class</option>
                            <option value="progress">Sort by Progress</option>
                            <option value="status">Sort by Status</option>
                        </select>
                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border-none outline-none cursor-pointer transition-all ${darkMode ? 'bg-slate-950 text-slate-300 hover:bg-slate-800' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                        >
                            {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px] custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className={`sticky top-0 z-10 text-[10px] font-black uppercase tracking-widest ${darkMode ? 'bg-slate-950 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
                            <tr>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Class</th>
                                <th className="px-6 py-4">Progress</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
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
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => startEdit(student)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-500 transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
