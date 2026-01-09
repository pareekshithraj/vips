import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Mail, Phone, Shield, Search, Briefcase, Car, Users, Edit2, X, Eye, Calendar, DollarSign, MapPin } from 'lucide-react';
import { managementService, StaffMember } from '../../../services/management';

export const StaffManagement = ({ darkMode }: { darkMode?: boolean }) => {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newStaff, setNewStaff] = useState({
        name: '',
        email: '',
        role: 'teacher' as 'teacher' | 'driver' | 'admin' | 'staff',
        phone: '',
        department: '',
        salary: '',
        joiningDate: new Date().toISOString().split('T')[0],
        address: ''
    });

    useEffect(() => {
        loadStaff();
    }, []);

    const loadStaff = async () => {
        const data = await managementService.getAllStaff();
        setStaff(data);
    };

    const handleAddStaff = async () => {
        if (!newStaff.name || !newStaff.email) return;
        setLoading(true);
        try {
            await managementService.addStaff(newStaff);
            setShowAddModal(false);
            setNewStaff({ name: '', email: '', role: 'teacher', phone: '', department: '', salary: '', joiningDate: new Date().toISOString().split('T')[0], address: '' });
            loadStaff();
        } catch (error) {
            console.error(error);
            alert('Failed to add staff');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStaff = async () => {
        if (!selectedStaff || !selectedStaff.name || !selectedStaff.email) return;
        setLoading(true);
        try {
            await managementService.updateStaff(selectedStaff.id, selectedStaff as any);
            setShowEditModal(false);
            setSelectedStaff(null);
            loadStaff();
        } catch (error) {
            console.error(error);
            alert('Failed to update staff');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, role: string) => {
        if (confirm('Are you sure you want to remove this staff member?')) {
            await managementService.deleteStaff(id, role as any);
            loadStaff();
        }
    };

    const filteredStaff = staff.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Inter']`}>
            <header className={`flex justify-between items-center p-6 rounded-[2rem] border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div>
                    <h3 className={`text-2xl font-black flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        <Users className="text-indigo-500" /> Staff Directory
                    </h3>
                    <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage Teachers, Drivers & Admins</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-500 flex items-center gap-2 transition-all hover:scale-105"
                >
                    <UserPlus size={18} /> Add Staff
                </button>
            </header>

            <div className={`p-6 rounded-[2.5rem] border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>

                {/* Search Bar */}
                <div className="mb-6 relative">
                    <Search className={`absolute left-4 top-3.5 w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                    <input
                        type="text"
                        placeholder="Search staff by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 rounded-2xl border-none font-bold text-sm ring-2 outline-none transition-all ${darkMode ? 'bg-slate-950 ring-slate-800 text-white focus:ring-indigo-500' : 'bg-slate-50 ring-slate-100 text-slate-700 focus:ring-indigo-200'}`}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStaff.map((member) => (
                        <div key={member.id} className={`group relative p-5 rounded-2xl border transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer ${darkMode ? 'bg-slate-950 border-slate-800 hover:bg-slate-900' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-indigo-100'}`} onClick={() => { setSelectedStaff(member); setShowViewModal(true); }}>
                            <div className="flex justify-between items-start mb-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black 
                                    ${member.role === 'teacher' ? 'bg-orange-100 text-orange-600' :
                                        member.role === 'driver' ? 'bg-emerald-100 text-emerald-600' :
                                            'bg-purple-100 text-purple-600'}`}>
                                    {member.name.charAt(0)}
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-[10px] uppercase font-black tracking-wide border
                                    ${member.role === 'teacher' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                        member.role === 'driver' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            'bg-purple-50 text-purple-600 border-purple-100'}`}>
                                    {member.role}
                                </span>
                            </div>

                            <h4 className={`text-lg font-black mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{member.name}</h4>

                            <div className="space-y-2 mt-4">
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                    <Mail size={14} className="text-slate-400" /> {member.email}
                                </div>
                                {member.phone && (
                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                        <Phone size={14} className="text-slate-400" /> {member.phone}
                                    </div>
                                )}
                            </div>

                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedStaff(member); setShowViewModal(true); }}
                                    className="p-2 rounded-xl text-slate-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                >
                                    <Eye size={16} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedStaff(member); setShowEditModal(true); }}
                                    className="p-2 rounded-xl text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(member.id, member.role); }}
                                    className="p-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* View Staff Modal */}
            {showViewModal && selectedStaff && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className={`w-full max-w-lg p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className={`text-2xl font-black mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{selectedStaff.name}</h3>
                                <p className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    <span className={`px-2 py-0.5 rounded ${selectedStaff.role === 'teacher' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>{selectedStaff.role}</span>
                                    {selectedStaff.department && <span>• {selectedStaff.department}</span>}
                                </p>
                            </div>
                            <button onClick={() => { setShowViewModal(false); setSelectedStaff(null); }} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`p-4 rounded-2xl ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Contact Info</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-bold">
                                            <Mail size={14} className="text-slate-400" /> {selectedStaff.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-bold">
                                            <Phone size={14} className="text-slate-400" /> {selectedStaff.phone || 'N/A'}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-bold">
                                            <MapPin size={14} className="text-slate-400" /> {selectedStaff.address || 'No Address'}
                                        </div>
                                    </div>
                                </div>
                                <div className={`p-4 rounded-2xl ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Employment</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-bold">
                                            <Briefcase size={14} className="text-slate-400" /> {selectedStaff.department || 'General'}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-bold">
                                            <Calendar size={14} className="text-slate-400" /> Joined: {selectedStaff.joiningDate || 'Unknown'}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                                            <DollarSign size={14} /> Salary: ₹{selectedStaff.salary || '0'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => { setShowViewModal(false); setShowEditModal(true); }}
                                className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold uppercase text-xs tracking-wider shadow-xl shadow-indigo-200 hover:bg-indigo-500"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Staff Modal */}
            {(showAddModal || (showEditModal && selectedStaff)) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className={`w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className={`text-2xl font-black mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{showEditModal ? 'Edit Staff' : 'Add New Staff'}</h3>
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">{showEditModal ? selectedStaff?.name : 'Create account credentials'}</p>
                            </div>
                            <button onClick={() => { setShowAddModal(false); setShowEditModal(false); setSelectedStaff(null); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1 block">Staff Role</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['teacher', 'driver', 'admin'].map(r => (
                                        <button
                                            key={r}
                                            onClick={() => showEditModal ? setSelectedStaff({ ...selectedStaff!, role: r as any }) : setNewStaff({ ...newStaff, role: r as any })}
                                            className={`py-3 rounded-xl text-xs font-bold uppercase transition-all ${(showEditModal ? selectedStaff?.role : newStaff.role) === r
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                                : (darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500')}`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Full Name"
                                    className={`w-full p-4 rounded-xl font-bold text-sm outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}
                                    value={showEditModal ? selectedStaff?.name : newStaff.name}
                                    onChange={e => showEditModal ? setSelectedStaff({ ...selectedStaff!, name: e.target.value }) : setNewStaff({ ...newStaff, name: e.target.value })}
                                />
                                <input
                                    placeholder="Department"
                                    className={`w-full p-4 rounded-xl font-bold text-sm outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}
                                    value={showEditModal ? selectedStaff?.department : newStaff.department}
                                    onChange={e => showEditModal ? setSelectedStaff({ ...selectedStaff!, department: e.target.value }) : setNewStaff({ ...newStaff, department: e.target.value })}
                                />
                            </div>

                            <input
                                placeholder="Email Address"
                                type="email"
                                // Emails are generally immutable as they are IDs in this system
                                disabled={showEditModal}
                                className={`w-full p-4 rounded-xl font-bold text-sm outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} ${showEditModal ? 'opacity-50 cursor-not-allowed' : ''}`}
                                value={showEditModal ? selectedStaff?.email : newStaff.email}
                                onChange={e => showEditModal ? setSelectedStaff({ ...selectedStaff!, email: e.target.value }) : setNewStaff({ ...newStaff, email: e.target.value })}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Phone Number"
                                    className={`w-full p-4 rounded-xl font-bold text-sm outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}
                                    value={showEditModal ? selectedStaff?.phone : newStaff.phone}
                                    onChange={e => showEditModal ? setSelectedStaff({ ...selectedStaff!, phone: e.target.value }) : setNewStaff({ ...newStaff, phone: e.target.value })}
                                />
                                <input
                                    placeholder="Salary (₹)"
                                    className={`w-full p-4 rounded-xl font-bold text-sm outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}
                                    value={showEditModal ? selectedStaff?.salary : newStaff.salary}
                                    onChange={e => showEditModal ? setSelectedStaff({ ...selectedStaff!, salary: e.target.value }) : setNewStaff({ ...newStaff, salary: e.target.value })}
                                />
                            </div>

                            <input
                                placeholder="Joining Date"
                                type="date"
                                className={`w-full p-4 rounded-xl font-bold text-sm outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}
                                value={showEditModal ? selectedStaff?.joiningDate : newStaff.joiningDate}
                                onChange={e => showEditModal ? setSelectedStaff({ ...selectedStaff!, joiningDate: e.target.value }) : setNewStaff({ ...newStaff, joiningDate: e.target.value })}
                            />

                            <input
                                placeholder="Address"
                                className={`w-full p-4 rounded-xl font-bold text-sm outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}
                                value={showEditModal ? selectedStaff?.address : newStaff.address}
                                onChange={e => showEditModal ? setSelectedStaff({ ...selectedStaff!, address: e.target.value }) : setNewStaff({ ...newStaff, address: e.target.value })}
                            />


                            <div className="flex gap-3 mt-6 pt-4">
                                <button
                                    onClick={() => { setShowAddModal(false); setShowEditModal(false); setSelectedStaff(null); }}
                                    className={`flex-1 py-4 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors ${darkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={showEditModal ? handleUpdateStaff : handleAddStaff}
                                    disabled={loading}
                                    className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold uppercase text-xs tracking-wider shadow-xl shadow-indigo-200 hover:bg-indigo-500 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : showEditModal ? 'Save Changes' : 'Create Account'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


