import React, { useState, useEffect } from 'react';
import { PlaceholderModule } from '../PlaceholderModule';
import { managementService } from '../../../services/management';
import { aiService } from '../../../services/ai';
import {
    CheckCircle, XCircle, Clock, Save, Users, Calendar, Upload,
    FileText, Trash2, Plus, Link, Video, File,
    LayoutDashboard, UserCheck, BrainCircuit, Sparkles, HelpCircle, Megaphone
} from 'lucide-react';
import { format } from 'date-fns';

export const TeacherOverview = () => {
    const [stats, setStats] = useState({ students: 0, classes: 0, attendance: 0 });
    const [notices, setNotices] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            const [cls, allStd, cir] = await Promise.all([
                managementService.getClasses(),
                managementService.getAllStudents(),
                managementService.getCirculars()
            ]);
            setStats({
                students: allStd.length,
                classes: cls.length,
                attendance: 92 // Mocked
            });
            setNotices(cir.filter((n: any) => n.audience === 'All' || n.audience === 'Teachers').slice(0, 3));
        };
        load();
    }, []);

    const QuickActionCard = ({ icon: Icon, title, subtitle, color, bg }: any) => (
        <button className={`relative overflow-hidden group p-6 rounded-[2rem] text-left transition-all duration-300 hover:scale-[1.02] active:scale-95 ${bg} ${color}`}>
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className={`w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4`}>
                    <Icon size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-black leading-tight mb-1">{title}</h3>
                    <p className="text-xs font-bold opacity-70 uppercase tracking-widest">{subtitle}</p>
                </div>
            </div>
            {/* Decoration */}
            <Icon className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12 group-hover:scale-110 transition-transform" />
        </button>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Classroom Control</span> Center
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold mt-1">Manage your students, classes, and detailed records efficiently.</p>
                </div>
                <div className="flex gap-3">
                    <div className="px-5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center gap-2">
                        <Clock size={16} /> {format(new Date(), 'EEEE, d MMMM')}
                    </div>
                </div>
            </header>

            {/* BENTO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[400px]">

                {/* 1. Main Hero Card (AI) - Spans 2 Col, 2 Row */}
                <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-8 shadow-2xl shadow-indigo-200 dark:shadow-none flex flex-col justify-between group">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-6 border border-white/10">
                            <Sparkles size={14} className="text-yellow-300" /> AI Assistant
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight">Generate Lesson Plans<br />in Seconds.</h3>
                        <p className="text-indigo-100 font-medium max-w-sm mb-8">Use our advanced AI to create quizzes, homework, and study material tailored to your syllabus.</p>
                        <button className="px-8 py-4 bg-white text-indigo-700 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                            <BrainCircuit size={20} /> Open Generator
                        </button>
                    </div>
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                </div>

                {/* 2. Stats Column */}
                <div className="md:col-span-1 md:row-span-2 flex flex-col gap-6">
                    <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2rem] p-6 border shadow-sm flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                            <Users size={32} />
                        </div>
                        <h4 className="text-4xl font-black text-slate-900 dark:text-white mb-1">{stats.students}</h4>
                        <p className="text-xs font-bold uppercase text-slate-400 tracking-widest">Total Students</p>
                    </div>
                    <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2rem] p-6 border shadow-sm flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                            <UserCheck size={32} />
                        </div>
                        <h4 className="text-4xl font-black text-slate-900 dark:text-white">{stats.attendance}%</h4>
                        <p className="text-xs font-bold uppercase text-slate-400 tracking-widest">Attendance</p>
                    </div>
                </div>

                {/* 3. Quick Actions Column */}
                <div className="md:col-span-1 md:row-span-2 flex flex-col gap-6">
                    <QuickActionCard icon={CheckCircle} title="Mark Attendance" subtitle="Daily Roll Call" color="text-white" bg="bg-emerald-500" />
                    <QuickActionCard icon={FileText} title="Create Quiz" subtitle="New Assessment" color="text-white" bg="bg-orange-500" />
                </div>
            </div>

            {/* Lower Section: Notices */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-xl flex items-center gap-3 text-slate-900 dark:text-white">
                            <Megaphone className="text-indigo-500" /> Recent Notices
                        </h3>
                        <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="space-y-3">
                        {notices.length === 0 ? <p className="text-slate-400 font-bold italic">No notices posted.</p> : notices.map((n, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                                <div className="mt-1 min-w-[3rem] text-center">
                                    <div className="text-xs font-bold text-slate-400 uppercase">{format(new Date(n.createdAt?.seconds * 1000 || Date.now()), 'MMM')}</div>
                                    <div className="text-lg font-black text-indigo-600 dark:text-indigo-400">{format(new Date(n.createdAt?.seconds * 1000 || Date.now()), 'dd')}</div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors mb-1">{n.title}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{n.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <h3 className="text-xl font-black mb-2">Upcoming Class</h3>
                        <div className="text-4xl font-black text-indigo-400 mb-1">10:30 AM</div>
                        <p className="text-slate-400 font-bold text-sm">Mathematics • Class 10-B</p>
                    </div>
                    <div className="relative z-10 mt-8">
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="w-3/4 h-full bg-indigo-500 rounded-full"></div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest text-right">45 mins remaining</p>
                    </div>
                    <Clock className="absolute top-8 right-8 text-slate-800 w-32 h-32 -rotate-12" />
                </div>
            </div>
        </div>
    );
};

export const StudentMonitoring = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        managementService.getAllStudents().then(data => {
            setStudents(data || []);
            setLoading(false);
        });
    }, []);

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border shadow-sm overflow-hidden">
                <div className="p-8 border-b bg-white flex justify-between items-center">
                    <h3 className="font-black text-xl flex items-center gap-2">
                        <UserCheck className="text-indigo-600" /> Student Engagement
                    </h3>
                    <div className="text-xs font-black bg-white px-3 py-1 rounded-full border shadow-sm text-slate-500 uppercase">
                        {students.length} Total
                    </div>
                </div>
                <div className="p-4 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-4 py-3">Student Name</th>
                                <th className="px-4 py-3 text-center">Engagement Score</th>
                                <th className="px-4 py-3">Last Active</th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {students.map(s => (
                                <tr key={s.id} className="group hover:bg-slate-50/80 transition-colors">
                                    <td className="px-4 py-4">
                                        <p className="font-bold text-slate-900 dark:text-white capitalize">{s.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400">{s.email}</p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="w-32 mx-auto h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${s.onboarded ? 'bg-emerald-500' : 'bg-orange-400'}`}
                                                style={{ width: s.onboarded ? '85%' : '35%' }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-xs font-bold text-slate-500">
                                        {s.onboarded ? 'Active Now' : 'Never Joined'}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <button className="p-2 hover:bg-white rounded-lg transition-colors text-indigo-600">
                                            <FileText size={18} />
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

export const QuizScheduler = () => {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [qData, setQData] = useState({ title: '', classLevel: '10', questions: 5 });

    useEffect(() => {
        managementService.getQuizzes().then(setQuizzes);
    }, []);

    const handleCreate = async () => {
        if (!qData.title) return;
        await managementService.createQuiz({ ...qData, status: 'Active' });
        setShowForm(false);
        setQData({ title: '', classLevel: '10', questions: 5 });
        managementService.getQuizzes().then(setQuizzes);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this quiz?")) return;
        await managementService.deleteQuiz(id);
        managementService.getQuizzes().then(setQuizzes);
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <header className="flex justify-between items-center">
                <h3 className="text-2xl font-black flex items-center gap-2">
                    <BrainCircuit className="text-purple-600" /> Quiz Hub
                </h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition-all"
                >
                    <Plus size={18} /> {showForm ? 'Cancel' : 'Create Quiz'}
                </button>
            </header>

            {showForm && (
                <div className="bg-white dark:bg-slate-900 border p-6 rounded-[2.5rem] shadow-xl animate-in zoom-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input className="p-3 bg-white rounded-xl border font-bold" placeholder="Quiz Title" value={qData.title} onChange={e => setQData({ ...qData, title: e.target.value })} />
                        <select className="p-3 bg-white rounded-xl border font-bold" value={qData.classLevel} onChange={e => setQData({ ...qData, classLevel: e.target.value })}>
                            <option value="10">Class 10</option>
                            <option value="11">Class 11</option>
                            <option value="12">Class 12</option>
                        </select>
                        <button onClick={handleCreate} className="bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-colors">Publish Now</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map(q => (
                    <div key={q.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border shadow-sm group hover:border-purple-200 transition-all relative">
                        <button onClick={() => handleDelete(q.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={18} />
                        </button>
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                            <HelpCircle size={20} />
                        </div>
                        <h4 className="font-bold text-lg mb-1">{q.title}</h4>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">Class {q.classLevel}</span>
                            <span className="text-xs font-black text-emerald-500 uppercase">{q.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const QuestionPaperCreator = () => {
    const [meta, setMeta] = useState({ classLevel: '10', subject: 'Maths', title: '', totalMarks: 20 });
    const [fileUrl, setFileUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!meta.title || !fileUrl) return alert("Please provide Title and File Link.");
        setLoading(true);
        try {
            await managementService.saveTeacherQuestionPaper({
                ...meta,
                teacherId: 'current-teacher',
                questions: [],
                fileUrl: fileUrl,
                type: 'PDF/Upload',
                totalMarks: parseInt(meta.totalMarks as any)
            });
            alert("Question Paper Uploaded! Sent for Admin Review.");
            setMeta({ classLevel: '10', subject: 'Maths', title: '', totalMarks: 20 });
            setFileUrl('');
        } catch (e) { console.error(e); alert("Failed to save"); }
        finally { setLoading(false); }
    };

    return (
        <div className="space-y-6 animate-in zoom-in duration-500 max-w-2xl mx-auto">
            <div className="text-center space-y-2 mb-8">
                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                    <BrainCircuit size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Assessment Center</h3>
                <p className="text-slate-500 font-medium">Upload question papers using a PDF or Drive link for Admin review.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border relative overflow-hidden">
                <div className="space-y-6">
                    <h4 className="font-black text-lg border-b pb-4">Upload Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-slate-400">Class</label>
                            <select className="w-full p-3 rounded-xl bg-slate-50 font-bold border" value={meta.classLevel} onChange={e => setMeta({ ...meta, classLevel: e.target.value })}>
                                <option value="10">Class 10</option>
                                <option value="11">Class 11</option>
                                <option value="12">Class 12</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-slate-400">Subject</label>
                            <select className="w-full p-3 rounded-xl bg-slate-50 font-bold border" value={meta.subject} onChange={e => setMeta({ ...meta, subject: e.target.value })}>
                                <option value="Maths">Mathematics</option>
                                <option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option>
                                <option value="English">English</option>
                            </select>
                        </div>
                        <div className="col-span-full space-y-1">
                            <label className="text-xs font-bold uppercase text-slate-400">Exam Title</label>
                            <input type="text" className="w-full p-3 rounded-xl bg-slate-50 font-bold border" placeholder="e.g. Unit Test 1 - Algebra" value={meta.title} onChange={e => setMeta({ ...meta, title: e.target.value })} />
                        </div>
                        <div className="col-span-full space-y-1">
                            <label className="text-xs font-bold uppercase text-slate-400">Question Paper Link (PDF/Drive)</label>
                            <input type="text" className="w-full p-3 rounded-xl bg-slate-50 font-bold border" placeholder="https://..." value={fileUrl} onChange={e => setFileUrl(e.target.value)} />
                        </div>
                    </div>
                    <div className="pt-4">
                        <button onClick={handleSave} className="w-full py-4 bg-purple-600 text-white rounded-xl font-black uppercase flex items-center justify-center gap-2 hover:bg-purple-700 shadow-lg shadow-purple-200">
                            {loading ? 'Uploading...' : 'Submit for Review'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AttendanceMarker = () => {
    const [classId, setClassId] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<Record<string, 'Present' | 'Absent'>>({});
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (!classId) return;
        setLoading(true);
        managementService.getAllStudents(classId).then(data => {
            setStudents(data);
            const initial: any = {};
            data.forEach(s => initial[s.id] = 'Present');
            setAttendance(initial);
            setLoading(false);
        });
    }, [classId]);

    const toggle = (id: string) => {
        setAttendance(prev => ({ ...prev, [id]: prev[id] === 'Present' ? 'Absent' : 'Present' }));
    };

    const save = async () => {
        if (!classId) return;
        setLoading(true);
        const records = Object.entries(attendance).map(([studentId, status]) => {
            const student = students.find(s => s.id === studentId);
            return {
                studentId,
                status: status as 'Present' | 'Absent',
                name: student?.name || 'Unknown',
                email: student?.email || ''
            };
        });
        await managementService.submitClassAttendance(classId, date, records);
        alert('Attendance Marked Successfully!');
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase">Attendance Register</h3>
                    <p className="text-sm font-bold text-slate-500">Mark daily attendance for your class.</p>
                </div>
                <div className="flex gap-4">
                    <input type="date" className="p-3 rounded-xl border font-bold bg-white" value={date} onChange={e => setDate(e.target.value)} />
                    <select className="p-3 rounded-xl border font-bold bg-white" value={classId} onChange={e => setClassId(e.target.value)}>
                        <option value="">Select Class</option>
                        <option value="10">Class 10</option>
                        <option value="11">Class 11</option>
                        <option value="12">Class 12</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border shadow-sm p-8">
                {students.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 font-bold">Select a class to load students.</div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {students.map(s => (
                                <div key={s.id} onClick={() => toggle(s.id)} className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${attendance[s.id] === 'Present' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white ${attendance[s.id] === 'Present' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                            {s.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{s.name}</h4>
                                            <p className="text-xs font-bold text-slate-500 uppercase">{s.id.slice(0, 6)}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-black uppercase px-3 py-1 rounded-lg ${attendance[s.id] === 'Present' ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'}`}>
                                        {attendance[s.id]}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="pt-6 border-t mt-6">
                            <button onClick={save} disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black uppercase hover:bg-indigo-700 disabled:opacity-50">
                                {loading ? 'Saving...' : 'Save Today\'s Register'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// TeacherMessages implemented below
export const TeacherMessages = ({ userEmail }: { userEmail?: string }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [view, setView] = useState<'inbox' | 'compose'>('inbox');
    const [composeData, setComposeData] = useState({ to: '', subject: '', body: '', role: 'Student' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userEmail) loadMessages();
    }, [userEmail]);

    const loadMessages = async () => {
        if (!userEmail) return;
        const data = await managementService.getMessages(userEmail);
        setMessages(data);
    };

    const handleSend = async () => {
        if (!composeData.to || !composeData.body || !userEmail) return alert("Fill required fields");
        setLoading(true);
        try {
            await managementService.sendMessage({
                from: userEmail,
                to: composeData.to,
                subject: composeData.subject,
                body: composeData.body,
                role: composeData.role
            });
            alert("Message Sent!");
            setView('inbox');
            setComposeData({ to: '', subject: '', body: '', role: 'Student' });
        } catch (e) { console.error(e); alert("Failed to send"); } finally { setLoading(false); }
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-black text-2xl flex items-center gap-3">
                        <Users className="w-6 h-6 text-indigo-600" /> Messages
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={() => setView('inbox')} className={`px-4 py-2 rounded-xl font-bold text-sm ${view === 'inbox' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Inbox</button>
                        <button onClick={() => setView('compose')} className={`px-4 py-2 rounded-xl font-bold text-sm ${view === 'compose' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Compose</button>
                    </div>
                </div>

                <div className="flex-1 p-6">
                    {view === 'inbox' ? (
                        <div className="space-y-4">
                            {messages.length === 0 ? (
                                <div className="text-center py-20 text-slate-400">No messages in inbox.</div>
                            ) : (
                                messages.map(msg => (
                                    <div key={msg.id} className="p-4 rounded-2xl border hover:bg-slate-50 transition-colors cursor-pointer">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-bold text-slate-900">{msg.from}</span>
                                            <span className="text-xs text-slate-500">{msg.timestamp ? format(msg.timestamp.toDate(), 'MMM dd, HH:mm') : 'Just now'}</span>
                                        </div>
                                        <h4 className="font-bold text-sm mb-1">{msg.subject}</h4>
                                        <p className="text-sm text-slate-600">{msg.body}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto space-y-4">
                            <h4 className="font-bold text-lg mb-4">New Message</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <select className="p-3 rounded-xl border bg-slate-50 font-semibold" value={composeData.role} onChange={e => setComposeData({ ...composeData, role: e.target.value })}>
                                    <option>Student</option>
                                    <option>Parent</option>
                                    <option>Admin</option>
                                </select>
                                <input type="email" placeholder="Recipient Email" className="p-3 rounded-xl border bg-slate-50 font-semibold" value={composeData.to} onChange={e => setComposeData({ ...composeData, to: e.target.value })} />
                            </div>
                            <input type="text" placeholder="Subject" className="w-full p-3 rounded-xl border bg-slate-50 font-semibold" value={composeData.subject} onChange={e => setComposeData({ ...composeData, subject: e.target.value })} />
                            <textarea placeholder="Type your message..." className="w-full h-40 p-3 rounded-xl border bg-slate-50 font-semibold resize-none" value={composeData.body} onChange={e => setComposeData({ ...composeData, body: e.target.value })}></textarea>
                            <div className="flex justify-end">
                                <button onClick={handleSend} disabled={loading} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700">
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export const EventScheduler = () => {
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        managementService.getEvents().then(setEvents);
    }, []);

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <header className="flex items-center gap-3">
                <Calendar className="text-indigo-600 w-8 h-8" />
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Academic Calendar</h3>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.length === 0 && <p className="text-slate-500 font-bold p-10">No upcoming events scheduled.</p>}
                {events.map(ev => (
                    <div key={ev.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border shadow-sm flex items-center gap-6 group hover:border-indigo-100 transition-all">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center border-b-4 border-indigo-600 shadow-inner">
                            <span className="text-[10px] font-black uppercase text-slate-400">{new Date(ev.date).toLocaleString('default', { month: 'short' })}</span>
                            <span className="text-2xl font-black text-slate-900 dark:text-white">{new Date(ev.date).getDate()}</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-900 dark:text-white">{ev.title}</h4>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${ev.type === 'Holiday' ? 'bg-red-50 text-red-500' :
                                ev.type === 'Exam' ? 'bg-purple-50 text-purple-500' :
                                    'bg-blue-50 text-blue-500'
                                }`}>{ev.type}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const Whiteboard = () => (
    <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border shadow-sm text-center">
        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner animate-pulse">
            <Video size={48} className="text-slate-300" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Virtual Whiteboard</h3>
        <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">The interactive whiteboard is being optimized for touch devices. Use "Materials Manager" for now!</p>
    </div>
);

export const MaterialsManager = () => {
    const [materials, setMaterials] = useState<any[]>([]);
    const [title, setTitle] = useState('');
    const [type, setType] = useState('PDF');
    const [url, setUrl] = useState('');
    const [classLevel, setClassLevel] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        const data = await managementService.getMaterials();
        setMaterials(data);
    };

    const handleUpload = async () => {
        if (!title || !url || !classLevel) return alert("Fill all fields");
        setLoading(true);
        await managementService.addMaterial({ title, type, url, classLevel, subjectId, author: 'Teacher' }); // Mock author
        setLoading(false);
        setTitle(''); setUrl('');
        fetchMaterials();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this material?")) {
            await managementService.deleteMaterial(id);
            fetchMaterials();
        }
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border shadow-sm">
                <h3 className="font-black text-2xl mb-6">Upload Study Material</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input className="p-3 bg-slate-50 rounded-xl border font-semibold" placeholder="Title (e.g. Algebra Formulas)" value={title} onChange={e => setTitle(e.target.value)} />
                    <select className="p-3 bg-slate-50 rounded-xl border font-semibold" value={type} onChange={e => setType(e.target.value)}>
                        <option value="PDF">PDF Document</option>
                        <option value="Video">Video Link</option>
                        <option value="Link">External Link</option>
                    </select>
                    <input className="p-3 bg-slate-50 rounded-xl border font-semibold" placeholder="URL / File Link" value={url} onChange={e => setUrl(e.target.value)} />
                    <select className="p-3 bg-slate-50 rounded-xl border font-semibold" value={classLevel} onChange={e => setClassLevel(e.target.value)}>
                        <option value="">Select Class</option>
                        <option value="10">Class 10</option>
                        <option value="11">Class 11</option>
                        <option value="12">Class 12</option>
                    </select>
                    <select className="p-3 bg-slate-50 rounded-xl border font-semibold" value={subjectId} onChange={e => setSubjectId(e.target.value)}>
                        <option value="">All Subjects</option>
                        <option value="maths">Mathematics</option>
                        <option value="physics">Physics</option>
                        <option value="chemistry">Chemistry</option>
                    </select>

                    <button disabled={loading} onClick={handleUpload} className="bg-indigo-600 text-white font-black rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-indigo-700">
                        {loading ? 'Uploading...' : <><Upload size={18} /> Upload</>}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map(m => (
                    <div key={m.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border shadow-sm hover:shadow-md transition-all group relative">
                        <button onClick={() => handleDelete(m.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={18} />
                        </button>
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                            {m.type === 'Video' ? <Video size={24} /> : m.type === 'Link' ? <Link size={24} /> : <FileText size={24} />}
                        </div>
                        <h4 className="font-bold text-lg mb-1">{m.title}</h4>
                        <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4">Class {m.classLevel} • {m.subjectId || 'General'}</p>
                        <a href={m.url} target="_blank" rel="noreferrer" className="block w-full text-center py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100">
                            View Resource
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const HomeworkManager = () => {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [form, setForm] = useState({ title: '', description: '', dueDate: '', classLevel: '', subjectId: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => { loadAssignments(); }, []);

    const loadAssignments = async () => {
        const data = await managementService.getAssignments();
        setAssignments(data);
    };

    const handleCreate = async () => {
        if (!form.title || !form.dueDate || !form.classLevel) return alert("Fill required fields");
        setLoading(true);
        await managementService.addAssignment(form);
        setLoading(false);
        setForm({ title: '', description: '', dueDate: '', classLevel: '', subjectId: '' });
        loadAssignments();
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border shadow-sm">
                <header className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-2xl">Create Assignment</h3>
                </header>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="p-3 rounded-xl border bg-slate-50 font-semibold" placeholder="Assignment Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                        <input type="date" className="p-3 rounded-xl border bg-slate-50 font-semibold" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
                        <select className="p-3 rounded-xl border bg-slate-50 font-semibold" value={form.classLevel} onChange={e => setForm({ ...form, classLevel: e.target.value })}>
                            <option value="">Select Class</option>
                            <option value="10">Class 10</option>
                            <option value="11">Class 11</option>
                        </select>
                        <select className="p-3 rounded-xl border bg-slate-50 font-semibold" value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })}>
                            <option value="">Subject</option>
                            <option value="maths">Maths</option>
                            <option value="physics">Physics</option>
                        </select>
                    </div>
                    <textarea className="w-full p-3 rounded-xl border bg-slate-50 font-semibold min-h-[100px]" placeholder="Instructions / Details..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
                    <div className="flex justify-end">
                        <button onClick={handleCreate} disabled={loading} className="bg-indigo-600 dark:bg-white dark:text-black text-white px-8 py-3 rounded-xl font-bold hover:opacity-80 transition-opacity">
                            {loading ? 'Publishing...' : 'Publish Assignment'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b bg-slate-50/50">
                    <h3 className="font-bold text-lg">Active Assignments</h3>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {assignments.map(a => (
                        <div key={a.id} className="p-6 flex justify-between items-start hover:bg-slate-50 transition-colors group relative">
                            <button
                                onClick={async () => {
                                    if (confirm("Delete this assignment?")) {
                                        await managementService.deleteAssignment(a.id);
                                        loadAssignments();
                                    }
                                }}
                                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={16} />
                            </button>
                            <div>
                                <h4 className="font-bold text-lg text-slate-900 dark:text-white">{a.title}</h4>
                                <p className="text-slate-500 text-sm mt-1">{a.description}</p>
                                <div className="flex gap-3 mt-3">
                                    <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-600 px-2 py-1 rounded">Class {a.classLevel}</span>
                                    <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-1 rounded">{a.subjectId}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-xs font-bold text-red-500 mb-1">Due {format(new Date(a.dueDate), 'MMM dd')}</span>
                                <button className="text-xs font-bold text-indigo-600 hover:underline">View Submissions</button>
                            </div>
                        </div>
                    ))}
                    {assignments.length === 0 && <div className="p-12 text-center text-slate-400">No active assignments.</div>}
                </div>
            </div>
        </div>
    );
};

export const AttendanceModule = () => {
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [students, setStudents] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>({});
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        managementService.getClasses().then(data => {
            setClasses(data);
            if (data.length > 0) setSelectedClass(data[0].id);
        });
    }, []);

    useEffect(() => {
        if (selectedClass) {
            setLoading(true);
            managementService.getStudentsByClassId(selectedClass).then(data => {
                setStudents(data);
                // Default all to Present
                const initial: any = {};
                data.forEach(s => initial[s.email] = 'Present');
                setAttendance(initial);
                setLoading(false);
            });
        }
    }, [selectedClass]);

    const handleMark = (id: string, status: 'Present' | 'Absent' | 'Late') => {
        setAttendance(prev => ({ ...prev, [id]: status }));
    };

    const handleSubmit = async () => {
        if (!confirm(`Submit attendance for ${students.length} students?`)) return;

        const records = students.map(s => ({
            studentId: s.email,
            name: s.name,
            status: attendance[s.email]
        }));

        await managementService.markAttendance(selectedClass, date, records);
        alert('Attendance Saved Successfully!');
    };

    return (
        <div className="space-y-6 h-full flex flex-col animate-in fade-in">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border shadow-sm">
                <div className="space-y-4 w-full md:w-auto">
                    <div>
                        <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Select Class</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full md:w-64 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 font-bold"
                        >
                            {classes.map(c => <option key={c.id} value={c.id}>{c.grade} - {c.sections?.length || 0} Sec</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-400 block">Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="p-3 rounded-xl bg-slate-50 border font-bold" />
                </div>

                <div className="flex-1 text-right">
                    <button onClick={handleSubmit} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg flex items-center gap-2 ml-auto">
                        <Save className="w-5 h-5" /> Save Records
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-black text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-500" /> Class List
                    </h3>
                    <span className="text-sm font-bold text-slate-400">{students.length} Students</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {loading ? <div className="p-10 text-center text-slate-400">Loading Students...</div> : students.map(student => (
                        <div key={student.email} className="flex items-center justify-between p-4 rounded-2xl border hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${attendance[student.email] === 'Present' ? 'bg-emerald-500' : attendance[student.email] === 'Absent' ? 'bg-red-500' : 'bg-orange-400'}`}>
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-slate-100">{student.name}</h4>
                                    <p className="text-xs text-slate-400">{student.email}</p>
                                </div>
                            </div>

                            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
                                <button
                                    onClick={() => handleMark(student.email, 'Present')}
                                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${attendance[student.email] === 'Present' ? 'bg-white shadow text-emerald-600' : 'text-slate-400 hover:text-emerald-600'}`}
                                >
                                    P
                                </button>
                                <button
                                    onClick={() => handleMark(student.email, 'Absent')}
                                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${attendance[student.email] === 'Absent' ? 'bg-white shadow text-red-600' : 'text-slate-400 hover:text-red-600'}`}
                                >
                                    A
                                </button>
                                <button
                                    onClick={() => handleMark(student.email, 'Late')}
                                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${attendance[student.email] === 'Late' ? 'bg-white shadow text-orange-600' : 'text-slate-400 hover:text-orange-600'}`}
                                >
                                    L
                                </button>
                            </div>
                        </div>
                    ))}

                    {students.length === 0 && !loading && (
                        <div className="text-center py-20 text-slate-400">
                            No students found in this class.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
