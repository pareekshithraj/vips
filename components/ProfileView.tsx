import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { UserConfig } from '../types';

interface ProfileViewProps {
    userConfig: UserConfig;
    setUserConfig: React.Dispatch<React.SetStateAction<UserConfig>>;
    setView: (v: any) => void;
    onReset: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ userConfig, setUserConfig, setView, onReset }) => {
    const [formData, setFormData] = useState({
        name: userConfig.name,
        schoolName: userConfig.schoolName,
        phone: userConfig.phone,
        classLevel: userConfig.classLevel.toString()
    });
    const [success, setSuccess] = useState('');

    const handleSave = () => {
        setUserConfig({
            ...userConfig,
            name: formData.name,
            schoolName: formData.schoolName,
            phone: formData.phone,
            classLevel: parseInt(formData.classLevel) as any
        });
        setSuccess('Profile updated successfully!');
        setTimeout(() => setView('dashboard'), 1500);
    };

    const confirmReset = () => {
        if (confirm('Are you sure you want to reset all progress? This will clear your completed tasks but keep your account settings.')) {
            onReset();
            setSuccess('Progress reset successfully!');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 space-y-6 animate-in zoom-in-95">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black text-indigo-950">Edit Profile</h2>
                    <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6 text-slate-400" /></button>
                </div>

                {success && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-xs font-bold flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {success}</div>}

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold text-indigo-950 mt-1" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">School Name</label>
                        <input type="text" value={formData.schoolName} onChange={e => setFormData({ ...formData, schoolName: e.target.value })} className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold text-indigo-950 mt-1" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Phone Number</label>
                        <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold text-indigo-950 mt-1" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Class</label>
                        <select value={formData.classLevel} onChange={e => setFormData({ ...formData, classLevel: e.target.value })} className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold text-indigo-950 mt-1">
                            {[8, 9, 10, 11, 12].map(c => <option key={c} value={c}>Class {c}</option>)}
                        </select>
                    </div>
                    <button onClick={handleSave} className="w-full bg-indigo-900 text-white py-4 rounded-xl font-black hover:bg-indigo-800 transition-all shadow-lg mt-4">Save Changes</button>

                    <button onClick={confirmReset} className="w-full bg-red-50 text-red-500 py-4 rounded-xl font-black hover:bg-red-100 transition-all mt-4 text-xs uppercase tracking-widest">
                        Reset All Schedule Progress
                    </button>
                </div>
            </div>
        </div>
    );
};
