import React, { useState, useEffect } from 'react';
import { UserPlus, CheckCircle2, XCircle, Search, Loader2 } from 'lucide-react';
import { managementService, AdmissionData } from '../../../services/management';

export const AdmissionManagement = ({ darkMode }: { darkMode?: boolean }) => {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        setLoading(true);
        try {
            const data = await managementService.getAdmissionRequests();
            setApplications(data);
        } catch (error) {
            console.error("Failed to load admissions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (app: any) => {
        if (!confirm(`Are you sure you want to admit ${app.fullName}? This will create a student account.`)) return;

        setActionLoading(app.id);
        try {
            // Map request data to AdmissionData
            const admissionData: AdmissionData = {
                fullName: app.fullName,
                gender: app.gender,
                dob: app.dob,
                classLevel: app.grade || '11-General', // Fallback or map
                section: 'A', // Default section
                rollNumber: '', // Generate or assign?
                useTransport: false,
                admittedBy: 'Admin',
                guardianName: app.parentName,
                fatherName: app.parentName, // Assumption if fields missing
                motherName: '',
                primaryContact: app.phone,
                address: app.address || '',
                email: app.email // Use email from request
            };

            await managementService.admitStudent(admissionData);
            await managementService.updateAdmissionRequestStatus(app.id, 'Approved');
            alert(`Student ${app.fullName} admitted successfully!`);
            loadApplications();
        } catch (error: any) {
            console.error("Admission failed", error);
            alert("Admission Failed: " + error.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm("Reject this application?")) return;

        setActionLoading(id);
        try {
            await managementService.updateAdmissionRequestStatus(id, 'Rejected');
            loadApplications();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(null);
        }
    };

    const [showAddForm, setShowAddForm] = useState(false);
    const [manualForm, setManualForm] = useState({
        fullName: '',
        parentName: '',
        email: '',
        phone: '',
        classLevel: '11-Science',
        section: 'A',
        dob: '',
        address: ''
    });

    const handleManualAdmission = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const admissionData: AdmissionData = {
                fullName: manualForm.fullName,
                guardianName: manualForm.parentName,
                fatherName: manualForm.parentName,
                motherName: '',
                email: manualForm.email,
                primaryContact: manualForm.phone,
                classLevel: manualForm.classLevel,
                section: manualForm.section,
                dob: manualForm.dob || new Date().toISOString(), // Fallback
                address: manualForm.address,
                gender: 'Not Specified',
                rollNumber: '',
                useTransport: false,
                admittedBy: 'Admin'
            };

            await managementService.admitStudent(admissionData);
            alert(`Student ${manualForm.fullName} admitted successfully!`);
            setShowAddForm(false);
            setManualForm({ fullName: '', parentName: '', email: '', phone: '', classLevel: '11-Science', section: 'A', dob: '', address: '' });
            loadApplications(); // Refresh list/stats if any? or just valid
        } catch (error: any) {
            console.error("Manual Admission Failed", error);
            alert("Failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Inter']`}>
            <header className={`flex justify-between items-center p-6 rounded-[2rem] border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div>
                    <h3 className={`text-2xl font-black flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        <UserPlus className="text-blue-500" /> Admissions
                    </h3>
                    <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage New Applications</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowAddForm(!showAddForm)} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors flex items-center gap-2">
                        <UserPlus className="w-4 h-4" /> {showAddForm ? 'Cancel' : 'Add Admission'}
                    </button>
                    <button onClick={loadApplications} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors">
                        <Search className={`w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    </button>
                </div>
            </header>

            {showAddForm && (
                <div className={`p-8 rounded-[2.5rem] border shadow-lg mb-6 animate-in slide-in-from-top-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-blue-100 ring-4 ring-blue-50'}`}>
                    <h4 className={`text-lg font-black mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>New Student Admission</h4>
                    <form onSubmit={handleManualAdmission} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Student Name</label>
                            <input required type="text" placeholder="Full Name" className={`w-full p-3 rounded-xl border font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={manualForm.fullName} onChange={e => setManualForm({ ...manualForm, fullName: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Parent Name</label>
                            <input required type="text" placeholder="Guardian/Father Name" className={`w-full p-3 rounded-xl border font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={manualForm.parentName} onChange={e => setManualForm({ ...manualForm, parentName: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Email (User ID)</label>
                            <input required type="email" placeholder="student@school.com" className={`w-full p-3 rounded-xl border font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={manualForm.email} onChange={e => setManualForm({ ...manualForm, email: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Phone</label>
                            <input required type="tel" placeholder="Contact Number" className={`w-full p-3 rounded-xl border font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={manualForm.phone} onChange={e => setManualForm({ ...manualForm, phone: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Class & Stream</label>
                            <select className={`w-full p-3 rounded-xl border font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={manualForm.classLevel} onChange={e => setManualForm({ ...manualForm, classLevel: e.target.value })}>
                                <option value="8-General">Class 8</option>
                                <option value="9-General">Class 9</option>
                                <option value="10-General">Class 10</option>
                                <option value="11-Science">Class 11 Science</option>
                                <option value="11-Commerce">Class 11 Commerce</option>
                                <option value="12-Science">Class 12 Science</option>
                                <option value="12-Commerce">Class 12 Commerce</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Date of Birth</label>
                            <input type="date" className={`w-full p-3 rounded-xl border font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={manualForm.dob} onChange={e => setManualForm({ ...manualForm, dob: e.target.value })} />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Address</label>
                            <input type="text" placeholder="Full Address" className={`w-full p-3 rounded-xl border font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={manualForm.address} onChange={e => setManualForm({ ...manualForm, address: e.target.value })} />
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <button disabled={loading} type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-900/20 transition-all">
                                {loading ? 'Creating Student...' : 'Complete Admission'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className={`p-6 rounded-[2.5rem] border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className="overflow-x-auto min-h-[300px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 font-bold">No admission requests found.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className={`text-xs uppercase border-b ${darkMode ? 'bg-slate-800/50 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                                    <th className="p-4 font-black">Applicant</th>
                                    <th className="p-4 font-black">Class</th>
                                    <th className="p-4 font-black">Submitted</th>
                                    <th className="p-4 font-black">Status</th>
                                    <th className="p-4 font-black text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                {applications.map((app) => (
                                    <tr key={app.id} className={`border-b last:border-0 transition-colors ${darkMode ? 'border-slate-800 hover:bg-slate-800/30' : 'border-slate-50 hover:bg-slate-50'}`}>
                                        <td className="p-4">
                                            <div>
                                                <div className="font-bold">{app.fullName}</div>
                                                <div className="text-xs text-slate-400">{app.email}</div>
                                                <div className="text-xs text-slate-400">{app.phone}</div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            Class {app.grade?.split('-')[0] || '?'}
                                            <span className="text-xs text-slate-400 block">{app.grade?.split('-')[1]}</span>
                                        </td>
                                        <td className="p-4 text-slate-400 text-xs">
                                            {app.timestamp ? new Date(app.timestamp.seconds * 1000).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-black tracking-wide ${app.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : app.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right flex justify-end gap-2">
                                            {app.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(app)}
                                                        disabled={actionLoading === app.id}
                                                        className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50 transition-colors"
                                                        title="Admit Student"
                                                    >
                                                        {actionLoading === app.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(app.id)}
                                                        disabled={actionLoading === app.id}
                                                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors"
                                                        title="Reject Application"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

