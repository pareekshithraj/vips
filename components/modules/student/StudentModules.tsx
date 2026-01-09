import React, { useEffect, useState } from 'react';
import { PlaceholderModule } from '../PlaceholderModule';
import { managementService } from '../../../services/management';
import { UserConfig } from '../../../types';
import {
    BookOpen, Clock, Calendar as CalendarIcon, CheckCircle, AlertCircle, FileText,
    Download, PlayCircle, HelpCircle, Send, X, Plus, Filter, Search, ChevronRight, Megaphone,
    CreditCard, Video, Link, Layers, CheckCircle2, ChevronLeft, ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';

interface StudentModuleProps {
    userConfig: UserConfig;
}

export const StudentFees: React.FC<StudentModuleProps> = ({ userConfig }) => {
    const [fees, setFees] = useState<any[]>([]);
    const [classFee, setClassFee] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userConfig?.email) {
            Promise.all([
                managementService.fetchStudentFees(userConfig.email),
                managementService.getClasses()
            ]).then(([feeData, classesData]: [any[], any[]]) => {
                setFees(feeData);
                // Find user's class fee
                const userClass = classesData.find((c: any) => c.grade == userConfig.classLevel || c.id == userConfig.classLevel);
                setClassFee(userClass?.annualFee || 0);
                setLoading(false);
            });
        }
    }, [userConfig]);

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    const totalPaid = fees.reduce((sum, f) => sum + (f.amount || 0), 0);
    const totalDue = classFee || 0;
    const pending = totalDue - totalPaid;

    const statsCards = [
        { label: 'Total Fee (Annual)', value: totalDue, icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-500/10', border: 'border-indigo-200' },
        { label: 'Paid Amount', value: totalPaid, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-200' },
        { label: 'Pending Due', value: pending, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-200' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Fee Management</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Track your academic financial records</p>
                </div>
                <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 rounded-full text-sm font-semibold">
                    Academic Year 2024-25
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statsCards.map((card, i) => (
                    <div key={i} className={`group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl ${card.bg} ${card.color} transition-colors group-hover:scale-110`}>
                                <card.icon size={28} />
                            </div>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                        <h4 className="text-3xl font-bold text-slate-900 dark:text-white">₹{card.value.toLocaleString()}</h4>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
                <h4 className="font-bold text-xl mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                    <Clock className="w-5 h-5 text-indigo-500" /> Payment History
                </h4>
                {fees.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                        <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-medium">No payments recorded yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {fees.map((txn, i) => (
                            <div key={i} className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl bg-white dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/30 hover:shadow-md transition-all">
                                <div className="flex items-center gap-5 mb-4 sm:mb-0">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-indigo-600 transition-colors">Fee Payment</p>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">{format(new Date(txn.date), 'dd MMM yyyy, h:mm a')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                    <span className="font-bold text-emerald-600 text-lg">+ ₹{txn.amount.toLocaleString()}</span>
                                    <button
                                        onClick={() => {
                                            const printWindow = window.open('', '_blank');
                                            if (printWindow) {
                                                printWindow.document.write(`
                                                    <html>
                                                        <head><title>Receipt #${i + 1}</title></head>
                                                        <body style="font-family: sans-serif; padding: 40px; border: 2px solid #eee; max-width: 600px; margin: 0 auto;">
                                                            <div style="text-align: center; margin-bottom: 30px;">
                                                                <h1 style="color: #4f46e5; margin: 0;">Vidyabodhini School</h1>
                                                                <p style="color: #666; font-size: 14px; margin: 5px 0;">Official Fee Receipt</p>
                                                            </div>
                                                            <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                                                                <p style="margin: 5px 0;"><strong>Student:</strong> ${userConfig.name}</p>
                                                                <p style="margin: 5px 0;"><strong>Class:</strong> ${userConfig.classLevel}</p>
                                                                <p style="margin: 5px 0;"><strong>Date:</strong> ${format(new Date(txn.date), 'PPP')}</p>
                                                                <p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${txn.id || 'TXN-' + Date.now()}</p>
                                                            </div>
                                                            <div style="text-align: center; font-size: 32px; font-weight: bold; color: #059669; margin: 30px 0;">
                                                                ₹${txn.amount.toLocaleString()}
                                                            </div>
                                                            <div style="text-align: center; color: #aaa; font-size: 12px; margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px;">
                                                                Generated electronically. No signature required.
                                                            </div>
                                                        </body>
                                                    </html>
                                                `);
                                                printWindow.document.close();
                                                printWindow.print();
                                            }
                                        }}
                                        className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 hover:border-indigo-200 rounded-xl transition-all text-slate-500"
                                        title="Print Receipt"
                                    >
                                        <FileText size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export const StudentAttendance: React.FC<StudentModuleProps> = ({ userConfig }) => {
    const [records, setRecords] = useState<any[]>([]);
    const [stats, setStats] = useState({ present: 0, absent: 0, percentage: 0 });

    useEffect(() => {
        if (userConfig?.email) {
            managementService.fetchStudentAttendance(userConfig.email).then(data => {
                setRecords(data);
                const p = data.filter((d: any) => d.status === 'Present').length;
                const total = data.length; // Assuming total days is length of records for now, or fetch total days
                setStats({ present: p, absent: total - p, percentage: total ? Math.round((p / total) * 100) : 0 });
            });
        }
    }, [userConfig]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Attendance Overview</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">View your presence and consistency</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col md:flex-row items-center gap-10 p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                    {/* Decorative bg */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="96" cy="96" r="88" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="12" />
                            <circle cx="96" cy="96" r="88" fill="none" stroke="currentColor" className="text-indigo-600" strokeWidth="12" strokeDasharray={552} strokeDashoffset={552 - (552 * stats.percentage) / 100} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tighter">{stats.percentage}%</span>
                            <span className="text-xs font-bold uppercase text-slate-400 tracking-widest mt-1">Present</span>
                        </div>
                    </div>
                    <div className="relative z-10 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Keep it up!</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm">
                            You have attended <strong className="text-indigo-600">{stats.present}</strong> out of <strong className="text-slate-900 dark:text-white">{stats.present + stats.absent}</strong> working days.
                            Maintaining high attendance helps you stay on top of your coursework.
                        </p>
                        {stats.percentage < 75 && (
                            <div className="mt-4 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-semibold inline-flex items-center gap-2">
                                <AlertCircle size={16} /> Attention Needed
                            </div>
                        )}
                    </div>
                </div>


                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-10 rounded-[2.5rem] shadow-xl shadow-indigo-200 dark:shadow-none flex flex-col justify-center items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 w-full h-full bg-white/5 opacity-50"></div>
                    <div className="relative z-10 bg-white/20 p-4 rounded-2xl mb-4 backdrop-blur-sm">
                        <CheckCircle size={32} className="text-white" />
                    </div>
                    <h4 className="text-5xl font-bold mb-2 tracking-tighter">{stats.present + stats.absent}</h4>
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-100 opacity-80">Total Working Days</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
                <h4 className="font-bold text-xl mb-6 text-slate-900 dark:text-white">Recent Records</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {records.length === 0 ? <p className="text-slate-400 font-medium w-full col-span-full text-center py-8">No attendance records found.</p> : records.slice(0, 12).map((rec, i) => (
                        <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 transition-colors">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{format(new Date(rec.date), 'EEE, dd MMM')}</span>
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 ${rec.status === 'Present' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                {rec.status === 'Present' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                                {rec.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export const StudentMaterials: React.FC<StudentModuleProps> = ({ userConfig }) => {
    const [materials, setMaterials] = useState<any[]>([]);

    useEffect(() => {
        managementService.getMaterials(userConfig.classLevel?.toString()).then(setMaterials);
    }, [userConfig]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Learning Resources</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Access course materials and assignments</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map(m => (
                    <div key={m.id} className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110 pointer-events-none"></div>

                        <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                                {m.type === 'Video' ? <Video size={28} /> : m.type === 'Link' ? <Link size={28} /> : <FileText size={28} />}
                            </div>

                            <h4 className="font-bold text-xl mb-2 text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors">{m.title}</h4>
                            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-8 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                {m.subjectId || 'General Resource'}
                            </p>

                            <a href={m.url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                                Open Resource <Link size={16} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
            {materials.length === 0 && (
                <div className="p-16 text-center text-slate-400 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] border-dashed">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <FileText size={32} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Materials Found</h4>
                    <p className="text-sm font-medium opacity-70">There are no materials uploaded for Class {userConfig.classLevel} yet.</p>
                </div>
            )}
        </div>
    );
};

export const StudentQuizzes: React.FC<StudentModuleProps> = ({ userConfig }) => {
    return (
        <div className="flex items-center justify-center min-h-[400px] bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="max-w-md">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                    <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Quizzes Coming Soon</h3>
                <p className="text-slate-500 font-medium leading-relaxed">We are currently preparing online assessment modules for your class. Check back later!</p>
            </div>
        </div>
    );
};

export const StudentHelpdesk: React.FC<StudentModuleProps> = ({ userConfig }) => {
    const [tickets, setTickets] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newTicket, setNewTicket] = useState({ subject: '', category: 'General', description: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        managementService.getStudentTickets().then(setTickets);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await managementService.createStudentTicket({
                studentEmail: userConfig.email || 'unknown',
                studentName: userConfig.name,
                category: newTicket.category,
                description: newTicket.description,
                subject: newTicket.subject
            });
            setShowForm(false);
            setNewTicket({ subject: '', category: 'General', description: '' });
            const updated = await managementService.getStudentTickets();
            setTickets(updated);
            alert("Ticket Submitted Successfully");
        } catch (error) {
            console.error(error);
            alert("Failed to submit ticket");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Student Helpdesk</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Get support for your academic or technical concerns</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm ? 'Cancel' : 'New Ticket'}
                </button>
            </header>

            {showForm && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100 dark:shadow-none animate-in fade-in slide-in-from-top-4">
                    <h4 className="font-bold text-xl mb-6 text-slate-900 dark:text-white">Raise a New Ticket</h4>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Subject</label>
                            <input
                                type="text"
                                value={newTicket.subject}
                                onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })}
                                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                placeholder="Brief subject of the issue"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Category</label>
                            <div className="relative">
                                <select
                                    value={newTicket.category}
                                    onChange={e => setNewTicket({ ...newTicket, category: e.target.value })}
                                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold text-slate-700 dark:text-slate-200 appearance-none focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                >
                                    <option>Academic</option>
                                    <option>Fees</option>
                                    <option>Transport</option>
                                    <option>Other</option>
                                </select>
                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Description</label>
                            <textarea
                                value={newTicket.description}
                                onChange={e => setNewTicket({ ...newTicket, description: e.target.value })}
                                rows={4}
                                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                placeholder="Describe your issue in detail..."
                                required
                            />
                        </div>
                        <div className="pt-2">
                            <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 dark:bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50">
                                {loading ? 'Submitting...' : 'Submit Ticket'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {tickets.length === 0 ? (
                    <div className="p-16 text-center text-slate-400 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] border-dashed">
                        <HelpCircle size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="font-bold text-lg">No tickets found</p>
                        <p className="text-sm font-medium opacity-60 mt-1">You haven't raised any tickets yet.</p>
                    </div>
                ) : (
                    tickets.map(t => (
                        <div key={t.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="flex gap-2 mb-3">
                                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 rounded-lg text-[10px] uppercase font-black tracking-wider">{t.category}</span>
                                    <span className={`px-3 py-1 rounded-lg text-[10px] uppercase font-black tracking-wider ${t.status === 'Open' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'}`}>{t.status}</span>
                                </div>
                                <p className="font-bold text-lg text-slate-900 dark:text-white mb-2 leading-relaxed">{t.description}</p>
                                <p className="text-xs text-slate-400 font-bold mt-1 flex items-center gap-1.5">
                                    <Clock size={12} />
                                    {format(new Date(t.createdAt?.seconds * 1000 || Date.now()), 'dd MMM yyyy, h:mm a')}
                                </p>
                            </div>

                            {t.resolution && (
                                <div className="w-full md:w-1/3 bg-emerald-50 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                                    <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-400">
                                        <CheckCircle size={16} />
                                        <span className="text-xs font-black uppercase tracking-wider">Resolution</span>
                                    </div>
                                    <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200 leading-relaxed">{t.resolution}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export const StudentTimetable: React.FC<StudentModuleProps> = ({ userConfig }) => {
    const [schedule, setSchedule] = useState<any>({
        Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: []
    });
    const [loading, setLoading] = useState(true);

    const periods = [
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
        { start: '12:00', end: '01:00' },
        { start: '02:00', end: '03:00' },
        { start: '03:00', end: '04:00' }
    ];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    useEffect(() => {
        if (userConfig?.classLevel) {
            managementService.getTimetable(userConfig.classLevel.toString()).then(data => {
                setSchedule(data || {});
                setLoading(false);
            });
        }
    }, [userConfig]);

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Class Timetable</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Weekly schedule grid view</p>
                </div>
                <div className="px-4 py-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-300 rounded-full text-sm font-semibold">
                    Class {userConfig.classLevel}
                </div>
            </header>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm overflow-x-auto">
                <div className="min-w-[900px]">
                    <div className="grid grid-cols-6 gap-4 mb-4">
                        <div className="text-[10px] font-black uppercase text-slate-400 p-2 tracking-widest">Time / Day</div>
                        {days.map(d => <div key={d} className="text-[10px] font-black uppercase text-slate-700 dark:text-white text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 tracking-widest">{d}</div>)}
                    </div>

                    {periods.map((period, pIndex) => (
                        <div key={pIndex} className="grid grid-cols-6 gap-4 mb-4">
                            <div className="text-xs font-bold text-slate-500 p-4 flex flex-col justify-center items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                <span>{period.start}</span>
                                <div className="w-8 h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                                <span className="opacity-50 text-[10px]">{period.end}</span>
                            </div>
                            {days.map(day => {
                                const subject = schedule[day]?.find((p: any) => p.startTime === period.start);
                                return (
                                    <div
                                        key={`${day}-${pIndex}`}
                                        className={`p-3 rounded-2xl transition-all min-h-[90px] flex flex-col justify-center items-center text-center border relative overflow-hidden group
                                            ${subject
                                                ? 'bg-pink-50 border-pink-100 dark:bg-pink-900/10 dark:border-pink-900/30'
                                                : 'bg-slate-50/50 border-transparent dark:bg-slate-800/20 dark:border-transparent'}
                                        `}
                                    >
                                        {subject ? (
                                            <>
                                                <div className="absolute top-0 left-0 w-full h-1 bg-pink-400 opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                                <div className="font-bold text-sm text-slate-900 dark:text-slate-100 z-10">{subject.subject}</div>
                                                <div className="text-[9px] uppercase font-black text-pink-500 mt-1 z-10 tracking-wider bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-lg">{subject.teacher}</div>
                                            </>
                                        ) : (
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const StudentCalendar: React.FC<StudentModuleProps> = ({ userConfig }) => {
    const [events, setEvents] = useState<any[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => { loadEvents(); }, []);

    const loadEvents = async () => {
        const data = await managementService.getCalendarEvents();
        setEvents(data);
    };

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sun
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div className="space-y-8 font-['Inter'] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">School Calendar</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Holidays, exams, and important events</p>
                </div>
                <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full p-1 shadow-sm">
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:text-indigo-600"><ChevronLeft size={20} /></button>
                    <h4 className="text-sm font-bold min-w-[140px] text-center text-slate-900 dark:text-white uppercase tracking-wider">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h4>
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:text-indigo-600"><ChevronLeft size={20} className="rotate-180" /></button>
                </div>
            </header>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm">
                <div className="grid grid-cols-7 gap-4 mb-6 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-[10px] font-black uppercase text-indigo-300 tracking-widest">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2 lg:gap-4">
                    {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
                        const dayEvents = events.filter(e => e.start === dateStr);
                        const isToday = new Date().toISOString().split('T')[0] === dateStr;

                        return (
                            <div
                                key={day}
                                className={`min-h-[120px] p-3 rounded-3xl transition-all relative border
                                    ${isToday
                                        ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-500/50'
                                        : 'bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-slate-700 hover:shadow-lg hover:-translate-y-1'}
                                `}
                            >
                                <span className={`text-sm font-bold block mb-2 ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>{day}</span>
                                <div className="space-y-1.5">
                                    {dayEvents.map(ev => (
                                        <div key={ev.id} className={`text-[9px] font-bold px-2 py-1.5 rounded-lg truncate shadow-sm
                                            ${ev.type === 'Holiday' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300' :
                                                ev.type === 'Exam' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' :
                                                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'}`}>
                                            {ev.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export const StudentNotices = ({ userConfig }: { userConfig: any }) => {
    const [notices, setNotices] = useState<any[]>([]);

    useEffect(() => {
        const fetchNotices = async () => {
            const allNotices = await managementService.getNotices('Admin');
            setNotices(allNotices.filter((n: any) => {
                const aud = (n.audience || 'All').toString().toLowerCase();
                return ['all', 'students', 'student', 'parents', 'parent'].includes(aud);
            }));
        };
        fetchNotices();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Notice Board</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">School Announcements & Circulars</p>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-5">
                {notices.length === 0 ? (
                    <div className="p-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem]">
                        <Megaphone className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold">No announcements at this time.</p>
                    </div>
                ) : notices.map(n => (
                    <div key={n.id} className="group p-8 rounded-[2.5rem] border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg tracking-widest">
                                {new Date(n.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md">
                                To: {n.audience}
                            </span>
                        </div>
                        <h4 className="font-bold text-2xl mb-3 text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{n.title}</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                            {n.content || n.message}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
