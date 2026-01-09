import React, { useState } from 'react';
import { X, CheckCircle, User, Shield, Key, School, Phone, Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { UserConfig } from '../types';
import { authService } from '../services/auth';

interface ProfileViewProps {
    userConfig: UserConfig | any; // Allow flexibility for other roles
    setUserConfig: React.Dispatch<React.SetStateAction<any>>;
    setView: (v: any) => void;
    onReset?: () => void;
    variant?: 'modal' | 'embedded';
    role?: 'student' | 'teacher' | 'driver';
}

export const ProfileView: React.FC<ProfileViewProps> = ({ userConfig, setUserConfig, setView, onReset, variant = 'modal', role = 'student' }) => {
    const [formData, setFormData] = useState({
        name: userConfig?.name || '',
        schoolName: userConfig?.schoolName || '',
        phone: userConfig?.phone || '',
        classLevel: userConfig?.classLevel?.toString() || '10'
    });
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isSchoolStudent = role === 'student';
    const isRestricted = isSchoolStudent; // Students can't edit academic info

    const handleSave = async () => {
        setLoading(true);
        setError('');
        try {
            // 1. Update Profile Data
            const updatedConfig = { ...userConfig };
            updatedConfig.name = formData.name;
            updatedConfig.phone = formData.phone;

            if (!isRestricted && role === 'student') {
                updatedConfig.schoolName = formData.schoolName;
                updatedConfig.classLevel = parseInt(formData.classLevel) as any;
            }

            setUserConfig(updatedConfig);
            // Ideally call managementService.updateUser(updatedConfig) here too for backend sync

            // 2. Change Password if provided
            if (passwords.new) {
                if (passwords.new !== passwords.confirm) throw new Error("New passwords do not match");
                if (!passwords.current) throw new Error("Current password required");
                await authService.changePassword(passwords.current, passwords.new);
            }

            setSuccess('Profile updated successfully!');
            if (variant === 'modal') {
                setTimeout(() => setView('dashboard'), 1500);
            }
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const confirmReset = () => {
        if (confirm('Are you sure you want to reset all progress? This will clear your completed tasks but keep your account settings.')) {
            if (onReset) onReset();
            setSuccess('Progress reset successfully!');
        }
    };

    const Content = (
        <div className={`w-full ${variant === 'modal' ? 'max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10' : 'bg-transparent'} space-y-8 animate-in mt-4 fade-in slide-in-from-bottom-4 duration-700`}>

            {variant === 'modal' && (
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Profile Settings</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage your account and security</p>
                    </div>
                    <button onClick={() => setView('dashboard')} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
                </div>
            )}

            {variant === 'embedded' && (
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
                    <div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Edit Profile</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Update your personal information</p>
                    </div>
                </header>
            )}

            {success && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2 text-indigo-600 dark:text-indigo-400">
                        <User className="w-5 h-5" />
                        <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">Personal Info</h4>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full p-4 pl-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    {role === 'student' && (
                        <div className={`p-6 rounded-2xl border ${isRestricted ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800' : 'bg-white border-slate-200'}`}>
                            <div className="flex items-center gap-2 mb-4 text-slate-400">
                                <School className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Academic Details</span>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">School Name</label>
                                    <input
                                        type="text"
                                        disabled={isRestricted}
                                        value={formData.schoolName}
                                        onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                                        className="w-full bg-transparent font-bold text-slate-900 dark:text-white border-none p-0 focus:ring-0"
                                    />
                                </div>
                                <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Class Level</label>
                                    <div className="font-bold text-slate-900 dark:text-white">Class {formData.classLevel}</div>
                                </div>
                            </div>
                            {isRestricted && (
                                <div className="mt-4 flex items-start gap-2 text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
                                    <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                    <span>Contact School Admin to update academic details.</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Security Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2 text-indigo-600 dark:text-indigo-400">
                        <Shield className="w-5 h-5" />
                        <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">Security</h4>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">Current Password</label>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwords.current}
                                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                    className="w-full p-4 pl-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">New Password</label>
                                <input
                                    type="password"
                                    placeholder="New"
                                    value={passwords.new}
                                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                    className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">Confirm</label>
                                <input
                                    type="password"
                                    placeholder="Confirm"
                                    value={passwords.confirm}
                                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                    className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-4 rounded-2xl text-sm font-bold text-center animate-shake">
                    {error}
                </div>
            )}

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-b-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save className="w-5 h-5" /> Save Changes
                        </>
                    )}
                </button>

                {role === 'student' && onReset && (
                    <button
                        onClick={confirmReset}
                        className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-900/30 rounded-2xl font-bold transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" /> Reset Data
                    </button>
                )}
            </div>
        </div>
    );

    if (variant === 'modal') {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm animate-in fade-in">
                {Content}
            </div>
        );
    }

    return Content;
};
