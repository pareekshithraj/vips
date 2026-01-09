import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Layers, Plus, Edit2, Trash2, X, GraduationCap } from 'lucide-react';
import { managementService } from '../../../services/management';

export const ClassManagement = ({ darkMode }: { darkMode?: boolean }) => {
    const [activeTab, setActiveTab] = useState<'classes' | 'subjects'>('classes');
    const [loading, setLoading] = useState(false);

    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);

    const [showClassModal, setShowClassModal] = useState(false);
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);

    const [classForm, setClassForm] = useState({ grade: '', section: '', stream: '' });
    const [subjectForm, setSubjectForm] = useState({ name: '', code: '', type: 'Theory', credits: 4 });

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [classesData, subjectsData] = await Promise.all([
                managementService.getClasses(),
                managementService.getSubjects()
            ]);
            // Sort classes by Grade
            setClasses(classesData.sort((a: any, b: any) => a.grade.localeCompare(b.grade)));
            setSubjects(subjectsData);
        } catch (error) {
            console.error("Failed to load academic data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveClass = async () => {
        try {
            if (editingItem) {
                await managementService.updateClass(editingItem.id, classForm);
            } else {
                await managementService.addClass(classForm);
            }
            setShowClassModal(false);
            setEditingItem(null);
            setClassForm({ grade: '', section: '', stream: '' });
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteClass = async (id: string) => {
        if (!confirm('Delete this class?')) return;
        try {
            await managementService.deleteClass(id);
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveSubject = async () => {
        try {
            if (editingItem) {
                await managementService.updateSubject(editingItem.id, subjectForm);
            } else {
                await managementService.addSubject(subjectForm);
            }
            setShowSubjectModal(false);
            setEditingItem(null);
            setSubjectForm({ name: '', code: '', type: 'Theory', credits: 4 });
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteSubject = async (id: string) => {
        if (!confirm('Delete this subject?')) return;
        try {
            await managementService.deleteSubject(id);
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={`space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Inter']`}>
            <header className={`flex flex-col md:flex-row justify-between items-center p-6 rounded-[2rem] border shadow-sm gap-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div>
                    <h3 className={`text-2xl font-black flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        <GraduationCap className="text-pink-500" /> Academics
                    </h3>
                    <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Classes & Subjects</p>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
                    <button onClick={() => setActiveTab('classes')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'classes' ? (darkMode ? 'bg-slate-700 text-white' : 'bg-white text-pink-600 shadow-md') : (darkMode ? 'text-slate-400' : 'text-slate-500')}`}>Classes</button>
                    <button onClick={() => setActiveTab('subjects')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'subjects' ? (darkMode ? 'bg-slate-700 text-white' : 'bg-white text-pink-600 shadow-md') : (darkMode ? 'text-slate-400' : 'text-slate-500')}`}>Subjects</button>
                </div>
            </header>

            {activeTab === 'classes' && (
                <div className={`p-6 rounded-[2.5rem] border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} animate-in fade-in`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Class Directory</h2>
                        <button onClick={() => { setEditingItem(null); setClassForm({ grade: '', section: '', stream: '' }); setShowClassModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-xl font-bold text-xs hover:bg-pink-700 transition-colors">
                            <Plus size={16} /> Add Class
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {classes.map((cls) => (
                            <div key={cls.id} className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-950/50 border-slate-800 hover:border-pink-500' : 'bg-slate-50 border-slate-200 hover:border-pink-500'} group transition-all`}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{cls.grade} - {cls.section}</h3>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditingItem(cls); setClassForm(cls); setShowClassModal(true); }} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-indigo-500"><Edit2 size={12} /></button>
                                        <button onClick={() => handleDeleteClass(cls.id)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-red-500"><Trash2 size={12} /></button>
                                    </div>
                                </div>
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider text-center py-1 mt-1 border-t dark:border-slate-800">{cls.stream || 'General'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'subjects' && (
                <div className={`p-6 rounded-[2.5rem] border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} animate-in fade-in`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Subjects Repository</h2>
                        <button onClick={() => { setEditingItem(null); setSubjectForm({ name: '', code: '', type: 'Theory', credits: 4 }); setShowSubjectModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-xl font-bold text-xs hover:bg-pink-700 transition-colors">
                            <Plus size={16} /> Add Subject
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className={`text-[10px] uppercase font-black tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                <tr>
                                    <th className="px-4 py-3">Code</th>
                                    <th className="px-4 py-3">Subject Name</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Credits</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                {subjects.map(sub => (
                                    <tr key={sub.id} className={`border-b last:border-0 ${darkMode ? 'border-slate-800' : 'border-slate-50'}`}>
                                        <td className="px-4 py-3 font-mono text-xs opacity-70">{sub.code}</td>
                                        <td className="px-4 py-3">{sub.name}</td>
                                        <td className="px-4 py-3"><span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] uppercase">{sub.type}</span></td>
                                        <td className="px-4 py-3">{sub.credits}</td>
                                        <td className="px-4 py-3 text-right flex justify-end gap-2">
                                            <button onClick={() => { setEditingItem(sub); setSubjectForm(sub); setShowSubjectModal(true); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-indigo-500"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDeleteSubject(sub.id)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-red-500"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Class Modal */}
            {showClassModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className={`w-full max-w-md p-6 rounded-[2rem] shadow-2xl ${darkMode ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-slate-900'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black">{editingItem ? 'Edit Class' : 'Create Class'}</h3>
                            <button onClick={() => setShowClassModal(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest opacity-50 mb-1 block">Grade</label>
                                    <select value={classForm.grade} onChange={e => setClassForm({ ...classForm, grade: e.target.value })} className={`w-full p-3 rounded-xl font-bold bg-transparent border-2 ${darkMode ? 'border-slate-700 focus:border-pink-500' : 'border-slate-200 focus:border-pink-500'} outline-none`}>
                                        <option value="">Select</option>
                                        {[...Array(12)].map((_, i) => <option key={i} value={`Class ${i + 1}`}>Class {i + 1}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest opacity-50 mb-1 block">Section</label>
                                    <input type="text" value={classForm.section} onChange={e => setClassForm({ ...classForm, section: e.target.value })} className={`w-full p-3 rounded-xl font-bold bg-transparent border-2 ${darkMode ? 'border-slate-700 focus:border-pink-500' : 'border-slate-200 focus:border-pink-500'} outline-none`} placeholder="A" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest opacity-50 mb-1 block">Stream (Optional)</label>
                                <select value={classForm.stream} onChange={e => setClassForm({ ...classForm, stream: e.target.value })} className={`w-full p-3 rounded-xl font-bold bg-transparent border-2 ${darkMode ? 'border-slate-700 focus:border-pink-500' : 'border-slate-200 focus:border-pink-500'} outline-none`}>
                                    <option value="">None</option>
                                    <option value="Science">Science</option>
                                    <option value="Commerce">Commerce</option>
                                    <option value="Arts">Humanities</option>
                                </select>
                            </div>
                            <button onClick={handleSaveClass} className="w-full py-4 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-black shadow-lg shadow-pink-500/20 active:scale-95 transition-all">
                                {editingItem ? 'Update Class' : 'Create Class'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Subject Modal */}
            {showSubjectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className={`w-full max-w-md p-6 rounded-[2rem] shadow-2xl ${darkMode ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-slate-900'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black">{editingItem ? 'Edit Subject' : 'Add Subject'}</h3>
                            <button onClick={() => setShowSubjectModal(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest opacity-50 mb-1 block">Subject Name</label>
                                <input type="text" value={subjectForm.name} onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })} className={`w-full p-3 rounded-xl font-bold bg-transparent border-2 ${darkMode ? 'border-slate-700 focus:border-pink-500' : 'border-slate-200 focus:border-pink-500'} outline-none`} placeholder="Mathematics" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest opacity-50 mb-1 block">Code</label>
                                    <input type="text" value={subjectForm.code} onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value })} className={`w-full p-3 rounded-xl font-bold bg-transparent border-2 ${darkMode ? 'border-slate-700 focus:border-pink-500' : 'border-slate-200 focus:border-pink-500'} outline-none`} placeholder="MATH101" />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest opacity-50 mb-1 block">Credits</label>
                                    <input type="number" value={subjectForm.credits} onChange={e => setSubjectForm({ ...subjectForm, credits: parseInt(e.target.value) })} className={`w-full p-3 rounded-xl font-bold bg-transparent border-2 ${darkMode ? 'border-slate-700 focus:border-pink-500' : 'border-slate-200 focus:border-pink-500'} outline-none`} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest opacity-50 mb-1 block">Type</label>
                                <select value={subjectForm.type} onChange={e => setSubjectForm({ ...subjectForm, type: e.target.value })} className={`w-full p-3 rounded-xl font-bold bg-transparent border-2 ${darkMode ? 'border-slate-700 focus:border-pink-500' : 'border-slate-200 focus:border-pink-500'} outline-none`}>
                                    <option value="Theory">Theory</option>
                                    <option value="Practical">Practical</option>
                                    <option value="Elective">Elective</option>
                                </select>
                            </div>
                            <button onClick={handleSaveSubject} className="w-full py-4 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-black shadow-lg shadow-pink-500/20 active:scale-95 transition-all">
                                {editingItem ? 'Update Subject' : 'Add Subject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
